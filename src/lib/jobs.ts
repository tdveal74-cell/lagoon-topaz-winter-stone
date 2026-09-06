import { useEffect, useRef } from "react";
import { generateMotion, generateStill } from "@/lib/ai";
import { useStudio, type ProposedJob } from "@/lib/store";
import type { GraphNode, Project, StudioJob } from "@/lib/types";

export function idleMediaJobs(nodes: GraphNode[]): ProposedJob[] {
  const stills = nodes.filter(
    (n) => n.kind === "image" && n.status !== "running" && !n.assetUrl,
  );
  const motions = nodes.filter(
    (n) => n.kind === "video" && n.status !== "running" && n.status !== "done",
  );
  const source = stills.length
    ? stills
    : nodes.filter((n) => n.kind === "image" && n.status !== "running" && !n.assetUrl);
  const picked = [...source, ...motions];
  return picked.map((n) => ({
    kind: n.kind === "video" ? "motion" : "still",
    nodeId: n.id,
    title: n.title,
    prompt: n.prompt,
    aspectRatio: n.aspectRatio,
  }));
}

export function allMediaJobs(nodes: GraphNode[]): ProposedJob[] {
  return nodes
    .filter((n) => n.kind === "image" || n.kind === "video")
    .map((n) => ({
      kind: n.kind === "video" ? ("motion" as const) : ("still" as const),
      nodeId: n.id,
      title: n.title,
      prompt: n.prompt,
      aspectRatio: n.aspectRatio,
    }));
}

export function jobsFromPlanNodes(nodes: GraphNode[]): ProposedJob[] {
  return nodes
    .filter((n) => n.kind === "image" || n.kind === "video")
    .map((n) => ({
      kind: n.kind === "video" ? ("motion" as const) : ("still" as const),
      nodeId: n.id,
      title: n.title,
      prompt: n.prompt,
      aspectRatio: n.aspectRatio,
    }));
}

function resolveStillUrl(job: StudioJob, project: Project): string | undefined {
  const node = job.nodeId
    ? project.nodes.find((n) => n.id === job.nodeId)
    : undefined;
  if (node?.assetUrl && node.assetKind === "image") return node.assetUrl;
  if (!node) {
    return project.nodes.find((n) => n.assetUrl && n.assetKind !== "video")
      ?.assetUrl;
  }
  const ins = project.edges
    .filter((e) => e.to === node.id)
    .map((e) => project.nodes.find((n) => n.id === e.from))
    .filter(Boolean) as GraphNode[];
  return (
    ins.find((n) => n.assetUrl)?.assetUrl ??
    project.nodes.find((n) => n.assetUrl && n.kind === "image")?.assetUrl
  );
}

async function runJob(job: StudioJob) {
  const store = useStudio.getState();
  store.patchJob(job.id, { status: "running", startedAt: Date.now() });

  let nodeId = job.nodeId;
  if (!nodeId) {
    nodeId = store.addNode(job.kind === "motion" ? "video" : "image");
    store.patchJob(job.id, { nodeId });
    store.patchNode(nodeId, {
      title: job.label,
      prompt: job.prompt,
      aspectRatio: job.aspectRatio,
    });
  } else {
    store.patchNode(nodeId, {
      status: "running",
      error: undefined,
    });
  }

  const capKind = job.kind === "motion" ? "videos" : "images";
  if (!useStudio.getState().bumpCap(capKind)) {
    useStudio.getState().patchJob(job.id, {
      status: "error",
      error: "Session cap reached.",
      finishedAt: Date.now(),
    });
    useStudio.getState().patchNode(nodeId, {
      status: "error",
      error: "Session cap reached.",
    });
    return;
  }

  try {
    if (job.kind === "motion") {
      const src = resolveStillUrl(job, useStudio.getState().project);
      if (!src) {
        useStudio.getState().patchJob(job.id, {
          status: "error",
          error: "Connect a still first.",
          finishedAt: Date.now(),
        });
        useStudio.getState().patchNode(nodeId, {
          status: "error",
          error: "Connect a still first.",
        });
        return;
      }
      const res = await generateMotion({
        data: { prompt: job.prompt, imageUrl: src, duration: 6 },
      });
      if (!res.ok) {
        useStudio.getState().patchJob(job.id, {
          status: "error",
          error: res.error,
          finishedAt: Date.now(),
        });
        useStudio.getState().patchNode(nodeId, {
          status: "error",
          error: res.error,
        });
        return;
      }
      finishJob(job, nodeId, res.url, "video");
    } else {
      const res = await generateStill({
        data: { prompt: job.prompt, aspectRatio: job.aspectRatio },
      });
      if (!res.ok) {
        useStudio.getState().patchJob(job.id, {
          status: "error",
          error: res.error,
          finishedAt: Date.now(),
        });
        useStudio.getState().patchNode(nodeId, {
          status: "error",
          error: res.error,
        });
        return;
      }
      finishJob(job, nodeId, res.url, "image");
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    useStudio.getState().patchJob(job.id, {
      status: "error",
      error: message,
      finishedAt: Date.now(),
    });
    useStudio.getState().patchNode(nodeId, { status: "error", error: message });
  }
}

function finishJob(
  job: StudioJob,
  nodeId: string,
  url: string,
  kind: "image" | "video",
) {
  const store = useStudio.getState();
  store.patchNode(nodeId, {
    status: "done",
    assetUrl: url,
    assetKind: kind,
  });
  const assetId = crypto.randomUUID();
  store.addAsset({
    id: assetId,
    url,
    kind,
    prompt: job.prompt,
    createdAt: Date.now(),
    aspectRatio: job.aspectRatio,
    title: job.label,
  });
  store.addClip({
    id: crypto.randomUUID(),
    assetId,
    duration: kind === "video" ? 6 : 2.4,
    label: job.label,
  });
  store.patchJob(job.id, {
    status: "done",
    resultUrl: url,
    finishedAt: Date.now(),
  });
  store.select(nodeId);
}

export function useJobRunner() {
  const jobs = useStudio((s) => s.jobs);
  const batchArmed = useStudio((s) => s.batchArmed);
  const inflight = useRef(false);

  useEffect(() => {
    if (!batchArmed || inflight.current) return;
    inflight.current = true;
    void (async () => {
      try {
        while (useStudio.getState().batchArmed) {
          const next = useStudio.getState().jobs.find((j) => j.status === "queued");
          if (!next) break;
          await runJob(next);
        }
      } finally {
        inflight.current = false;
        const open = useStudio
          .getState()
          .jobs.some((j) => j.status === "queued" || j.status === "running");
        if (!open) useStudio.setState({ batchArmed: false });
      }
    })();
  }, [jobs, batchArmed]);
}

export function proposedCounts(jobs: StudioJob[]) {
  const open = jobs.filter(
    (j) =>
      j.status === "proposed" ||
      j.status === "queued" ||
      j.status === "running",
  );
  return {
    stills: open.filter((j) => j.kind === "still").length,
    motion: open.filter((j) => j.kind === "motion").length,
    proposed: jobs.filter((j) => j.status === "proposed").length,
    running: jobs.filter((j) => j.status === "running").length,
    queued: jobs.filter((j) => j.status === "queued").length,
  };
}
