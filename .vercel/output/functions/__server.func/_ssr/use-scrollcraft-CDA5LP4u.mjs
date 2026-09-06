import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-scrollcraft-CDA5LP4u.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useScrollCraft(rootId) {
	(0, import_react.useEffect)(() => {
		const root = document.getElementById(rootId);
		if (!root) return;
		let cancelled = false;
		const mount = () => {
			if (cancelled || !window.ScrollCraft) return;
			window.ScrollCraft.instances.length = 0;
			window.ScrollCraft.mount(root);
		};
		if (window.ScrollCraft) mount();
		else {
			const existing = document.querySelector("script[src=\"/scrollcraft/scrollcraft.js\"]");
			if (existing) existing.addEventListener("load", mount);
			else {
				const script = document.createElement("script");
				script.src = "/scrollcraft/scrollcraft.js";
				script.async = false;
				script.onload = mount;
				document.body.appendChild(script);
			}
		}
		return () => {
			cancelled = true;
		};
	}, [rootId]);
}
//#endregion
export { useScrollCraft as t };
