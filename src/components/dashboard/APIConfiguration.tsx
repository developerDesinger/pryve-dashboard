"use client";

import { Card } from "@/components/ui/card";

export default function APIConfiguration() {
  return (
    <Card className="p-6 bg-white rounded-2xl border-0 space-y-6">
      <div className="flex items-center gap-3">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-gray-600"
        >
          <path
            d="M9 5H7C6.46957 5 5.96086 5.21071 5.58579 5.58579C5.21071 5.96086 5 6.46957 5 7V19C5 19.5304 5.21071 20.0391 5.58579 20.4142C5.96086 20.7893 6.46957 21 7 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V7C19 6.46957 18.7893 5.96086 18.4142 5.58579C18.0391 5.21071 17.5304 5 17 5H15M9 5C9 4.46957 9.21071 3.96086 9.58579 3.58579C9.96086 3.21071 10.4696 3 11 3H13C13.5304 3 14.0391 3.21071 14.4142 3.58579C14.7893 3.96086 15 4.46957 15 5M9 5C9 5.53043 9.21071 6.03914 9.58579 6.41421C9.96086 6.78929 10.4696 7 11 7H13C13.5304 7 14.0391 6.78929 14.4142 6.41421C14.7893 6.03914 15 5.53043 15 5M9 9H15M9 13H15M9 17H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div>
          <h2 className="text-[18px] font-semibold text-gray-900">API Configuration</h2>
          <p className="text-[14px] text-gray-500">Manage external API connections</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* OpenAI API Key */}
        <div className="space-y-2">
          <label htmlFor="openai-key" className="text-[14px] lg:text-[16px] font-medium text-gray-900">
            OpenAI API Key
          </label>
          <input
            type="password"
            id="openai-key"
            placeholder="sk-..."
            className="w-full h-10 lg:h-12 px-3 lg:px-4 bg-gray-50 rounded-xl border-0 text-[14px] lg:text-[16px] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
          />
          <p className="text-[11px] lg:text-[12px] text-gray-500">Required for AI conversation capabilities</p>
        </div>

        {/* Stripe Secret Key */}
        <div className="space-y-2">
          <label htmlFor="stripe-key" className="text-[14px] lg:text-[16px] font-medium text-gray-900">
            Stripe Secret Key
          </label>
          <input
            type="password"
            id="stripe-key"
            placeholder="sk-..."
            className="w-full h-10 lg:h-12 px-3 lg:px-4 bg-gray-50 rounded-xl border-0 text-[14px] lg:text-[16px] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
          />
          <p className="text-[11px] lg:text-[12px] text-gray-500">Required for payment processing and subscriptions</p>
        </div>
      </div>
    </Card>
  );
}
