"use client";

import { useState } from "react";
import ToneProfiles from "@/components/dashboard/ToneProfiles";
import ProfileBasicInfo from "@/components/dashboard/ProfileBasicInfo";
import PromptEditor from "@/components/dashboard/PromptEditor";
import ToneSettings from "@/components/dashboard/ToneSettings";
import MoodToToneRouting from "@/components/dashboard/MoodToToneRouting";
import SaveChanges from "@/components/dashboard/SaveChanges";
import { ToneProfileFormProvider } from "@/contexts/ToneProfileFormContext";

export default function TonePage() {
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleProfileSelect = (profileId: string | null) => {
    setSelectedProfileId(profileId);
    setIsEditing(false); // Reset edit mode when selecting different profile
  };

  const handleEditProfile = (profileId: string) => {
    setIsEditing(true);
  };

  return (
    <ToneProfileFormProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-[24px] leading-9 font-bold text-[#242424]">Tone & Prompt Management</h1>
          <p className="mt-1 text-[16px] leading-6 text-muted-foreground">
          Control Pryve's personality and response style
          </p>
        </div>


        {/* Tone Profiles Component */}
        <ToneProfiles 
          selectedProfileId={selectedProfileId}
          onProfileSelect={handleProfileSelect}
          onEditProfile={handleEditProfile}
        />

        {/* Show editing components only when a profile is selected and in edit mode */}
        {selectedProfileId && isEditing && (
          <>
            {/* Profile Basic Information Component */}
            <ProfileBasicInfo />

            {/* Prompt Editor Component */}
            <PromptEditor />

            {/* Tone Settings Component */}
            <ToneSettings />

            {/* Mood-to-Tone Routing Component */}
            <MoodToToneRouting />

            {/* Save Changes Component */}
            <SaveChanges selectedProfileId={selectedProfileId} />
          </>
        )}
      </div>
    </ToneProfileFormProvider>
  );
}


