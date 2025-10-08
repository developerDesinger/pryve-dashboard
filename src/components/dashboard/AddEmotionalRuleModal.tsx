"use client";

import { useState } from "react";

interface AddEmotionalRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: {
    trigger: string;
    responseType: string;
    tone: string;
    description: string;
  }) => void;
}

export default function AddEmotionalRuleModal({ isOpen, onClose, onSave }: AddEmotionalRuleModalProps) {
  const [formData, setFormData] = useState({
    trigger: "",
    responseType: "Soft comfort tone",
    tone: "Calm & reassuring",
    description: "When users experience feelings of anxiety, it is essential to provide a response that is both calm and supportive. This approach not only helps to alleviate their concerns but also fosters a sense of trust and safety. By acknowledging their feelings and offering reassurance, you can create a more positive interaction that encourages users to engage further."
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    // Reset form
    setFormData({
      trigger: "",
      responseType: "Soft comfort tone",
      tone: "Calm & reassuring",
      description: "When users experience feelings of anxiety, it is essential to provide a response that is both calm and supportive. This approach not only helps to alleviate their concerns but also fosters a sense of trust and safety. By acknowledging their feelings and offering reassurance, you can create a more positive interaction that encourages users to engage further."
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 backdrop-blur flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl p-8 w-full max-w-4xl mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-[20px] font-semibold text-gray-900">Add Emotional rule</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Three fields in a row on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Trigger Input */}
            <div>
              <label className="block text-[16px] font-semibold text-gray-900 mb-3">
                Trigger
              </label>
              <input
                type="text"
                value={formData.trigger}
                onChange={(e) => setFormData(prev => ({ ...prev, trigger: e.target.value }))}
                placeholder="(e.g anxiety)"
                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl text-[16px] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                required
              />
            </div>

            {/* Response Type Dropdown */}
            <div>
              <label className="block text-[16px] font-semibold text-gray-900 mb-3">
                Response type
              </label>
              <div className="relative">
                <select
                  value={formData.responseType}
                  onChange={(e) => setFormData(prev => ({ ...prev, responseType: e.target.value }))}
                  className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none cursor-pointer pr-10"
                >
                  <option value="Soft comfort tone">Soft comfort tone</option>
                  <option value="Empathetic response">Empathetic response</option>
                  <option value="Direct guidance">Direct guidance</option>
                  <option value="Gentle reminder">Gentle reminder</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Tone Dropdown */}
            <div>
              <label className="block text-[16px] font-semibold text-gray-900 mb-3">
                Tone
              </label>
              <div className="relative">
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value }))}
                  className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none cursor-pointer pr-10"
                >
                  <option value="Calm & reassuring">Calm & reassuring</option>
                  <option value="Warm & supportive">Warm & supportive</option>
                  <option value="Gentle & understanding">Gentle & understanding</option>
                  <option value="Encouraging & positive">Encouraging & positive</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block text-[16px] font-semibold text-gray-900 mb-3">
              Description
            </label>
            <div className="relative">
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full h-24 p-4 pr-12 bg-white border border-gray-200 rounded-xl text-[16px] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
                placeholder="Enter description..."
                required
              />
              <div className="absolute bottom-4 right-4">
                <img src="/icons/Vector.svg" alt="Resize" className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              className="px-8 py-3 bg-[#757575] text-white rounded-lg text-[16px] font-semibold hover:brightness-95 transition-colors cursor-pointer"
            >
              Save system prompt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
