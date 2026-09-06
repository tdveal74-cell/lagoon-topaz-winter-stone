import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Pause, i as Play } from "../_libs/lucide-react.mjs";
import { s as useStudio } from "./router-C2iD6btd.mjs";
import { t as RoomShell } from "./room-shell-E0xA2WdM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/timeline-2suAre_j.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TimelinePage() {
	const { project, removeClip, patchClip } = useStudio();
	const [ready, setReady] = (0, import_react.useState)(false);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [t, setT] = (0, import_react.useState)(0);
	const rows = (0, import_react.useMemo)(() => project.clips.map((c) => ({
		clip: c,
		asset: project.assets.find((a) => a.id === c.assetId)
	})), [project]);
	const total = (0, import_react.useMemo)(() => project.clips.reduce((s, c) => s + c.duration, 0) || 1, [project.clips]);
	const current = (0, import_react.useMemo)(() => {
		let acc = 0;
		for (const row of rows) {
			if (t < acc + row.clip.duration) return {
				...row,
				local: t - acc,
				index: rows.indexOf(row)
			};
			acc += row.clip.duration;
		}
		const last = rows.at(-1);
		return last ? {
			...last,
			local: 0,
			index: rows.length - 1
		} : {
			clip: void 0,
			asset: void 0,
			local: 0,
			index: 0
		};
	}, [rows, t]);
	(0, import_react.useEffect)(() => setReady(true), []);
	(0, import_react.useEffect)(() => {
		if (!playing) return;
		let raf = 0;
		let last = performance.now();
		const tick = (now) => {
			const dt = (now - last) / 1e3;
			last = now;
			setT((v) => {
				const n = v + dt;
				if (n >= total) {
					setPlaying(false);
					return total;
				}
				return n;
			});
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [playing, total]);
	function seekTo(i) {
		let acc = 0;
		for (let n = 0; n < i; n++) acc += rows[n]?.clip.duration ?? 0;
		setT(acc);
		setPlaying(false);
	}
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-[50vh]" });
	const p = Math.min(100, t / total * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RoomShell, {
		id: "forge-cut",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "floor-head floor-head--cut",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "house-kicker",
						children: "Timeline"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Cut" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Sequence from dailies. Play reads stills as holds. Last frame is the still the rubric wants." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bay-viewer",
				children: current.asset ? current.asset.kind === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					src: current.asset.url,
					muted: true,
					playsInline: true,
					autoPlay: playing
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: current.asset.url,
					alt: ""
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No clips. Stamp a plate in dailies." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bay-transport",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "bay-play",
						onClick: () => {
							if (t >= total) setT(0);
							setPlaying((v) => !v);
						},
						"aria-label": playing ? "Pause" : "Play",
						disabled: rows.length === 0,
						children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { size: 16 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bay-meter",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { width: `${p}%` } })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "bay-time",
						children: [t.toFixed(1), "s"]
					})
				]
			}),
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "floor-empty",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Empty timeline." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/dailies",
					children: "Open dailies"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "bay-list",
				children: rows.map(({ clip, asset }, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: current.index === i ? "is-on" : void 0,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "bay-shot",
							onClick: () => seekTo(i),
							children: [asset ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: asset.url,
								alt: "",
								width: 192,
								height: 108
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "bay-miss" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
								String(i + 1).padStart(2, "0"),
								" · ",
								clip.label
							] }) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "bay-hold",
							children: [
								"Hold",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: .4,
									max: 12,
									step: .2,
									value: clip.duration,
									onChange: (e) => patchClip(clip.id, { duration: Math.min(12, Math.max(.4, Number(e.target.value) || .4)) }),
									"aria-label": `Hold for ${clip.label}`
								}),
								"s"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "bay-lift",
							onClick: () => removeClip(clip.id),
							children: "Lift"
						})
					]
				}, clip.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "bay-foot",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/rubric",
					children: "Open rubric"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "cut-playhead",
				"aria-hidden": "true",
				"data-sc-verify-state": `${current.index}:${rows.length}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { width: `${p}%` } })
			})
		]
	});
}
//#endregion
export { TimelinePage as component };
