import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as createFileRoute, b as useRouter, d as HeadContent, f as useRouterState, g as lazyRouteComponent, h as Outlet, m as createRouter, u as Scripts, v as createRootRoute, x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { t as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-C2iD6btd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function ForgeMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		fill: "none",
		className: cn("text-amber", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "5",
				y: "7",
				width: "22",
				height: "18",
				rx: "2.5",
				stroke: "currentColor",
				strokeWidth: "1.7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M5 13.5h22",
				stroke: "currentColor",
				strokeWidth: "1.7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M11 13.5V25",
				stroke: "currentColor",
				strokeWidth: "1.7"
			})
		]
	});
}
var links = [
	{
		href: "/canvas",
		label: "Canvas"
	},
	{
		href: "/agent",
		label: "Agent"
	},
	{
		href: "/dailies",
		label: "Dailies"
	},
	{
		href: "/timeline",
		label: "Timeline"
	},
	{
		href: "/rubric",
		label: "Rubric"
	}
];
function AppNav() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "house-nav",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/",
			className: "house-nav__mark",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ForgeMark, { className: "house-nav__icon" }), "EditForge"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			"aria-label": "Departments",
			children: links.map((l) => {
				const active = pathname === l.href || pathname.startsWith(l.href + "/");
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: l.href,
					"aria-current": active ? "page" : void 0,
					className: active ? "is-on" : void 0,
					children: l.label
				}, l.href);
			})
		})]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var generateStill = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("74e4bd1692b6eb8646ef14c88cce0deeb7ed40d51037424f8eed2c607e32a3fe"));
var generateMotion = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("66de95bfb06f0583d278bbdd20ffc8a599bb95b00606f1f36e4258c815a2def5"));
createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("b41f3cbecc7f8f47bb45dd6c1228638efcb3f9ce489ae6add2397b6dabce8902"));
var dispatchAgent = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("40f5c6cc73e39f5ea5beee14e7f03cc34a7e12bd30187f49fc705f9c895e8bba"));
function n(partial) {
	return {
		aspectRatio: "16:9",
		status: "idle",
		...partial
	};
}
function e(from, to) {
	return {
		id: `${from}-${to}`,
		from,
		to
	};
}
var TEMPLATES = [
	{
		id: "film",
		name: "Film stills",
		tagline: "Three restrained scene plates that can cut together.",
		still: "/stills/film.jpg",
		category: "Film",
		nodes: [
			n({
				id: "p1",
				kind: "prompt",
				x: 60,
				y: 200,
				title: "Brief",
				prompt: "Two figures on a rooftop at blue hour. One warm practical. Anamorphic. Hold the stillness. No stylized grade."
			}),
			n({
				id: "i1",
				kind: "image",
				x: 420,
				y: 40,
				title: "Wide",
				prompt: "Photoreal wide cinematic still, two silhouettes on a concrete rooftop at dusk, city bokeh, one warm practical lamp, 35mm grain, restrained color, no text.",
				status: "done",
				assetUrl: "/stills/film.jpg",
				assetKind: "image"
			}),
			n({
				id: "i2",
				kind: "image",
				x: 420,
				y: 360,
				title: "Street",
				prompt: "Photoreal cinematic still, rain-soaked night street, figure in a long coat, teal neon and tungsten windows, wet asphalt, no text.",
				status: "done",
				assetUrl: "/stills/cinematic.jpg",
				assetKind: "image"
			}),
			n({
				id: "v1",
				kind: "video",
				x: 760,
				y: 40,
				title: "Motion",
				prompt: "Slow push in. Almost no camera shake. Hold the strongest beat."
			}),
			n({
				id: "o1",
				kind: "output",
				x: 760,
				y: 360,
				title: "Cut",
				prompt: "Assemble plates. Still-frame hold on the last shot."
			})
		],
		edges: [
			e("p1", "i1"),
			e("p1", "i2"),
			e("i1", "v1"),
			e("i1", "o1"),
			e("i2", "o1")
		]
	},
	{
		id: "ugc",
		name: "User-generated",
		tagline: "Apartment light. Product in hand. Nothing performed.",
		still: "/stills/ugc.jpg",
		category: "UGC",
		nodes: [
			n({
				id: "p1",
				kind: "prompt",
				x: 60,
				y: 160,
				title: "Brief",
				prompt: "Soft window light. Serum bottle in hand. Authentic, unstyled, no hard sell."
			}),
			n({
				id: "i1",
				kind: "image",
				x: 420,
				y: 140,
				title: "Talking",
				prompt: "Photoreal UGC still, young woman in a sunlit apartment holding a frosted glass serum bottle to camera, plants behind, natural window light, no text.",
				status: "done",
				assetUrl: "/stills/ugc.jpg",
				assetKind: "image"
			}),
			n({
				id: "v1",
				kind: "video",
				x: 760,
				y: 140,
				title: "Motion",
				prompt: "Slight handheld drift. Keep her eyes. Do not add captions."
			}),
			n({
				id: "o1",
				kind: "output",
				x: 1100,
				y: 140,
				title: "Cut",
				prompt: "End on a still of the bottle. Logo last."
			})
		],
		edges: [
			e("p1", "i1"),
			e("i1", "v1"),
			e("v1", "o1")
		]
	},
	{
		id: "talent",
		name: "On-camera talent",
		tagline: "One look. Same light. Carry her across platforms.",
		still: "/stills/talent.jpg",
		category: "Talent",
		nodes: [
			n({
				id: "s1",
				kind: "style",
				x: 60,
				y: 80,
				title: "Look",
				prompt: "North light. Charcoal silk. Silver jewelry. 85mm. Ivory and charcoal only."
			}),
			n({
				id: "p1",
				kind: "prompt",
				x: 60,
				y: 260,
				title: "Brief",
				prompt: "Editorial portrait. Quiet. No fashion-campaign gloss."
			}),
			n({
				id: "i1",
				kind: "image",
				x: 420,
				y: 160,
				title: "Portrait",
				prompt: "Photoreal fashion editorial portrait, sculpted silver jewelry, charcoal silk blouse, soft north light, 85mm, muted ivory and charcoal, no text.",
				status: "done",
				assetUrl: "/stills/talent.jpg",
				assetKind: "image"
			}),
			n({
				id: "o1",
				kind: "output",
				x: 760,
				y: 160,
				title: "Cut",
				prompt: "Hold the eyes. Title only if needed."
			})
		],
		edges: [
			e("s1", "i1"),
			e("p1", "i1"),
			e("i1", "o1")
		]
	},
	{
		id: "youtube",
		name: "YouTube desk",
		tagline: "Warm practicals. Camera in frame. Thumbnail that is a still, not a poster.",
		still: "/stills/youtube.jpg",
		category: "YouTube",
		nodes: [
			n({
				id: "p1",
				kind: "prompt",
				x: 60,
				y: 160,
				title: "Brief",
				prompt: "Creator at a dark oak desk. Two lamps. Cinema camera. No UI on screens."
			}),
			n({
				id: "i1",
				kind: "image",
				x: 420,
				y: 160,
				title: "Desk still",
				prompt: "Photoreal creator studio still, filmmaker at a dark oak desk with a cinema camera and condenser microphone, two warm practical lamps, cinematic grade, no readable text.",
				status: "done",
				assetUrl: "/stills/youtube.jpg",
				assetKind: "image"
			}),
			n({
				id: "o1",
				kind: "output",
				x: 760,
				y: 160,
				title: "Cut",
				prompt: "Thumbnail is a crop of the still. No word salad."
			})
		],
		edges: [e("p1", "i1"), e("i1", "o1")]
	},
	{
		id: "product",
		name: "Product catalog",
		tagline: "Wet stone. Side light. Texture in the highlights.",
		still: "/stills/product.jpg",
		category: "Product",
		nodes: [
			n({
				id: "p1",
				kind: "prompt",
				x: 60,
				y: 160,
				title: "Brief",
				prompt: "Faceted glass bottle on wet black stone. Dramatic side light. No sparkle bloom."
			}),
			n({
				id: "i1",
				kind: "image",
				x: 420,
				y: 160,
				title: "Hero",
				prompt: "Photoreal luxury product photograph, faceted glass perfume bottle on wet black stone, dramatic side light, water droplets, muted charcoal, no text.",
				status: "done",
				assetUrl: "/stills/product.jpg",
				assetKind: "image"
			}),
			n({
				id: "v1",
				kind: "video",
				x: 760,
				y: 160,
				title: "Motion",
				prompt: "Slow orbit. Keep highlights textured. No lens flare."
			}),
			n({
				id: "o1",
				kind: "output",
				x: 1100,
				y: 160,
				title: "Cut",
				prompt: "Still-frame hold on the bottle. Logo after fade."
			})
		],
		edges: [
			e("p1", "i1"),
			e("i1", "v1"),
			e("v1", "o1")
		]
	},
	{
		id: "social",
		name: "Social plate",
		tagline: "Golden hour walk. One frame that can crop to 9:16.",
		still: "/stills/social.jpg",
		category: "Social",
		nodes: [
			n({
				id: "p1",
				kind: "prompt",
				x: 60,
				y: 160,
				title: "Brief",
				prompt: "Street, golden hour, charcoal coat. Quiet. Not a campaign.",
				aspectRatio: "9:16"
			}),
			n({
				id: "i1",
				kind: "image",
				x: 420,
				y: 140,
				title: "Walk",
				prompt: "Photoreal social fashion still, golden hour sidewalk, woman in a tailored charcoal coat walking toward camera, sun flare, shallow depth, no text.",
				aspectRatio: "16:9",
				status: "done",
				assetUrl: "/stills/social.jpg",
				assetKind: "image"
			}),
			n({
				id: "o1",
				kind: "output",
				x: 760,
				y: 160,
				title: "Cut",
				prompt: "Crop to 9:16. Hold the walk. No captions."
			})
		],
		edges: [e("p1", "i1"), e("i1", "o1")]
	}
];
function templateById(id) {
	return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}
function assetsFromTemplate(t) {
	return t.nodes.filter((n) => n.assetUrl).map((n) => ({
		id: `asset-${n.id}`,
		url: n.assetUrl,
		kind: n.assetKind ?? "image",
		prompt: n.prompt,
		createdAt: Date.now(),
		aspectRatio: n.aspectRatio,
		title: n.title
	}));
}
function clipsFromTemplate(t) {
	return t.nodes.filter((n) => n.kind === "image" && n.assetUrl).map((n) => ({
		id: `clip-${n.id}`,
		assetId: `asset-${n.id}`,
		duration: 2.4,
		label: n.title
	}));
}
/** Walkable house collection. Ids are namespaced so they never collide across workflows. */
function houseRoll() {
	return TEMPLATES.flatMap((t) => t.nodes.filter((n) => n.assetUrl).map((n) => ({
		id: `house-${t.id}-${n.id}`,
		url: n.assetUrl,
		kind: n.assetKind ?? "image",
		prompt: n.prompt,
		createdAt: 0,
		aspectRatio: n.aspectRatio,
		title: n.title
	})));
}
function uid() {
	return crypto.randomUUID();
}
function projectFromTemplate(templateId) {
	const t = templateById(templateId);
	return {
		id: uid(),
		name: t.name,
		templateId: t.id,
		nodes: t.nodes.map((n) => ({ ...n })),
		edges: t.edges.map((e) => ({ ...e })),
		assets: assetsFromTemplate(t),
		clips: clipsFromTemplate(t),
		updatedAt: Date.now()
	};
}
var STARTER = {
	id: "starter",
	role: "agent",
	text: "Floor agent. Describe a campaign, or tell me to run the graph. Paid runs wait for your confirm.",
	at: 0
};
var CAP_MAX = {
	images: 8,
	videos: 2,
	chats: 10
};
var useStudio = create()(persist((set, get) => ({
	project: projectFromTemplate("film"),
	selectedId: "i1",
	caps: {
		images: 0,
		videos: 0,
		chats: 0
	},
	jobs: [],
	messages: [STARTER],
	batchArmed: false,
	loadTemplate: (id) => {
		const project = projectFromTemplate(id);
		set({
			project,
			selectedId: (project.nodes.find((n) => n.kind === "image") ?? project.nodes[0])?.id ?? null
		});
	},
	select: (id) => set({ selectedId: id }),
	moveNode: (id, x, y) => set((s) => ({ project: {
		...s.project,
		nodes: s.project.nodes.map((n) => n.id === id ? {
			...n,
			x,
			y
		} : n),
		updatedAt: Date.now()
	} })),
	patchNode: (id, patch) => set((s) => ({ project: {
		...s.project,
		nodes: s.project.nodes.map((n) => n.id === id ? {
			...n,
			...patch
		} : n),
		updatedAt: Date.now()
	} })),
	addNode: (kind) => {
		const { project, selectedId } = get();
		const selected = project.nodes.find((n) => n.id === selectedId);
		const id = uid();
		const node = {
			id,
			kind,
			x: (selected?.x ?? 200) + 180,
			y: (selected?.y ?? 120) + 40,
			title: kind === "prompt" ? "Brief" : kind === "image" ? "Still" : kind === "video" ? "Motion" : kind === "style" ? "Look" : "Cut",
			prompt: selected?.prompt ?? "",
			aspectRatio: selected?.aspectRatio ?? "16:9",
			status: "idle"
		};
		const edges = selected ? [...project.edges, {
			id: `${selected.id}-${id}`,
			from: selected.id,
			to: id
		}] : project.edges;
		set({
			project: {
				...project,
				nodes: [...project.nodes, node],
				edges,
				updatedAt: Date.now()
			},
			selectedId: id
		});
		return id;
	},
	removeSelected: () => {
		const { selectedId, project } = get();
		if (!selectedId) return;
		set({
			selectedId: null,
			project: {
				...project,
				nodes: project.nodes.filter((n) => n.id !== selectedId),
				edges: project.edges.filter((e) => e.from !== selectedId && e.to !== selectedId),
				updatedAt: Date.now()
			}
		});
	},
	addAsset: (asset) => set((s) => ({ project: {
		...s.project,
		assets: [asset, ...s.project.assets],
		updatedAt: Date.now()
	} })),
	addClip: (clip) => set((s) => ({ project: {
		...s.project,
		clips: [...s.project.clips, clip],
		updatedAt: Date.now()
	} })),
	removeClip: (id) => set((s) => ({ project: {
		...s.project,
		clips: s.project.clips.filter((c) => c.id !== id),
		updatedAt: Date.now()
	} })),
	patchClip: (id, patch) => set((s) => ({ project: {
		...s.project,
		clips: s.project.clips.map((c) => c.id === id ? {
			...c,
			...patch
		} : c),
		updatedAt: Date.now()
	} })),
	bumpCap: (kind) => {
		const caps = get().caps;
		if (caps[kind] >= CAP_MAX[kind]) return false;
		set({ caps: {
			...caps,
			[kind]: caps[kind] + 1
		} });
		return true;
	},
	remaining: (kind) => CAP_MAX[kind] - get().caps[kind],
	applyPlan: (name, nodes) => {
		const edges = nodes.slice(0, -1).map((node, i) => ({
			id: `${node.id}-${nodes[i + 1].id}`,
			from: node.id,
			to: nodes[i + 1].id
		}));
		set((s) => ({
			project: {
				...s.project,
				name,
				nodes,
				edges,
				updatedAt: Date.now()
			},
			selectedId: nodes.find((n) => n.kind === "image")?.id ?? nodes[0]?.id ?? null
		}));
	},
	enqueueJobs: (incoming) => {
		if (!incoming.length) return [];
		const created = incoming.map((j) => ({
			id: uid(),
			kind: j.kind,
			status: "proposed",
			label: j.title,
			prompt: j.prompt,
			nodeId: j.nodeId,
			aspectRatio: j.aspectRatio,
			createdAt: Date.now()
		}));
		set((s) => {
			const keep = s.jobs.filter((job) => job.status === "running" || job.status === "done" || job.status === "error" || job.status === "queued");
			return {
				jobs: [...created, ...keep].slice(0, 60),
				batchArmed: s.batchArmed
			};
		});
		return created.map((j) => j.id);
	},
	patchJob: (id, patch) => set((s) => ({ jobs: s.jobs.map((j) => j.id === id ? {
		...j,
		...patch
	} : j) })),
	armBatch: () => {
		const { jobs } = get();
		if (!jobs.filter((j) => j.status === "proposed").length) return false;
		set({
			batchArmed: true,
			jobs: jobs.map((j) => j.status === "proposed" ? {
				...j,
				status: "queued"
			} : j)
		});
		return true;
	},
	cancelOpenJobs: () => set((s) => ({
		batchArmed: false,
		jobs: s.jobs.map((j) => j.status === "proposed" || j.status === "queued" ? {
			...j,
			status: "cancelled",
			finishedAt: Date.now()
		} : j)
	})),
	addMessage: (msg) => set((s) => ({ messages: [...s.messages, {
		...msg,
		id: uid(),
		at: Date.now()
	}].slice(-40) }))
}), {
	name: "editforge-canvas-v3",
	partialize: (s) => ({
		project: s.project,
		selectedId: s.selectedId,
		caps: s.caps,
		jobs: s.jobs,
		messages: s.messages
	}),
	onRehydrateStorage: () => (state) => {
		if (!state) return;
		state.batchArmed = false;
		state.jobs = state.jobs.map((j) => j.status === "queued" || j.status === "running" ? {
			...j,
			status: "proposed",
			error: void 0
		} : j);
		if (!state.messages?.length) state.messages = [STARTER];
	}
}));
function idleMediaJobs(nodes) {
	const stills = nodes.filter((n) => n.kind === "image" && n.status !== "running" && !n.assetUrl);
	const motions = nodes.filter((n) => n.kind === "video" && n.status !== "running" && n.status !== "done");
	return [...stills.length ? stills : nodes.filter((n) => n.kind === "image" && n.status !== "running" && !n.assetUrl), ...motions].map((n) => ({
		kind: n.kind === "video" ? "motion" : "still",
		nodeId: n.id,
		title: n.title,
		prompt: n.prompt,
		aspectRatio: n.aspectRatio
	}));
}
function allMediaJobs(nodes) {
	return nodes.filter((n) => n.kind === "image" || n.kind === "video").map((n) => ({
		kind: n.kind === "video" ? "motion" : "still",
		nodeId: n.id,
		title: n.title,
		prompt: n.prompt,
		aspectRatio: n.aspectRatio
	}));
}
function jobsFromPlanNodes(nodes) {
	return nodes.filter((n) => n.kind === "image" || n.kind === "video").map((n) => ({
		kind: n.kind === "video" ? "motion" : "still",
		nodeId: n.id,
		title: n.title,
		prompt: n.prompt,
		aspectRatio: n.aspectRatio
	}));
}
function resolveStillUrl(job, project) {
	const node = job.nodeId ? project.nodes.find((n) => n.id === job.nodeId) : void 0;
	if (node?.assetUrl && node.assetKind === "image") return node.assetUrl;
	if (!node) return project.nodes.find((n) => n.assetUrl && n.assetKind !== "video")?.assetUrl;
	return project.edges.filter((e) => e.to === node.id).map((e) => project.nodes.find((n) => n.id === e.from)).filter(Boolean).find((n) => n.assetUrl)?.assetUrl ?? project.nodes.find((n) => n.assetUrl && n.kind === "image")?.assetUrl;
}
async function runJob(job) {
	const store = useStudio.getState();
	store.patchJob(job.id, {
		status: "running",
		startedAt: Date.now()
	});
	let nodeId = job.nodeId;
	if (!nodeId) {
		nodeId = store.addNode(job.kind === "motion" ? "video" : "image");
		store.patchJob(job.id, { nodeId });
		store.patchNode(nodeId, {
			title: job.label,
			prompt: job.prompt,
			aspectRatio: job.aspectRatio
		});
	} else store.patchNode(nodeId, {
		status: "running",
		error: void 0
	});
	const capKind = job.kind === "motion" ? "videos" : "images";
	if (!useStudio.getState().bumpCap(capKind)) {
		useStudio.getState().patchJob(job.id, {
			status: "error",
			error: "Session cap reached.",
			finishedAt: Date.now()
		});
		useStudio.getState().patchNode(nodeId, {
			status: "error",
			error: "Session cap reached."
		});
		return;
	}
	try {
		if (job.kind === "motion") {
			const src = resolveStillUrl(job, useStudio.getState().project);
			if (!src) {
				useStudio.getState().patchJob(job.id, {
					status: "error",
					error: "Connect a still first.",
					finishedAt: Date.now()
				});
				useStudio.getState().patchNode(nodeId, {
					status: "error",
					error: "Connect a still first."
				});
				return;
			}
			const res = await generateMotion({ data: {
				prompt: job.prompt,
				imageUrl: src,
				duration: 6
			} });
			if (!res.ok) {
				useStudio.getState().patchJob(job.id, {
					status: "error",
					error: res.error,
					finishedAt: Date.now()
				});
				useStudio.getState().patchNode(nodeId, {
					status: "error",
					error: res.error
				});
				return;
			}
			finishJob(job, nodeId, res.url, "video");
		} else {
			const res = await generateStill({ data: {
				prompt: job.prompt,
				aspectRatio: job.aspectRatio
			} });
			if (!res.ok) {
				useStudio.getState().patchJob(job.id, {
					status: "error",
					error: res.error,
					finishedAt: Date.now()
				});
				useStudio.getState().patchNode(nodeId, {
					status: "error",
					error: res.error
				});
				return;
			}
			finishJob(job, nodeId, res.url, "image");
		}
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed";
		useStudio.getState().patchJob(job.id, {
			status: "error",
			error: message,
			finishedAt: Date.now()
		});
		useStudio.getState().patchNode(nodeId, {
			status: "error",
			error: message
		});
	}
}
function finishJob(job, nodeId, url, kind) {
	const store = useStudio.getState();
	store.patchNode(nodeId, {
		status: "done",
		assetUrl: url,
		assetKind: kind
	});
	const assetId = crypto.randomUUID();
	store.addAsset({
		id: assetId,
		url,
		kind,
		prompt: job.prompt,
		createdAt: Date.now(),
		aspectRatio: job.aspectRatio,
		title: job.label
	});
	store.addClip({
		id: crypto.randomUUID(),
		assetId,
		duration: kind === "video" ? 6 : 2.4,
		label: job.label
	});
	store.patchJob(job.id, {
		status: "done",
		resultUrl: url,
		finishedAt: Date.now()
	});
	store.select(nodeId);
}
function useJobRunner() {
	const jobs = useStudio((s) => s.jobs);
	const batchArmed = useStudio((s) => s.batchArmed);
	const inflight = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (!batchArmed || inflight.current) return;
		inflight.current = true;
		(async () => {
			try {
				while (useStudio.getState().batchArmed) {
					const next = useStudio.getState().jobs.find((j) => j.status === "queued");
					if (!next) break;
					await runJob(next);
				}
			} finally {
				inflight.current = false;
				if (!useStudio.getState().jobs.some((j) => j.status === "queued" || j.status === "running")) useStudio.setState({ batchArmed: false });
			}
		})();
	}, [jobs, batchArmed]);
}
function proposedCounts(jobs) {
	const open = jobs.filter((j) => j.status === "proposed" || j.status === "queued" || j.status === "running");
	return {
		stills: open.filter((j) => j.kind === "still").length,
		motion: open.filter((j) => j.kind === "motion").length,
		proposed: jobs.filter((j) => j.status === "proposed").length,
		running: jobs.filter((j) => j.status === "running").length,
		queued: jobs.filter((j) => j.status === "queued").length
	};
}
function JobRunner() {
	useJobRunner();
	return null;
}
var styles_default = "/assets/styles-CaT97PeJ.css";
var APP_NAME = "EditForge";
var Route$6 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "EditForge. Make the plate. An agent runs the jobs. Rubric before master."
			},
			{
				name: "theme-color",
				content: "#0A1628"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap"
			}
		]
	}),
	component: RootDocument
});
function roomClass(pathname) {
	if (pathname === "/") return "forge-landing";
	if (pathname.startsWith("/timeline")) return "forge-house forge-cut";
	if (pathname.startsWith("/canvas") || pathname.startsWith("/agent")) return "forge-house forge-live";
	return "forge-house";
}
function RootDocument() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const isLanding = pathname === "/";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		className: cn("antialiased", roomClass(pathname)),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "min-h-screen bg-bg font-sans text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobRunner, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-h-screen flex-col",
						children: [isLanding ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppNav, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
						theme: "light",
						position: "bottom-right",
						toastOptions: { className: "font-sans text-sm bg-surface text-navy border-border shadow-[var(--shadow-card)]" }
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$5 = () => import("./routes-4boq8Lrf.mjs");
var Route$5 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./agent-C0LONR6J.mjs");
var Route$4 = createFileRoute("/agent")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./canvas-Ck5XwY6x.mjs");
var Route$3 = createFileRoute("/canvas")({
	validateSearch: (s) => ({ template: typeof s.template === "string" ? s.template : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./dailies-D7cEXMDs.mjs");
var Route$2 = createFileRoute("/dailies")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./rubric-jUnMugLX.mjs");
var Route$1 = createFileRoute("/rubric")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./timeline-2suAre_j.mjs");
var Route = createFileRoute("/timeline")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$5.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$6
	}),
	AgentRoute: Route$4.update({
		id: "/agent",
		path: "/agent",
		getParentRoute: () => Route$6
	}),
	CanvasRoute: Route$3.update({
		id: "/canvas",
		path: "/canvas",
		getParentRoute: () => Route$6
	}),
	DailiesRoute: Route$2.update({
		id: "/dailies",
		path: "/dailies",
		getParentRoute: () => Route$6
	}),
	RubricRoute: Route$1.update({
		id: "/rubric",
		path: "/rubric",
		getParentRoute: () => Route$6
	}),
	TimelineRoute: Route.update({
		id: "/timeline",
		path: "/timeline",
		getParentRoute: () => Route$6
	})
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { jobsFromPlanNodes as a, TEMPLATES as c, cn as d, idleMediaJobs as i, houseRoll as l, Route$3 as n, proposedCounts as o, allMediaJobs as r, useStudio as s, router_exports as t, dispatchAgent as u };
