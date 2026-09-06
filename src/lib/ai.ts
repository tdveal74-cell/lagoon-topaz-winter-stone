import { createServerFn } from "@tanstack/react-start";

const IMAGE_MODEL = "grok-imagine-image-2.0";
const VIDEO_MODEL = "grok-imagine-video-1.5";
const CHAT_MODEL = "grok-4.5";

const budgets = { images: 0, videos: 0, chats: 0 };
const BUDGET = { images: 40, videos: 6, chats: 80 };

function key() {
  return process.env.XAI_API_KEY;
}

async function xai(path: string, body: unknown, timeoutMs = 90000) {
  const apiKey = key();
  if (!apiKey) return { ok: false as const, error: "AI is not available in this environment." };
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  const isGet = path.startsWith("/videos/") && !path.endsWith("/generations");
  try {
    const res = await fetch(`https://api.x.ai/v1${path}`, {
      method: isGet ? "GET" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      ...(isGet ? {} : { body: JSON.stringify(body) }),
      signal: ctrl.signal,
    });
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) {
      const msg =
        (typeof json.error === "string" && json.error) ||
        (typeof (json.error as { message?: string } | undefined)?.message === "string"
          ? (json.error as { message: string }).message
          : `xAI error ${res.status}`);
      return { ok: false as const, error: msg };
    }
    return { ok: true as const, json };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";
    return { ok: false as const, error: message };
  } finally {
    clearTimeout(t);
  }
}

function imageUrlFrom(json: Record<string, unknown>): string | null {
  const data = json.data as { url?: string }[] | undefined;
  if (data?.[0]?.url) return data[0].url;
  const url = json.url;
  return typeof url === "string" ? url : null;
}

export const generateStill = createServerFn({ method: "POST" })
  .validator((input: { prompt: string; aspectRatio?: string }) => input)
  .handler(async ({ data }) => {
    if (!data.prompt?.trim()) return { ok: false as const, error: "Prompt is empty." };
    if (budgets.images >= BUDGET.images) {
      return { ok: false as const, error: "Session image budget is spent." };
    }
    budgets.images += 1;
    const result = await xai("/images/generations", {
      model: IMAGE_MODEL,
      prompt: data.prompt.trim(),
      n: 1,
      aspect_ratio: data.aspectRatio ?? "16:9",
      response_format: "url",
    });
    if (!result.ok) return result;
    const url = imageUrlFrom(result.json);
    if (!url) return { ok: false as const, error: "No image returned." };
    return { ok: true as const, url };
  });

export const generateMotion = createServerFn({ method: "POST" })
  .validator((input: { prompt: string; imageUrl: string; duration?: number }) => input)
  .handler(async ({ data }) => {
    if (!data.imageUrl) return { ok: false as const, error: "Motion needs a still first." };
    if (budgets.videos >= BUDGET.videos) {
      return { ok: false as const, error: "Session motion budget is spent." };
    }
    budgets.videos += 1;
    const start = await xai("/videos/generations", {
      model: VIDEO_MODEL,
      prompt: data.prompt.trim() || "Slow, restrained camera move. Hold the subject.",
      image: { url: data.imageUrl },
      duration: data.duration ?? 6,
    });
    if (!start.ok) return start;
    const id =
      (start.json.request_id as string | undefined) ||
      (start.json.id as string | undefined) ||
      ((start.json.video as { id?: string } | undefined)?.id);
    const direct =
      (start.json.video as { url?: string } | undefined)?.url ||
      (start.json.url as string | undefined);
    if (direct) return { ok: true as const, url: direct };
    if (!id) return { ok: false as const, error: "Motion job did not return an id." };

    for (let i = 0; i < 18; i++) {
      await new Promise((r) => setTimeout(r, 4000));
      const poll = await xai(`/videos/${id}`, undefined, 20000);
      if (!poll.ok) continue;
      const status = String(poll.json.status ?? "");
      const url =
        (poll.json.video as { url?: string } | undefined)?.url ||
        (poll.json.url as string | undefined);
      if (status === "done" && url) return { ok: true as const, url };
      if (status === "failed" || status === "expired") {
        return { ok: false as const, error: `Motion ${status}.` };
      }
    }
    return { ok: false as const, error: "Motion timed out. Try again." };
  });

export const planCanvas = createServerFn({ method: "POST" })
  .validator((input: { brief: string }) => input)
  .handler(async ({ data }) => {
    if (!data.brief?.trim()) return { ok: false as const, error: "Brief is empty." };
    if (budgets.chats >= BUDGET.chats) {
      return { ok: false as const, error: "Session brief budget is spent." };
    }
    budgets.chats += 1;
    const result = await xai("/chat/completions", {
      model: CHAT_MODEL,
      max_tokens: 700,
      messages: [
        {
          role: "system",
          content:
            "You are EditForge Canvas. Premium Restraint: protect quality, refine do not transform. Return ONLY JSON with keys name (short), shots (array of {title, kind: prompt|image|video|output, prompt, aspectRatio: 16:9|9:16|1:1|4:3}). 3 to 5 shots. Prompts are photoreal, restrained, no text overlays, no logos. No markdown.",
        },
        { role: "user", content: data.brief.trim() },
      ],
    });
    if (!result.ok) return result;
    const choices = result.json.choices as
      | { message?: { content?: string } }[]
      | undefined;
    const text = choices?.[0]?.message?.content ?? "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return { ok: false as const, error: "Could not parse a plan." };
    try {
      const parsed = JSON.parse(match[0]) as {
        name?: string;
        shots?: {
          title?: string;
          kind?: string;
          prompt?: string;
          aspectRatio?: string;
        }[];
      };
      const shots = (parsed.shots ?? []).slice(0, 6).map((s, i) => ({
        title: s.title || `Shot ${i + 1}`,
        kind: (["prompt", "image", "video", "style", "output"].includes(
          s.kind ?? "",
        )
          ? s.kind
          : i === 0
            ? "prompt"
            : "image") as "prompt" | "image" | "video" | "style" | "output",
        prompt: s.prompt || data.brief,
        aspectRatio: (s.aspectRatio as "16:9") || "16:9",
      }));
      if (!shots.length) return { ok: false as const, error: "Plan had no shots." };
      return { ok: true as const, name: parsed.name || "Canvas plan", shots };
    } catch {
      return { ok: false as const, error: "Plan JSON was invalid." };
    }
  });

type GraphSnap = {
  id: string;
  kind: string;
  title: string;
  status: string;
  hasAsset: boolean;
  prompt: string;
};

export const dispatchAgent = createServerFn({ method: "POST" })
  .validator(
    (input: {
      message: string;
      templateId: string;
      graph: GraphSnap[];
    }) => input,
  )
  .handler(async ({ data }) => {
    if (!data.message?.trim()) {
      return { ok: false as const, error: "Message is empty." };
    }
    if (budgets.chats >= BUDGET.chats) {
      return { ok: false as const, error: "Session brief budget is spent." };
    }
    budgets.chats += 1;
    const result = await xai("/chat/completions", {
      model: CHAT_MODEL,
      max_tokens: 900,
      messages: [
        {
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
- Prompts must be production-ready. No markdown.`,
        },
        {
          role: "user",
          content: JSON.stringify({
            message: data.message.trim(),
            templateId: data.templateId,
            graph: data.graph,
          }),
        },
      ],
    });
    if (!result.ok) return result;
    const choices = result.json.choices as
      | { message?: { content?: string } }[]
      | undefined;
    const text = choices?.[0]?.message?.content ?? "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return { ok: false as const, error: "Could not parse the agent." };
    try {
      const parsed = JSON.parse(match[0]) as {
        reply?: string;
        intent?: string;
        templateId?: string;
        name?: string;
        shots?: {
          title?: string;
          kind?: string;
          prompt?: string;
          aspectRatio?: string;
        }[];
        jobs?: {
          kind?: string;
          nodeId?: string;
          title?: string;
          prompt?: string;
          aspectRatio?: string;
        }[];
      };
      const intent = (
        ["run", "plan", "load", "talk", "cancel"].includes(parsed.intent ?? "")
          ? parsed.intent
          : "talk"
      ) as "run" | "plan" | "load" | "talk" | "cancel";
      const kinds = ["prompt", "image", "video", "style", "output"];
      const shots = (parsed.shots ?? []).slice(0, 6).map((s, i) => ({
        title: s.title || `Shot ${i + 1}`,
        kind: (kinds.includes(s.kind ?? "") ? s.kind : i === 0 ? "prompt" : "image") as
          | "prompt"
          | "image"
          | "video"
          | "style"
          | "output",
        prompt: s.prompt || data.message,
        aspectRatio: (s.aspectRatio as "16:9") || "16:9",
      }));
      const jobs = (parsed.jobs ?? [])
        .filter((j) => j.kind === "still" || j.kind === "motion")
        .slice(0, 4)
        .map((j) => ({
          kind: j.kind as "still" | "motion",
          nodeId: j.nodeId,
          title: j.title || (j.kind === "motion" ? "Motion" : "Still"),
          prompt: j.prompt || data.message,
          aspectRatio: (j.aspectRatio as "16:9") || "16:9",
        }));
      return {
        ok: true as const,
        reply: parsed.reply || "Ready when you are.",
        intent,
        templateId: parsed.templateId,
        name: parsed.name,
        shots,
        jobs,
      };
    } catch {
      return { ok: false as const, error: "Agent JSON was invalid." };
    }
  });
