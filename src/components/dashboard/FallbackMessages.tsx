"use client";

import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { aiConfigAPI, type AIConfig } from "@/lib/api/aiConfig";
import { useToast } from "@/hooks/useToast";
import { cookieUtils } from "@/lib/cookies";

const fallbackMessageTypes = [
  {
    id: "context-needed",
    title: "Context Needed",
    emoji: "💕"
  },
  {
    id: "technical-error",
    title: "Technical Error",
    emoji: "🌸"
  }
];

export default function FallbackMessages() {
  const { user } = useAuth();
  const { showSuccess, showError, showLoading, dismiss } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{
    id: string;
    title: string;
    content: string;
    emoji: string;
    active: boolean;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [aiConfig, setAiConfig] = useState<AIConfig | null>(null);

  // Load fallback messages data on component mount
  useEffect(() => {
    const loadFallbackMessages = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const token = cookieUtils.getAuthToken();
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await aiConfigAPI.getAIConfig(token);
        
        if (response.success && response.data) {
          setAiConfig(response.data);
          
          // Initialize messages with API data
          const initializedMessages = fallbackMessageTypes.map(msgType => {
            if (msgType.id === "context-needed") {
              return {
                ...msgType,
                content: response.data?.contextNeededMessage || "",
                active: response.data?.contextNeededActive || false
              };
            } else if (msgType.id === "technical-error") {
              return {
                ...msgType,
                content: response.data?.technicalErrorMessage || "",
                active: response.data?.technicalErrorActive || false
              };
            }
            return {
              ...msgType,
              content: "",
              active: false
            };
          });
          
          setMessages(initializedMessages);
        } else {
          // Initialize with empty messages if no API data
          const emptyMessages = fallbackMessageTypes.map(msgType => ({
            ...msgType,
            content: "",
            active: false
          }));
          
          setMessages(emptyMessages);
        }
      } catch (error) {
        console.error('Error loading fallback messages:', error);
        // Initialize with empty messages on error
        const emptyMessages = fallbackMessageTypes.map(msgType => ({
          ...msgType,
          content: "",
          active: false
        }));
        
        setMessages(emptyMessages);
      } finally {
        setIsLoading(false);
      }
    };

    loadFallbackMessages();
  }, [user]);

  const handleEdit = (id: string) => {
    setEditingId(editingId === id ? null : id);
  };

  const handleSave = async (id: string, newContent: string) => {
    if (!user) return;
    
    // Validate content before saving
    if (!newContent.trim()) {
      showError('Please enter a message before saving');
      return;
    }
    
    setIsSaving(true);
    const loadingToast = showLoading('Saving fallback message...');
    
    try {
      const token = cookieUtils.getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      let updateData: Partial<AIConfig> = {};
      
      if (id === "context-needed") {
        updateData = {
          contextNeededMessage: newContent.trim()
        };
      } else if (id === "technical-error") {
        updateData = {
          technicalErrorMessage: newContent.trim()
        };
      }
      
      const response = await aiConfigAPI.updateAIConfig(token, updateData);
      
      if (response.success) {
        dismiss(loadingToast);
        showSuccess('Fallback message saved successfully!');
        setMessages(prev => prev.map(msg => 
          msg.id === id ? { ...msg, content: newContent.trim() } : msg
        ));
        setEditingId(null);
      } else {
        dismiss(loadingToast);
        showError(response.message || 'Failed to save fallback message');
      }
    } catch (error) {
      dismiss(loadingToast);
      showError('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (id: string) => {
    if (!user) return;
    
    const message = messages.find(msg => msg.id === id);
    if (!message) return;
    
    // Check if message has content before allowing activation
    if (!message.content.trim()) {
      showError('Please add content to the message before activating it');
      return;
    }
    
    const newActiveState = !message.active;
    
    setIsSaving(true);
    try {
      const token = cookieUtils.getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      let updateData: Partial<AIConfig> = {};
      
      if (id === "context-needed") {
        updateData = {
          contextNeededActive: newActiveState
        };
      } else if (id === "technical-error") {
        updateData = {
          technicalErrorActive: newActiveState
        };
      }
      
      const response = await aiConfigAPI.updateAIConfig(token, updateData);
      
      if (response.success) {
        showSuccess(`Fallback message ${newActiveState ? 'activated' : 'deactivated'} successfully!`);
        setMessages(prev => prev.map(msg => 
          msg.id === id ? { ...msg, active: newActiveState } : msg
        ));
      } else {
        showError(response.message || 'Failed to update fallback message status');
      }
    } catch (error) {
      showError('Network error. Please try again.');
    } finally {
      setIsSaving(false);
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
        <h2 className="text-[18px] font-semibold text-gray-900">Fallback Messages</h2>
      </div>

      {/* Question */}
      <div>
        <p className="text-[16px] text-gray-700 font-medium">Fallback messages for different scenarios</p>
      </div>

      {/* Fallback Message Sections */}
      <div className="space-y-6 flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
              <p className="text-[14px] text-gray-500 mt-2">Loading fallback messages...</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
          <div key={message.id} className="space-y-4 w-full">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
              <div className="flex items-center gap-3">
                <h3 className="text-[16px] font-semibold text-gray-900">{message.title}</h3>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${message.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-[12px] text-gray-600">
                    {message.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button 
                  onClick={() => handleToggleActive(message.id)}
                  disabled={isSaving}
                  className={`w-full sm:w-auto px-3 py-1 border rounded-lg text-[12px] font-medium transition-colors ${
                    message.active 
                      ? 'border-red-300 text-red-600 hover:bg-red-50' 
                      : 'border-green-300 text-green-600 hover:bg-green-50'
                  } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {message.active ? 'Deactivate' : 'Activate'}
                </button>
                <button 
                  onClick={() => editingId === message.id ? handleSave(message.id, message.content) : handleEdit(message.id)}
                  disabled={isSaving}
                  className={`w-full sm:w-auto px-3 py-1 bg-[#757575] text-white rounded-lg text-[12px] font-medium hover:brightness-95 transition-colors ${
                    isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {isSaving ? 'Saving...' : editingId === message.id ? 'Save' : 'Edit'}
                </button>
                {editingId === message.id && (
                  <button 
                    onClick={() => setEditingId(null)}
                    disabled={isSaving}
                    className="w-full sm:w-auto px-3 py-1 border border-gray-300 text-gray-600 rounded-lg text-[12px] font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
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
                  disabled={isSaving}
                  className={`w-full h-32 p-4 pr-12 bg-gray-50 rounded-xl border-0 text-[14px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none ${
                    isSaving ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  placeholder="Enter your fallback message here..."
                />
                <div className="absolute bottom-4 right-4">
                  <img src="/icons/Vector.svg" alt="Resize" className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        )))}
      </div>
    </Card>
  );
}
