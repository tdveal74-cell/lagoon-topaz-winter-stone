import { useScrollCraft } from "@/lib/use-scrollcraft";
import { cn } from "@/lib/cn";

export function RoomShell({
  id,
  className,
  progress = true,
  children,
}: {
  id: string;
  className?: string;
  progress?: boolean;
  children: React.ReactNode;
}) {
  useScrollCraft(id);
  return (
    <div id={id} className={cn("house-room", className)}>
      {progress ? <span data-sc-progress /> : null}
      <div className="sc-grain" aria-hidden="true" />
      {children}
    </div>
  );
}
