"use client";

import { loadingEmitter } from "@/lib/loadingEmitter";

let enabled = false;

export function enableGlobalFetchLoader() {
  if (enabled) return;
  if (typeof window === "undefined" || typeof window.fetch !== "function") {
    return;
  }

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (...args) => {
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
