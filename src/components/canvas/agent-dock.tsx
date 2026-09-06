import { useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { dispatchAgent } from "@/lib/ai";
import {
  applyDecision,
  fallbackPlan,
  graphSnapshot,
  interpretLocal,
  jobTone,
} from "@/lib/agent";
import { proposedCounts } from "@/lib/jobs";
import { useStudio } from "@/lib/store";
import { cn } from "@/lib/cn";

export function AgentDock({ variant }: { variant: "dock" | "page" }) {
  const {
    project,
    jobs,
    messages,
    remaining,
    bumpCap,
    armBatch,
    cancelOpenJobs,
    addMessage,
  } = useStudio();
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const counts = proposedCounts(jobs);
  const openJobs = useMemo(
    () =>
      jobs.filter(
        (j) =>
          j.status === "proposed" ||
          j.status === "queued" ||
          j.status === "running",
      ),
    [jobs],
  );
  const visibleMessages =
    variant === "dock" ? messages.slice(-4) : messages;

  async function send(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    setDraft("");
    addMessage({ role: "user", text: message });
    setBusy(true);
    try {
      const local = interpretLocal(message, project.nodes);
      if (local.intent !== "plan") {
        applyDecision(local);
        return;
      }

      if (remaining("chats") > 0) {
        const res = await dispatchAgent({
          data: {
            message,
            templateId: project.templateId,
            graph: graphSnapshot(project.nodes),
          },
        });
        if (res.ok) {
          bumpCap("chats");
          applyDecision({
            intent: res.intent,
            reply: res.reply,
            templateId: res.templateId,
            name: res.name,
            shots: res.shots,
            jobs: res.jobs,
          });
          return;
        }
        toast.error(res.error);
      }

      applyDecision(fallbackPlan(message));
    } finally {
      setBusy(false);
      requestAnimationFrame(() => {
        scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
      });
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(draft);
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(draft);
    }
  }

  function onConfirm() {
    if (!armBatch()) {
      toast.message("Nothing to confirm.");
      return;
    }
    toast.message("Paid run armed. Jobs run one at a time.");
  }

  const page = variant === "page";

  const bits = [
    counts.stills ? `${counts.stills} still${counts.stills === 1 ? "" : "s"}` : "",
    counts.motion ? `${counts.motion} motion` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  const confirmLabel = counts.proposed
    ? page
      ? `Confirm paid run · ${bits}`
      : `Confirm · ${bits}`
    : counts.running || counts.queued
      ? "Running…"
      : page
        ? "Confirm paid run"
        : "Confirm run";

  return (
    <div
      className={cn(
        "flex min-h-0 bg-surface",
        page
          ? "agent-page h-full flex-col lg:flex-row"
          : "h-[188px] shrink-0 flex-row border-t border-border",
      )}
    >
      <div
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col",
          page && "lg:border-r lg:border-border",
        )}
      >
        <div
          ref={scroller}
          className={cn(
            "min-h-0 flex-1 overflow-y-auto px-3 py-2 md:px-4",
            page && "px-4 py-4 md:px-6",
          )}
        >
          {page ? (
            <div className="mb-4">
              <p className="house-kicker">Agent</p>
              <h1 className="agent-title">Queue</h1>
              <p className="agent-note">
                Confirm waits. Nothing ships silent. Plates land in dailies.
              </p>
            </div>
          ) : null}
          <ul className="space-y-2">
            {visibleMessages.map((m) => (
              <li key={m.id} className="agent-ticket">
                <span className="agent-ticket__who">
                  {m.role === "agent" ? "Agent" : "You"}
                </span>
                <span>{m.text}</span>
              </li>
            ))}
            {busy ? (
              <li className="text-[11px] uppercase tracking-[0.16em] text-amber-deep">
                Reading the floor…
              </li>
            ) : null}
          </ul>
        </div>
        <form
          onSubmit={onSubmit}
          className="flex items-end gap-2 border-t border-border px-3 py-2 md:px-4"
        >
          <label className="flex-1 text-[11px] font-medium text-muted">
            <span className={page ? "block" : "sr-only"}>Job for the agent</span>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKey}
              rows={page ? 3 : 2}
              placeholder="Run the graph, or a serum in apartment light"
              className="live-compose mt-1"
            />
          </label>
          <Button type="submit" disabled={busy || !draft.trim()} className="min-h-11">
            {busy ? "…" : "Send"}
          </Button>
        </form>
      </div>

      <div
        className={cn(
          "flex shrink-0 flex-col border-t border-border md:border-t-0 md:border-l",
          page ? "h-[44%] lg:h-auto lg:w-[380px] md:w-[340px]" : "w-[260px] lg:w-[280px]",
        )}
      >
        <div className="flex items-center justify-between px-3 py-2">
            <p className="live-kicker">Queue</p>
          <p className="text-[11px] tabular-nums text-muted">
            Stills {remaining("images")} · Motion {remaining("videos")}
          </p>
        </div>
        <ul className={cn("min-h-0 flex-1 overflow-y-auto px-3", page && "px-4")}>
          {openJobs.length === 0 && !jobs.some((j) => j.status === "done") ? (
            <li className="py-2 text-sm text-muted">No jobs yet.</li>
          ) : (
            (page ? jobs.slice(0, 18) : openJobs.slice(0, 6)).map((j) => (
              <li
                key={j.id}
                className={cn(
                  "flex items-baseline justify-between gap-2 border-b border-border py-2 last:border-0",
                  page && "docket-item",
                )}
              >
                <span className="min-w-0 truncate text-sm">{j.label}</span>
                <span
                  className={cn(
                    "shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em]",
                    jobTone(j.status),
                    j.status === "running" && "job-running",
                  )}
                >
                  {j.status}
                </span>
              </li>
            ))
          )}
        </ul>
        <div className="flex flex-col gap-2 border-t border-border p-3">
          <Button
            className="w-full min-h-11 whitespace-nowrap"
            onClick={onConfirm}
            disabled={!counts.proposed || counts.running > 0}
          >
            {confirmLabel}
          </Button>
          {counts.proposed || counts.queued ? (
            <button
              type="button"
              onClick={() => {
                cancelOpenJobs();
                toast.message("Queue cleared.");
              }}
              className={cn(
                "text-[11px] font-medium text-muted hover:text-navy",
                page && "min-h-11",
              )}
            >
              Cancel open jobs
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
