import ToneProfiles from "@/components/dashboard/ToneProfiles";
import PromptEditor from "@/components/dashboard/PromptEditor";
import ToneSettings from "@/components/dashboard/ToneSettings";
import MoodToToneRouting from "@/components/dashboard/MoodToToneRouting";
import SaveChanges from "@/components/dashboard/SaveChanges";

export default function TonePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] leading-9 font-bold text-[#242424]">Tone & Prompt Management</h1>
        <p className="mt-1 text-[16px] leading-6 text-muted-foreground">
        Control Pryve's personality and response style
        </p>
      </div>

      {/* Tone Profiles Component */}
      <ToneProfiles />

          {/* Prompt Editor Component */}
          <PromptEditor />

          {/* Tone Settings Component */}
          <ToneSettings />

          {/* Mood-to-Tone Routing Component */}
          <MoodToToneRouting />

          {/* Save Changes Component */}
          <SaveChanges />
        </div>
      );
    }


