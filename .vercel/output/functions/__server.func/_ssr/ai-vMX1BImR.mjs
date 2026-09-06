import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-vMX1BImR.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var IMAGE_MODEL = "grok-imagine-image-2.0";
var VIDEO_MODEL = "grok-imagine-video-1.5";
var CHAT_MODEL = "grok-4.5";
var budgets = {
	images: 0,
	videos: 0,
	chats: 0
};
var BUDGET = {
	images: 40,
	videos: 6,
	chats: 80
};
function key() {
	return process.env.XAI_API_KEY;
}
async function xai(path, body, timeoutMs = 9e4) {
	const apiKey = key();
	if (!apiKey) return {
		ok: false,
		error: "AI is not available in this environment."
	};
	const ctrl = new AbortController();
	const t = setTimeout(() => ctrl.abort(), timeoutMs);
	const isGet = path.startsWith("/videos/") && !path.endsWith("/generations");
	try {
		const res = await fetch(`https://api.x.ai/v1${path}`, {
			method: isGet ? "GET" : "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			...isGet ? {} : { body: JSON.stringify(body) },
			signal: ctrl.signal
		});
		const json = await res.json().catch(() => ({}));
		if (!res.ok) return {
			ok: false,
			error: typeof json.error === "string" && json.error || (typeof json.error?.message === "string" ? json.error.message : `xAI error ${res.status}`)
		};
		return {
			ok: true,
			json
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Network error"
		};
	} finally {
		clearTimeout(t);
	}
}
function imageUrlFrom(json) {
	const data = json.data;
	if (data?.[0]?.url) return data[0].url;
	const url = json.url;
	return typeof url === "string" ? url : null;
}
var generateStill_createServerFn_handler = createServerRpc({
	id: "74e4bd1692b6eb8646ef14c88cce0deeb7ed40d51037424f8eed2c607e32a3fe",
	name: "generateStill",
	filename: "src/lib/ai.ts"
}, (opts) => generateStill.__executeServer(opts));
var generateStill = createServerFn({ method: "POST" }).validator((input) => input).handler(generateStill_createServerFn_handler, async ({ data }) => {
	if (!data.prompt?.trim()) return {
		ok: false,
		error: "Prompt is empty."
	};
	if (budgets.images >= BUDGET.images) return {
		ok: false,
		error: "Session image budget is spent."
	};
	budgets.images += 1;
	const result = await xai("/images/generations", {
		model: IMAGE_MODEL,
		prompt: data.prompt.trim(),
		n: 1,
		aspect_ratio: data.aspectRatio ?? "16:9",
		response_format: "url"
	});
	if (!result.ok) return result;
	const url = imageUrlFrom(result.json);
	if (!url) return {
		ok: false,
		error: "No image returned."
	};
	return {
		ok: true,
		url
	};
});
var generateMotion_createServerFn_handler = createServerRpc({
	id: "66de95bfb06f0583d278bbdd20ffc8a599bb95b00606f1f36e4258c815a2def5",
	name: "generateMotion",
	filename: "src/lib/ai.ts"
}, (opts) => generateMotion.__executeServer(opts));
var generateMotion = createServerFn({ method: "POST" }).validator((input) => input).handler(generateMotion_createServerFn_handler, async ({ data }) => {
	if (!data.imageUrl) return {
		ok: false,
		error: "Motion needs a still first."
	};
	if (budgets.videos >= BUDGET.videos) return {
		ok: false,
		error: "Session motion budget is spent."
	};
	budgets.videos += 1;
	const start = await xai("/videos/generations", {
		model: VIDEO_MODEL,
		prompt: data.prompt.trim() || "Slow, restrained camera move. Hold the subject.",
		image: { url: data.imageUrl },
		duration: data.duration ?? 6
	});
	if (!start.ok) return start;
	const id = start.json.request_id || start.json.id || start.json.video?.id;
	const direct = start.json.video?.url || start.json.url;
	if (direct) return {
		ok: true,
		url: direct
	};
	if (!id) return {
		ok: false,
		error: "Motion job did not return an id."
	};
	for (let i = 0; i < 18; i++) {
		await new Promise((r) => setTimeout(r, 4e3));
		const poll = await xai(`/videos/${id}`, void 0, 2e4);
		if (!poll.ok) continue;
		const status = String(poll.json.status ?? "");
		const url = poll.json.video?.url || poll.json.url;
		if (status === "done" && url) return {
			ok: true,
			url
		};
		if (status === "failed" || status === "expired") return {
			ok: false,
			error: `Motion ${status}.`
		};
	}
	return {
		ok: false,
		error: "Motion timed out. Try again."
	};
});
var planCanvas_createServerFn_handler = createServerRpc({
	id: "b41f3cbecc7f8f47bb45dd6c1228638efcb3f9ce489ae6add2397b6dabce8902",
	name: "planCanvas",
	filename: "src/lib/ai.ts"
}, (opts) => planCanvas.__executeServer(opts));
var planCanvas = createServerFn({ method: "POST" }).validator((input) => input).handler(planCanvas_createServerFn_handler, async ({ data }) => {
	if (!data.brief?.trim()) return {
		ok: false,
		error: "Brief is empty."
	};
	if (budgets.chats >= BUDGET.chats) return {
		ok: false,
		error: "Session brief budget is spent."
	};
	budgets.chats += 1;
	const result = await xai("/chat/completions", {
		model: CHAT_MODEL,
		max_tokens: 700,
		messages: [{
			role: "system",
			content: "You are EditForge Canvas. Premium Restraint: protect quality, refine do not transform. Return ONLY JSON with keys name (short), shots (array of {title, kind: prompt|image|video|output, prompt, aspectRatio: 16:9|9:16|1:1|4:3}). 3 to 5 shots. Prompts are photoreal, restrained, no text overlays, no logos. No markdown."
		}, {
			role: "user",
			content: data.brief.trim()
		}]
	});
	if (!result.ok) return result;
	const match = (result.json.choices?.[0]?.message?.content ?? "").match(/\{[\s\S]*\}/);
	if (!match) return {
		ok: false,
		error: "Could not parse a plan."
	};
	try {
		const parsed = JSON.parse(match[0]);
		const shots = (parsed.shots ?? []).slice(0, 6).map((s, i) => ({
			title: s.title || `Shot ${i + 1}`,
			kind: [
				"prompt",
				"image",
				"video",
				"style",
				"output"
			].includes(s.kind ?? "") ? s.kind : i === 0 ? "prompt" : "image",
			prompt: s.prompt || data.brief,
			aspectRatio: s.aspectRatio || "16:9"
		}));
		if (!shots.length) return {
			ok: false,
			error: "Plan had no shots."
		};
		return {
			ok: true,
			name: parsed.name || "Canvas plan",
			shots
		};
	} catch {
		return {
			ok: false,
			error: "Plan JSON was invalid."
		};
	}
});
var dispatchAgent_createServerFn_handler = createServerRpc({
	id: "40f5c6cc73e39f5ea5beee14e7f03cc34a7e12bd30187f49fc705f9c895e8bba",
	name: "dispatchAgent",
	filename: "src/lib/ai.ts"
}, (opts) => dispatchAgent.__executeServer(opts));
var dispatchAgent = createServerFn({ method: "POST" }).validator((input) => input).handler(dispatchAgent_createServerFn_handler, async ({ data }) => {
	if (!data.message?.trim()) return {
		ok: false,
		error: "Message is empty."
	};
	if (budgets.chats >= BUDGET.chats) return {
		ok: false,
		error: "Session brief budget is spent."
	};
	budgets.chats += 1;
	const result = await xai("/chat/completions", {
		model: CHAT_MODEL,
		max_tokens: 900,
		messages: [{
			role: "system",
			content: `You are the EditForge floor agent. You queue production jobs. You never spend. The human confirms paid runs.

Premium Restraint: photoreal, restrained grade, no text overlays, no logos, refine do not transform.

Return ONLY JSON:
{
  "reply": "short operator sentence",
  "intent": "run" | "plan" | "load" | "talk" | "cancel",
  "templateId": "film|ugc|talent|youtube|product|social",
  "name": "short graph name",
  "shots": [{ "title", "kind": "prompt|image|video|style|output", "prompt", "aspectRatio": "16:9|9:16|1:1|4:3" }],
  "jobs": [{ "kind": "still|motion", "nodeId": "existing id if run", "title", "prompt", "aspectRatio": "16:9" }]
}

Rules:
- intent run: queue jobs against existing graph node ids. Stills before motion. Skip nodes that already have assets unless asked to regenerate. Max 4 jobs.
- intent plan: 3-5 shots and jobs only for image/video shots. Do not include prompt/style/output as jobs.
- intent load: only when they ask to open a named workflow. templateId required.
- intent cancel: stop open jobs.
- intent talk: no jobs.
- Prompts must be production-ready. No markdown.`
		}, {
			role: "user",
			content: JSON.stringify({
				message: data.message.trim(),
				templateId: data.templateId,
				graph: data.graph
			})
		}]
	});
	if (!result.ok) return result;
	const match = (result.json.choices?.[0]?.message?.content ?? "").match(/\{[\s\S]*\}/);
	if (!match) return {
		ok: false,
		error: "Could not parse the agent."
	};
	try {
		const parsed = JSON.parse(match[0]);
		const intent = [
			"run",
			"plan",
			"load",
			"talk",
			"cancel"
		].includes(parsed.intent ?? "") ? parsed.intent : "talk";
		const kinds = [
			"prompt",
			"image",
			"video",
			"style",
			"output"
		];
		const shots = (parsed.shots ?? []).slice(0, 6).map((s, i) => ({
			title: s.title || `Shot ${i + 1}`,
			kind: kinds.includes(s.kind ?? "") ? s.kind : i === 0 ? "prompt" : "image",
			prompt: s.prompt || data.message,
			aspectRatio: s.aspectRatio || "16:9"
		}));
		const jobs = (parsed.jobs ?? []).filter((j) => j.kind === "still" || j.kind === "motion").slice(0, 4).map((j) => ({
			kind: j.kind,
			nodeId: j.nodeId,
			title: j.title || (j.kind === "motion" ? "Motion" : "Still"),
			prompt: j.prompt || data.message,
			aspectRatio: j.aspectRatio || "16:9"
		}));
		return {
			ok: true,
			reply: parsed.reply || "Ready when you are.",
			intent,
			templateId: parsed.templateId,
			name: parsed.name,
			shots,
			jobs
		};
	} catch {
		return {
			ok: false,
			error: "Agent JSON was invalid."
		};
	}
});
//#endregion
export { dispatchAgent_createServerFn_handler, generateMotion_createServerFn_handler, generateStill_createServerFn_handler, planCanvas_createServerFn_handler };
