import * as React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-zinc-900 bg-zinc-950/70 px-4 py-2 text-sm text-white outline-none placeholder:text-zinc-500 transition-colors focus:border-zinc-700 focus:ring-2 focus:ring-white/5",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
