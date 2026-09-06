import { createFileRoute, Link } from "@tanstack/react-router";
import { useScrollCraft } from "@/lib/use-scrollcraft";

export const Route = createFileRoute("/")({ component: Home });

const CHECKS = [
  "Grade is subtle. No hero look.",
  "Sound has a hierarchy. Voice first.",
  "The ending is a held still.",
  "Titles stay out of the way.",
  "Protect what is already good.",
];

function Home() {
  useScrollCraft("forge-sc");

  return (
    <div id="forge-sc" className="forge-sc">
      <span data-sc-progress />
      <div className="sc-grain" aria-hidden="true" />
      <div className="forge-rule" aria-hidden="true" />

      <div className="forge-folio">
        <a href="#top">EditForge</a>
        <span>Create · Finish</span>
      </div>

      <main id="top">
        <section data-sc-act="pin" data-sc-span="2.2">
          <div data-sc-stage>
            <div className="forge-split forge-hero">
              <div className="forge-room forge-room--create">
                <div
                  className="forge-plane forge-plane--back"
                  data-sc-parallax="-1.2"
                >
                  <img
                    src="/stills/cinematic.jpg"
                    alt=""
                    width={1600}
                    height={900}
                  />
                </div>
                <div
                  className="forge-plane forge-plane--mid"
                  data-sc-parallax="-0.55"
                >
                  <img
                    src="/stills/film.jpg"
                    alt=""
                    width={1200}
                    height={800}
                  />
                </div>
                <div className="sc-scrim sc-scrim--lead" aria-hidden="true" />
                <div
                  className="forge-copy"
                  data-sc-cue="0 0.86 0"
                >
                  <p className="forge-kicker">Create</p>
                  <h1 className="sc-display forge-hero-title">Make the plate.</h1>
                  <p className="sc-lede" style={{ marginTop: "1rem" }}>
                    Brief. Still. Motion. An agent to run the jobs.
                  </p>
                </div>
              </div>

              <div className="forge-room forge-room--finish">
                <div
                  className="forge-plane forge-plane--back"
                  data-sc-parallax="-0.9"
                  style={{ opacity: 0.42, filter: "saturate(0.4)" }}
                >
                  <img
                    src="/stills/talent.jpg"
                    alt=""
                    width={1200}
                    height={800}
                  />
                </div>
                <div
                  className="forge-plane forge-plane--front"
                  data-sc-parallax="0.4"
                >
                  <img
                    src="/stills/youtube.jpg"
                    alt=""
                    width={900}
                    height={600}
                  />
                </div>
                <div
                  className="forge-copy forge-copy--trail"
                  data-sc-cue="0 0.86 0"
                >
                  <p className="forge-kicker">Finish</p>
                  <h2 className="sc-display forge-hero-title">Earn the cut.</h2>
                  <p className="sc-lede" style={{ marginTop: "1rem" }}>
                    Dailies, timeline, rubric. The master is a decision.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="forge-tension" data-sc-act="flow">
          <div className="forge-room forge-room--create">
            <div className="forge-copy sc-stack" data-sc-in data-sc-stagger="70">
              <h2 className="sc-display sc-display--md">
                Restaging is the cheap trick.
              </h2>
              <p className="sc-lede">
                Most generative tools keep looking until the frame you shot is
                gone. A new sky. A new face. A look that never lived in the room.
              </p>
              <p className="sc-body">
                EditForge is a finishing house. Canvas makes plates. The cut
                still has to hold. Protect the image rather than restage it.
              </p>
            </div>
          </div>
          <div className="forge-room forge-room--finish">
            <figure className="forge-still" data-sc-in>
              <img
                src="/stills/ugc.jpg"
                alt="A held close-up on a dim practical, no stylized grade"
                width={1600}
                height={1000}
              />
              <figcaption>
                Contact sheet, not a look pack. The plate is useful if it can
                cut next to what you already have.
              </figcaption>
            </figure>
          </div>
        </section>

        <section data-sc-act="pin" data-sc-span="3.4">
          <div data-sc-stage>
            <div className="forge-split">
              <div className="forge-room forge-room--create">
                <div className="forge-node" aria-hidden="true">
                  <span className="forge-node__tag">Still node</span>
                  <img
                    src="/stills/social.jpg"
                    alt=""
                    width={1280}
                    height={800}
                  />
                </div>
                <div
                  className="forge-drop-copy"
                  data-sc-cue="0 0.42 0"
                >
                  <p className="sc-lede">
                    Confirm a paid run. The plate leaves the graph.
                  </p>
                </div>
              </div>
              <div className="forge-room forge-room--finish">
                <div className="forge-slot" aria-hidden="true" />
                <div className="forge-track" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <div
                  className="forge-drop-copy"
                  data-sc-cue="0.55 1"
                  style={{ left: "auto", right: "var(--sc-gutter)" }}
                >
                  <p className="sc-lede" style={{ color: "#0a1628" }}>
                    It sits on the cut. That is the whole product.
                  </p>
                </div>
              </div>
            </div>
            <div className="forge-plate" aria-hidden="true">
              <img
                src="/stills/social.jpg"
                alt=""
                width={1280}
                height={800}
              />
            </div>
          </div>
        </section>

        <section className="forge-law" data-sc-act="flow">
          <div className="forge-room forge-room--create">
            <div className="forge-copy sc-stack" data-sc-in>
              <p className="forge-kicker">House law</p>
              <h2 className="sc-display sc-display--md">
                The gate is the product.
              </h2>
              <p className="sc-body">
                A master export is blocked until every check passes. Skipping
                the rubric is how a draft ships as a draft.
              </p>
            </div>
          </div>
          <div className="forge-room forge-room--finish">
            <ol
              className="forge-checks"
              data-sc-reveal="up"
              data-sc-reveal-at="0.12 0.7"
            >
              {CHECKS.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ol>
          </div>
        </section>

        <section data-sc-act="pin" data-sc-span="1.4" className="forge-close">
          <div data-sc-stage>
            <div className="forge-split">
              <div className="forge-room forge-room--create" aria-hidden="true" />
              <div className="forge-room forge-room--finish">
                <div className="forge-close__inner">
                  <h2
                    className="sc-display sc-display--md"
                    data-sc-cue="0.06"
                  >
                    Hold the last frame.
                  </h2>
                  <p className="sc-lede" data-sc-cue="0.1" style={{ marginTop: "1rem" }}>
                    Canvas is the Create department. Open it, wire a graph, and
                    send the plate to dailies. Rubric before master.
                  </p>
                  <Link
                    to="/canvas"
                    className="forge-cta"
                    data-sc-cue="0.12"
                    data-sc-rise="0"
                  >
                    Open Canvas
                  </Link>
                  <footer className="forge-foot" data-sc-cue="0.16">
                    EditForge · flagship post-production studio OS
                    <br />
                    Consent for clones · no silent auto-ship
                  </footer>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
