import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RoomShell } from "@/components/room-shell";
import { jobTone } from "@/lib/agent";
import { houseRoll } from "@/lib/templates";
import { useStudio } from "@/lib/store";
import type { LibraryAsset } from "@/lib/types";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/dailies")({ component: DailiesPage });

function DailiesPage() {
  const { project, addAsset, addClip, jobs } = useStudio();
  const [pressed, setPressed] = useState<string | null>(null);

  const roll = project.assets;
  const house = useMemo(() => {
    const taken = new Set(roll.map((a) => a.url));
    return houseRoll().filter((p) => !taken.has(p.url));
  }, [roll]);

  const stamped = project.clips
    .map((c) => {
      const asset =
        project.assets.find((a) => a.id === c.assetId) ??
        house.find((a) => a.id === c.assetId);
      return asset ? { clip: c, asset } : null;
    })
    .filter(
      (row): row is { clip: (typeof project.clips)[number]; asset: LibraryAsset } =>
        Boolean(row),
    );

  function stamp(asset: LibraryAsset) {
    if (!project.assets.some((a) => a.id === asset.id || a.url === asset.url)) {
      addAsset(asset);
    }
    const assetId =
      project.assets.find((a) => a.url === asset.url)?.id ?? asset.id;
    addClip({
      id: crypto.randomUUID(),
      assetId,
      duration: asset.kind === "video" ? 6 : 2.4,
      label: asset.title,
    });
    setPressed(asset.id);
  }

  return (
    <RoomShell id="forge-roll">
      <header className="floor-head">
        <p className="house-kicker">Dailies</p>
        <h1>Roll</h1>
        <p>Plates from Canvas. Stamp one onto the cut when it holds.</p>
      </header>

      {roll.length === 0 ? (
        <div className="floor-empty" data-sc-in>
          <p>No plates yet.</p>
          <Link to="/canvas">Open Canvas</Link>
        </div>
      ) : (
        <ul className="roll-grid">
          {roll.map((p) => (
            <PlateCard
              key={p.id}
              plate={p}
              onStamp={stamp}
              pressed={pressed === p.id}
            />
          ))}
        </ul>
      )}

      {house.length > 0 ? (
        <section className="roll-house">
          <p className="house-kicker">House plates</p>
          <ul className="roll-grid">
            {house.map((p) => (
              <PlateCard
                key={p.id}
                plate={p}
                onStamp={stamp}
                pressed={pressed === p.id}
              />
            ))}
          </ul>
        </section>
      ) : null}

      <section className="roll-jobs">
        <div className="sc-stack" data-sc-in data-sc-stagger="60">
          <h2>Jobs</h2>
          {jobs.length === 0 ? (
            <p className="sc-body">No paid runs this session.</p>
          ) : (
            <ul>
              {jobs.slice(0, 12).map((j) => (
                <li key={j.id}>
                  <span>{j.label}</span>
                  <span className={cn("house-kicker", jobTone(j.status))}>
                    {j.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/agent" className="roll-jobs__link">
            Open agent
          </Link>
        </div>
      </section>

      <div
        className="stamp-strip"
        data-sc-verify-state={String(stamped.length)}
      >
        <Link to="/timeline">Cut</Link>
        {stamped.length === 0 ? (
          <span className="stamp-empty">Empty strip</span>
        ) : (
          stamped.map(({ clip, asset }) => (
            <img
              key={clip.id}
              src={asset.url}
              alt=""
              className={cn(
                "stamp-thumb",
                pressed === asset.id && "is-on",
              )}
              width={112}
              height={72}
            />
          ))
        )}
      </div>
    </RoomShell>
  );
}

function PlateCard({
  plate,
  onStamp,
  pressed,
}: {
  plate: LibraryAsset;
  onStamp: (asset: LibraryAsset) => void;
  pressed: boolean;
}) {
  return (
    <li>
      <figure
        id={`plate-${plate.id}`}
        className={cn("roll-card", pressed && "is-pressed")}
        data-sc-in
        data-sc-tilt="5"
      >
        {plate.kind === "video" ? (
          <video
            src={plate.url}
            width={1600}
            height={900}
            muted
            playsInline
            controls
          />
        ) : (
          <img src={plate.url} alt="" width={1600} height={900} />
        )}
        <figcaption>
          <strong>{plate.title}</strong>
          <span>
            {plate.kind} · {plate.aspectRatio}
          </span>
        </figcaption>
        <button
          type="button"
          className="roll-stamp"
          onClick={() => onStamp(plate)}
        >
          To cut
        </button>
      </figure>
    </li>
  );
}
