"use client";

import React, { useState, useCallback } from "react";
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
  const [addressComponents, setAddressComponents] = useState({
    barangay: "",
    cityMunicipality: "",
    province: "",
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  // Clear validation errors and address components when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setValidationErrors({});
      setAddressComponents({
        barangay: "",
        cityMunicipality: "",
        province: "",
      });
      setFormData((prev) => ({
        ...prev,
        address: "",
      }));
    }
  }, [isOpen]);

  const handleInputChange = (
    field: keyof CreateProfileRequest,
    value: string
  ) => {
    let processedValue = value;

    // Format contact number as user types
    if (field === "contactNumber") {
      // Remove all non-digits
      const digitsOnly = value.replace(/\D/g, "");

      // Only keep digits that would form a valid Philippine mobile number
      if (digitsOnly.length <= 10) {
        // Format as: 9XX XXX XXXX
        if (digitsOnly.length >= 4) {
          processedValue = digitsOnly.slice(0, 3) + " " + digitsOnly.slice(3);
        }
        if (digitsOnly.length >= 7) {
          processedValue =
            digitsOnly.slice(0, 3) +
            " " +
            digitsOnly.slice(3, 6) +
            " " +
            digitsOnly.slice(6);
        }
        if (digitsOnly.length < 4) {
          processedValue = digitsOnly;
        }
      } else {
        // Don't allow more than 10 digits
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAddressComponentChange = (
    field: keyof typeof addressComponents,
    value: string
  ) => {
    setAddressComponents((prev) => {
      const updated = { ...prev, [field]: value };

      // Concatenate address components into single address string
      const concatenatedAddress = [
        updated.barangay,
        updated.cityMunicipality,
        updated.province,
      ]
        .filter((part) => part.trim() !== "")
        .join(", ");

      // Update the main form data address field
      setFormData((formPrev) => ({
        ...formPrev,
        address: concatenatedAddress,
      }));

      return updated;
    });

    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validation function for required fields (same as NavUser)
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};

    // First name validation
    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    }

    // Birth date validation
    if (!formData.birthDate.trim()) {
      errors.birthDate = "Birth date is required";
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const minAge = new Date(
        today.getFullYear() - 100,
        today.getMonth(),
        today.getDate()
      );
      const maxAge = new Date(
        today.getFullYear() - 5,
        today.getMonth(),
        today.getDate()
      );

      if (birthDate > today) {
        errors.birthDate = "Birth date cannot be in the future";
      } else if (birthDate < minAge) {
        errors.birthDate = "Please enter a valid birth date";
      } else if (birthDate > maxAge) {
        errors.birthDate = "You must be at least 5 years old";
      }
    }

    // Contact number validation (Philippine format: +63 9XX XXX XXXX)
    if (!formData.contactNumber.trim()) {
      errors.contactNumber = "Contact number is required";
    } else {
      const cleanNumber = formData.contactNumber.replace(/\s/g, "");
      if (!/^9\d{9}$/.test(cleanNumber)) {
        errors.contactNumber =
          "Please enter a valid Philippine mobile number (9XX XXX XXXX)";
      }
    }

    // Address validation - validate each component
    if (!addressComponents.barangay.trim()) {
      errors.barangay = "Barangay is required";
    } else if (addressComponents.barangay.trim().length < 2) {
      errors.barangay = "Barangay must be at least 2 characters";
    }

    if (!addressComponents.cityMunicipality.trim()) {
      errors.cityMunicipality = "City/Municipality is required";
    } else if (addressComponents.cityMunicipality.trim().length < 2) {
      errors.cityMunicipality =
        "City/Municipality must be at least 2 characters";
    }

    if (!addressComponents.province.trim()) {
      errors.province = "Province is required";
    } else if (addressComponents.province.trim().length < 2) {
      errors.province = "Province must be at least 2 characters";
    }

    // Ensure concatenated address is valid
    if (!formData.address.trim()) {
      errors.address = "Complete address is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, addressComponents]);

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

    // Validate form before saving (same as NavUser)
    if (!validateForm()) {
      toast.error("Please fix the required fields before saving");
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
                      className={`text-sm sm:text-base ${
                        validationErrors.firstName ? "border-red-500" : ""
                      }`}
                    />
                    {validationErrors.firstName && (
                      <p className="text-sm text-red-500">
                        {validationErrors.firstName}
                      </p>
                    )}
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
                      className={`text-sm sm:text-base ${
                        validationErrors.lastName ? "border-red-500" : ""
                      }`}
                    />
                    {validationErrors.lastName && (
                      <p className="text-sm text-red-500">
                        {validationErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Phone Number *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                      +63
                    </span>
                    <Input
                      id="contactNumber"
                      type="tel"
                      value={formData.contactNumber}
                      onChange={(e) =>
                        handleInputChange("contactNumber", e.target.value)
                      }
                      placeholder="9XX XXX XXXX"
                      required
                      disabled={loading}
                      className={`text-sm sm:text-base pl-12 ${
                        validationErrors.contactNumber ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {validationErrors.contactNumber && (
                    <p className="text-sm text-red-500">
                      {validationErrors.contactNumber}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">Address *</Label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="barangay" className="text-sm">
                        Barangay *
                      </Label>
                      <Input
                        id="barangay"
                        type="text"
                        value={addressComponents.barangay}
                        onChange={(e) =>
                          handleAddressComponentChange(
                            "barangay",
                            e.target.value
                          )
                        }
                        placeholder="Enter barangay"
                        required
                        disabled={loading}
                        className={`text-sm sm:text-base ${
                          validationErrors.barangay ? "border-red-500" : ""
                        }`}
                      />
                      {validationErrors.barangay && (
                        <p className="text-xs text-red-500">
                          {validationErrors.barangay}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cityMunicipality" className="text-sm">
                        City/Municipality *
                      </Label>
                      <Input
                        id="cityMunicipality"
                        type="text"
                        value={addressComponents.cityMunicipality}
                        onChange={(e) =>
                          handleAddressComponentChange(
                            "cityMunicipality",
                            e.target.value
                          )
                        }
                        placeholder="Enter city/municipality"
                        required
                        disabled={loading}
                        className={`text-sm sm:text-base ${
                          validationErrors.cityMunicipality
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {validationErrors.cityMunicipality && (
                        <p className="text-xs text-red-500">
                          {validationErrors.cityMunicipality}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="province" className="text-sm">
                        Province *
                      </Label>
                      <Input
                        id="province"
                        type="text"
                        value={addressComponents.province}
                        onChange={(e) =>
                          handleAddressComponentChange(
                            "province",
                            e.target.value
                          )
                        }
                        placeholder="Enter province"
                        required
                        disabled={loading}
                        className={`text-sm sm:text-base ${
                          validationErrors.province ? "border-red-500" : ""
                        }`}
                      />
                      {validationErrors.province && (
                        <p className="text-xs text-red-500">
                          {validationErrors.province}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Display concatenated address */}
                  {formData.address && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-md border">
                      <Label className="text-xs text-muted-foreground mb-1 block">
                        Full Address:
                      </Label>
                      <p className="text-sm font-medium">{formData.address}</p>
                    </div>
                  )}

                  {validationErrors.address && (
                    <p className="text-sm text-red-500">
                      {validationErrors.address}
                    </p>
                  )}
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
                      className={`text-sm sm:text-base ${
                        validationErrors.birthDate ? "border-red-500" : ""
                      }`}
                    />
                    {validationErrors.birthDate && (
                      <p className="text-sm text-red-500">
                        {validationErrors.birthDate}
                      </p>
                    )}
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
