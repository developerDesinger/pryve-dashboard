"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "ghost";
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  const variantClass = variant === "primary" ? "button-primary" : "button-ghost";
  return <button className={cn(variantClass, className)} {...props} />;
}


