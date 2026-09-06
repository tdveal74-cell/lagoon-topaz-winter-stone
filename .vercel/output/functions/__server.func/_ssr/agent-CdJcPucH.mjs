import { a as jobsFromPlanNodes, c as TEMPLATES, i as idleMediaJobs, r as allMediaJobs, s as useStudio } from "./router-C2iD6btd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/agent-CdJcPucH.js
var TEMPLATE_HINTS = [
	{
		re: /\b(ugc|apartment|serum|user[- ]generated)\b/i,
		id: "ugc"
	},
	{
		re: /\b(talent|portrait|editorial)\b/i,
		id: "talent"
	},
	{
		re: /\b(youtube|desk|creator)\b/i,
		id: "youtube"
	},
	{
		re: /\b(product|perfume|catalog|bottle)\b/i,
		id: "product"
	},
	{
		re: /\b(social|vertical|reel|9:16)\b/i,
		id: "social"
	},
	{
		re: /\b(film|cinematic|rooftop|street)\b/i,
		id: "film"
	}
];
function graphSnapshot(nodes) {
	return nodes.map((n) => ({
		id: n.id,
		kind: n.kind,
		title: n.title,
		status: n.status,
		hasAsset: Boolean(n.assetUrl),
		prompt: n.prompt.slice(0, 160)
	}));
}
function jobReply(jobs) {
	const stills = jobs.filter((j) => j.kind === "still").length;
	const motion = jobs.filter((j) => j.kind === "motion").length;
	return `Queuing ${[stills ? `${stills} still${stills === 1 ? "" : "s"}` : "", motion ? `${motion} motion` : ""].filter(Boolean).join(" and ")}. Confirm the paid run to spend.`;
}
function interpretLocal(message, nodes) {
	const text = message.trim();
	const lower = text.toLowerCase();
	if (/\b(cancel|stop|abort|never ?mind|clear jobs)\b/i.test(text)) return {
		intent: "cancel",
		reply: "Open jobs cancelled. Nothing spent.",
		jobs: []
	};
	if (/\b(load|open|switch|use|start with)\b/i.test(text)) {
		const hit = TEMPLATE_HINTS.find((h) => h.re.test(text));
		if (hit) {
			const t = TEMPLATES.find((x) => x.id === hit.id);
			return {
				intent: "load",
				templateId: hit.id,
				reply: `Loaded ${t?.name ?? hit.id}. Tell me to run it when you want plates.`,
				jobs: []
			};
		}
	}
	if (/\b(regen|regenerate|redo|replace|again)\b/i.test(text)) {
		const jobs = allMediaJobs(nodes);
		if (!jobs.length) return {
			intent: "talk",
			reply: "No still or motion nodes on this graph.",
			jobs: []
		};
		return {
			intent: "run",
			reply: jobReply(jobs),
			jobs
		};
	}
	if (/\b(run|generate|queue|execute|go|render|do it|kick off)\b/i.test(text)) {
		const jobs = idleMediaJobs(nodes);
		if (!jobs.length) return {
			intent: "talk",
			reply: "Nothing idle to run. Describe a new campaign or pick a still node.",
			jobs: []
		};
		return {
			intent: "run",
			reply: jobReply(jobs),
			jobs
		};
	}
	if (/^(hi|hello|hey|help|what can you do|status)\b/i.test(lower) || text.length < 8) return {
		intent: "talk",
		reply: "I queue stills and motion against the graph. Describe a campaign, load a workflow, or tell me to run it. Paid runs wait for confirm.",
		jobs: []
	};
	return {
		intent: "plan",
		reply: "",
		jobs: [],
		name: "Canvas plan"
	};
}
function materializeShots(shots) {
	return shots.slice(0, 6).map((s, i) => ({
		id: crypto.randomUUID(),
		kind: s.kind,
		x: 56 + i * 300,
		y: 80 + i % 2 * 220,
		title: s.title,
		prompt: s.prompt,
		aspectRatio: s.aspectRatio || "16:9",
		status: "idle"
	}));
}
function bindJobs(jobs, nodes) {
	const used = /* @__PURE__ */ new Set();
	return jobs.map((j) => {
		if (j.nodeId && nodes.some((n) => n.id === j.nodeId)) {
			used.add(j.nodeId);
			return j;
		}
		const byTitle = nodes.find((n) => n.title.toLowerCase() === j.title.toLowerCase() && !used.has(n.id));
		const want = j.kind === "motion" ? "video" : "image";
		const byKind = nodes.find((n) => n.kind === want && !used.has(n.id));
		const id = byTitle?.id ?? byKind?.id ?? j.nodeId;
		if (id) used.add(id);
		return {
			...j,
			nodeId: id
		};
	});
}
function applyDecision(decision) {
	const store = useStudio.getState();
	if (decision.intent === "cancel") {
		store.cancelOpenJobs();
		store.addMessage({
			role: "agent",
			text: decision.reply
		});
		return;
	}
	if (decision.intent === "load" && decision.templateId) {
		store.loadTemplate(decision.templateId);
		store.addMessage({
			role: "agent",
			text: decision.reply
		});
		return;
	}
	if (decision.intent === "plan" && decision.shots?.length) {
		const nodes = materializeShots(decision.shots);
		store.applyPlan(decision.name || "Canvas plan", nodes);
		const jobs = bindJobs(decision.jobs.length ? decision.jobs : jobsFromPlanNodes(nodes), nodes).filter((j) => j.kind === "still" || j.kind === "motion");
		const ids = store.enqueueJobs(jobs);
		store.addMessage({
			role: "agent",
			text: decision.reply || `Graph laid with ${jobs.length} job${jobs.length === 1 ? "" : "s"}. Confirm the paid run.`,
			jobIds: ids
		});
		return;
	}
	if (decision.intent === "run") {
		const jobs = decision.jobs.length > 0 ? bindJobs(decision.jobs, store.project.nodes) : idleMediaJobs(store.project.nodes);
		if (!jobs.length) {
			store.addMessage({
				role: "agent",
				text: "Nothing to queue. Describe a campaign first."
			});
			return;
		}
		const ids = store.enqueueJobs(jobs);
		store.addMessage({
			role: "agent",
			text: decision.reply || jobReply(jobs),
			jobIds: ids
		});
		return;
	}
	store.addMessage({
		role: "agent",
		text: decision.reply || "Say run to queue idle nodes, or describe the campaign you want plated."
	});
}
function fallbackPlan(brief) {
	const prompt = brief.trim();
	return {
		intent: "plan",
		name: "Floor plan",
		reply: "One still queued from the brief. Confirm the paid run.",
		shots: [
			{
				title: "Brief",
				kind: "prompt",
				prompt,
				aspectRatio: "16:9"
			},
			{
				title: "Still",
				kind: "image",
				prompt: `Photoreal cinematic still. ${prompt}. Restrained grade, no text, no logos.`,
				aspectRatio: "16:9"
			},
			{
				title: "Cut",
				kind: "output",
				prompt: "Hold the last frame. Logo last if needed.",
				aspectRatio: "16:9"
			}
		],
		jobs: []
	};
}
function jobTone(status) {
	switch (status) {
		case "running": return "text-amber-deep";
		case "done": return "text-navy";
		case "error": return "text-amber-deep";
		case "cancelled": return "text-faint";
		default: return "text-muted";
	}
}
//#endregion
export { jobTone as a, interpretLocal as i, fallbackPlan as n, graphSnapshot as r, applyDecision as t };
