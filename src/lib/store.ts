import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AgentMessage,
  AspectRatio,
  GraphNode,
  LibraryAsset,
  NodeKind,
  Project,
  StudioJob,
  TimelineClip,
} from "@/lib/types";
import {
  assetsFromTemplate,
  clipsFromTemplate,
  templateById,
} from "@/lib/templates";

const IMAGE_CAP = 8;
const VIDEO_CAP = 2;
const CHAT_CAP = 10;

function uid() {
  return crypto.randomUUID();
}

function projectFromTemplate(templateId: string): Project {
  const t = templateById(templateId);
  return {
    id: uid(),
    name: t.name,
    templateId: t.id,
    nodes: t.nodes.map((n) => ({ ...n })),
    edges: t.edges.map((e) => ({ ...e })),
    assets: assetsFromTemplate(t),
    clips: clipsFromTemplate(t),
    updatedAt: Date.now(),
  };
}

const STARTER: AgentMessage = {
  id: "starter",
  role: "agent",
  text: "Floor agent. Describe a campaign, or tell me to run the graph. Paid runs wait for your confirm.",
  at: 0,
};

interface SessionCaps {
  images: number;
  videos: number;
  chats: number;
}

export type ProposedJob = {
  kind: StudioJob["kind"];
  nodeId?: string;
  title: string;
  prompt: string;
  aspectRatio: AspectRatio;
};

interface StudioState {
  project: Project;
  selectedId: string | null;
  caps: SessionCaps;
  jobs: StudioJob[];
  messages: AgentMessage[];
  batchArmed: boolean;
  loadTemplate: (id: string) => void;
  select: (id: string | null) => void;
  moveNode: (id: string, x: number, y: number) => void;
  patchNode: (id: string, patch: Partial<GraphNode>) => void;
  addNode: (kind: NodeKind) => string;
  removeSelected: () => void;
  addAsset: (asset: LibraryAsset) => void;
  addClip: (clip: TimelineClip) => void;
  removeClip: (id: string) => void;
  patchClip: (id: string, patch: Partial<TimelineClip>) => void;
  bumpCap: (kind: "images" | "videos" | "chats") => boolean;
  remaining: (kind: "images" | "videos" | "chats") => number;
  applyPlan: (name: string, nodes: GraphNode[]) => void;
  enqueueJobs: (incoming: ProposedJob[]) => string[];
  patchJob: (id: string, patch: Partial<StudioJob>) => void;
  armBatch: () => boolean;
  cancelOpenJobs: () => void;
  addMessage: (msg: Omit<AgentMessage, "id" | "at">) => void;
}

const CAP_MAX = { images: IMAGE_CAP, videos: VIDEO_CAP, chats: CHAT_CAP };

export const useStudio = create<StudioState>()(
  persist(
    (set, get) => ({
      project: projectFromTemplate("film"),
      selectedId: "i1",
      caps: { images: 0, videos: 0, chats: 0 },
      jobs: [],
      messages: [STARTER],
      batchArmed: false,
      loadTemplate: (id) => {
        const project = projectFromTemplate(id);
        const first =
          project.nodes.find((n) => n.kind === "image") ?? project.nodes[0];
        set({
          project,
          selectedId: first?.id ?? null,
        });
      },
      select: (id) => set({ selectedId: id }),
      moveNode: (id, x, y) =>
        set((s) => ({
          project: {
            ...s.project,
            nodes: s.project.nodes.map((n) =>
              n.id === id ? { ...n, x, y } : n,
            ),
            updatedAt: Date.now(),
          },
        })),
      patchNode: (id, patch) =>
        set((s) => ({
          project: {
            ...s.project,
            nodes: s.project.nodes.map((n) =>
              n.id === id ? { ...n, ...patch } : n,
            ),
            updatedAt: Date.now(),
          },
        })),
      addNode: (kind) => {
        const { project, selectedId } = get();
        const selected = project.nodes.find((n) => n.id === selectedId);
        const id = uid();
        const node: GraphNode = {
          id,
          kind,
          x: (selected?.x ?? 200) + 180,
          y: (selected?.y ?? 120) + 40,
          title:
            kind === "prompt"
              ? "Brief"
              : kind === "image"
                ? "Still"
                : kind === "video"
                  ? "Motion"
                  : kind === "style"
                    ? "Look"
                    : "Cut",
          prompt: selected?.prompt ?? "",
          aspectRatio: (selected?.aspectRatio ?? "16:9") as AspectRatio,
          status: "idle",
        };
        const edges = selected
          ? [
              ...project.edges,
              { id: `${selected.id}-${id}`, from: selected.id, to: id },
            ]
          : project.edges;
        set({
          project: {
            ...project,
            nodes: [...project.nodes, node],
            edges,
            updatedAt: Date.now(),
          },
          selectedId: id,
        });
        return id;
      },
      removeSelected: () => {
        const { selectedId, project } = get();
        if (!selectedId) return;
        set({
          selectedId: null,
          project: {
            ...project,
            nodes: project.nodes.filter((n) => n.id !== selectedId),
            edges: project.edges.filter(
              (e) => e.from !== selectedId && e.to !== selectedId,
            ),
            updatedAt: Date.now(),
          },
        });
      },
      addAsset: (asset) =>
        set((s) => ({
          project: {
            ...s.project,
            assets: [asset, ...s.project.assets],
            updatedAt: Date.now(),
          },
        })),
      addClip: (clip) =>
        set((s) => ({
          project: {
            ...s.project,
            clips: [...s.project.clips, clip],
            updatedAt: Date.now(),
          },
        })),
      removeClip: (id) =>
        set((s) => ({
          project: {
            ...s.project,
            clips: s.project.clips.filter((c) => c.id !== id),
            updatedAt: Date.now(),
          },
        })),
      patchClip: (id, patch) =>
        set((s) => ({
          project: {
            ...s.project,
            clips: s.project.clips.map((c) =>
              c.id === id ? { ...c, ...patch } : c,
            ),
            updatedAt: Date.now(),
          },
        })),
      bumpCap: (kind) => {
        const caps = get().caps;
        if (caps[kind] >= CAP_MAX[kind]) return false;
        set({ caps: { ...caps, [kind]: caps[kind] + 1 } });
        return true;
      },
      remaining: (kind) => CAP_MAX[kind] - get().caps[kind],
      applyPlan: (name, nodes) => {
        const edges = nodes.slice(0, -1).map((node, i) => ({
          id: `${node.id}-${nodes[i + 1].id}`,
          from: node.id,
          to: nodes[i + 1].id,
        }));
        set((s) => ({
          project: {
            ...s.project,
            name,
            nodes,
            edges,
            updatedAt: Date.now(),
          },
          selectedId: nodes.find((n) => n.kind === "image")?.id ?? nodes[0]?.id ?? null,
        }));
      },
      enqueueJobs: (incoming) => {
        if (!incoming.length) return [];
        const created: StudioJob[] = incoming.map((j) => ({
          id: uid(),
          kind: j.kind,
          status: "proposed",
          label: j.title,
          prompt: j.prompt,
          nodeId: j.nodeId,
          aspectRatio: j.aspectRatio,
          createdAt: Date.now(),
        }));
        set((s) => {
          const keep = s.jobs.filter(
            (job) =>
              job.status === "running" ||
              job.status === "done" ||
              job.status === "error" ||
              job.status === "queued",
          );
          return {
            jobs: [...created, ...keep].slice(0, 60),
            batchArmed: s.batchArmed,
          };
        });
        return created.map((j) => j.id);
      },
      patchJob: (id, patch) =>
        set((s) => ({
          jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)),
        })),
      armBatch: () => {
        const { jobs } = get();
        const proposed = jobs.filter((j) => j.status === "proposed");
        if (!proposed.length) return false;
        set({
          batchArmed: true,
          jobs: jobs.map((j) =>
            j.status === "proposed" ? { ...j, status: "queued" } : j,
          ),
        });
        return true;
      },
      cancelOpenJobs: () =>
        set((s) => ({
          batchArmed: false,
          jobs: s.jobs.map((j) =>
            j.status === "proposed" || j.status === "queued"
              ? { ...j, status: "cancelled", finishedAt: Date.now() }
              : j,
          ),
        })),
      addMessage: (msg) =>
        set((s) => ({
          messages: [
            ...s.messages,
            { ...msg, id: uid(), at: Date.now() },
          ].slice(-40),
        })),
    }),
    {
      name: "editforge-canvas-v3",
      partialize: (s) => ({
        project: s.project,
        selectedId: s.selectedId,
        caps: s.caps,
        jobs: s.jobs,
        messages: s.messages,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.batchArmed = false;
        state.jobs = state.jobs.map((j) =>
          j.status === "queued" || j.status === "running"
            ? { ...j, status: "proposed" as const, error: undefined }
            : j,
        );
        if (!state.messages?.length) state.messages = [STARTER];
      },
    },
  ),
);

export { IMAGE_CAP, VIDEO_CAP, CHAT_CAP };
