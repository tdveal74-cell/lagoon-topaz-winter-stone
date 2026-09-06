import { createFileRoute } from "@tanstack/react-router";
import { StudioApp } from "@/components/canvas/studio-app";

type Search = { template?: string };

export const Route = createFileRoute("/canvas")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    template: typeof s.template === "string" ? s.template : undefined,
  }),
  component: CanvasPage,
});

function CanvasPage() {
  const { template } = Route.useSearch();
  return <StudioApp templateId={template} />;
}
