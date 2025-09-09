"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/auth.context";
import { CreateProfileRequest, Gender } from "@/types/api";
import { profilesService } from "@/services/profiles.service";
import { toast } from "sonner";

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose?: () => void;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function ProfileCompletionModal({
  isOpen,
  onClose,
  showButton = false,
  buttonText = "Complete Profile",
  onButtonClick,
}: ProfileCompletionModalProps) {
  const { user, refreshProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateProfileRequest>({
    firstName: "",
    lastName: "",
    contactNumber: "",
    address: "",
    birthDate: "",
    gender: Gender.MALE,
  });

  const handleInputChange = (
    field: keyof CreateProfileRequest,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Helper function to get redirect path based on user role
  const getRedirectPath = (role: string): string => {
    switch (role) {
      case "ADMIN":
        return "/admin-dashboard";
      case "TEACHER":
        return "/teacher-dashboard";
      case "STUDENT":
        return "/student-dashboard";
      default:
        return "/admin-dashboard"; // Default fallback
    }
  };

  // Handle skip button - allow user to continue without profile
  const handleSkip = () => {
    if (onClose) {
      onClose();
    }

    // Redirect to appropriate dashboard even without profile
    if (user?.role) {
      const redirectPath = getRedirectPath(user.role);
      console.log("⏭️ Profile skipped - redirecting to:", redirectPath);
      router.push(redirectPath);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.contactNumber ||
      !formData.address ||
      !formData.birthDate
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      // Create the profile
      await profilesService.createProfile(formData);

      // Try to refresh the profile in auth context
      try {
        await refreshProfile();
        toast.success("Profile created successfully!");

        // Close modal first
        if (onClose) {
          onClose();
        }

        // Redirect to appropriate dashboard based on user role
        if (user?.role) {
          const redirectPath = getRedirectPath(user.role);
          console.log("🚀 Profile completed - redirecting to:", redirectPath);
          router.push(redirectPath);
        }
      } catch (refreshError) {
        // If profile refresh fails (e.g., backend down), still show success
        // but with a note about potential sync issues
        console.warn(
          "Profile created but couldn't refresh auth context:",
          refreshError
        );
        toast.success(
          "Profile created successfully! Please refresh the page if needed."
        );

        // Still try to redirect even if refresh failed
        if (onClose) {
          onClose();
        }
        if (user?.role) {
          const redirectPath = getRedirectPath(user.role);
          router.push(redirectPath);
        }
      }
    } catch (error) {
      console.error("Failed to create profile:", error);
      toast.error("Failed to create profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen && !showButton) return null;

  return (
    <>
      {/* Redirect Button */}
      {showButton && !isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">Profile Setup Required</CardTitle>
              <CardDescription>
                Please complete your profile to continue using the system.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <Button
                onClick={onButtonClick}
                className="w-full sm:w-auto px-6 py-2"
                size="lg">
                {buttonText}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Profile Completion Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <Card className="w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-4">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">
                Complete Your Profile
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Before you can access the system, please complete your profile
                information. This information is required for all users.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      placeholder="Enter your first name"
                      required
                      disabled={loading}
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      placeholder="Enter your last name"
                      required
                      disabled={loading}
                      className="text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Phone Number *</Label>
                  <Input
                    id="contactNumber"
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) =>
                      handleInputChange("contactNumber", e.target.value)
                    }
                    placeholder="Enter your phone number"
                    required
                    disabled={loading}
                    className="text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Enter your address"
                    required
                    disabled={loading}
                    className="text-sm sm:text-base"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Date of Birth *</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) =>
                        handleInputChange("birthDate", e.target.value)
                      }
                      required
                      disabled={loading}
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        handleInputChange("gender", value as Gender)
                      }
                      disabled={loading}>
                      <SelectTrigger className="text-sm sm:text-base">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={Gender.MALE}>Male</SelectItem>
                        <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                        <SelectItem value={Gender.OTHER}>Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4 pb-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSkip}
                    disabled={loading}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base">
                    Skip for now
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base">
                    {loading ? "Creating Profile..." : "Complete Profile"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
