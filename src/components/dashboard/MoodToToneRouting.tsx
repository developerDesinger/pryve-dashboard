"use client";

import { useState } from "react";

interface MoodToneRule {
  id: string;
  mood: string;
  tone: string;
  priority: number;
}

const initialRules: MoodToneRule[] = [
  { id: "1", mood: "Anxious", tone: "Comforting", priority: 1 },
  { id: "2", mood: "Confused", tone: "Grounded", priority: 2 },
  { id: "3", mood: "Sad", tone: "Comforting", priority: 3 },
  { id: "4", mood: "Excited", tone: "Playful", priority: 4 },
  { id: "5", mood: "Frustrated", tone: "Direct", priority: 5 },
  { id: "6", mood: "Overwhelmed", tone: "Grounded", priority: 6 },
];

const moodOptions = [
  "Anxious", "Confused", "Sad", "Excited", "Frustrated", "Overwhelmed",
  "Happy", "Angry", "Calm", "Stressed", "Lonely", "Confident"
];

const toneOptions = [
  "Comforting", "Grounded", "Playful", "Direct", "Warm", "Supportive"
];

export default function MoodToToneRouting() {
  const [rules, setRules] = useState<MoodToneRule[]>(initialRules);

  const addRule = () => {
    const newRule: MoodToneRule = {
      id: Date.now().toString(),
      mood: "Anxious",
      tone: "Comforting",
      priority: rules.length + 1,
    };
    setRules(prev => [...prev, newRule]);
  };

  const deleteRule = (id: string) => {
    setRules(prev => prev.filter(rule => rule.id !== id));
  };

  const updateRule = (id: string, field: keyof MoodToneRule, value: string | number) => {
    setRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <img src="/icons/Tone/Icon (9).svg" alt="Mood-to-Tone Routing" className="w-4 h-4 sm:w-5 sm:h-5" />
          <div>
            <h2 className="text-[16px] sm:text-[18px] font-bold text-gray-800">Mood-to-Tone Routing</h2>
            <p className="text-[12px] sm:text-[14px] text-gray-600 font-normal">Define which tone to use based on detected user mood.</p>
          </div>
        </div>
        <button
          onClick={addRule}
          className="px-3 sm:px-4 py-2 bg-[#757575] text-white rounded-lg text-[12px] sm:text-[14px] font-medium hover:brightness-95 transition-colors cursor-pointer self-start sm:self-auto"
        >
          + Add Rule
        </button>
      </div>

      {/* Rules List */}
      <div className="space-y-2 sm:space-y-3">
        {rules.map((rule) => (
          <div key={rule.id} className="bg-gray-100 rounded-xl p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center w-full gap-2 sm:gap-4">
              {/* If mood is */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-[12px] sm:text-[14px] text-gray-700 whitespace-nowrap flex-shrink-0">If mood is</span>
                <div className="relative flex-1 min-w-0">
                  <select
                    value={rule.mood}
                    onChange={(e) => updateRule(rule.id, 'mood', e.target.value)}
                    className="w-full px-2 sm:px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-[12px] sm:text-[14px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 appearance-none cursor-pointer pr-6 sm:pr-8"
                  >
                    {moodOptions.map((mood) => (
                      <option key={mood} value={mood}>{mood}</option>
                    ))}
                  </select>
                  <div className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg width="10" height="10" className="sm:w-3 sm:h-3 text-gray-800" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* use tone */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-[12px] sm:text-[14px] text-gray-700 whitespace-nowrap flex-shrink-0">use tone</span>
                <div className="relative flex-1 min-w-0">
                  <select
                    value={rule.tone}
                    onChange={(e) => updateRule(rule.id, 'tone', e.target.value)}
                    className="w-full px-2 sm:px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-[12px] sm:text-[14px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 appearance-none cursor-pointer pr-6 sm:pr-8"
                  >
                    {toneOptions.map((tone) => (
                      <option key={tone} value={tone}>{tone}</option>
                    ))}
                  </select>
                  <div className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg width="10" height="10" className="sm:w-3 sm:h-3 text-gray-800" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* priority */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[12px] sm:text-[14px] text-gray-700 whitespace-nowrap">priority</span>
                <input
                  type="number"
                  value={rule.priority}
                  onChange={(e) => updateRule(rule.id, 'priority', parseInt(e.target.value) || 1)}
                  className="w-12 sm:w-16 px-1 sm:px-2 py-2 bg-gray-100 border border-gray-300 rounded-lg text-[12px] sm:text-[14px] text-gray-700 text-center focus:outline-none focus:ring-2 focus:ring-gray-400"
                  min="1"
                />
              </div>

              {/* Delete button */}
              <button
                onClick={() => deleteRule(rule.id)}
                className="text-red-500 hover:text-red-700 transition-colors cursor-pointer flex-shrink-0 self-start sm:self-auto"
              >
                <svg width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
