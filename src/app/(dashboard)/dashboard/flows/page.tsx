"use client";

import { useEffect, useState } from "react";
import MessageLimits from "@/components/dashboard/MessageLimits";
import UpgradePromptText from "@/components/dashboard/UpgradePromptText";
import UpgradePromptTimings from "@/components/dashboard/UpgradePromptTimings";
import FirstMessages from "@/components/dashboard/FirstMessages";
import { chatSettingsAPI, ChatSettings } from "@/lib/api/chatSettings";

export default function FlowsPage() {
  const [settings, setSettings] = useState<ChatSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch chat settings on mount
  useEffect(() => {
    fetchChatSettings();
  }, []);

  const fetchChatSettings = async () => {
    try {
      setLoading(true);
      const response = await chatSettingsAPI.getChatSettings();
      if (response.success && response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch chat settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<ChatSettings>) => {
    try {
      setSaving(true);
      const response = await chatSettingsAPI.updateChatSettings(updates);
      if (response.success && response.data) {
        // Use the complete response data directly since API returns full ChatSettings object
        setSettings(response.data);
        setHasChanges(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update chat settings:", error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    // Reset all settings to default values
    const defaultSettings: Partial<ChatSettings> = {
      dailyReset: false,
      freeTierMessageLimit: 10,
      gracePeriodMessages: 0,
      upgradePromptText: null,
      showPromptOnLimit: true,
      showPromptAfterGrace: false,
      showPromptOnReturn: false,
      newUserMessage: null,
      returningUserMessage: null,
    };
    await updateSettings(defaultSettings);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading chat settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] leading-9 font-bold text-[#242424]">Chat Flow</h1>
          <p className="mt-1 text-[16px] leading-6 text-muted-foreground">
            Configure message limits, upgrade prompts, and user experience flow
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
          <button
            onClick={handleResetToDefault}
            className="h-10 rounded-[18px] px-4 bg-[#e5e5e5] text-foreground font-semibold cursor-pointer whitespace-nowrap hover:bg-[#d5d5d5] transition-colors"
          >
            Reset to Default
          </button>
          <span className={`text-[14px] ${hasChanges ? 'text-[#757575]' : 'text-[#9a7d84]'}`}>
            {hasChanges ? 'Unsaved Changes' : 'No Changes'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MessageLimits
          settings={settings}
          onUpdate={(updates) => {
            setSettings((prev) => {
              if (!prev) return prev;
              return { ...prev, ...updates } as ChatSettings;
            });
            setHasChanges(true);
          }}
          onSave={updateSettings}
          saving={saving}
        />
        <UpgradePromptText
          settings={settings}
          onUpdate={(updates) => {
            setSettings((prev) => {
              if (!prev) return prev;
              return { ...prev, ...updates } as ChatSettings;
            });
            setHasChanges(true);
          }}
          onSave={updateSettings}
          saving={saving}
        />
      </div>

      <div className="space-y-6">
        <UpgradePromptTimings
          settings={settings}
          onUpdate={(updates) => {
            setSettings((prev) => {
              if (!prev) return prev;
              return { ...prev, ...updates } as ChatSettings;
            });
            setHasChanges(true);
          }}
          onSave={updateSettings}
          saving={saving}
        />
        <FirstMessages
          settings={settings}
          onUpdate={(updates) => {
            setSettings((prev) => {
              if (!prev) return prev;
              return { ...prev, ...updates } as ChatSettings;
            });
            setHasChanges(true);
          }}
          onSave={updateSettings}
          saving={saving}
        />
      </div>
    </div>
  );
}


