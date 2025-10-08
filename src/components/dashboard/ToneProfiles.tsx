"use client";

import { useState } from "react";

interface ToneProfile {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  icon: string;
  iconBg: string;
}

const toneProfiles: ToneProfile[] = [
  {
    id: "1",
    name: "Comforting",
    description: "Warm, nurturing, and emotionally supportive.",
    isActive: true,
    icon: "/icons/Tone/heart.svg",
    iconBg: "#fce7f3"
  },
  {
    id: "2",
    name: "Grounded",
    description: "Practical, balanced, and solution-focused.",
    isActive: true,
    icon: "/icons/Tone/Icon (7).svg",
    iconBg: "#fef2f2"
  },
  {
    id: "3",
    name: "Playful",
    description: "Light-hearted, encouraging, and optimistic.",
    isActive: true,
    icon: "/icons/Tone/smileys.svg",
    iconBg: "#eff6ff"
  },
  {
    id: "4",
    name: "Direct",
    description: "Clear, honest, and straightforward communication.",
    isActive: true,
    icon: "/icons/Tone/Icon (8).svg",
    iconBg: "#fff7ed"
  }
];

export default function ToneProfiles() {
  const [profiles, setProfiles] = useState<ToneProfile[]>(toneProfiles);

  const handleToggleProfile = (profileId: string) => {
    setProfiles(prev => 
      prev.map(profile => 
        profile.id === profileId 
          ? { ...profile, isActive: !profile.isActive }
          : profile
      )
    );
  };

  const handleEditProfile = (profileId: string) => {
    console.log("Edit profile:", profileId);
    // Handle edit functionality here
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <svg width="16" height="16" className="sm:w-5 sm:h-5 text-gray-800" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div>
          <h2 className="text-[16px] sm:text-[18px] font-bold text-gray-800">Tone Profiles</h2>
          <p className="text-[12px] sm:text-[14px] text-gray-600 font-normal">Configure Pryve's different personality modes</p>
        </div>
      </div>

      {/* Profile Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {profiles.map((profile) => (
          <div key={profile.id} className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: profile.iconBg }}
                >
                  <img src={profile.icon} alt={profile.name} className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 flex-wrap">
                    <h3 className="text-[14px] sm:text-[16px] font-bold text-gray-900 truncate">{profile.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-[9px] sm:text-[10px] font-medium flex-shrink-0 ${
                      profile.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {profile.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-[12px] sm:text-[14px] text-gray-700 font-normal leading-relaxed">{profile.description}</p>
                </div>
              </div>
              
              {/* Buttons - only show for first card (Comforting) */}
              {profile.id === "1" && (
                <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4 flex-shrink-0">
                  <button
                    onClick={() => handleToggleProfile(profile.id)}
                    className="px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-[12px] font-medium border border-red-300 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    Disable
                  </button>
                  <button
                    onClick={() => handleEditProfile(profile.id)}
                    className="px-2 sm:px-3 py-1 bg-[#757575] text-white rounded-lg text-[10px] sm:text-[12px] font-medium hover:brightness-95 transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
