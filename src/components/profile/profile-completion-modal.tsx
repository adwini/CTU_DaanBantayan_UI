"use client";

import React, { useState } from "react";
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
}

export default function ProfileCompletionModal({
  isOpen,
  onClose,
}: ProfileCompletionModalProps) {
  const { user, refreshProfile } = useAuth();
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

      // Refresh the profile in auth context
      await refreshProfile();

      toast.success("Profile created successfully!");

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Failed to create profile:", error);
      toast.error("Failed to create profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
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
                onChange={(e) => handleInputChange("address", e.target.value)}
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

            <div className="flex justify-end space-x-2 pt-4 pb-2">
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
  );
}
