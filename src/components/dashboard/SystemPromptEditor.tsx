"use client";

import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { aiConfigAPI, type AIConfig } from "@/lib/api/aiConfig";
import { useToast } from "@/hooks/useToast";
import { cookieUtils } from "@/lib/cookies";

export default function SystemPromptEditor() {
  const { user } = useAuth();
  const { showSuccess, showError, showLoading, dismiss } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [systemPromptActive, setSystemPromptActive] = useState(false);
  const [lastModified, setLastModified] = useState<string>("");

  // Load system prompt data on component mount
  useEffect(() => {
    const loadSystemPrompt = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const token = cookieUtils.getAuthToken();
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await aiConfigAPI.getAIConfig(token);
        
        if (response.success && response.data) {
          setPrompt(response.data.systemPrompt || "");
          setSystemPromptActive(response.data.systemPromptActive || false);
          if (response.data.updatedAt) {
            setLastModified(new Date(response.data.updatedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }));
          }
        } else {
          // Set default prompt if no data exists
          setPrompt("You are Pryve, a compassionate AI companion designed specifically for women seeking emotional support and meaningful conversation.\n\nWhat Pryve should always remember about himself:\n• You are a safe, non-judgmental space for women to express themselves\n• You provide emotional validation and gentle guidance\n• You remember personal details to create continuity in conversations");
          setLastModified("Not set");
        }
      } catch (error) {
        console.error('Error loading system prompt:', error);
        // Set default prompt on error
        setPrompt("You are Pryve, a compassionate AI companion designed specifically for women seeking emotional support and meaningful conversation.\n\nWhat Pryve should always remember about himself:\n• You are a safe, non-judgmental space for women to express themselves\n• You provide emotional validation and gentle guidance\n• You remember personal details to create continuity in conversations");
        setLastModified("Not set");
      } finally {
        setIsLoading(false);
      }
    };

    loadSystemPrompt();
  }, [user]);

  // Handle save functionality
  const handleSave = async () => {
    if (!user) return;
    
    // Validate content before saving
    if (!prompt.trim()) {
      showError('Please enter a system prompt before saving');
      return;
    }
    
    setIsSaving(true);
    const loadingToast = showLoading('Saving system prompt...');
    
    try {
      const token = cookieUtils.getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await aiConfigAPI.updateAIConfig(token, {
        systemPrompt: prompt.trim(),
        systemPromptActive: systemPromptActive
      });
      
      if (response.success) {
        dismiss(loadingToast);
        showSuccess('System prompt saved successfully!');
        setIsEditing(false);
        setLastModified(new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }));
      } else {
        dismiss(loadingToast);
        showError(response.message || 'Failed to save system prompt');
      }
    } catch (error) {
      dismiss(loadingToast);
      showError('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle toggle active status
  const handleToggleActive = async () => {
    if (!user) return;
    
    // Check if prompt has content before allowing activation
    if (!prompt.trim()) {
      showError('Please add content to the system prompt before activating it');
      return;
    }
    
    const newActiveState = !systemPromptActive;
    setSystemPromptActive(newActiveState);
    
    try {
      const token = cookieUtils.getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await aiConfigAPI.updateAIConfig(token, {
        systemPromptActive: newActiveState
      });
      
      if (response.success) {
        showSuccess(`System prompt ${newActiveState ? 'activated' : 'deactivated'} successfully!`);
      } else {
        // Revert on failure
        setSystemPromptActive(!newActiveState);
        showError(response.message || 'Failed to update system prompt status');
      }
    } catch (error) {
      // Revert on failure
      setSystemPromptActive(!newActiveState);
      showError('Network error. Please try again.');
    }
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
        <h2 className="text-[18px] font-semibold text-gray-900">System Prompt Editor</h2>
      </div>

      {/* Question */}
      <div>
        <p className="text-[16px] text-gray-700 font-medium">What Pryve should always remember about himself?</p>
        <p className="text-[12px] text-gray-500 mt-1">Last modified: {lastModified}</p>
        <div className="flex items-center gap-2 mt-2">
          <div className={`w-2 h-2 rounded-full ${systemPromptActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className="text-[12px] text-gray-600">
            {systemPromptActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 flex-1">
        {isLoading ? (
          <div className="p-4 bg-gray-50 rounded-xl h-full min-h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
              <p className="text-[14px] text-gray-500 mt-2">Loading system prompt...</p>
            </div>
          </div>
        ) : isEditing ? (
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-full min-h-64 p-4 pr-12 bg-gray-50 rounded-xl border-0 text-[14px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none"
              placeholder="Enter your system prompt here..."
              disabled={isSaving}
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
        <button 
          onClick={handleToggleActive}
          disabled={isLoading || isSaving}
          className={`w-full px-4 py-2 border rounded-lg text-[14px] font-medium transition-colors cursor-pointer ${
            systemPromptActive 
              ? 'border-red-300 text-red-600 hover:bg-red-50' 
              : 'border-green-300 text-green-600 hover:bg-green-50'
          } ${isLoading || isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {systemPromptActive ? 'Deactivate' : 'Activate'}
        </button>
        <button 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          disabled={isLoading || isSaving}
          className={`w-full px-4 py-2 bg-[#757575] text-white rounded-lg text-[14px] font-medium hover:brightness-95 transition-colors ${
            isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {isSaving ? 'Saving...' : isEditing ? 'Save' : 'Edit'}
        </button>
        {isEditing && (
          <button 
            onClick={() => setIsEditing(false)}
            disabled={isSaving}
            className="w-full px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-[14px] font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </Card>
  );
}
