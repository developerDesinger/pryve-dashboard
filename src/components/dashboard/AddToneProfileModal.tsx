"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ToneProfile {
  id: string;
  name: string;
  description: string;
  icon: string;
  coreIdentity: string;
  safetyGuidelines: string[];
  comfortingInstructions: string;
  maxWords: number;
  responseStyle: string;
  bannedWords: string[];
  moodToToneRouting: {
    [key: string]: {
      priority: number;
      autoSelect: boolean;
      tone: string;
    };
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AddToneProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (profile: Omit<ToneProfile, 'id'>) => void;
}

const availableIcons = [
  { key: "heart", src: "/icons/Tone/heart.svg", name: "Heart" },
  { key: "grounded", src: "/icons/Tone/Icon (7).svg", name: "Grounded" },
  { key: "smileys", src: "/icons/Tone/smileys.svg", name: "Smileys" },
  { key: "direct", src: "/icons/Tone/Icon (8).svg", name: "Direct" },
  { key: "professional", src: "/icons/Tone/Icon (9).svg", name: "Professional" },
];

const availableColors = [
  { bg: "#fce7f3", name: "Pink" },
  { bg: "#fef2f2", name: "Red" },
  { bg: "#eff6ff", name: "Blue" },
  { bg: "#fff7ed", name: "Orange" },
  { bg: "#f0fdf4", name: "Green" },
  { bg: "#fefce8", name: "Yellow" },
  { bg: "#f3e8ff", name: "Purple" },
  { bg: "#ecfdf5", name: "Teal" },
];

export default function AddToneProfileModal({ isOpen, onClose, onAdd }: AddToneProfileModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "heart",
    iconBg: "#fce7f3",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.description.trim()) {
      onAdd({
        name: formData.name.trim(),
        description: formData.description.trim(),
        icon: formData.icon,
        coreIdentity: `You are Pryve in ${formData.name} mode, a specialized AI companion.`,
        safetyGuidelines: [
          "Never provide medical advice",
          "Always encourage professional help for mental health crises",
          "Maintain appropriate boundaries"
        ],
        comfortingInstructions: `You are a ${formData.name.toLowerCase()} companion who provides support and guidance.`,
        maxWords: 200,
        responseStyle: formData.name,
        bannedWords: [],
        moodToToneRouting: {},
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setFormData({
        name: "",
        description: "",
        icon: "heart",
        iconBg: "#fce7f3",
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-blur bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Add Tone Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Profile Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter profile name"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the tone profile"
              className="mt-1"
              rows={3}
              required
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Choose Icon
            </Label>
            <div className="grid grid-cols-5 gap-2">
              {availableIcons.map((icon) => (
                <button
                  key={icon.key}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon: icon.key }))}
                  className={`p-2 rounded-lg border-2 transition-colors ${
                    formData.icon === icon.key
                      ? 'border-[#757575] bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={icon.src} alt={icon.name} className="w-6 h-6 mx-auto" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Choose Color
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {availableColors.map((color) => (
                <button
                  key={color.bg}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, iconBg: color.bg }))}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    formData.iconBg === color.bg
                      ? 'border-[#757575]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color.bg }}
                >
                  <div className="w-4 h-4 rounded-full bg-white mx-auto"></div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#757575] hover:brightness-95"
            >
              Add Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
