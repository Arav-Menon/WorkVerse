import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-[linear-gradient(90deg,rgba(39,39,42,0.9),rgba(63,63,70,0.7),rgba(39,39,42,0.9))] bg-[length:200%_100%]",
        className,
      )}
      {...props}
    />
  );
}
