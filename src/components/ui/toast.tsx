"use client";
import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          fontSize: '14px',
          fontWeight: '500',
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
        success: {
          iconTheme: {
            primary: 'var(--success)',
            secondary: 'white',
          },
          style: {
            borderLeft: '4px solid var(--success)',
          },
        },
        error: {
          iconTheme: {
            primary: 'var(--destructive)',
            secondary: 'white',
          },
          style: {
            borderLeft: '4px solid var(--destructive)',
          },
        },
        loading: {
          iconTheme: {
            primary: 'var(--primary)',
            secondary: 'white',
          },
          style: {
            borderLeft: '4px solid var(--primary)',
          },
        },
      }}
    />
  );
}
