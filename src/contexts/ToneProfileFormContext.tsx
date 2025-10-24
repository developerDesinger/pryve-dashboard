"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

export interface ToneProfileFormData {
  name: string;
  description: string;
  icon: string;
  coreIdentity: string;
  safetyGuidelines: string;
  comfortingInstructions: string;
  maxWordCount: string;
  responseStyle: string;
  bannedWords: string[];
  moodToToneRules: {
    id: string;
    mood: string;
    tone: string;
    priority: number;
  }[];
}

interface ToneProfileFormContextType {
  formData: ToneProfileFormData;
  updateFormData: (updates: Partial<ToneProfileFormData>) => void;
  resetFormData: () => void;
  loadProfileData: (profile: any) => void;
  hasChanges: boolean;
  setHasChanges: (hasChanges: boolean) => void;
}

const initialFormData: ToneProfileFormData = {
  name: '',
  description: '',
  icon: 'heart',
  coreIdentity: '',
  safetyGuidelines: '',
  comfortingInstructions: '',
  maxWordCount: '',
  responseStyle: '',
  bannedWords: [],
  moodToToneRules: [],
};

const ToneProfileFormContext = createContext<ToneProfileFormContextType | undefined>(undefined);

export function ToneProfileFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<ToneProfileFormData>(initialFormData);
  const [hasChanges, setHasChanges] = useState(false);

  const updateFormData = (updates: Partial<ToneProfileFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const resetFormData = () => {
    setFormData(initialFormData);
    setHasChanges(false);
  };

  const loadProfileData = (profile: any) => {
    if (!profile) return;
    
    // Convert moodToToneRouting object to array format
    const moodToToneRules = Object.entries(profile.moodToToneRouting || {}).map(([mood, config]: [string, any], index) => ({
      id: `rule-${index}`,
      mood: mood.charAt(0).toUpperCase() + mood.slice(1), // Capitalize first letter
      tone: config.tone || "Comforting", // Use tone from config or default
      priority: config.priority || index + 1,
    }));

    setFormData({
      name: profile.name || '',
      description: profile.description || '',
      icon: profile.icon || 'heart',
      coreIdentity: profile.coreIdentity || '',
      safetyGuidelines: Array.isArray(profile.safetyGuidelines) 
        ? profile.safetyGuidelines.join('\n') 
        : profile.safetyGuidelines || '',
      comfortingInstructions: profile.comfortingInstructions || '',
      maxWordCount: profile.maxWords?.toString() || '',
      responseStyle: profile.responseStyle || '',
      bannedWords: profile.bannedWords || [],
      moodToToneRules: moodToToneRules,
    });
    setHasChanges(false);
  };

  return (
    <ToneProfileFormContext.Provider
      value={{
        formData,
        updateFormData,
        resetFormData,
        loadProfileData,
        hasChanges,
        setHasChanges,
      }}
    >
      {children}
    </ToneProfileFormContext.Provider>
  );
}

export function useToneProfileForm() {
  const context = useContext(ToneProfileFormContext);
  if (context === undefined) {
    throw new Error('useToneProfileForm must be used within a ToneProfileFormProvider');
  }
  return context;
}
