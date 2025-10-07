"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export type StatCardProps = {
  title: string;
  value: string | number;
  changeText: string;
  changeClassName?: string;
  icon?: React.ReactNode;
  iconContainerClassName?: string;
  className?: string;
};

export default function StatCard({
  title,
  value,
  changeText,
  changeClassName,
  icon,
  iconContainerClassName,
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "rounded-2xl border border-border bg-white dark:bg-white p-5 flex items-start justify-between",
        className
      )}
    >
      <div className="space-y-2">
        <div className="text-[14px] text-foreground/80">{title}</div>
        <div className="text-[28px] font-semibold leading-8">{value}</div>
        <div className="text-[14px]">
          {(() => {
            const percentIndex = changeText.indexOf("%");
            if (percentIndex === -1) {
              return <span className="text-foreground">{changeText}</span>;
            }
            const coloredPart = changeText.slice(0, percentIndex + 1);
            const remainingPart = changeText.slice(percentIndex + 1);
            return (
              <>
                <span className={cn(changeClassName)}>{coloredPart}</span>
                <span className="text-foreground">{remainingPart}</span>
              </>
            );
          })()}
        </div>
      </div>
      {icon ? (
        <div
          className={cn(
            "w-12 h-12 rounded-2xl shrink-0 inline-flex items-center justify-center",
            iconContainerClassName
          )}
        >
          {icon}
        </div>
      ) : null}
    </Card>
  );
}


