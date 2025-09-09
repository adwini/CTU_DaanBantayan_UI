"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth.context";
import ProfileCompletionModal from "./profile-completion-modal";

interface ProfileGuardProps {
  children: React.ReactNode;
}

/**
 * ProfileGuard component that ensures users have completed their profile
 * before they can access the application. Shows a modal that forces
 * profile completion if the user doesn't have a profile.
 */
export default function ProfileGuard({ children }: ProfileGuardProps) {
  const { user, profile, isProfileComplete, authState } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Only check for profile completion if user is authenticated and not loading
    if (authState.isAuthenticated && !authState.isLoading && user) {
      // If user is authenticated but has no profile, they need to complete it
      if (!isProfileComplete && profile === null) {
        console.log("📝 User needs to complete profile - showing modal");
        setShowModal(true);
        return;
      }

      // If profile exists and is complete, hide modal
      if (isProfileComplete && profile) {
        console.log("✅ Profile is complete - hiding modal");
        setShowModal(false);
        return;
      }
    }

    // If not authenticated or still loading, hide modal
    if (!authState.isAuthenticated || authState.isLoading) {
      setShowModal(false);
    }
  }, [
    authState.isAuthenticated,
    authState.isLoading,
    user,
    isProfileComplete,
    profile,
  ]);

  const handleModalClose = () => {
    // Don't allow closing the modal unless profile is complete
    if (isProfileComplete) {
      setShowModal(false);
    }
  };

  // Don't render children if profile is incomplete
  if (
    authState.isAuthenticated &&
    !authState.isLoading &&
    user &&
    !isProfileComplete
  ) {
    return (
      <>
        {/* Render a loading/blocking screen */}
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center max-w-md mx-auto">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Profile Setup Required
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Please complete your profile to continue using the system.
            </p>
          </div>
        </div>

        {/* Profile completion modal */}
        <ProfileCompletionModal isOpen={showModal} onClose={handleModalClose} />
      </>
    );
  }

  // Render children normally if profile is complete or user is not authenticated
  return (
    <>
      {children}

      {/* Profile completion modal for edge cases */}
      <ProfileCompletionModal isOpen={showModal} onClose={handleModalClose} />
    </>
  );
}
