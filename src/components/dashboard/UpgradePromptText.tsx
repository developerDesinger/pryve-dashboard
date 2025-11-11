"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { ChatSettings } from "@/lib/api/chatSettings";

interface UpgradePromptTextProps {
  settings: ChatSettings | null;
  onUpdate: (updates: Partial<ChatSettings>) => void;
  onSave: (updates: Partial<ChatSettings>) => Promise<boolean>;
  saving?: boolean;
}

export default function UpgradePromptText({ settings, onUpdate, onSave, saving = false }: UpgradePromptTextProps) {
  const [promptText, setPromptText] = useState("");
  const [initialValue, setInitialValue] = useState<string>("");

  useEffect(() => {
    if (settings) {
      const value = settings.upgradePromptText || "";
      setPromptText(value);
      setInitialValue(value);
    }
  }, [settings]);

  // Check if there are changes by comparing current value with initial loaded value
  const hasChanges = promptText !== initialValue;

  const handleSave = async () => {
    const success = await onSave({ upgradePromptText: promptText });
    if (success) {
      // Update initial value to current value after successful save
      setInitialValue(promptText);
    }
  };

  const handleCancel = () => {
    setPromptText(initialValue);
  };

  return (
    <Card className="rounded-2xl p-6 bg-white dark:bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <img src="/icons/Icon (6).svg" alt="Upgrade Prompt Text" className="w-6 h-6" />
          <div>
            <CardTitle className="text-[18px] font-semibold">Upgrade Prompt Text</CardTitle>
            <p className="text-[14px] text-muted-foreground mt-1">
              Message shown to encourage premium upgrade
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            value={promptText}
            onChange={(e) => {
              setPromptText(e.target.value);
              onUpdate({ upgradePromptText: e.target.value });
            }}
            className="min-h-[120px] resize-none pr-8 text-[14px] leading-relaxed"
            placeholder="Enter your upgrade prompt text..."
            disabled={saving}
          />
          <div className="absolute bottom-2 right-2 text-gray-400">
            <img src="/icons/Vector.svg" alt="Resize" className="w-4 h-4" />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="flex-1 bg-[#757575] text-white hover:brightness-95 px-6 py-2 text-[14px] font-bold rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleCancel}
            disabled={saving || !hasChanges}
            className="flex-1 bg-gray-100 text-black hover:bg-gray-200 px-6 py-2 text-[14px] font-bold rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
