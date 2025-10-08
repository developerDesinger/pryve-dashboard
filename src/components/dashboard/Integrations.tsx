"use client";

import { Card } from "@/components/ui/card";
import { FaDiscord, FaSlack, FaGoogle, FaBolt } from "react-icons/fa";
import { SiWebflow, SiNotion } from "react-icons/si";

const integrations = [
  {
    id: "webflow",
    name: "Webflow",
    description: "Embed Pryve into your website",
    icon: SiWebflow,
    iconBg: "bg-blue-500",
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Automate workflows and data sync",
    icon: FaBolt, // Lightning bolt icon for automation
    iconBg: "bg-orange-500",
  },
  {
    id: "notion",
    name: "Notion",
    description: "Export insights to Notion pages",
    icon: SiNotion,
    iconBg: "bg-black",
  },
  {
    id: "discord",
    name: "Discord",
    description: "Community server integration",
    icon: FaDiscord,
    iconBg: "bg-purple-500",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Team notifications and alerts",
    icon: FaSlack,
    iconBg: "bg-gradient-to-r from-teal-400 via-pink-400 to-yellow-400",
  },
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Track user engagement and insights",
    icon: FaGoogle,
    iconBg: "bg-orange-400",
  },
];

export default function Integrations() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-gray-600"
        >
          <path
            d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h2 className="text-[18px] font-semibold text-gray-900">Integrations</h2>
      </div>
      <p className="text-[14px] text-gray-500">Connect with external services and platforms</p>

      {/* Integration Cards */}
      <div className="space-y-3">
        {integrations.map((integration) => (
          <Card key={integration.id} className="p-3 lg:p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow cursor-pointer">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 lg:gap-4 min-w-0 flex-1">
                <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0 ${integration.iconBg}`}>
                  <integration.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-[14px] lg:text-[16px] text-gray-900 truncate">{integration.name}</h3>
                  <p className="text-[12px] lg:text-[14px] text-gray-500 truncate">{integration.description}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer flex-shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.4791 3.53087C19.5521 2.60383 18.298 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.46997L11.75 5.17997"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 11C13.5705 10.4259 13.0226 9.95085 12.3934 9.60705C11.7643 9.26325 11.0685 9.05886 10.3533 9.00766C9.63816 8.95645 8.92037 9.05972 8.24861 9.31028C7.57686 9.56084 6.96684 9.95302 6.45996 10.46L3.45996 13.46C2.54917 14.403 2.04519 15.666 2.05659 16.977C2.06799 18.288 2.59383 19.542 3.52087 20.469C4.44791 21.396 5.70198 21.9219 7.01296 21.9333C8.32394 21.9447 9.58695 21.4407 10.53 20.5299L12.24 18.8199"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Custom Integration Request */}
      <Card className="p-3 lg:p-4 bg-white rounded-xl border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 lg:gap-4 min-w-0 flex-1">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-600 lg:w-5 lg:h-5"
              >
                <path
                  d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-[14px] lg:text-[16px] text-gray-900">Need Custom Integration</h3>
              <p className="text-[12px] lg:text-[14px] text-gray-500">
                Let us know what service you'd like to connect with Pryve. We're always expanding our integration ecosystem.
              </p>
            </div>
          </div>
          <button className="px-3 lg:px-4 py-2 bg-gray-600 text-white rounded-lg text-[12px] lg:text-[14px] font-medium hover:bg-gray-700 transition-colors cursor-pointer flex-shrink-0 w-full sm:w-auto">
            Request
          </button>
        </div>
      </Card>
    </div>
  );
}
