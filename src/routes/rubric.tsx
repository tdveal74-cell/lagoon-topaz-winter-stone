import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RoomShell } from "@/components/room-shell";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/rubric")({ component: RubricPage });

const CATS = [
  {
    id: "hold",
    name: "Strongest moment hold",
    hint: "Feels deliberate and powerful, not rushed.",
  },
  {
    id: "ending",
    name: "Ending",
    hint: "Still frame, soft fade, then logo. Never a hard cut to card.",
  },
  {
    id: "color",
    name: "Color restraint",
    hint: "Nearly invisible. Depth without gloss.",
  },
  {
    id: "sound",
    name: "Sound hierarchy",
    hint: "Voice on top. Tactile more memorable than music.",
  },
  {
    id: "titles",
    name: "Title minimalism",
    hint: "One line and logo, or logo only.",
  },
  {
    id: "feel",
    name: "Overall premium feel",
    hint: "Expensive and calm. Technique never leads.",
  },
];

function RubricPage() {
  const [scores, setScores] = useState<Record<string, number>>({
    hold: 8,
    ending: 7,
    color: 8,
    sound: 7,
    titles: 9,
    feel: 8,
  });

  const avg = useMemo(() => {
    const vals = Object.values(scores);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }, [scores]);

  const pass = avg >= 8.5;

  return (
    <RoomShell id="forge-gate">
      <header className="gate-mast">
        <p className="house-kicker">Rubric</p>
        <h1 className="gate-word">Gate</h1>
        <p>Score the cut, not the graph. Target 8.5. After three passes, stop unless a technical error remains.</p>
      </header>

      <section className="gate-list">
        <ul>
          {CATS.map((c) => (
            <li key={c.id} className="gate-row" data-sc-in>
              <div className="gate-row__top">
                <h2>{c.name}</h2>
                <span>{scores[c.id]}</span>
              </div>
              <p>{c.hint}</p>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={scores[c.id]}
                onChange={(e) =>
                  setScores((s) => ({ ...s, [c.id]: Number(e.target.value) }))
                }
                aria-label={c.name}
              />
            </li>
          ))}
        </ul>
      </section>

      <ol className="gate-law">
        <li>Protect the strongest moment. Hold it 0.8 to 1.2s longer.</li>
        <li>Voice dry and intimate. Tactile sound above music.</li>
        <li>Still frame at least 1.0s, then fade to black, then logo.</li>
      </ol>

      <p className="gate-colophon">
        <Link to="/canvas" className="gate-link">
          Open Canvas
        </Link>
      </p>

      <div
        className={cn("gate-bar", pass && "is-open")}
        data-sc-verify-state={pass ? "open" : "hold"}
      >
        <strong>{avg.toFixed(1)}</strong>
        <span>
          {pass ? "Willing to stop here." : "Fix the lowest category only."}
        </span>
      </div>
    </RoomShell>
  );
}
