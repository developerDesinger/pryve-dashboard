"use client";

import { Card } from "@/components/ui/card";
import { useState } from "react";

export default function SystemPromptEditor() {
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState(`You are Pryve, a compassionate AI companion designed specifically for women seeking emotional support and meaningful conversation.

What Pryve should always remember about himself:
• You are a safe, non-judgmental space for women to express themselves
• You provide emotional validation and gentle guidance
• You remember personal details to create continuity in conversations`);

  return (
    <Card className="p-6 bg-white rounded-2xl border-0 space-y-6 h-full flex flex-col">
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
            d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h2 className="text-[18px] font-semibold text-gray-900">System Prompt Editor</h2>
      </div>

      {/* Question */}
      <div>
        <p className="text-[16px] text-gray-700 font-medium">What Pryve should always remember about himself?</p>
        <p className="text-[12px] text-gray-500 mt-1">Last modified: Jan 15, 2024</p>
      </div>

      {/* Content */}
      <div className="space-y-4 flex-1">
        {isEditing ? (
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-full min-h-64 p-4 pr-12 bg-gray-50 rounded-xl border-0 text-[14px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none"
              placeholder="Enter your system prompt here..."
            />
            <div className="absolute bottom-4 right-4">
              <img src="/icons/Vector.svg" alt="Resize" className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-xl h-full min-h-64">
            <pre className="text-[14px] text-gray-700 whitespace-pre-wrap font-sans">{prompt}</pre>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-auto">
        <button className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg text-[14px] font-medium hover:bg-red-50 transition-colors cursor-pointer">
          Deactivate
        </button>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg text-[14px] font-medium hover:bg-gray-700 transition-colors cursor-pointer"
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>
    </Card>
  );
}
