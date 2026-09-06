import { createFileRoute } from "@tanstack/react-router";
import { AgentDock } from "@/components/canvas/agent-dock";
import { RoomShell } from "@/components/room-shell";

export const Route = createFileRoute("/agent")({
  component: AgentPage,
});

function AgentPage() {
  return (
    <RoomShell id="forge-agent" className="live-floor" progress={false}>
      <AgentDock variant="page" />
    </RoomShell>
  );
}
