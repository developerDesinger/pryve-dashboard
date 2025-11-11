"use client";

import Integrations from "@/components/dashboard/Integrations";
import FeatureToggles from "@/components/dashboard/FeatureToggles";
import APIConfiguration from "@/components/dashboard/APIConfiguration";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-[24px] leading-9 font-bold text-[#242424]">Settings & Integrations</h1>
        <p className="mt-1 text-[16px] leading-6 text-muted-foreground">
        Configure API connections, features, and system behavior
        </p>
      </div>
        <div className="text-[14px] text-[#242424]">
          <span className="font-bold">Last modified</span>: Aug 13, 2025
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Integrations */}
        <div className="bg-white rounded-2xl p-6">
          <Integrations />
        </div>

        {/* Right Column - Feature Toggles */}
        <div className="bg-white rounded-2xl p-6">
          <FeatureToggles />
        </div>
      </div>

      {/* API Configuration */}
      <APIConfiguration />
    </div>
  );
}


