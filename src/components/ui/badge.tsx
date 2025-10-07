import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "destructive";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  const map: Record<BadgeVariant, string> = {
    default: "bg-accent text-accent-foreground",
    success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    destructive:
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium",
        map[variant],
        className
      )}
      {...props}
    />
  );
}


