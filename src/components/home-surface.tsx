import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { modulesByDept, STUDIO_MODULES } from "@/lib/studio";
import { useScrollCraft } from "@/lib/use-scrollcraft";
import "@/styles/forge-os.css";

const VIEWER = {
  src: "/stills/film.jpg",
  label: "Rain street · reference frame",
  alt: "Wet street, sodium practicals, deep shadow",
};

const DAILIES = [
  { src: "/stills/ugc.jpg", label: "Close-up", alt: "A face held in existing light, no beauty grade" },
  { src: "/stills/social.jpg", label: "Still", alt: "A held social frame, no look pack" },
  { src: "/stills/talent.jpg", label: "Talent", alt: "Talent in a dim practical, restrained grade" },
] as const;

const BAR_LINKS = [
  { to: "/canvas", label: "Canvas" },
  { to: "/agent", label: "Agent" },
  { to: "/dailies", label: "Dailies" },
  { to: "/timeline", label: "Timeline" },
  { to: "/rubric", label: "Rubric" },
] as const;

const STILL_COUNT = 7;

function Bay({ stamped }: { stamped: boolean }) {
  return (
    <div className="os-bay">
      <div className="os-viewer">
        <img src={VIEWER.src} alt={VIEWER.alt} width={1600} height={900} />
        {stamped ? (
          <>
            <span className="os-stamp os-stamp--ingest">Ingest</span>
            <span className="os-stamp os-stamp--grade">Grade</span>
            <span className="os-stamp os-stamp--rubric">Rubric</span>
          </>
        ) : null}
        <p className="os-viewer__meta">{VIEWER.label}</p>
      </div>
      <div className="os-dailies">
        {DAILIES.map((d) => (
          <figure className="os-thumb" key={d.src}>
            <img src={d.src} alt={d.alt} width={1200} height={800} />
            <span>{d.label}</span>
          </figure>
        ))}
      </div>
      <aside className="os-inspector">
        <p className="os-kicker">{stamped ? "Take stamp" : "Bay idle"}</p>
        <h2>{stamped ? "Gate" : "Inspector"}</h2>
        {stamped ? (
          <ol className="os-gate">
            <li>Ingest</li>
            <li>Grade</li>
            <li>Rubric</li>
          </ol>
        ) : (
          <dl className="os-dl">
            <dt>Take</dt>
            <dd>01</dd>
            <dt>Src</dt>
            <dd>{VIEWER.label}</dd>
            <dt>Gate</dt>
            <dd>Open</dd>
          </dl>
        )}
        <p className="os-note">
          {stamped
            ? "A stamped take can sit in dailies. It still has to earn the master."
            : "Protect the image rather than restage it. Waiting on ingest."}
        </p>
      </aside>
    </div>
  );
}

export function HomeSurface() {
  useScrollCraft("forge-os");
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [playhead, setPlayhead] = useState("00:00:00:00");

  const byDept = modulesByDept();
  const depts = Object.entries(byDept);
  const operational = STUDIO_MODULES.filter((m) => m.status === "operational").length;
  const aiMedia = STUDIO_MODULES.filter((m) => m.status === "ai-media").length;

  const hits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return STUDIO_MODULES.filter(
      (m) => m.label.toLowerCase().includes(q) || m.dept.toLowerCase().includes(q),
    );
  }, [query]);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      const frames = Math.round(p * 24 * 8);
      const f = frames % 24;
      const s = Math.floor(frames / 24) % 60;
      setPlayhead(`00:00:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function onCommand(e: FormEvent) {
    e.preventDefault();
    const target = hits[0]?.href ?? "/canvas";
    void navigate({ to: target });
  }

  return (
    <div id="forge-os" className="os-root">
      <div className="sc-grain" aria-hidden="true" />

      <header className="os-bar">
        <Link to="/" className="os-bar__mark">
          EditForge
        </Link>
        <h1>Bay</h1>
        <nav className="os-bar__depts" aria-label="Departments">
          {BAR_LINKS.map((l) => (
            <Link key={l.to} to={l.to}>
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="os-bar__clock">
          <span className="sr-only">Page playhead </span>
          {playhead}
        </p>
      </header>

      <main id="main">
        <section data-sc-act="pin" data-sc-span="1.6">
          <div data-sc-stage>
            <Bay stamped={false} />
          </div>
        </section>

        <section className="os-job" data-sc-act="flow">
          <dl className="os-job-row sc-stack" data-sc-in data-sc-stagger="60">
            <dt>Job</dt>
            <dd>cut-01</dd>
            <dt>State</dt>
            <dd className="warn">Ungated</dd>
            <dt>Note</dt>
            <dd>A take sitting in dailies with no rubric is a master waiting to leak.</dd>
          </dl>
        </section>

        <section data-sc-act="pin" data-sc-span="3.2">
          <div data-sc-stage>
            <Bay stamped />
          </div>
        </section>

        <section className="os-rail-stage" data-sc-act="pan" data-sc-span="4.2">
          <div data-sc-stage>
            <div className="os-rail" data-sc-pan="0.06">
              <div className="os-rail__lead">
                <strong>Index</strong>
                <p>{STUDIO_MODULES.length} surfaces wired in this bay.</p>
              </div>
              {depts.map(([dept, mods]) => (
                <Link key={dept} to={mods[0]?.href ?? "/canvas"} className="os-folder">
                  <b>{dept}</b>
                  <span>
                    {mods.length} {mods.length === 1 ? "module" : "modules"}
                  </span>
                </Link>
              ))}
              <div className="os-rail__end">
                <strong>End of rail</strong>
                <p>Canvas is Create. The rest still has to finish.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="os-tele" data-sc-act="flow">
          <div className="os-tele__grid sc-stack" data-sc-in data-sc-stagger="70">
            <p>
              <b>
                <span className="sc-nums" data-sc-count={`0 ${operational}`}>
                  0
                </span>
              </b>
              <span>Operational</span>
            </p>
            <p>
              <b>
                <span className="sc-nums" data-sc-count={`0 ${aiMedia}`}>
                  0
                </span>
              </b>
              <span>AI media</span>
            </p>
            <p>
              <b>
                <span className="sc-nums" data-sc-count={`0 ${STILL_COUNT}`}>
                  0
                </span>
              </b>
              <span>Studio stills</span>
            </p>
          </div>
        </section>

        <section id="os-close" className="os-close" data-sc-act="pin" data-sc-span="1.4">
          <div data-sc-stage>
            <div className="os-command">
              <form onSubmit={onCommand}>
                <label htmlFor="os-cmd" data-sc-cue="0 1 0 0">
                  Command
                </label>
                <div className="os-cmd-row" data-sc-cue="0.08">
                  <input
                    id="os-cmd"
                    name="q"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter studio"
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <button type="submit">Enter studio</button>
                </div>
                <p className="os-hits" data-sc-cue="0.1">
                  {query.trim()
                    ? hits.length
                      ? `${hits.length} match · ${hits.map((h) => h.label).join(", ")}`
                      : "No match · Enter studio opens Canvas"
                    : "Empty command opens Canvas."}
                </p>
              </form>
              <footer className="os-foot" data-sc-cue="0.14">
                EditForge · flagship post-production studio OS
                <br />
                Rubric before master · consent for clones · no silent auto-ship
              </footer>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
