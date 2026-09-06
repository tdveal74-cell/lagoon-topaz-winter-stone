import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Pause, Play } from "lucide-react";
import { RoomShell } from "@/components/room-shell";
import { useStudio } from "@/lib/store";

export const Route = createFileRoute("/timeline")({ component: TimelinePage });

function TimelinePage() {
  const { project, removeClip, patchClip } = useStudio();
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);

  const rows = useMemo(
    () =>
      project.clips.map((c) => ({
        clip: c,
        asset: project.assets.find((a) => a.id === c.assetId),
      })),
    [project],
  );

  const total = useMemo(
    () => project.clips.reduce((s, c) => s + c.duration, 0) || 1,
    [project.clips],
  );

  const current = useMemo(() => {
    let acc = 0;
    for (const row of rows) {
      if (t < acc + row.clip.duration) {
        return { ...row, local: t - acc, index: rows.indexOf(row) };
      }
      acc += row.clip.duration;
    }
    const last = rows.at(-1);
    return last
      ? { ...last, local: 0, index: rows.length - 1 }
      : { clip: undefined, asset: undefined, local: 0, index: 0 };
  }, [rows, t]);

  useEffect(() => setReady(true), []);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setT((v) => {
        const n = v + dt;
        if (n >= total) {
          setPlaying(false);
          return total;
        }
        return n;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, total]);

  function seekTo(i: number) {
    let acc = 0;
    for (let n = 0; n < i; n++) acc += rows[n]?.clip.duration ?? 0;
    setT(acc);
    setPlaying(false);
  }

  if (!ready) return <div className="min-h-[50vh]" />;

  const p = Math.min(100, (t / total) * 100);

  return (
    <RoomShell id="forge-cut">
      <header className="floor-head floor-head--cut">
        <p className="house-kicker">Timeline</p>
        <h1>Cut</h1>
        <p>
          Sequence from dailies. Play reads stills as holds. Last frame is the
          still the rubric wants.
        </p>
      </header>

      <div className="bay-viewer">
        {current.asset ? (
          current.asset.kind === "video" ? (
            <video
              src={current.asset.url}
              muted
              playsInline
              autoPlay={playing}
            />
          ) : (
            <img src={current.asset.url} alt="" />
          )
        ) : (
          <p>No clips. Stamp a plate in dailies.</p>
        )}
      </div>

      <div className="bay-transport">
        <button
          type="button"
          className="bay-play"
          onClick={() => {
            if (t >= total) setT(0);
            setPlaying((v) => !v);
          }}
          aria-label={playing ? "Pause" : "Play"}
          disabled={rows.length === 0}
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <div className="bay-meter" aria-hidden="true">
          <i style={{ width: `${p}%` }} />
        </div>
        <span className="bay-time">
          {t.toFixed(1)}s
        </span>
      </div>

      {rows.length === 0 ? (
        <div className="floor-empty">
          <p>Empty timeline.</p>
          <Link to="/dailies">Open dailies</Link>
        </div>
      ) : (
        <ol className="bay-list">
          {rows.map(({ clip, asset }, i) => (
            <li
              key={clip.id}
              className={current.index === i ? "is-on" : undefined}
            >
              <button
                type="button"
                className="bay-shot"
                onClick={() => seekTo(i)}
              >
                {asset ? (
                  <img src={asset.url} alt="" width={192} height={108} />
                ) : (
                  <span className="bay-miss" />
                )}
                <span>
                  <strong>
                    {String(i + 1).padStart(2, "0")} · {clip.label}
                  </strong>
                </span>
              </button>
              <label className="bay-hold">
                Hold
                <input
                  type="number"
                  min={0.4}
                  max={12}
                  step={0.2}
                  value={clip.duration}
                  onChange={(e) =>
                    patchClip(clip.id, {
                      duration: Math.min(
                        12,
                        Math.max(0.4, Number(e.target.value) || 0.4),
                      ),
                    })
                  }
                  aria-label={`Hold for ${clip.label}`}
                />
                s
              </label>
              <button
                type="button"
                className="bay-lift"
                onClick={() => removeClip(clip.id)}
              >
                Lift
              </button>
            </li>
          ))}
        </ol>
      )}

      <footer className="bay-foot">
        <Link to="/rubric">Open rubric</Link>
      </footer>

      <div
        className="cut-playhead"
        aria-hidden="true"
        data-sc-verify-state={`${current.index}:${rows.length}`}
      >
        <i style={{ width: `${p}%` }} />
      </div>
    </RoomShell>
  );
}
