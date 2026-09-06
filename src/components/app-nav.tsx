import { Link, useRouterState } from "@tanstack/react-router";
import { ForgeMark } from "@/components/forge-mark";

const links = [
  { href: "/canvas", label: "Canvas" },
  { href: "/agent", label: "Agent" },
  { href: "/dailies", label: "Dailies" },
  { href: "/timeline", label: "Timeline" },
  { href: "/rubric", label: "Rubric" },
] as const;

export function AppNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="house-nav">
      <Link to="/" className="house-nav__mark">
        <ForgeMark className="house-nav__icon" />
        EditForge
      </Link>
      <nav aria-label="Departments">
        {links.map((l) => {
          const active =
            pathname === l.href || pathname.startsWith(l.href + "/");
          return (
            <Link
              key={l.href}
              to={l.href}
              aria-current={active ? "page" : undefined}
              className={active ? "is-on" : undefined}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
