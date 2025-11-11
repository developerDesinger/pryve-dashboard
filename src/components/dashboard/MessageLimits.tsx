"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { ChatSettings } from "@/lib/api/chatSettings";

interface MessageLimitsProps {
  settings: ChatSettings | null;
  onUpdate: (updates: Partial<ChatSettings>) => void;
  onSave: (updates: Partial<ChatSettings>) => Promise<boolean>;
  saving?: boolean;
}

export default function MessageLimits({ settings, onUpdate, onSave, saving = false }: MessageLimitsProps) {
  const [dailyReset, setDailyReset] = useState(false);
  const [freeTierLimit, setFreeTierLimit] = useState<number | undefined>(undefined);
  const [gracePeriod, setGracePeriod] = useState<number | undefined>(undefined);
  const [editingLimit, setEditingLimit] = useState(false);
  const [editingGrace, setEditingGrace] = useState(false);

  useEffect(() => {
    if (settings) {
      setDailyReset(settings.dailyReset ?? false);
      setFreeTierLimit(settings.freeTierMessageLimit ?? 10);
      setGracePeriod(settings.gracePeriodMessages ?? 0);
    }
  }, [settings]);

  const handleDailyResetToggle = () => {
    const newValue = !dailyReset;
    setDailyReset(newValue);
    onUpdate({ dailyReset: newValue });
  };

  // Check if limit has changed
  const limitHasChanged = settings 
    ? freeTierLimit !== undefined && freeTierLimit !== (settings.freeTierMessageLimit ?? 10)
    : freeTierLimit !== undefined;

  // Check if grace period has changed
  const graceHasChanged = settings
    ? gracePeriod !== undefined && gracePeriod !== (settings.gracePeriodMessages ?? 0)
    : gracePeriod !== undefined;

  const handleLimitSave = async () => {
    if (freeTierLimit !== undefined && limitHasChanged) {
      await onSave({ freeTierMessageLimit: freeTierLimit });
      setEditingLimit(false);
    }
  };

  const handleGraceSave = async () => {
    if (gracePeriod !== undefined && graceHasChanged) {
      await onSave({ gracePeriodMessages: gracePeriod });
      setEditingGrace(false);
    }
  };

  return (
    <Card className="rounded-2xl p-6 bg-white dark:bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/icons/Icon (5).svg" alt="Message Limits" className="w-6 h-6" />
            <div>
              <CardTitle className="text-[18px] font-semibold">Message Limits</CardTitle>
              <p className="text-[14px] text-muted-foreground mt-1">
                Control free tier messaging restrictions
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="text-[14px] text-muted-foreground">Daily Reset</span>
            <button
              onClick={handleDailyResetToggle}
              disabled={saving}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                dailyReset ? "bg-[#757575]" : "bg-gray-300"
              } ${saving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  dailyReset ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-[14px]">Free Tier Message Limit</h4>
              {editingLimit ? (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    value={freeTierLimit ?? ""}
                    onChange={(e) => setFreeTierLimit(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-20 px-2 py-1 text-[12px] border border-gray-300 rounded"
                    min="1"
                  />
                  <span className="text-[12px] text-muted-foreground">messages per user</span>
                </div>
              ) : (
                <p className="text-[12px] text-muted-foreground">
                  {freeTierLimit !== undefined ? `${freeTierLimit} messages per user` : "Not set"}
                </p>
              )}
            </div>
            {editingLimit ? (
              <button
                onClick={handleLimitSave}
                disabled={saving || !limitHasChanged}
                className="w-8 h-8 rounded-lg bg-[#757575] text-white inline-flex items-center justify-center hover:bg-[#656565] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => setEditingLimit(true)}
                className="w-8 h-8 rounded-lg bg-gray-200 inline-flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-600"
                >
                  <path
                    d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-[14px]">Grace Period Messages</h4>
              {editingGrace ? (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    value={gracePeriod ?? ""}
                    onChange={(e) => setGracePeriod(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-20 px-2 py-1 text-[12px] border border-gray-300 rounded"
                    min="0"
                  />
                  <span className="text-[12px] text-muted-foreground">extra messages</span>
                </div>
              ) : (
                <p className="text-[12px] text-muted-foreground">
                  {gracePeriod !== undefined ? `${gracePeriod} extra messages` : "Not set"}
                </p>
              )}
            </div>
            {editingGrace ? (
              <button
                onClick={handleGraceSave}
                disabled={saving || !graceHasChanged}
                className="w-8 h-8 rounded-lg bg-[#757575] text-white inline-flex items-center justify-center hover:bg-[#656565] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => setEditingGrace(true)}
                className="w-8 h-8 rounded-lg bg-gray-200 inline-flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-600"
                >
                  <path
                    d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
