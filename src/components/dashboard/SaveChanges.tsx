"use client";

import { useState } from "react";
import { useToneProfileForm } from "@/contexts/ToneProfileFormContext";
import { toneProfilesAPI } from "@/lib/api/toneProfiles";
import { useToast } from "@/hooks/useToast";
import { ButtonLoader } from "@/components/ui/loader";

interface SaveChangesProps {
  selectedProfileId: string | null;
}

export default function SaveChanges({ selectedProfileId }: SaveChangesProps) {
  const { formData, hasChanges, resetFormData } = useToneProfileForm();
  const { showSuccess, showError, showLoading, dismiss } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveChanges = async () => {
    if (!hasChanges) {
      showError("No changes to save");
      return;
    }

    try {
      setIsSaving(true);
      const loadingToast = showLoading("Saving changes...");

      // Convert form data to API format
      const apiData = {
        name: formData.name || "Custom Profile",
        description: formData.description || "Custom tone profile created from form data",
        icon: formData.icon || "heart",
        coreIdentity: formData.coreIdentity,
        safetyGuidelines: formData.safetyGuidelines.split('\n').filter(line => line.trim()),
        comfortingInstructions: formData.comfortingInstructions,
        maxWords: parseInt(formData.maxWordCount) || 200,
        responseStyle: formData.responseStyle || "Conversational",
        bannedWords: formData.bannedWords || [],
        moodToToneRouting: formData.moodToToneRules?.reduce((acc, rule) => {
          acc[rule.mood.toLowerCase()] = {
            priority: rule.priority,
            autoSelect: true,
            tone: rule.tone
          };
          return acc;
        }, {} as Record<string, { priority: number; autoSelect: boolean; tone: string }>) || {},
        isActive: true,
      };


      // Update existing profile or create new one
      let response;
      if (selectedProfileId) {
        // Update existing profile
        response = await toneProfilesAPI.updateToneProfile(selectedProfileId, apiData);
      } else {
        // Create new profile
        response = await toneProfilesAPI.createToneProfile(apiData);
      }

      dismiss(loadingToast);

      if (response.success) {
        showSuccess("Changes saved successfully!");
        resetFormData();
      } else {
        showError(response.message || "Failed to save changes");
      }
    } catch (error) {
      dismiss(showLoading("Saving changes..."));
      showError("Network error. Please check your connection and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[16px] sm:text-[18px] font-bold text-gray-800">Save Changes</h2>
          <p className="text-[12px] sm:text-[14px] text-gray-600 font-normal mt-1">
            Apply all tone and prompt modifications.
          </p>
        </div>
        <button
          onClick={handleSaveChanges}
          disabled={!hasChanges || isSaving}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-[#757575] text-white rounded-lg text-[12px] sm:text-[14px] font-bold hover:brightness-95 transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <ButtonLoader />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
}
