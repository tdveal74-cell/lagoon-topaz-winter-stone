import { useCallback, useRef, useState, type PointerEvent } from "react";
import { cn } from "@/lib/cn";
import type { GraphEdge, GraphNode, NodeKind } from "@/lib/types";
import { NODE_KIND_LABEL } from "@/lib/types";

const KIND_TONE: Record<NodeKind, string> = {
  prompt: "text-amber-deep",
  image: "text-navy",
  video: "text-navy",
  style: "text-muted",
  output: "text-navy",
};

function bezier(x1: number, y1: number, x2: number, y2: number) {
  const dx = Math.max(48, Math.abs(x2 - x1) * 0.45);
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

export function NodeCanvas({
  nodes,
  edges,
  selectedId,
  onSelect,
  onMove,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onMove: (id: string, x: number, y: number) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ x: 16, y: 20, scale: 0.78 });
  const pan = useRef<{
    x: number;
    y: number;
    vx: number;
    vy: number;
  } | null>(null);
  const drag = useRef<{
    id: string;
    ox: number;
    oy: number;
    nx: number;
    ny: number;
  } | null>(null);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.94 : 1.06;
    setView((v) => ({
      ...v,
      scale: Math.min(1.6, Math.max(0.45, v.scale * delta)),
    }));
  }, []);

  const onBgPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget && (e.target as HTMLElement).dataset.bg !== "1")
      return;
    onSelect(null);
    pan.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onBgPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current) {
      const dx = (e.clientX - drag.current.ox) / view.scale;
      const dy = (e.clientY - drag.current.oy) / view.scale;
      onMove(drag.current.id, drag.current.nx + dx, drag.current.ny + dy);
      return;
    }
    if (!pan.current) return;
    setView((v) => ({
      ...v,
      x: pan.current!.vx + (e.clientX - pan.current!.x),
      y: pan.current!.vy + (e.clientY - pan.current!.y),
    }));
  };

  const endPointer = () => {
    pan.current = null;
    drag.current = null;
  };

  const startDrag = (e: PointerEvent, node: GraphNode) => {
    e.stopPropagation();
    onSelect(node.id);
    drag.current = {
      id: node.id,
      ox: e.clientX,
      oy: e.clientY,
      nx: node.x,
      ny: node.y,
    };
  };

  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div
      ref={wrapRef}
      className="relative h-full overflow-hidden bg-canvas select-none live-lamp"
      onWheel={onWheel}
      onPointerDown={onBgPointerDown}
      onPointerMove={onBgPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
    >
      <div
        data-bg="1"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(248,245,240,0.07) 1px, transparent 1px)",
          backgroundSize: `${22 * view.scale}px ${22 * view.scale}px`,
          backgroundPosition: `${view.x}px ${view.y}px`,
        }}
      />
      <div
        className="absolute origin-top-left"
        style={{
          transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
        }}
      >
        <svg className="pointer-events-none absolute inset-0 overflow-visible" width="1" height="1">
          {edges.map((ed) => {
            const a = byId[ed.from];
            const b = byId[ed.to];
            if (!a || !b) return null;
            const x1 = a.x + 268;
            const y1 = a.y + (a.assetUrl ? 110 : 52);
            const x2 = b.x;
            const y2 = b.y + (b.assetUrl ? 110 : 52);
            return (
              <path
                key={ed.id}
                d={bezier(x1, y1, x2, y2)}
                fill="none"
                stroke="rgba(212,160,23,0.55)"
                strokeWidth="1.6"
              />
            );
          })}
        </svg>
        {nodes.map((node) => (
          <article
            key={node.id}
            onPointerDown={(e) => startDrag(e, node)}
            className={cn(
              "live-node absolute w-[268px] p-2 shadow-[var(--shadow-card)]",
              selectedId === node.id
                ? "ring-2 ring-amber"
                : node.status === "running"
                  ? "ring-2 ring-amber"
                  : "ring-1 ring-border",
            )}
            style={{ left: node.x, top: node.y }}
          >
            <div className="flex items-center justify-between px-1 pb-1.5">
              <span
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-[0.16em]",
                  KIND_TONE[node.kind],
                )}
              >
                {NODE_KIND_LABEL[node.kind]}
              </span>
              <span
                className={cn(
                  "text-[10px] tabular-nums text-faint",
                  node.status === "running" && "job-running text-amber-deep",
                  node.status === "error" && "text-amber-deep",
                )}
              >
                {node.status === "running"
                  ? "running"
                  : node.status === "error"
                    ? "error"
                    : node.status === "done"
                      ? "ready"
                      : "idle"}
              </span>
            </div>
            {node.assetUrl ? (
              node.assetKind === "video" ? (
                <video
                  src={node.assetUrl}
                  className="mb-2 h-32 w-full rounded-[var(--radius-sm)] object-cover"
                  muted
                  playsInline
                  loop
                />
              ) : (
                <img
                  src={node.assetUrl}
                  alt=""
                  className="mb-2 h-32 w-full rounded-[var(--radius-sm)] object-cover"
                  draggable={false}
                />
              )
            ) : null}
            <h3 className="px-1 text-sm font-medium text-navy">{node.title}</h3>
            <p className="line-clamp-2 px-1 pb-1 text-[11px] leading-snug text-muted">
              {node.prompt || "Empty brief"}
            </p>
          </article>
        ))}
      </div>
      <p className="pointer-events-none absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.16em] text-on-navy/45">
        Drag to pan · scroll to zoom
      </p>
    </div>
  );
}
