import { cn } from "@/lib/cn";

export function ForgeMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn("text-amber", className)}
      aria-hidden="true"
    >
      <rect
        x="5"
        y="7"
        width="22"
        height="18"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M5 13.5h22"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M11 13.5V25"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}
