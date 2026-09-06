import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as cn } from "./router-C2iD6btd.mjs";
import { t as RoomShell } from "./room-shell-E0xA2WdM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rubric-jUnMugLX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATS = [
	{
		id: "hold",
		name: "Strongest moment hold",
		hint: "Feels deliberate and powerful, not rushed."
	},
	{
		id: "ending",
		name: "Ending",
		hint: "Still frame, soft fade, then logo. Never a hard cut to card."
	},
	{
		id: "color",
		name: "Color restraint",
		hint: "Nearly invisible. Depth without gloss."
	},
	{
		id: "sound",
		name: "Sound hierarchy",
		hint: "Voice on top. Tactile more memorable than music."
	},
	{
		id: "titles",
		name: "Title minimalism",
		hint: "One line and logo, or logo only."
	},
	{
		id: "feel",
		name: "Overall premium feel",
		hint: "Expensive and calm. Technique never leads."
	}
];
function RubricPage() {
	const [scores, setScores] = (0, import_react.useState)({
		hold: 8,
		ending: 7,
		color: 8,
		sound: 7,
		titles: 9,
		feel: 8
	});
	const avg = (0, import_react.useMemo)(() => {
		const vals = Object.values(scores);
		return vals.reduce((a, b) => a + b, 0) / vals.length;
	}, [scores]);
	const pass = avg >= 8.5;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RoomShell, {
		id: "forge-gate",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "gate-mast",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "house-kicker",
						children: "Rubric"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "gate-word",
						children: "Gate"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Score the cut, not the graph. Target 8.5. After three passes, stop unless a technical error remains." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "gate-list",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: CATS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "gate-row",
					"data-sc-in": true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "gate-row__top",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: c.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: scores[c.id] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: c.hint }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 1,
							max: 10,
							step: 1,
							value: scores[c.id],
							onChange: (e) => setScores((s) => ({
								...s,
								[c.id]: Number(e.target.value)
							})),
							"aria-label": c.name
						})
					]
				}, c.id)) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "gate-law",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Protect the strongest moment. Hold it 0.8 to 1.2s longer." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Voice dry and intimate. Tactile sound above music." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Still frame at least 1.0s, then fade to black, then logo." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "gate-colophon",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/canvas",
					className: "gate-link",
					children: "Open Canvas"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("gate-bar", pass && "is-open"),
				"data-sc-verify-state": pass ? "open" : "hold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: avg.toFixed(1) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: pass ? "Willing to stop here." : "Fix the lowest category only." })]
			})
		]
	});
}
//#endregion
export { RubricPage as component };
