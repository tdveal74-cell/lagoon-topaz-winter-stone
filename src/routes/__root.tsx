import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AppNav } from "@/components/app-nav";
import { JobRunner } from "@/components/job-runner";
import { Toaster } from "sonner";
import { cn } from "@/lib/cn";
import appCss from "../styles.css?url";
import "@/styles/forge-landing.css";
import "@/styles/forge-house.css";

const APP_NAME = "EditForge";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "EditForge. Make the plate. An agent runs the jobs. Rubric before master.",
      },
      { name: "theme-color", content: "#0A1628" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap",
      },
    ],
  }),
  component: RootDocument,
});

function roomClass(pathname: string) {
  if (pathname === "/") return "forge-landing";
  if (pathname.startsWith("/timeline")) return "forge-house forge-cut";
  if (pathname.startsWith("/canvas") || pathname.startsWith("/agent")) {
    return "forge-house forge-live";
  }
  return "forge-house";
}

function RootDocument() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLanding = pathname === "/";

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", roomClass(pathname))}
    >
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-bg font-sans text-fg">
        <PreviewHostBridge />
        <AuthProvider>
          <JobRunner />
          <div className="flex min-h-screen flex-col">
            {isLanding ? null : <AppNav />}
            <div className="flex-1">
              <Outlet />
            </div>
          </div>
          <Toaster
            theme="light"
            position="bottom-right"
            toastOptions={{
              className:
                "font-sans text-sm bg-surface text-navy border-border shadow-[var(--shadow-card)]",
            }}
          />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
