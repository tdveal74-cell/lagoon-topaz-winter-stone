import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentDock } from "@/components/canvas/agent-dock";
import { InspectorPanel } from "@/components/canvas/inspector-panel";
import { NodeCanvas } from "@/components/canvas/node-canvas";
import { idleMediaJobs } from "@/lib/jobs";
import { useStudio } from "@/lib/store";
import { TEMPLATES } from "@/lib/templates";
import { NODE_KIND_LABEL, type GraphNode, type NodeKind } from "@/lib/types";
import { useScrollCraft } from "@/lib/use-scrollcraft";
import { cn } from "@/lib/cn";

const KINDS: NodeKind[] = ["prompt", "image", "video", "style", "output"];

export function StudioApp({ templateId }: { templateId?: string }) {
  const {
    project,
    selectedId,
    jobs,
    loadTemplate,
    select,
    moveNode,
    patchNode,
    addNode,
    removeSelected,
    remaining,
    enqueueJobs,
    armBatch,
  } = useStudio();

  const [armedId, setArmedId] = useState<string | null>(null);
  const [narrow, setNarrow] = useState(false);
  const [phoneTab, setPhoneTab] = useState<"floor" | "agent">("floor");
  useScrollCraft("forge-canvas");

  useEffect(() => {
    const m = window.matchMedia("(max-width: 767px)");
    const apply = () => setNarrow(m.matches);
    apply();
    m.addEventListener("change", apply);
    return () => m.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (templateId && templateId !== project.templateId) {
      loadTemplate(templateId);
    }
  }, [templateId, project.templateId, loadTemplate]);

  const selected = project.nodes.find((n) => n.id === selectedId) ?? null;
  const openCount = jobs.filter(
    (j) =>
      j.status === "proposed" ||
      j.status === "queued" ||
      j.status === "running",
  ).length;
  const plates = project.nodes.filter((n) => n.assetUrl);

  function queueNode(node: GraphNode) {
    if (node.kind !== "image" && node.kind !== "video") {
      toast.message("This node does not generate. Run a Still or Motion node.");
      return;
    }
    const key = `${node.id}:${node.prompt}:${node.kind}`;
    if (armedId !== key) {
      setArmedId(key);
      toast.message("Confirm paid run to queue this job.");
      return;
    }
    setArmedId(null);
    enqueueJobs([
      {
        kind: node.kind === "video" ? "motion" : "still",
        nodeId: node.id,
        title: node.title,
        prompt: node.prompt,
        aspectRatio: node.aspectRatio,
      },
    ]);
    if (armBatch()) toast.message("Job queued.");
  }

  function queueIdle() {
    const incoming = idleMediaJobs(project.nodes);
    if (!incoming.length) {
      toast.message("Nothing idle to queue.");
      return;
    }
    enqueueJobs(incoming);
    toast.message("Jobs proposed. Confirm the paid run in the agent dock.");
  }

  const armed =
    selected != null &&
    armedId === `${selected.id}:${selected.prompt}:${selected.kind}`;

  return (
    <div id="forge-canvas" className="house-room live-floor">
      <div className="sc-grain" aria-hidden="true" />
      <div className="live-strip">
        <span>Plates</span>
        {plates.length === 0 ? (
          <span>None on the floor</span>
        ) : (
          plates.map((n) =>
            n.assetKind === "video" ? (
              <video
                key={n.id}
                src={n.assetUrl}
                muted
                playsInline
                width={88}
                height={56}
              />
            ) : (
              <img
                key={n.id}
                src={n.assetUrl}
                alt=""
                width={88}
                height={56}
              />
            ),
          )
        )}
      </div>

      {narrow ? (
        <div className="flex gap-1 overflow-x-auto border-b border-border bg-surface px-3 py-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => loadTemplate(t.id)}
              className={cn(
                "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[var(--radius-sm)] px-2.5 text-left",
                project.templateId === t.id
                  ? "bg-navy text-on-navy"
                  : "bg-paper text-navy",
              )}
            >
              <img
                src={t.still}
                alt=""
                className="size-7 rounded-[var(--radius-xs)] object-cover"
              />
              <span className="text-xs font-medium">{t.name}</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1">
        <aside className="live-rail hidden w-52 shrink-0 flex-col lg:flex">
          <div className="border-b border-border px-4 py-3">
            <p className="live-kicker">Workflows</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => loadTemplate(t.id)}
                className={cn(
                  "mb-1 flex w-full items-center gap-2 rounded-[var(--radius-sm)] p-2 text-left",
                  project.templateId === t.id
                    ? "bg-navy text-on-navy"
                    : "hover:bg-paper",
                )}
              >
                <img
                  src={t.still}
                  alt=""
                  className="size-9 rounded-[var(--radius-xs)] object-cover"
                />
                <span className="min-w-0">
                  <span className="block truncate text-xs font-medium">
                    {t.name}
                  </span>
                  <span
                    className={cn(
                      "block truncate text-[10px]",
                      project.templateId === t.id
                        ? "text-on-navy/70"
                        : "text-muted",
                    )}
                  >
                    {t.category}
                  </span>
                </span>
              </button>
            ))}
          </div>
          <div className="border-t border-border p-3">
            <p className="live-kicker mb-2">Add node</p>
            <div className="flex flex-wrap gap-1">
              {KINDS.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => addNode(k)}
                  className="inline-flex min-h-9 items-center gap-1 rounded-[var(--radius-sm)] bg-paper px-2 text-[11px] font-medium text-navy hover:bg-sunken"
                >
                  <Plus className="size-3" />
                  {NODE_KIND_LABEL[k]}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="live-toolbar flex items-center justify-between gap-3 px-3 py-2 md:px-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{project.name}</p>
              <p className="text-[11px] tabular-nums text-muted">
                Stills {remaining("images")} · Motion {remaining("videos")} ·
                Briefs {remaining("chats")}
                {openCount ? ` · ${openCount} in queue` : ""}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <select
                className="hidden h-9 max-w-[160px] rounded-[var(--radius-sm)] bg-paper px-2 text-xs text-navy md:block lg:hidden"
                value={project.templateId}
                onChange={(e) => loadTemplate(e.target.value)}
                aria-label="Workflow"
              >
                {TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              {!narrow ? (
                <Button size="sm" variant="quiet" onClick={queueIdle}>
                  Queue idle
                </Button>
              ) : null}
              <Button
                size="sm"
                variant="ghost"
                onClick={removeSelected}
                disabled={!selected}
                aria-label="Remove node"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>

          {narrow && phoneTab === "agent" ? (
            <div className="min-h-0 flex-1">
              <AgentDock variant="page" />
            </div>
          ) : narrow ? (
            <div className="flex-1 overflow-y-auto p-3 pb-4">
              {project.nodes.map((node) => (
                <div key={node.id} className="mb-2">
                  <button
                    type="button"
                    onClick={() => select(node.id)}
                    className={cn(
                      "w-full rounded-[var(--radius-md)] bg-surface p-3 text-left shadow-[var(--shadow-border)]",
                      selectedId === node.id && "ring-2 ring-amber",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-amber-deep">
                        {NODE_KIND_LABEL[node.kind]}
                      </p>
                      <p
                        className={cn(
                          "text-[10px] uppercase tracking-[0.14em] text-faint",
                          node.status === "running" && "job-running text-amber-deep",
                        )}
                      >
                        {node.status === "done" ? "ready" : node.status}
                      </p>
                    </div>
                    <p className="text-sm font-medium">{node.title}</p>
                    {node.assetUrl ? (
                      node.assetKind === "video" ? (
                        <video
                          src={node.assetUrl}
                          className="mt-2 h-28 w-full rounded-[var(--radius-sm)] object-cover"
                          muted
                          playsInline
                        />
                      ) : (
                        <img
                          src={node.assetUrl}
                          alt=""
                          className="mt-2 h-28 w-full rounded-[var(--radius-sm)] object-cover"
                        />
                      )
                    ) : (
                      <p className="mt-1 line-clamp-2 text-[11px] text-muted">
                        {node.prompt}
                      </p>
                    )}
                  </button>
                  {selectedId === node.id &&
                  (node.kind === "image" || node.kind === "video") ? (
                    <Button
                      className="mt-2 w-full min-h-11"
                      onClick={() => queueNode(node)}
                      disabled={node.status === "running"}
                    >
                      {node.status === "running"
                        ? "Running…"
                        : armed
                          ? "Confirm paid run"
                          : node.kind === "video"
                            ? "Generate motion"
                            : "Generate still"}
                    </Button>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="min-h-0 flex-1">
              <NodeCanvas
                nodes={project.nodes}
                edges={project.edges}
                selectedId={selectedId}
                onSelect={select}
                onMove={moveNode}
              />
            </div>
          )}
        </div>

        <aside className="live-inspector hidden w-72 shrink-0 flex-col lg:flex">
          <div className="border-b border-border px-4 py-3">
            <p className="live-kicker">Inspector</p>
          </div>
          <InspectorPanel
            selected={selected}
            armed={armed}
            onPatch={(id, patch) => {
              setArmedId(null);
              patchNode(id, patch);
            }}
            onRun={queueNode}
          />
        </aside>
      </div>

      {!narrow ? <AgentDock variant="dock" /> : null}

      {narrow ? (
        <div className="live-phone flex">
          <button
            type="button"
            onClick={() => setPhoneTab("floor")}
            className={cn(
              "flex min-h-12 flex-1 items-center justify-center text-xs font-medium",
              phoneTab === "floor" ? "is-on" : "text-muted",
            )}
          >
            Floor
          </button>
          <button
            type="button"
            onClick={() => setPhoneTab("agent")}
            className={cn(
              "flex min-h-12 flex-1 items-center justify-center text-xs font-medium",
              phoneTab === "agent" ? "is-on" : "text-muted",
            )}
          >
            Agent{openCount ? ` · ${openCount}` : ""}
          </button>
        </div>
      ) : null}
    </div>
  );
}
