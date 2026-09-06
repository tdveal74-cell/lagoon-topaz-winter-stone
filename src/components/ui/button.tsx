import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,background-color,color,box-shadow] duration-[var(--motion-fast)] ease-[var(--ease-flagship)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-navy text-on-navy hover:bg-navy-700",
        outline:
          "bg-transparent text-navy shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
        ghost: "bg-transparent text-muted hover:text-navy hover:bg-paper",
        quiet: "bg-paper text-navy hover:bg-sunken",
        danger: "bg-navy text-on-navy hover:opacity-90",
      },
      size: {
        default: "h-11 px-5 text-sm rounded-[var(--radius-sm)]",
        sm: "h-9 px-3.5 text-sm rounded-[var(--radius-sm)]",
        lg: "h-12 px-6 text-[0.9375rem] rounded-[var(--radius-md)]",
        icon: "size-11 rounded-[var(--radius-sm)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
