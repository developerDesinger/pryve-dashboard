"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";

export type UserStat = {
  id: string;
  title: string;
  value: string | number;
  iconSrc: string;
  iconBg: string; // e.g. #eef5ff
};

export default function UserStatMiniCard({ title, value, iconSrc, iconBg }: UserStat) {
  return (
    <Card className="rounded-2xl border border-border bg-white dark:bg-white p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl inline-flex items-center justify-center" style={{ background: iconBg }}>
        <img src={iconSrc} alt="" className="w-5 h-5" />
      </div>
      <div>
        <div className="text-[14px] text-muted-foreground">{title}</div>
        <div className="text-[20px] font-semibold">{value}</div>
      </div>
    </Card>
  );
}


