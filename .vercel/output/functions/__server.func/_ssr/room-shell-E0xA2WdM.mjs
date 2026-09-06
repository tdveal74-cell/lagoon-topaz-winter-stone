import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as cn } from "./router-C2iD6btd.mjs";
import { t as useScrollCraft } from "./use-scrollcraft-CDA5LP4u.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/room-shell-E0xA2WdM.js
var import_jsx_runtime = require_jsx_runtime();
function RoomShell({ id, className, progress = true, children }) {
	useScrollCraft(id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id,
		className: cn("house-room", className),
		children: [
			progress ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { "data-sc-progress": true }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sc-grain",
				"aria-hidden": "true"
			}),
			children
		]
	});
}
//#endregion
export { RoomShell as t };
