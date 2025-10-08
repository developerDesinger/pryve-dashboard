"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function UpgradePromptTimings() {
  const [selectedTiming, setSelectedTiming] = useState("immediate");

  const timingOptions = [
    {
      id: "immediate",
      title: "Show upgrade prompt immediately when limit is reached.",
    },
    {
      id: "grace-period",
      title: "Show upgrade prompt after grace period messages are used.",
    },
    {
      id: "next-session",
      title: "Show upgrade prompt when user returns after hitting limit.",
    },
  ];

  return (
    <Card className="rounded-2xl p-6 bg-white dark:bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <img src="/icons/Icon (5).svg" alt="Upgrade Prompt Timings" className="w-6 h-6" />
          <div>
            <CardTitle className="text-[18px] font-semibold">Upgrade Prompt Timings</CardTitle>
            <p className="text-[14px] text-muted-foreground mt-1">
              When to show upgrade modal to free users
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {timingOptions.map((option) => (
            <div
              key={option.id}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setSelectedTiming(option.id)}
            >
              <div className="flex items-center justify-center w-5 h-5">
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    selectedTiming === option.id
                      ? "border-gray-600 bg-gray-600"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {selectedTiming === option.id && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-[14px] font-medium text-gray-900">
                {option.title}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
