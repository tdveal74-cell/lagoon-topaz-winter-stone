import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AgentDock } from "./agent-dock-C3uoRCG5.mjs";
import { t as RoomShell } from "./room-shell-E0xA2WdM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agent-C0LONR6J.js
var import_jsx_runtime = require_jsx_runtime();
function AgentPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoomShell, {
		id: "forge-agent",
		className: "live-floor",
		progress: false,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentDock, { variant: "page" })
	});
}
//#endregion
export { AgentPage as component };
