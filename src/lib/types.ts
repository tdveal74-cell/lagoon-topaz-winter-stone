export type NodeKind = "prompt" | "image" | "video" | "style" | "output";

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:2";

export type NodeStatus = "idle" | "running" | "done" | "error";

export interface GraphNode {
  id: string;
  kind: NodeKind;
  x: number;
  y: number;
  title: string;
  prompt: string;
  aspectRatio: AspectRatio;
  status: NodeStatus;
  error?: string;
  assetUrl?: string;
  assetKind?: "image" | "video";
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
}

export interface LibraryAsset {
  id: string;
  url: string;
  kind: "image" | "video";
  prompt: string;
  createdAt: number;
  aspectRatio: AspectRatio;
  title: string;
}

export interface TimelineClip {
  id: string;
  assetId: string;
  duration: number;
  label: string;
}

export interface Project {
  id: string;
  name: string;
  templateId: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  assets: LibraryAsset[];
  clips: TimelineClip[];
  updatedAt: number;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  tagline: string;
  still: string;
  category: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export type JobKind = "still" | "motion";

export type JobStatus =
  | "proposed"
  | "queued"
  | "running"
  | "done"
  | "error"
  | "cancelled";

export interface StudioJob {
  id: string;
  kind: JobKind;
  status: JobStatus;
  label: string;
  prompt: string;
  nodeId?: string;
  aspectRatio: AspectRatio;
  resultUrl?: string;
  error?: string;
  createdAt: number;
  startedAt?: number;
  finishedAt?: number;
}

export interface AgentMessage {
  id: string;
  role: "user" | "agent";
  text: string;
  at: number;
  jobIds?: string[];
}

export const ASPECT_OPTIONS: AspectRatio[] = [
  "16:9",
  "9:16",
  "1:1",
  "4:3",
  "3:2",
];

export const NODE_KIND_LABEL: Record<NodeKind, string> = {
  prompt: "Brief",
  image: "Still",
  video: "Motion",
  style: "Look",
  output: "Output",
};
