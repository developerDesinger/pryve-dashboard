"use client";

import { loadingEmitter } from "@/lib/loadingEmitter";

let enabled = false;

// Endpoints that should NOT trigger the global loader
const EXCLUDED_ENDPOINTS = [
  '/api/v1/ai-config/progress', // SSE progress endpoint
  '/api/v1/ai-config', // AI config updates (we show inline progress instead)
];

function shouldSkipLoader(url: string): boolean {
  return EXCLUDED_ENDPOINTS.some(endpoint => url.includes(endpoint));
}

export function enableGlobalFetchLoader() {
  if (enabled) return;
  if (typeof window === "undefined" || typeof window.fetch !== "function") {
    return;
  }

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (...args) => {
    let url = '';
    if (typeof args[0] === 'string') {
      url = args[0];
    } else if (args[0] instanceof URL) {
      url = args[0].toString();
    } else if (args[0] instanceof Request) {
      url = args[0].url;
    }
    
    // Skip global loader for excluded endpoints
    if (shouldSkipLoader(url)) {
      return originalFetch(...args);
    }
    
    loadingEmitter.increment();
    try {
      const response = await originalFetch(...args);
      return response;
    } finally {
      loadingEmitter.decrement();
    }
  };

  enabled = true;
}
