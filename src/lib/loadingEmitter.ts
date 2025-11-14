"use client";

type Listener = (count: number) => void;

let activeRequests = 0;
const listeners = new Set<Listener>();

const notify = () => {
  for (const listener of listeners) {
    listener(activeRequests);
  }
};

export const loadingEmitter = {
  increment() {
    activeRequests += 1;
    notify();
  },
  decrement() {
    activeRequests = Math.max(0, activeRequests - 1);
    notify();
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    listener(activeRequests);
    return () => {
      listeners.delete(listener);
    };
  },
  getCount() {
    return activeRequests;
  },
};
