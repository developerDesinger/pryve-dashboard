"use client";

import { useState } from "react";

export default function PromptEditor() {
  const [coreIdentity, setCoreIdentity] = useState(`You are Pryve, a compassionate AI companion designed to provide emotional support and guidance to women. Your core purpose is to create a safe, non-judgmental space where users feel heard, understood, and supported in their personal growth journey.

- Unconditional positive regard and empathy
- Respect for user autonomy and choices
- Cultural sensitivity and inclusivity
- Trauma-informed responses
- Evidence-based emotional support techniques`);

  const [safetyGuidelines, setSafetyGuidelines] = useState(`SAFETY GUIDELINES (Read-Only):

- Never provide medical, legal, or financial advice
- Immediately encourage professional help for crisis situations
- Maintain appropriate boundaries in all interactions
- Respect privacy and confidentiality
- Report harmful content according to platform policies
- Use inclusive, non-discriminatory language at all times`);

  const [comfortingInstructions, setComfortingInstructions] = useState(`You are a gentle, nurturing companion who offers comfort and emotional support. Speak with warmth, validate feelings, and provide reassurance. Use phrases like 'I understand how you're feeling' and 'You're not alone in this.' Focus on emotional validation and gentle encouragement.`);
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <svg width="16" height="16" className="sm:w-5 sm:h-5 text-gray-800" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h2 className="text-[16px] sm:text-[18px] font-bold text-gray-800">Prompt Editor</h2>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Core Identity and Safety Guidelines - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Core Identity Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-3">
            <h3 className="text-[16px] sm:text-[20px] font-bold text-gray-900">Core Identity</h3>
            <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-[10px] sm:text-[12px] font-medium self-start sm:self-auto">Read Only</span>
          </div>
          <div className="relative">
            <textarea
              value={coreIdentity}
              onChange={(e) => setCoreIdentity(e.target.value)}
              className="w-full h-32 sm:h-48 p-3 sm:p-4 bg-gray-100 rounded-lg text-[14px] sm:text-[16px] text-gray-800 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3">
              <img src="/icons/Vector.svg" alt="Resize" className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Safety Guidelines Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-3">
            <h3 className="text-[16px] sm:text-[20px] font-bold text-gray-900">Safety Guidelines</h3>
            <span className="px-2 py-1 bg-red-200 text-red-800 rounded text-[10px] sm:text-[12px] font-medium self-start sm:self-auto">Critical</span>
          </div>
          <div className="relative">
            <textarea
              value={safetyGuidelines}
              onChange={(e) => setSafetyGuidelines(e.target.value)}
              className="w-full h-32 sm:h-48 p-3 sm:p-4 bg-gray-100 rounded-lg text-[14px] sm:text-[16px] text-gray-800 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3">
              <img src="/icons/Vector.svg" alt="Resize" className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
            </div>
          </div>
        </div>
        </div>

        {/* Comforting Instructions Section - Full Width */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[16px] sm:text-[20px] font-bold text-gray-900">Comforting Instructions</h3>
          </div>
          <div className="relative">
            <textarea
              value={comfortingInstructions}
              onChange={(e) => setComfortingInstructions(e.target.value)}
              className="w-full h-24 sm:h-32 p-3 sm:p-4 bg-gray-100 rounded-lg text-[14px] sm:text-[16px] text-gray-800 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3">
              <img src="/icons/Vector.svg" alt="Resize" className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
