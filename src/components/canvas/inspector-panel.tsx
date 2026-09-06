import { Button } from "@/components/ui/button";
import { ASPECT_OPTIONS, type GraphNode } from "@/lib/types";

export function InspectorPanel({
  selected,
  armed,
  onPatch,
  onRun,
}: {
  selected: GraphNode | null;
  armed: boolean;
  onPatch: (id: string, patch: Partial<GraphNode>) => void;
  onRun: (node: GraphNode) => void;
}) {
  if (!selected) {
    return <p className="p-4 text-sm text-muted">Select a node.</p>;
  }

  const isMedia = selected.kind === "image" || selected.kind === "video";
  const label = selected.status === "running"
    ? "Running…"
    : armed
      ? "Confirm paid run"
      : selected.kind === "video"
        ? "Generate motion"
        : selected.kind === "image"
          ? "Generate still"
          : "Node is reference";

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
      {selected.assetUrl ? (
        selected.assetKind === "video" ? (
          <video
            src={selected.assetUrl}
            className="live-plate"
            muted
            playsInline
          />
        ) : (
          <img src={selected.assetUrl} alt="" className="live-plate" />
        )
      ) : null}
      <label className="live-field">
        Title
        <input
          value={selected.title}
          onChange={(e) => onPatch(selected.id, { title: e.target.value })}
        />
      </label>
      <label className="live-field">
        Brief
        <textarea
          value={selected.prompt}
          onChange={(e) => onPatch(selected.id, { prompt: e.target.value })}
          rows={5}
        />
      </label>
      <label className="live-field">
        Ratio
        <select
          value={selected.aspectRatio}
          onChange={(e) =>
            onPatch(selected.id, {
              aspectRatio: e.target.value as GraphNode["aspectRatio"],
            })
          }
        >
          {ASPECT_OPTIONS.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </label>
      {selected.error ? (
        <p className="text-xs text-amber-deep">{selected.error}</p>
      ) : null}
      <Button
        onClick={() => onRun(selected)}
        disabled={selected.status === "running" || !isMedia}
      >
        {label}
      </Button>
      <p className="text-[11px] leading-snug text-muted">
        Paid runs spend your xAI quota. First click arms. Second click queues
        the job. Changing the brief clears the arm.
      </p>
    </div>
  );
}