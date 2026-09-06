import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as cn, l as houseRoll, s as useStudio } from "./router-C2iD6btd.mjs";
import { a as jobTone } from "./agent-CdJcPucH.mjs";
import { t as RoomShell } from "./room-shell-E0xA2WdM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dailies-D7cEXMDs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DailiesPage() {
	const { project, addAsset, addClip, jobs } = useStudio();
	const [pressed, setPressed] = (0, import_react.useState)(null);
	const roll = project.assets;
	const house = (0, import_react.useMemo)(() => {
		const taken = new Set(roll.map((a) => a.url));
		return houseRoll().filter((p) => !taken.has(p.url));
	}, [roll]);
	const stamped = project.clips.map((c) => {
		const asset = project.assets.find((a) => a.id === c.assetId) ?? house.find((a) => a.id === c.assetId);
		return asset ? {
			clip: c,
			asset
		} : null;
	}).filter((row) => Boolean(row));
	function stamp(asset) {
		if (!project.assets.some((a) => a.id === asset.id || a.url === asset.url)) addAsset(asset);
		const assetId = project.assets.find((a) => a.url === asset.url)?.id ?? asset.id;
		addClip({
			id: crypto.randomUUID(),
			assetId,
			duration: asset.kind === "video" ? 6 : 2.4,
			label: asset.title
		});
		setPressed(asset.id);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RoomShell, {
		id: "forge-roll",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "floor-head",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "house-kicker",
						children: "Dailies"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Roll" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Plates from Canvas. Stamp one onto the cut when it holds." })
				]
			}),
			roll.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "floor-empty",
				"data-sc-in": true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No plates yet." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/canvas",
					children: "Open Canvas"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "roll-grid",
				children: roll.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlateCard, {
					plate: p,
					onStamp: stamp,
					pressed: pressed === p.id
				}, p.id))
			}),
			house.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "roll-house",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "house-kicker",
					children: "House plates"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "roll-grid",
					children: house.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlateCard, {
						plate: p,
						onStamp: stamp,
						pressed: pressed === p.id
					}, p.id))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "roll-jobs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sc-stack",
					"data-sc-in": true,
					"data-sc-stagger": "60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Jobs" }),
						jobs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "sc-body",
							children: "No paid runs this session."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: jobs.slice(0, 12).map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: j.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("house-kicker", jobTone(j.status)),
							children: j.status
						})] }, j.id)) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/agent",
							className: "roll-jobs__link",
							children: "Open agent"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "stamp-strip",
				"data-sc-verify-state": String(stamped.length),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/timeline",
					children: "Cut"
				}), stamped.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "stamp-empty",
					children: "Empty strip"
				}) : stamped.map(({ clip, asset }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: asset.url,
					alt: "",
					className: cn("stamp-thumb", pressed === asset.id && "is-on"),
					width: 112,
					height: 72
				}, clip.id))]
			})
		]
	});
}
function PlateCard({ plate, onStamp, pressed }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		id: `plate-${plate.id}`,
		className: cn("roll-card", pressed && "is-pressed"),
		"data-sc-in": true,
		"data-sc-tilt": "5",
		children: [
			plate.kind === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				src: plate.url,
				width: 1600,
				height: 900,
				muted: true,
				playsInline: true,
				controls: true
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: plate.url,
				alt: "",
				width: 1600,
				height: 900
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: plate.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				plate.kind,
				" · ",
				plate.aspectRatio
			] })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "roll-stamp",
				onClick: () => onStamp(plate),
				children: "To cut"
			})
		]
	}) });
}
//#endregion
export { DailiesPage as component };
