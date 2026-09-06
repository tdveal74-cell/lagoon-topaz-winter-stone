export type ModuleStatus = "operational" | "planner" | "bridge" | "ai-media";

export type StudioModule = {
  id: string;
  dept: string;
  label: string;
  href: "/canvas" | "/agent" | "/dailies" | "/timeline" | "/rubric";
  status: ModuleStatus;
  studioRole: string;
};

/** Surfaces actually wired in this bay. Counts on the home must use this list. */
export const STUDIO_MODULES: StudioModule[] = [
  {
    id: "canvas",
    dept: "Create",
    label: "Canvas",
    href: "/canvas",
    status: "ai-media",
    studioRole: "Node graph for stills and motion",
  },
  {
    id: "agent",
    dept: "Create",
    label: "Agent",
    href: "/agent",
    status: "ai-media",
    studioRole: "Job runner for the floor",
  },
  {
    id: "dailies",
    dept: "Production",
    label: "Dailies",
    href: "/dailies",
    status: "operational",
    studioRole: "Day roll queue",
  },
  {
    id: "timeline",
    dept: "Editorial",
    label: "Timeline",
    href: "/timeline",
    status: "operational",
    studioRole: "Assembly sketch",
  },
  {
    id: "rubric",
    dept: "QC",
    label: "Rubric",
    href: "/rubric",
    status: "operational",
    studioRole: "Ship gate",
  },
];

export function modulesByDept(): Record<string, StudioModule[]> {
  const map: Record<string, StudioModule[]> = {};
  for (const m of STUDIO_MODULES) {
    (map[m.dept] ||= []).push(m);
  }
  return map;
}
