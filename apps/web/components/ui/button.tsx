"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = {
  default:
    "bg-white text-black hover:bg-zinc-200 shadow-[0_12px_40px_rgba(255,255,255,0.08)]",
  secondary:
    "border border-zinc-800 bg-zinc-950/80 text-zinc-100 hover:border-zinc-700 hover:bg-zinc-900",
  ghost:
    "text-zinc-400 hover:bg-zinc-900/70 hover:text-white",
};

type ButtonVariant = keyof typeof buttonVariants;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-white/20 disabled:pointer-events-none disabled:opacity-50",
          buttonVariants[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
