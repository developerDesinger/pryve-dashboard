"use client";

import { Card } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { aiConfigAPI, type AIConfig } from "@/lib/api/aiConfig";
import { useToast } from "@/hooks/useToast";
import { cookieUtils } from "@/lib/cookies";
import { API_CONFIG, getApiUrl } from "@/lib/config";

interface ProgressData {
  status: string;
  progress: number;
  totalChunks: number;
  processedChunks: number;
  currentBatch: number;
  totalBatches: number;
  message: string;
  error?: string;
}

export default function SystemPromptEditor() {
  const { user } = useAuth();
  const { showSuccess, showError, showLoading, dismiss } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [systemPromptActive, setSystemPromptActive] = useState(false);
  const [lastModified, setLastModified] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<ProgressData | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentSessionIdRef = useRef<string | null>(null);

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

  // Start progress polling
  const startProgressPolling = (sessionId: string) => {
    // Clear any existing polling
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    const token = cookieUtils.getAuthToken();
    if (!token) {
      console.error('No token available for progress polling');
      return;
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || API_CONFIG.BASE_URL;
    const url = `${backendUrl}${API_CONFIG.ENDPOINTS.AI_CONFIG_PROGRESS}/${sessionId}`;
    
    console.log('🔄 Starting progress polling:', url);

    // Poll immediately, then every 500ms
    const pollProgress = async () => {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...API_CONFIG.DEFAULT_HEADERS,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            console.log('📭 Session not found, stopping polling');
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Check if response has success field
        if (!result.success) {
          console.warn('⚠️ Progress response indicates failure:', result.error);
          return;
        }

        const data: ProgressData = result;
        
        // Verify this is for the current session
        if (currentSessionIdRef.current !== sessionId) {
          console.warn(`⚠️ Received progress for different session. Current: ${currentSessionIdRef.current}, Received: ${sessionId}`);
          return;
        }

        // Calculate progress if not provided
        const calculatedProgress = data.progress ?? 
          (data.totalChunks && data.processedChunks
            ? Math.round((data.processedChunks / data.totalChunks) * 100)
            : 0);

        console.log('✅ Progress update received:', {
          status: data.status,
          progress: calculatedProgress,
          processedChunks: data.processedChunks,
          totalChunks: data.totalChunks,
          message: data.message,
        });

        // Update progress state
        setUploadProgress({
          status: data.status || 'uploading',
          progress: calculatedProgress,
          totalChunks: data.totalChunks || 0,
          processedChunks: data.processedChunks || 0,
          currentBatch: data.currentBatch || 0,
          totalBatches: data.totalBatches || 0,
          message: data.message || 'Uploading chunks...',
          error: data.error,
        });

        // Handle completion
        if (data.status === 'completed' || data.status === 'error') {
          console.log(`🎉 Upload ${data.status}`);
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          
          if (data.status === 'completed') {
            setTimeout(() => {
              setUploadProgress(null);
              currentSessionIdRef.current = null;
            }, 3000);
          }
          
          if (data.status === 'error') {
            showError(data.error || 'Failed to upload chunks');
          }
        }
      } catch (error) {
        console.error('❌ Error polling progress:', error);
        // Don't stop polling on error - might be temporary network issue
      }
    };

    // Poll immediately
    pollProgress();
    
    // Then poll every 500ms
    pollingIntervalRef.current = setInterval(pollProgress, 500);
    
    console.log('✅ Progress polling started');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup polling on unmount
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, []);


  // Generate unique session ID for progress tracking
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Handle save functionality
  const handleSave = async () => {
    if (!user) return;
    
    // Validate content before saving
    if (!prompt.trim()) {
      showError('Please enter a system prompt before saving');
      return;
    }
    
    setIsSaving(true);
    
    // Check if prompt is large enough to require chunking (>500 words)
    const wordCount = prompt.trim().split(/\s+/).length;
    const needsChunking = wordCount > 500 && systemPromptActive;
    
    // Generate session ID for progress tracking if chunking is needed
    const sessionId = needsChunking ? generateSessionId() : undefined;
    currentSessionIdRef.current = sessionId || null;
    
    // Initialize progress state if chunking is needed
    if (needsChunking && sessionId) {
      setUploadProgress({
        status: 'initializing',
        progress: 0,
        totalChunks: 0,
        processedChunks: 0,
        currentBatch: 0,
        totalBatches: 0,
        message: 'Preparing to upload chunks...',
      });
      
      // Start progress polling
      startProgressPolling(sessionId);
      
      // No need to wait - polling will start immediately
    } else {
      setUploadProgress(null);
    }
    
    // Only show toast for non-chunking saves (small prompts)
    const loadingToast = needsChunking ? null : showLoading('Saving system prompt...');
    
    try {
      const token = cookieUtils.getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await aiConfigAPI.updateAIConfig(token, {
        systemPrompt: prompt.trim(),
        systemPromptActive: systemPromptActive
      }, sessionId);
      
      if (response.success) {
        // Wait a bit for final progress update if chunking was needed
        if (needsChunking && sessionId) {
          // Wait for progress to complete (max 60 seconds)
          let waitCount = 0;
          while (uploadProgress && uploadProgress.status !== 'completed' && uploadProgress.status !== 'error' && waitCount < 60) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            waitCount++;
          }
        }
        
        if (loadingToast) {
          dismiss(loadingToast);
        }
        showSuccess(needsChunking ? 'System prompt saved and chunks uploaded successfully!' : 'System prompt saved successfully!');
        setIsEditing(false);
        setLastModified(new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }));
        
        // Clear progress after a short delay to show completion
        if (needsChunking) {
          setTimeout(() => {
            setUploadProgress(null);
            currentSessionIdRef.current = null;
          }, 3000);
        }
      } else {
        if (loadingToast) {
          dismiss(loadingToast);
        }
        showError(response.message || 'Failed to save system prompt');
        setUploadProgress(null);
        currentSessionIdRef.current = null;
      }
    } catch (error) {
      if (loadingToast) {
        dismiss(loadingToast);
      }
      showError('Network error. Please try again.');
      setUploadProgress(null);
      currentSessionIdRef.current = null;
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

        {/* Progress Bar - Show when uploading chunks */}
        {uploadProgress && (
          <div className={`mt-4 p-4 rounded-xl border ${
            uploadProgress.status === 'error' 
              ? 'bg-red-50 border-red-200' 
              : uploadProgress.status === 'completed'
              ? 'bg-green-50 border-green-200'
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[14px] font-medium ${
                uploadProgress.status === 'error' 
                  ? 'text-red-900' 
                  : uploadProgress.status === 'completed'
                  ? 'text-green-900'
                  : 'text-blue-900'
              }`}>
                {uploadProgress.message || 'Uploading chunks...'}
              </span>
              {uploadProgress.status !== 'completed' && (
                <span className={`text-[12px] ${
                  uploadProgress.status === 'error' 
                    ? 'text-red-700' 
                    : 'text-blue-700'
                }`}>
                  {uploadProgress.progress}%
                </span>
              )}
            </div>
            {uploadProgress.status !== 'completed' && uploadProgress.status !== 'error' && (
              <div className={`w-full rounded-full h-2.5 mb-2 ${
                uploadProgress.status === 'error' 
                  ? 'bg-red-200' 
                  : 'bg-blue-200'
              }`}>
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    uploadProgress.status === 'error' 
                      ? 'bg-red-600' 
                      : 'bg-blue-600'
                  }`}
                  style={{ 
                    width: `${Math.min(Math.max(uploadProgress.progress, 0), 100)}%` 
                  }}
                ></div>
              </div>
            )}
            {uploadProgress.status === 'completed' && (
              <div className="flex items-center gap-2 text-green-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[14px] font-medium">Upload completed successfully!</span>
              </div>
            )}
            {uploadProgress.totalChunks > 0 && uploadProgress.status !== 'completed' && (
              <p className={`text-[12px] mt-2 ${
                uploadProgress.status === 'error' 
                  ? 'text-red-700' 
                  : 'text-blue-700'
              }`}>
                {uploadProgress.processedChunks || 0} of {uploadProgress.totalChunks} chunks uploaded
                {uploadProgress.totalBatches > 0 && ` • Batch ${uploadProgress.currentBatch || 0}/${uploadProgress.totalBatches}`}
              </p>
            )}
            {uploadProgress.status === 'error' && uploadProgress.error && (
              <p className="text-[12px] text-red-600 mt-2">
                Error: {uploadProgress.error}
              </p>
            )}
          </div>
        )}

        {/* Simple Loading Indicator when saving (non-chunking) */}
        {isSaving && !uploadProgress && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <div className="flex-1">
                <p className="text-[14px] font-medium text-blue-900">
                  Saving system prompt...
                </p>
              </div>
            </div>
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
          className={`w-full px-4 py-2 bg-[#757575] text-white rounded-lg text-[14px] font-medium hover:brightness-95 transition-colors flex items-center justify-center gap-2 ${
            isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {isSaving && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          <span>{isSaving ? 'Saving...' : isEditing ? 'Save' : 'Edit'}</span>
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
