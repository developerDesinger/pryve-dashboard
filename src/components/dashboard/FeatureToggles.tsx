"use client";

import { Card } from "@/components/ui/card";
import { useState } from "react";

const features = [
  {
    id: "advanced-analytics",
    name: "Advanced Analytics",
    description: "Enhanced user behavior tracking and insights",
    enabled: true,
    comingSoon: false,
  },
  {
    id: "ai-voice-chat",
    name: "AI Voice Chat",
    description: "Voice-based conversations with AI companion",
    enabled: false,
    comingSoon: true,
  },
  {
    id: "group-therapy",
    name: "Group Therapy Sessions",
    description: "Facilitated group conversations and support",
    enabled: false,
    comingSoon: true,
  },
  {
    id: "custom-branding",
    name: "Custom Branding",
    description: "White-label solutions for organizations",
    enabled: false,
    comingSoon: true,
  },
  {
    id: "multilingual-support",
    name: "Multilingual Support",
    description: "Support for multiple languages and cultures",
    enabled: false,
    comingSoon: true,
  },
  {
    id: "crisis-intervention",
    name: "Crisis Intervention",
    description: "Emergency support and professional referrals",
    enabled: false,
    comingSoon: true,
  },
];

export default function FeatureToggles() {
  const [enabledFeatures, setEnabledFeatures] = useState<string[]>(["advanced-analytics"]);

  const toggleFeature = (featureId: string) => {
    setEnabledFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <img
          src="/icons/settings/Icon (3).svg"
          alt="Feature Toggles"
          className="w-5 h-5"
        />
        <h2 className="text-[18px] font-semibold text-gray-900">Feature Toggles</h2>
      </div>
      <p className="text-[14px] text-gray-500">Enable or disable upcoming features</p>

      {/* Feature Toggle Cards */}
      <div className="space-y-3">
        {features.map((feature) => (
          <Card key={feature.id} className="p-3 lg:p-4 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 lg:gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-[14px] lg:text-[16px] text-gray-900 truncate">{feature.name}</h3>
                  {feature.comingSoon && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] lg:text-[12px] font-medium flex-shrink-0">
                      Coming Soon
                    </span>
                  )}
                </div>
                <p className="text-[12px] lg:text-[14px] text-gray-500 break-words">{feature.description}</p>
              </div>
              <div className="ml-2 lg:ml-4 flex-shrink-0">
                <button
                  onClick={() => toggleFeature(feature.id)}
                  disabled={feature.comingSoon}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    enabledFeatures.includes(feature.id)
                      ? 'bg-gray-600'
                      : 'bg-gray-200'
                  } ${feature.comingSoon ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      enabledFeatures.includes(feature.id) ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* System Language */}
      <div className="space-y-3">
        <h3 className="font-semibold text-[14px] lg:text-[16px] text-gray-900">System Language</h3>
        <div className="relative">
          <select className="w-full h-10 lg:h-12 px-3 lg:px-4 bg-white border border-gray-200 rounded-xl text-[14px] lg:text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer">
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
            <option value="french">French</option>
            <option value="german">German</option>
          </select>
          <div className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-400 lg:w-5 lg:h-5"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Feature Development Timeline */}
      <Card className="p-3 lg:p-4 bg-white rounded-xl border border-gray-200">
        <div className="flex items-start gap-3">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-600 flex-shrink-0 mt-0.5 lg:w-5 lg:h-5"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-[14px] lg:text-[16px] text-gray-900 mb-1">Feature Development Timeline</h3>
            <p className="text-[12px] lg:text-[14px] text-gray-600 break-words">
              Features marked as "Coming Soon" are currently in development. They will be automatically enabled once ready for production.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
