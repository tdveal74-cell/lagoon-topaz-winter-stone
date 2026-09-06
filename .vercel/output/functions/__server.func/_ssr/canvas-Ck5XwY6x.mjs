import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Trash2, r as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as TEMPLATES, d as cn, i as idleMediaJobs, n as Route$3, s as useStudio } from "./router-C2iD6btd.mjs";
import { n as Button, t as AgentDock } from "./agent-dock-C3uoRCG5.mjs";
import { t as useScrollCraft } from "./use-scrollcraft-CDA5LP4u.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/canvas-Ck5XwY6x.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ASPECT_OPTIONS = [
	"16:9",
	"9:16",
	"1:1",
	"4:3",
	"3:2"
];
var NODE_KIND_LABEL = {
	prompt: "Brief",
	image: "Still",
	video: "Motion",
	style: "Look",
	output: "Output"
};
function InspectorPanel({ selected, armed, onPatch, onRun }) {
	if (!selected) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-4 text-sm text-muted",
		children: "Select a node."
	});
	const isMedia = selected.kind === "image" || selected.kind === "video";
	const label = selected.status === "running" ? "Running…" : armed ? "Confirm paid run" : selected.kind === "video" ? "Generate motion" : selected.kind === "image" ? "Generate still" : "Node is reference";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-1 flex-col gap-3 overflow-y-auto p-4",
		children: [
			selected.assetUrl ? selected.assetKind === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				src: selected.assetUrl,
				className: "live-plate",
				muted: true,
				playsInline: true
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: selected.assetUrl,
				alt: "",
				className: "live-plate"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "live-field",
				children: ["Title", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: selected.title,
					onChange: (e) => onPatch(selected.id, { title: e.target.value })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "live-field",
				children: ["Brief", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: selected.prompt,
					onChange: (e) => onPatch(selected.id, { prompt: e.target.value }),
					rows: 5
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "live-field",
				children: ["Ratio", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: selected.aspectRatio,
					onChange: (e) => onPatch(selected.id, { aspectRatio: e.target.value }),
					children: ASPECT_OPTIONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: r }, r))
				})]
			}),
			selected.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-amber-deep",
				children: selected.error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => onRun(selected),
				disabled: selected.status === "running" || !isMedia,
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] leading-snug text-muted",
				children: "Paid runs spend your xAI quota. First click arms. Second click queues the job. Changing the brief clears the arm."
			})
		]
	});
}
var KIND_TONE = {
	prompt: "text-amber-deep",
	image: "text-navy",
	video: "text-navy",
	style: "text-muted",
	output: "text-navy"
};
function bezier(x1, y1, x2, y2) {
	const dx = Math.max(48, Math.abs(x2 - x1) * .45);
	return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}
function NodeCanvas({ nodes, edges, selectedId, onSelect, onMove }) {
	const wrapRef = (0, import_react.useRef)(null);
	const [view, setView] = (0, import_react.useState)({
		x: 16,
		y: 20,
		scale: .78
	});
	const pan = (0, import_react.useRef)(null);
	const drag = (0, import_react.useRef)(null);
	const onWheel = (0, import_react.useCallback)((e) => {
		e.preventDefault();
		const delta = e.deltaY > 0 ? .94 : 1.06;
		setView((v) => ({
			...v,
			scale: Math.min(1.6, Math.max(.45, v.scale * delta))
		}));
	}, []);
	const onBgPointerDown = (e) => {
		if (e.target !== e.currentTarget && e.target.dataset.bg !== "1") return;
		onSelect(null);
		pan.current = {
			x: e.clientX,
			y: e.clientY,
			vx: view.x,
			vy: view.y
		};
		e.currentTarget.setPointerCapture(e.pointerId);
	};
	const onBgPointerMove = (e) => {
		if (drag.current) {
			const dx = (e.clientX - drag.current.ox) / view.scale;
			const dy = (e.clientY - drag.current.oy) / view.scale;
			onMove(drag.current.id, drag.current.nx + dx, drag.current.ny + dy);
			return;
		}
		if (!pan.current) return;
		setView((v) => ({
			...v,
			x: pan.current.vx + (e.clientX - pan.current.x),
			y: pan.current.vy + (e.clientY - pan.current.y)
		}));
	};
	const endPointer = () => {
		pan.current = null;
		drag.current = null;
	};
	const startDrag = (e, node) => {
		e.stopPropagation();
		onSelect(node.id);
		drag.current = {
			id: node.id,
			ox: e.clientX,
			oy: e.clientY,
			nx: node.x,
			ny: node.y
		};
	};
	const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: wrapRef,
		className: "relative h-full overflow-hidden bg-canvas select-none live-lamp",
		onWheel,
		onPointerDown: onBgPointerDown,
		onPointerMove: onBgPointerMove,
		onPointerUp: endPointer,
		onPointerCancel: endPointer,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-bg": "1",
				className: "absolute inset-0",
				style: {
					backgroundImage: "radial-gradient(rgba(248,245,240,0.07) 1px, transparent 1px)",
					backgroundSize: `${22 * view.scale}px ${22 * view.scale}px`,
					backgroundPosition: `${view.x}px ${view.y}px`
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute origin-top-left",
				style: { transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
					className: "pointer-events-none absolute inset-0 overflow-visible",
					width: "1",
					height: "1",
					children: edges.map((ed) => {
						const a = byId[ed.from];
						const b = byId[ed.to];
						if (!a || !b) return null;
						const x1 = a.x + 268;
						const y1 = a.y + (a.assetUrl ? 110 : 52);
						const x2 = b.x;
						const y2 = b.y + (b.assetUrl ? 110 : 52);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: bezier(x1, y1, x2, y2),
							fill: "none",
							stroke: "rgba(212,160,23,0.55)",
							strokeWidth: "1.6"
						}, ed.id);
					})
				}), nodes.map((node) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					onPointerDown: (e) => startDrag(e, node),
					className: cn("live-node absolute w-[268px] p-2 shadow-[var(--shadow-card)]", selectedId === node.id ? "ring-2 ring-amber" : node.status === "running" ? "ring-2 ring-amber" : "ring-1 ring-border"),
					style: {
						left: node.x,
						top: node.y
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between px-1 pb-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("text-[10px] font-semibold uppercase tracking-[0.16em]", KIND_TONE[node.kind]),
								children: NODE_KIND_LABEL[node.kind]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("text-[10px] tabular-nums text-faint", node.status === "running" && "job-running text-amber-deep", node.status === "error" && "text-amber-deep"),
								children: node.status === "running" ? "running" : node.status === "error" ? "error" : node.status === "done" ? "ready" : "idle"
							})]
						}),
						node.assetUrl ? node.assetKind === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
							src: node.assetUrl,
							className: "mb-2 h-32 w-full rounded-[var(--radius-sm)] object-cover",
							muted: true,
							playsInline: true,
							loop: true
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: node.assetUrl,
							alt: "",
							className: "mb-2 h-32 w-full rounded-[var(--radius-sm)] object-cover",
							draggable: false
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "px-1 text-sm font-medium text-navy",
							children: node.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "line-clamp-2 px-1 pb-1 text-[11px] leading-snug text-muted",
							children: node.prompt || "Empty brief"
						})
					]
				}, node.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "pointer-events-none absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.16em] text-on-navy/45",
				children: "Drag to pan · scroll to zoom"
			})
		]
	});
}
var KINDS = [
	"prompt",
	"image",
	"video",
	"style",
	"output"
];
function StudioApp({ templateId }) {
	const { project, selectedId, jobs, loadTemplate, select, moveNode, patchNode, addNode, removeSelected, remaining, enqueueJobs, armBatch } = useStudio();
	const [armedId, setArmedId] = (0, import_react.useState)(null);
	const [narrow, setNarrow] = (0, import_react.useState)(false);
	const [phoneTab, setPhoneTab] = (0, import_react.useState)("floor");
	useScrollCraft("forge-canvas");
	(0, import_react.useEffect)(() => {
		const m = window.matchMedia("(max-width: 767px)");
		const apply = () => setNarrow(m.matches);
		apply();
		m.addEventListener("change", apply);
		return () => m.removeEventListener("change", apply);
	}, []);
	(0, import_react.useEffect)(() => {
		if (templateId && templateId !== project.templateId) loadTemplate(templateId);
	}, [
		templateId,
		project.templateId,
		loadTemplate
	]);
	const selected = project.nodes.find((n) => n.id === selectedId) ?? null;
	const openCount = jobs.filter((j) => j.status === "proposed" || j.status === "queued" || j.status === "running").length;
	const plates = project.nodes.filter((n) => n.assetUrl);
	function queueNode(node) {
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
		enqueueJobs([{
			kind: node.kind === "video" ? "motion" : "still",
			nodeId: node.id,
			title: node.title,
			prompt: node.prompt,
			aspectRatio: node.aspectRatio
		}]);
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
	const armed = selected != null && armedId === `${selected.id}:${selected.prompt}:${selected.kind}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "forge-canvas",
		className: "house-room live-floor",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sc-grain",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "live-strip",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Plates" }), plates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "None on the floor" }) : plates.map((n) => n.assetKind === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					src: n.assetUrl,
					muted: true,
					playsInline: true,
					width: 88,
					height: 56
				}, n.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: n.assetUrl,
					alt: "",
					width: 88,
					height: 56
				}, n.id))]
			}),
			narrow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 overflow-x-auto border-b border-border bg-surface px-3 py-2",
				children: TEMPLATES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => loadTemplate(t.id),
					className: cn("inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[var(--radius-sm)] px-2.5 text-left", project.templateId === t.id ? "bg-navy text-on-navy" : "bg-paper text-navy"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: t.still,
						alt: "",
						className: "size-7 rounded-[var(--radius-xs)] object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium",
						children: t.name
					})]
				}, t.id))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "live-rail hidden w-52 shrink-0 flex-col lg:flex",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border-b border-border px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "live-kicker",
									children: "Workflows"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1 overflow-y-auto p-2",
								children: TEMPLATES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => loadTemplate(t.id),
									className: cn("mb-1 flex w-full items-center gap-2 rounded-[var(--radius-sm)] p-2 text-left", project.templateId === t.id ? "bg-navy text-on-navy" : "hover:bg-paper"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: t.still,
										alt: "",
										className: "size-9 rounded-[var(--radius-xs)] object-cover"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-xs font-medium",
											children: t.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("block truncate text-[10px]", project.templateId === t.id ? "text-on-navy/70" : "text-muted"),
											children: t.category
										})]
									})]
								}, t.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-border p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "live-kicker mb-2",
									children: "Add node"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-1",
									children: KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => addNode(k),
										className: "inline-flex min-h-9 items-center gap-1 rounded-[var(--radius-sm)] bg-paper px-2 text-[11px] font-medium text-navy hover:bg-sunken",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3" }), NODE_KIND_LABEL[k]]
									}, k))
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 flex-1 flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "live-toolbar flex items-center justify-between gap-3 px-3 py-2 md:px-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium",
									children: project.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] tabular-nums text-muted",
									children: [
										"Stills ",
										remaining("images"),
										" · Motion ",
										remaining("videos"),
										" · Briefs ",
										remaining("chats"),
										openCount ? ` · ${openCount} in queue` : ""
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										className: "hidden h-9 max-w-[160px] rounded-[var(--radius-sm)] bg-paper px-2 text-xs text-navy md:block lg:hidden",
										value: project.templateId,
										onChange: (e) => loadTemplate(e.target.value),
										"aria-label": "Workflow",
										children: TEMPLATES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: t.id,
											children: t.name
										}, t.id))
									}),
									!narrow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "quiet",
										onClick: queueIdle,
										children: "Queue idle"
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: removeSelected,
										disabled: !selected,
										"aria-label": "Remove node",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
									})
								]
							})]
						}), narrow && phoneTab === "agent" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-h-0 flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentDock, { variant: "page" })
						}) : narrow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 overflow-y-auto p-3 pb-4",
							children: project.nodes.map((node) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => select(node.id),
									className: cn("w-full rounded-[var(--radius-md)] bg-surface p-3 text-left shadow-[var(--shadow-border)]", selectedId === node.id && "ring-2 ring-amber"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] uppercase tracking-[0.16em] text-amber-deep",
												children: NODE_KIND_LABEL[node.kind]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: cn("text-[10px] uppercase tracking-[0.14em] text-faint", node.status === "running" && "job-running text-amber-deep"),
												children: node.status === "done" ? "ready" : node.status
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium",
											children: node.title
										}),
										node.assetUrl ? node.assetKind === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
											src: node.assetUrl,
											className: "mt-2 h-28 w-full rounded-[var(--radius-sm)] object-cover",
											muted: true,
											playsInline: true
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: node.assetUrl,
											alt: "",
											className: "mt-2 h-28 w-full rounded-[var(--radius-sm)] object-cover"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 line-clamp-2 text-[11px] text-muted",
											children: node.prompt
										})
									]
								}), selectedId === node.id && (node.kind === "image" || node.kind === "video") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "mt-2 w-full min-h-11",
									onClick: () => queueNode(node),
									disabled: node.status === "running",
									children: node.status === "running" ? "Running…" : armed ? "Confirm paid run" : node.kind === "video" ? "Generate motion" : "Generate still"
								}) : null]
							}, node.id))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-h-0 flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NodeCanvas, {
								nodes: project.nodes,
								edges: project.edges,
								selectedId,
								onSelect: select,
								onMove: moveNode
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "live-inspector hidden w-72 shrink-0 flex-col lg:flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-b border-border px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "live-kicker",
								children: "Inspector"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InspectorPanel, {
							selected,
							armed,
							onPatch: (id, patch) => {
								setArmedId(null);
								patchNode(id, patch);
							},
							onRun: queueNode
						})]
					})
				]
			}),
			!narrow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentDock, { variant: "dock" }) : null,
			narrow ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "live-phone flex",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setPhoneTab("floor"),
					className: cn("flex min-h-12 flex-1 items-center justify-center text-xs font-medium", phoneTab === "floor" ? "is-on" : "text-muted"),
					children: "Floor"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setPhoneTab("agent"),
					className: cn("flex min-h-12 flex-1 items-center justify-center text-xs font-medium", phoneTab === "agent" ? "is-on" : "text-muted"),
					children: ["Agent", openCount ? ` · ${openCount}` : ""]
				})]
			}) : null
		]
	});
}
function CanvasPage() {
	const { template } = Route$3.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioApp, { templateId: template });
}
//#endregion
export { CanvasPage as component };
