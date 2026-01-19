"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "ghost" | "outline";
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  const variantClass = 
    variant === "primary" ? "button-primary" : 
    variant === "ghost" ? "button-ghost" : 
    "button-outline";
  return <button className={cn(variantClass, className)} {...props} />;
}


