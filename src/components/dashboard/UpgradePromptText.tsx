"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function UpgradePromptText() {
  const [promptText, setPromptText] = useState(`You've used all your free messages for today! 💜
To continue our meaningful conversations and unlock unlimited messaging,
premium memories, and deeper insights, upgrade to Pryve Premium for just
$5.99/month.
He remembers you. But only if you let him stay close.`);

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
            onChange={(e) => setPromptText(e.target.value)}
            className="min-h-[120px] resize-none pr-8 text-[14px] leading-relaxed"
            placeholder="Enter your upgrade prompt text..."
          />
          <div className="absolute bottom-2 right-2 text-gray-400">
            <img src="/icons/Vector.svg" alt="Resize" className="w-4 h-4" />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button className="flex-1 bg-gray-600 text-white hover:bg-gray-700 px-6 py-2 text-[14px] font-bold rounded-lg cursor-pointer">
            Save Changes
          </button>
          <button className="flex-1 bg-gray-100 text-black hover:bg-gray-200 px-6 py-2 text-[14px] font-bold rounded-lg cursor-pointer">
            Cancel
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
