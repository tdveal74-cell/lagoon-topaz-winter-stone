import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as cn, o as proposedCounts, s as useStudio, u as dispatchAgent } from "./router-C2iD6btd.mjs";
import { a as jobTone, i as interpretLocal, n as fallbackPlan, r as graphSnapshot, t as applyDecision } from "./agent-CdJcPucH.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agent-dock-C3uoRCG5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color,color,box-shadow] duration-[var(--motion-fast)] ease-[var(--ease-flagship)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-navy text-on-navy hover:bg-navy-700",
			outline: "bg-transparent text-navy shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			ghost: "bg-transparent text-muted hover:text-navy hover:bg-paper",
			quiet: "bg-paper text-navy hover:bg-sunken",
			danger: "bg-navy text-on-navy hover:opacity-90"
		},
		size: {
			default: "h-11 px-5 text-sm rounded-[var(--radius-sm)]",
			sm: "h-9 px-3.5 text-sm rounded-[var(--radius-sm)]",
			lg: "h-12 px-6 text-[0.9375rem] rounded-[var(--radius-md)]",
			icon: "size-11 rounded-[var(--radius-sm)]"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function AgentDock({ variant }) {
	const { project, jobs, messages, remaining, bumpCap, armBatch, cancelOpenJobs, addMessage } = useStudio();
	const [draft, setDraft] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const scroller = (0, import_react.useRef)(null);
	const counts = proposedCounts(jobs);
	const openJobs = (0, import_react.useMemo)(() => jobs.filter((j) => j.status === "proposed" || j.status === "queued" || j.status === "running"), [jobs]);
	const visibleMessages = variant === "dock" ? messages.slice(-4) : messages;
	async function send(text) {
		const message = text.trim();
		if (!message || busy) return;
		setDraft("");
		addMessage({
			role: "user",
			text: message
		});
		setBusy(true);
		try {
			const local = interpretLocal(message, project.nodes);
			if (local.intent !== "plan") {
				applyDecision(local);
				return;
			}
			if (remaining("chats") > 0) {
				const res = await dispatchAgent({ data: {
					message,
					templateId: project.templateId,
					graph: graphSnapshot(project.nodes)
				} });
				if (res.ok) {
					bumpCap("chats");
					applyDecision({
						intent: res.intent,
						reply: res.reply,
						templateId: res.templateId,
						name: res.name,
						shots: res.shots,
						jobs: res.jobs
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
	function onSubmit(e) {
		e.preventDefault();
		send(draft);
	}
	function onKey(e) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			send(draft);
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
	const bits = [counts.stills ? `${counts.stills} still${counts.stills === 1 ? "" : "s"}` : "", counts.motion ? `${counts.motion} motion` : ""].filter(Boolean).join(" · ");
	const confirmLabel = counts.proposed ? page ? `Confirm paid run · ${bits}` : `Confirm · ${bits}` : counts.running || counts.queued ? "Running…" : page ? "Confirm paid run" : "Confirm run";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex min-h-0 bg-surface", page ? "agent-page h-full flex-col lg:flex-row" : "h-[188px] shrink-0 flex-row border-t border-border"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("flex min-h-0 min-w-0 flex-1 flex-col", page && "lg:border-r lg:border-border"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: scroller,
				className: cn("min-h-0 flex-1 overflow-y-auto px-3 py-2 md:px-4", page && "px-4 py-4 md:px-6"),
				children: [page ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "house-kicker",
							children: "Agent"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "agent-title",
							children: "Queue"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "agent-note",
							children: "Confirm waits. Nothing ships silent. Plates land in dailies."
						})
					]
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-2",
					children: [visibleMessages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "agent-ticket",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "agent-ticket__who",
							children: m.role === "agent" ? "Agent" : "You"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m.text })]
					}, m.id)), busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-[11px] uppercase tracking-[0.16em] text-amber-deep",
						children: "Reading the floor…"
					}) : null]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "flex items-end gap-2 border-t border-border px-3 py-2 md:px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex-1 text-[11px] font-medium text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: page ? "block" : "sr-only",
						children: "Job for the agent"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: draft,
						onChange: (e) => setDraft(e.target.value),
						onKeyDown: onKey,
						rows: page ? 3 : 2,
						placeholder: "Run the graph, or a serum in apartment light",
						className: "live-compose mt-1"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: busy || !draft.trim(),
					className: "min-h-11",
					children: busy ? "…" : "Send"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("flex shrink-0 flex-col border-t border-border md:border-t-0 md:border-l", page ? "h-[44%] lg:h-auto lg:w-[380px] md:w-[340px]" : "w-[260px] lg:w-[280px]"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "live-kicker",
						children: "Queue"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] tabular-nums text-muted",
						children: [
							"Stills ",
							remaining("images"),
							" · Motion ",
							remaining("videos")
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: cn("min-h-0 flex-1 overflow-y-auto px-3", page && "px-4"),
					children: openJobs.length === 0 && !jobs.some((j) => j.status === "done") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "py-2 text-sm text-muted",
						children: "No jobs yet."
					}) : (page ? jobs.slice(0, 18) : openJobs.slice(0, 6)).map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: cn("flex items-baseline justify-between gap-2 border-b border-border py-2 last:border-0", page && "docket-item"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 truncate text-sm",
							children: j.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em]", jobTone(j.status), j.status === "running" && "job-running"),
							children: j.status
						})]
					}, j.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 border-t border-border p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full min-h-11 whitespace-nowrap",
						onClick: onConfirm,
						disabled: !counts.proposed || counts.running > 0,
						children: confirmLabel
					}), counts.proposed || counts.queued ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							cancelOpenJobs();
							toast.message("Queue cleared.");
						},
						className: cn("text-[11px] font-medium text-muted hover:text-navy", page && "min-h-11"),
						children: "Cancel open jobs"
					}) : null]
				})
			]
		})]
	});
}
//#endregion
export { Button as n, AgentDock as t };
