import { TEMPLATES } from "@/lib/templates";
import { allMediaJobs, idleMediaJobs, jobsFromPlanNodes } from "@/lib/jobs";
import { useStudio, type ProposedJob } from "@/lib/store";
import type {
  AspectRatio,
  GraphNode,
  NodeKind,
  StudioJob,
} from "@/lib/types";

export type AgentIntent = "run" | "plan" | "load" | "talk" | "cancel";

export type AgentShot = {
  title: string;
  kind: NodeKind;
  prompt: string;
  aspectRatio: AspectRatio;
};

export type AgentDecision = {
  intent: AgentIntent;
  reply: string;
  templateId?: string;
  name?: string;
  shots?: AgentShot[];
  jobs: ProposedJob[];
};

const TEMPLATE_HINTS: { re: RegExp; id: string }[] = [
  { re: /\b(ugc|apartment|serum|user[- ]generated)\b/i, id: "ugc" },
  { re: /\b(talent|portrait|editorial)\b/i, id: "talent" },
  { re: /\b(youtube|desk|creator)\b/i, id: "youtube" },
  { re: /\b(product|perfume|catalog|bottle)\b/i, id: "product" },
  { re: /\b(social|vertical|reel|9:16)\b/i, id: "social" },
  { re: /\b(film|cinematic|rooftop|street)\b/i, id: "film" },
];

export function graphSnapshot(nodes: GraphNode[]) {
  return nodes.map((n) => ({
    id: n.id,
    kind: n.kind,
    title: n.title,
    status: n.status,
    hasAsset: Boolean(n.assetUrl),
    prompt: n.prompt.slice(0, 160),
  }));
}

function jobReply(jobs: ProposedJob[]) {
  const stills = jobs.filter((j) => j.kind === "still").length;
  const motion = jobs.filter((j) => j.kind === "motion").length;
  const bits = [
    stills ? `${stills} still${stills === 1 ? "" : "s"}` : "",
    motion ? `${motion} motion` : "",
  ].filter(Boolean);
  return `Queuing ${bits.join(" and ")}. Confirm the paid run to spend.`;
}

export function interpretLocal(
  message: string,
  nodes: GraphNode[],
): AgentDecision {
  const text = message.trim();
  const lower = text.toLowerCase();

  if (/\b(cancel|stop|abort|never ?mind|clear jobs)\b/i.test(text)) {
    return {
      intent: "cancel",
      reply: "Open jobs cancelled. Nothing spent.",
      jobs: [],
    };
  }

  const wantsLoad = /\b(load|open|switch|use|start with)\b/i.test(text);
  if (wantsLoad) {
    const hit = TEMPLATE_HINTS.find((h) => h.re.test(text));
    if (hit) {
      const t = TEMPLATES.find((x) => x.id === hit.id);
      return {
        intent: "load",
        templateId: hit.id,
        reply: `Loaded ${t?.name ?? hit.id}. Tell me to run it when you want plates.`,
        jobs: [],
      };
    }
  }

  if (/\b(regen|regenerate|redo|replace|again)\b/i.test(text)) {
    const jobs = allMediaJobs(nodes);
    if (!jobs.length) {
      return {
        intent: "talk",
        reply: "No still or motion nodes on this graph.",
        jobs: [],
      };
    }
    return { intent: "run", reply: jobReply(jobs), jobs };
  }

  if (/\b(run|generate|queue|execute|go|render|do it|kick off)\b/i.test(text)) {
    const jobs = idleMediaJobs(nodes);
    if (!jobs.length) {
      return {
        intent: "talk",
        reply: "Nothing idle to run. Describe a new campaign or pick a still node.",
        jobs: [],
      };
    }
    return { intent: "run", reply: jobReply(jobs), jobs };
  }

  if (
    /^(hi|hello|hey|help|what can you do|status)\b/i.test(lower) ||
    text.length < 8
  ) {
    return {
      intent: "talk",
      reply: "I queue stills and motion against the graph. Describe a campaign, load a workflow, or tell me to run it. Paid runs wait for confirm.",
      jobs: [],
    };
  }

  return {
    intent: "plan",
    reply: "",
    jobs: [],
    name: "Canvas plan",
  };
}

function materializeShots(shots: AgentShot[]): GraphNode[] {
  return shots.slice(0, 6).map((s, i) => ({
    id: crypto.randomUUID(),
    kind: s.kind,
    x: 56 + i * 300,
    y: 80 + (i % 2) * 220,
    title: s.title,
    prompt: s.prompt,
    aspectRatio: s.aspectRatio || "16:9",
    status: "idle" as const,
  }));
}

function bindJobs(jobs: ProposedJob[], nodes: GraphNode[]): ProposedJob[] {
  const used = new Set<string>();
  return jobs.map((j) => {
    if (j.nodeId && nodes.some((n) => n.id === j.nodeId)) {
      used.add(j.nodeId);
      return j;
    }
    const byTitle = nodes.find(
      (n) =>
        n.title.toLowerCase() === j.title.toLowerCase() && !used.has(n.id),
    );
    const want = j.kind === "motion" ? "video" : "image";
    const byKind = nodes.find((n) => n.kind === want && !used.has(n.id));
    const id = byTitle?.id ?? byKind?.id ?? j.nodeId;
    if (id) used.add(id);
    return { ...j, nodeId: id };
  });
}

export function applyDecision(decision: AgentDecision) {
  const store = useStudio.getState();

  if (decision.intent === "cancel") {
    store.cancelOpenJobs();
    store.addMessage({ role: "agent", text: decision.reply });
    return;
  }

  if (decision.intent === "load" && decision.templateId) {
    store.loadTemplate(decision.templateId);
    store.addMessage({ role: "agent", text: decision.reply });
    return;
  }

  if (decision.intent === "plan" && decision.shots?.length) {
    const nodes = materializeShots(decision.shots);
    store.applyPlan(decision.name || "Canvas plan", nodes);
    const raw = decision.jobs.length ? decision.jobs : jobsFromPlanNodes(nodes);
    const jobs = bindJobs(raw, nodes).filter(
      (j) => j.kind === "still" || j.kind === "motion",
    );
    const ids = store.enqueueJobs(jobs);
    store.addMessage({
      role: "agent",
      text:
        decision.reply ||
        `Graph laid with ${jobs.length} job${jobs.length === 1 ? "" : "s"}. Confirm the paid run.`,
      jobIds: ids,
    });
    return;
  }

  if (decision.intent === "run") {
    const jobs =
      decision.jobs.length > 0
        ? bindJobs(decision.jobs, store.project.nodes)
        : idleMediaJobs(store.project.nodes);
    if (!jobs.length) {
      store.addMessage({
        role: "agent",
        text: "Nothing to queue. Describe a campaign first.",
      });
      return;
    }
    const ids = store.enqueueJobs(jobs);
    store.addMessage({
      role: "agent",
      text: decision.reply || jobReply(jobs),
      jobIds: ids,
    });
    return;
  }

  store.addMessage({
    role: "agent",
    text:
      decision.reply ||
      "Say run to queue idle nodes, or describe the campaign you want plated.",
  });
}

export function fallbackPlan(brief: string): AgentDecision {
  const prompt = brief.trim();
  const shots: AgentShot[] = [
    {
      title: "Brief",
      kind: "prompt",
      prompt,
      aspectRatio: "16:9",
    },
    {
      title: "Still",
      kind: "image",
      prompt: `Photoreal cinematic still. ${prompt}. Restrained grade, no text, no logos.`,
      aspectRatio: "16:9",
    },
    {
      title: "Cut",
      kind: "output",
      prompt: "Hold the last frame. Logo last if needed.",
      aspectRatio: "16:9",
    },
  ];
  return {
    intent: "plan",
    name: "Floor plan",
    reply: "One still queued from the brief. Confirm the paid run.",
    shots,
    jobs: [],
  };
}

export function jobTone(status: StudioJob["status"]) {
  switch (status) {
    case "running":
      return "text-amber-deep";
    case "done":
      return "text-navy";
    case "error":
      return "text-amber-deep";
    case "cancelled":
      return "text-faint";
    default:
      return "text-muted";
  }
}
