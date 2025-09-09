"use client";

import React from "react";
import { useAuth } from "@/contexts/auth.context";
import { clearAllAuthData } from "@/contexts/auth.context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Debug component for auth state management
 * Only use this in development mode
 */
export default function AuthDebug() {
  const { authState, logout } = useAuth();

  const handleClearStorage = () => {
    clearAllAuthData();
    window.location.reload();
  };

  const checkStorage = () => {
    const localStorage_data = localStorage.getItem("ctu_auth_state");
    const sessionStorage_data = sessionStorage.getItem("ctu_auth_state");
    
    console.log("📦 localStorage:", localStorage_data ? JSON.parse(localStorage_data) : "empty");
    console.log("📦 sessionStorage:", sessionStorage_data ? JSON.parse(sessionStorage_data) : "empty");
  };

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-red-50 border-red-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-red-800">Auth Debug Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-xs text-gray-600">
          <div>Status: {authState.isAuthenticated ? "✅ Logged In" : "❌ Logged Out"}</div>
          <div>User: {authState.user?.email || "None"}</div>
          <div>Profile: {authState.profile?.firstName || "None"}</div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={checkStorage}
            className="text-xs"
          >
            Check Storage
          </Button>
          <Button 
            size="sm" 
            variant="destructive" 
            onClick={handleClearStorage}
            className="text-xs"
          >
            Clear All Data
          </Button>
          {authState.isAuthenticated && (
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={logout}
              className="text-xs"
            >
              Logout
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
