"use client";

import React from "react";
import { useAuth } from "@/contexts/auth.context";

/**
 * Simple session test component
 * Add this to your page to see session storage in action
 */
export default function SessionTest() {
  const { authState } = useAuth();

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-4 z-50">
      <h3 className="font-semibold text-blue-800 mb-2">Session Test</h3>
      <div className="text-sm space-y-1">
        <div>
          Status: <span className="font-mono">{authState.isAuthenticated ? "🟢 Logged In" : "🔴 Logged Out"}</span>
        </div>
        <div>
          Storage: <span className="font-mono bg-blue-100 px-1 rounded">sessionStorage</span>
        </div>
        <div className="text-blue-600 text-xs mt-2">
          💡 Close browser tab to test auto-logout
        </div>
      </div>
    </div>
  );
}
