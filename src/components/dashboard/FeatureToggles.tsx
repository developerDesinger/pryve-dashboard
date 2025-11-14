"use client";

import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { settingsAPI, FeatureToggle, SystemLanguage } from "@/lib/api/settings";
import { useToast } from "@/hooks/useToast";

// Mapping between API feature names and display names
const FEATURE_NAME_MAP: Record<string, { displayName: string; description: string }> = {
  ADVANCED_ANALYTICS: {
    displayName: "Advanced Analytics",
    description: "Enhanced user behavior tracking and insights",
  },
  AI_VOICE_CHAT: {
    displayName: "AI Voice Chat",
    description: "Voice-based conversations with AI companion",
  },
  GROUP_THERAPY_SESSIONS: {
    displayName: "Group Therapy Sessions",
    description: "Facilitated group conversations and support",
  },
  CUSTOM_BRANDING: {
    displayName: "Custom Branding",
    description: "White-label solutions for organizations",
  },
  MULTILINGUAL_SUPPORT: {
    displayName: "Multilingual Support",
    description: "Support for multiple languages and cultures",
  },
  CRISIS_INTERVENTION: {
    displayName: "Crisis Intervention",
    description: "Emergency support and professional referrals",
  },
};

export default function FeatureToggles() {
  const [featureToggles, setFeatureToggles] = useState<FeatureToggle[]>([]);
  const [systemLanguage, setSystemLanguage] = useState<SystemLanguage | null>(null);
  const [loading, setLoading] = useState(true);
  const [togglingFeatures, setTogglingFeatures] = useState<Set<string>>(new Set());
  const { showSuccess, showError, showLoading, dismiss } = useToast();

  // Fetch feature toggles and system language on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch feature toggles and system language in parallel
      const [togglesResponse, languageResponse] = await Promise.all([
        settingsAPI.getAllFeatureToggles(),
        settingsAPI.getSystemLanguage(),
      ]);

      if (togglesResponse.success && togglesResponse.data) {
        setFeatureToggles(togglesResponse.data);
      } else {
        showError(togglesResponse.message || "Failed to load feature toggles");
      }

      if (languageResponse.success && languageResponse.data) {
        setSystemLanguage(languageResponse.data);
      } else {
        showError(languageResponse.message || "Failed to load system language");
      }
    } catch (error) {
      showError("An error occurred while loading settings");
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = async (featureName: string) => {
    // Check if feature is coming soon
    const feature = featureToggles.find((f) => f.name === featureName);
    if (feature?.status === "COMING_SOON") {
      showError("Cannot enable features marked as 'Coming Soon'");
      return;
    }

    setTogglingFeatures((prev) => new Set(prev).add(featureName));
    const loadingToast = showLoading("Updating feature...");

    try {
      const response = await settingsAPI.toggleFeature(featureName);

      if (response.success && response.data) {
        // Update the feature toggle in state
        setFeatureToggles((prev) =>
          prev.map((f) => (f.name === featureName ? response.data! : f))
        );
        dismiss(loadingToast);
        showSuccess(
          `${FEATURE_NAME_MAP[featureName]?.displayName || featureName} ${
            response.data.isEnabled ? "enabled" : "disabled"
          }`
        );
      } else {
        dismiss(loadingToast);
        showError(response.message || "Failed to update feature toggle");
      }
    } catch (error) {
      dismiss(loadingToast);
      showError("An error occurred while updating the feature");
    } finally {
      setTogglingFeatures((prev) => {
        const next = new Set(prev);
        next.delete(featureName);
        return next;
      });
    }
  };

  const handleLanguageChange = async (language: string) => {
    const loadingToast = showLoading("Updating system language...");

    try {
      const response = await settingsAPI.updateSystemLanguage(language);

      if (response.success && response.data) {
        setSystemLanguage(response.data);
        dismiss(loadingToast);
        showSuccess(`System language updated to ${language}`);
      } else {
        dismiss(loadingToast);
        showError(response.message || "Failed to update system language");
      }
    } catch (error) {
      dismiss(loadingToast);
      showError("An error occurred while updating system language");
    }
  };

  const handleInitializeDefaults = async () => {
    const loadingToast = showLoading("Initializing default feature toggles...");

    try {
      const response = await settingsAPI.initializeDefaultFeatureToggles();

      if (response.success && response.data) {
        setFeatureToggles(response.data);
        dismiss(loadingToast);
        showSuccess("Default feature toggles initialized successfully");
      } else {
        dismiss(loadingToast);
        showError(response.message || "Failed to initialize feature toggles");
      }
    } catch (error) {
      dismiss(loadingToast);
      showError("An error occurred while initializing feature toggles");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <img
            src="/icons/settings/Icon (3).svg"
            alt="Feature Toggles"
            className="w-5 h-5"
          />
          <h2 className="text-[18px] font-semibold text-gray-900">Feature Toggles</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

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
        {featureToggles.length === 0 ? (
          <Card className="p-3 lg:p-4 bg-white rounded-xl border border-gray-200">
            <div className="text-center py-4 space-y-3">
              <p className="text-[14px] text-gray-500">
                No feature toggles available. Initialize default feature toggles to get started.
              </p>
              <button
                onClick={handleInitializeDefaults}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[14px] font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Initialize Defaults
              </button>
            </div>
          </Card>
        ) : (
          featureToggles.map((feature) => {
            const featureInfo = FEATURE_NAME_MAP[feature.name] || {
              displayName: feature.name,
              description: feature.description || "",
            };
            const isComingSoon = feature.status === "COMING_SOON";
            const isToggling = togglingFeatures.has(feature.name);

            return (
              <Card
                key={feature.id || feature.name}
                className="p-3 lg:p-4 bg-white rounded-xl border border-gray-200"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 lg:gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-[14px] lg:text-[16px] text-gray-900 truncate">
                        {featureInfo.displayName}
                      </h3>
                      {isComingSoon && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] lg:text-[12px] font-medium flex-shrink-0">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] lg:text-[14px] text-gray-500 break-words">
                      {featureInfo.description || feature.description}
                    </p>
                  </div>
                  <div className="ml-2 lg:ml-4 flex-shrink-0">
                    <button
                      onClick={() => toggleFeature(feature.name)}
                      disabled={isComingSoon || isToggling}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        feature.isEnabled
                          ? "bg-[#757575]"
                          : "bg-gray-200"
                      } ${
                        isComingSoon || isToggling
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          feature.isEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* System Language */}
      <div className="space-y-3">
        <h3 className="font-semibold text-[14px] lg:text-[16px] text-gray-900">
          System Language
        </h3>
        <div className="relative">
          <select
            value={systemLanguage?.language || "English"}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="w-full h-10 lg:h-12 px-3 lg:px-4 bg-white border border-gray-200 rounded-xl text-[14px] lg:text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
          >
            {systemLanguage?.availableLanguages?.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            )) || (
              <>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </>
            )}
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
