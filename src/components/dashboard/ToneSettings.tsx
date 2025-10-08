"use client";

import { useState } from "react";

export default function ToneSettings() {
  const [maxWordCount, setMaxWordCount] = useState("150");
  const [responseStyle, setResponseStyle] = useState("Conversational");
  const [bannedWords, setBannedWords] = useState(["Harmful", "Illegal", "Offensive"]);

  const removeBannedWord = (wordToRemove: string) => {
    setBannedWords(prev => prev.filter(word => word !== wordToRemove));
  };

  const addBannedWord = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      const newWord = e.currentTarget.value.trim();
      if (!bannedWords.includes(newWord)) {
        setBannedWords(prev => [...prev, newWord]);
        e.currentTarget.value = '';
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <img src="/icons/Tone/Icon (9).svg" alt="Tone Settings" className="w-4 h-4 sm:w-5 sm:h-5" />
        <h2 className="text-[16px] sm:text-[18px] font-bold text-gray-800">Tone Settings</h2>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Max Word Count and Response Style Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Max Word Count */}
          <div>
            <label className="block text-[14px] sm:text-[16px] font-semibold text-gray-900 mb-2 sm:mb-3">
              Max Word Count
            </label>
            <input
              type="number"
              value={maxWordCount}
              onChange={(e) => setMaxWordCount(e.target.value)}
              className="w-full h-10 sm:h-12 px-3 sm:px-4 bg-white border border-gray-200 rounded-xl text-[14px] sm:text-[16px] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              placeholder="150"
            />
          </div>

          {/* Response Style */}
          <div>
            <label className="block text-[14px] sm:text-[16px] font-semibold text-gray-900 mb-2 sm:mb-3">
              Response Style
            </label>
            <div className="relative">
              <select
                value={responseStyle}
                onChange={(e) => setResponseStyle(e.target.value)}
                className="w-full h-10 sm:h-12 px-3 sm:px-4 bg-white border border-gray-200 rounded-xl text-[14px] sm:text-[16px] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none cursor-pointer pr-8 sm:pr-10"
              >
                <option value="Conversational">Conversational</option>
                <option value="Formal">Formal</option>
                <option value="Casual">Casual</option>
                <option value="Professional">Professional</option>
                <option value="Friendly">Friendly</option>
              </select>
              <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg width="16" height="16" className="sm:w-5 sm:h-5 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Banned Words Section */}
        <div>
          <label className="block text-[14px] sm:text-[16px] font-semibold text-gray-900 mb-2 sm:mb-3">
            Banned Words
          </label>
          <div className="min-h-[100px] sm:min-h-[120px] p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200">
            {/* Banned Words Tags */}
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
              {bannedWords.map((word, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-red-100 text-red-800 rounded-full text-[12px] sm:text-[14px] font-medium"
                >
                  <button
                    onClick={() => removeBannedWord(word)}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    <svg width="10" height="10" className="sm:w-3 sm:h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <span className="truncate">{word}</span>
                </div>
              ))}
            </div>
            
            {/* Add New Banned Word Input */}
            <input
              type="text"
              placeholder="Type a word and press Enter to add..."
              onKeyDown={addBannedWord}
              className="w-full h-8 sm:h-10 px-2 sm:px-3 bg-white border border-gray-200 rounded-lg text-[12px] sm:text-[14px] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
