"use client";

import { Card } from "@/components/ui/card";
import { useState } from "react";

const fallbackMessages = [
  {
    id: "context-needed",
    title: "Context Needed",
    content: "I want to make sure I understand you fully so I can offer the best support. Could you help me understand a bit more about what you're feeling or what's on your mind? Sometimes it helps to start with whatever feels most important to you right now, even if it seems small. I'm here to listen. 💕",
    emoji: "💕"
  },
  {
    id: "technical-error",
    title: "Technical Error",
    content: "I'm having a little trouble processing that right now, but I'm still here with you. Could you try rephrasing that, or would you like to share something else that's on your mind? Your thoughts and feelings are important to me. 🌸",
    emoji: "🌸"
  }
];

export default function FallbackMessages() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [messages, setMessages] = useState(fallbackMessages);

  const handleEdit = (id: string) => {
    setEditingId(editingId === id ? null : id);
  };

  const handleSave = (id: string, newContent: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, content: newContent } : msg
    ));
    setEditingId(null);
  };

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
        <h2 className="text-[18px] font-semibold text-gray-900">Fallback Messages</h2>
      </div>

      {/* Question */}
      <div>
        <p className="text-[16px] text-gray-700 font-medium">What Pryve should always remember about himself?</p>
      </div>

      {/* Fallback Message Sections */}
      <div className="space-y-6 flex-1">
        {messages.map((message) => (
          <div key={message.id} className="space-y-4 w-full">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
              <h3 className="text-[16px] font-semibold text-gray-900">{message.title}</h3>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button className="w-full sm:w-auto px-3 py-1 border border-red-300 text-red-600 rounded-lg text-[12px] font-medium hover:bg-red-50 transition-colors cursor-pointer">
                  Deactivate
                </button>
                <button 
                  onClick={() => handleEdit(message.id)}
                  className="w-full sm:w-auto px-3 py-1 bg-gray-600 text-white rounded-lg text-[12px] font-medium hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  {editingId === message.id ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>

            {/* Message Content */}
            <div className="space-y-3 w-full">
              <div className="relative">
                <textarea
                  value={message.content}
                  onChange={(e) => {
                    setMessages(prev => prev.map(msg => 
                      msg.id === message.id ? { ...msg, content: e.target.value } : msg
                    ));
                  }}
                  className="w-full h-32 p-4 pr-12 bg-gray-50 rounded-xl border-0 text-[14px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none"
                  placeholder="Enter your fallback message here..."
                />
                <div className="absolute bottom-4 right-4">
                  <img src="/icons/Vector.svg" alt="Resize" className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
