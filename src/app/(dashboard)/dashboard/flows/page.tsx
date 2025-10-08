import MessageLimits from "@/components/dashboard/MessageLimits";
import UpgradePromptText from "@/components/dashboard/UpgradePromptText";
import UpgradePromptTimings from "@/components/dashboard/UpgradePromptTimings";
import FirstMessages from "@/components/dashboard/FirstMessages";

export default function FlowsPage() {
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
          <button className="h-10 rounded-[18px] px-4 bg-[#e5e5e5] text-foreground font-semibold cursor-pointer whitespace-nowrap">Reset to Default</button>
          <span className="text-[14px] text-[#9a7d84]">No Changes</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MessageLimits />
        <UpgradePromptText />
      </div>

      <div className="space-y-6">
        <UpgradePromptTimings />
        <FirstMessages />
      </div>
    </div>
  );
}


