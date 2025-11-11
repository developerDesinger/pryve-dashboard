"use client";

import SystemPromptEditor from "@/components/dashboard/SystemPromptEditor";
import FallbackMessages from "@/components/dashboard/FallbackMessages";
import EmotionalResponseRules from "@/components/dashboard/EmotionalResponseRules";

export default function PromptsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] leading-9 font-bold text-[#242424]">Prompts & Personality</h1>
        <p className="mt-1 text-[16px] leading-6 text-muted-foreground">
        Configure AI behavior, responses, and emotional intelligence
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - System Prompt Editor */}
        <div className="w-full">
          <SystemPromptEditor />
        </div>

        {/* Right Column - Fallback Messages */}
        <div className="w-full">
          <FallbackMessages />
        </div>
      </div>

      {/* Emotional Response Rules */}
      <EmotionalResponseRules />
    </div>
  );
}


