"use client";

import { useToneProfileForm } from "@/contexts/ToneProfileFormContext";

const iconOptions = [
  { value: "heart", label: "Heart", src: "/icons/Tone/heart.svg" },
  { value: "grounded", label: "Grounded", src: "/icons/Tone/Icon (7).svg" },
  { value: "smileys", label: "Smileys", src: "/icons/Tone/smileys.svg" },
  { value: "direct", label: "Direct", src: "/icons/Tone/Icon (8).svg" },
  { value: "professional", label: "Professional", src: "/icons/Tone/Icon (9).svg" },
];

export default function ProfileBasicInfo() {
  const { formData, updateFormData } = useToneProfileForm();

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <svg width="16" height="16" className="sm:w-5 sm:h-5 text-gray-800" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h2 className="text-[16px] sm:text-[18px] font-bold text-gray-800">Profile Information</h2>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Name and Description Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Profile Name */}
          <div>
            <label className="block text-[14px] sm:text-[16px] font-semibold text-gray-900 mb-2 sm:mb-3">
              Profile Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
              className="w-full h-10 sm:h-12 px-3 sm:px-4 bg-white border border-gray-200 rounded-xl text-[14px] sm:text-[16px] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="Enter profile name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[14px] sm:text-[16px] font-semibold text-gray-900 mb-2 sm:mb-3">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              className="w-full h-10 sm:h-12 px-3 sm:px-4 bg-white border border-gray-200 rounded-xl text-[14px] sm:text-[16px] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="Enter profile description"
            />
          </div>
        </div>

        {/* Icon Selection */}
        <div>
          <label className="block text-[14px] sm:text-[16px] font-semibold text-gray-900 mb-2 sm:mb-3">
            Profile Icon
          </label>
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {iconOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateFormData({ icon: option.value })}
                className={`p-2 sm:p-3 rounded-xl border-2 transition-all ${
                  formData.icon === option.value
                    ? 'border-[#757575] bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center gap-1 sm:gap-2">
                  <img 
                    src={option.src} 
                    alt={option.label} 
                    className="w-4 h-4 sm:w-5 sm:h-5" 
                  />
                  <span className="text-[10px] sm:text-[12px] text-gray-700 font-medium">
                    {option.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
