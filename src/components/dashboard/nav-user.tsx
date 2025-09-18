"use client";

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { profilesService } from "@/services/profiles.service";
import { Gender } from "@/types/api";
import { toast } from "sonner";

export function NavUser({
  user,
  asHeader = false,
}: {
  user: {
    name?: string;
    email?: string;
    avatar?: string;
  };
  asHeader?: boolean;
}) {
  const { isMobile } = useSidebar();
  const { logout, profile, refreshProfile } = useAuth();
  const router = useRouter();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    firstName: profile?.firstName || "",
    middleName: profile?.middleName || "",
    lastName: profile?.lastName || "",
    gender: (profile?.gender as Gender) || Gender.OTHER,
    birthDate: profile?.birthDate || "",
    contactNumber: profile?.contactNumber
      ? profile.contactNumber
          .replace(/^\+63/, "")
          .replace(/\s/g, "")
          .replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3")
      : "",
    address: profile?.address || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Validation function for required fields
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};

    // First name validation
    if (!profileFormData.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (profileFormData.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    }

    // Last name validation
    if (!profileFormData.lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (profileFormData.lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    }

    // Birth date validation
    if (!profileFormData.birthDate.trim()) {
      errors.birthDate = "Birth date is required";
    } else {
      const birthDate = new Date(profileFormData.birthDate);
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
    if (!profileFormData.contactNumber.trim()) {
      errors.contactNumber = "Contact number is required";
    } else {
      const cleanNumber = profileFormData.contactNumber.replace(/\s/g, "");
      if (!/^9\d{9}$/.test(cleanNumber)) {
        errors.contactNumber =
          "Please enter a valid Philippine mobile number (9XX XXX XXXX)";
      }
    }

    // Address validation
    if (!profileFormData.address.trim()) {
      errors.address = "Address is required";
    } else if (profileFormData.address.trim().length < 10) {
      errors.address = "Address must be at least 10 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [profileFormData]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      // Redirect to landing page after successful logout
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails on server, redirect to landing page
      router.push("/");
    }
  }, [logout, router]);

  const handleProfileClick = useCallback(async () => {
    setIsLoadingProfile(true);

    try {
      // Fetch fresh profile data from /api/profiles/me with JWT token
      const freshProfile = await profilesService.getMyProfile();

      // Set form data with fresh profile data
      setProfileFormData({
        firstName: freshProfile?.firstName || "",
        middleName: freshProfile?.middleName || "",
        lastName: freshProfile?.lastName || "",
        gender: (freshProfile?.gender as Gender) || Gender.OTHER,
        birthDate: freshProfile?.birthDate || "",
        contactNumber: freshProfile?.contactNumber
          ? freshProfile.contactNumber
              .replace(/^\+63/, "")
              .replace(/\s/g, "")
              .replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3")
          : "",
        address: freshProfile?.address || "",
      });
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
      // Fallback to cached profile data if API call fails
      setProfileFormData({
        firstName: profile?.firstName || "",
        middleName: profile?.middleName || "",
        lastName: profile?.lastName || "",
        gender: (profile?.gender as Gender) || Gender.OTHER,
        birthDate: profile?.birthDate || "",
        contactNumber: profile?.contactNumber
          ? profile.contactNumber
              .replace(/^\+63/, "")
              .replace(/\s/g, "")
              .replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3")
          : "",
        address: profile?.address || "",
      });
    } finally {
      setIsLoadingProfile(false);
      // Clear any previous validation errors when modal opens
      setValidationErrors({});
    }

    setIsProfileModalOpen(true);
  }, [profile]);
  const handleProfileSave = useCallback(async () => {
    // Validate form before saving
    if (!validateForm()) {
      toast.error("Please fix the validation errors before saving");
      return;
    }

    if (!profile?.id) {
      toast.error("No profile ID found");
      return;
    }

    try {
      setIsSaving(true);

      const updateData = {
        id: profile.id,
        ...profileFormData,
        // Ensure contact number is saved with +63 prefix
        contactNumber: profileFormData.contactNumber.startsWith("+63")
          ? profileFormData.contactNumber
          : `+63${profileFormData.contactNumber.replace(/\s/g, "")}`,
      };

      await profilesService.updateProfile(profile.id, updateData);
      console.log("Profile updated successfully");

      // Dispatch custom event for real-time updates
      window.dispatchEvent(
        new CustomEvent("profileUpdated", {
          detail: {
            profileId: profile.id,
            updatedData: updateData,
            timestamp: new Date().toISOString(),
          },
        })
      );

      // Refresh the profile in auth context to update UI
      await refreshProfile();

      // Clear validation errors and close modal
      setValidationErrors({});
      setIsProfileModalOpen(false);

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [profileFormData, profile, refreshProfile, validateForm]);

  const handleInputChange = useCallback(
    (field: string, value: string) => {
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

      setProfileFormData((prev) => ({
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
    },
    [validationErrors]
  );

  // Generate user initials from profile
  const getUserInitials = useCallback(() => {
    if (profile?.firstName && profile?.lastName) {
      return `${profile.firstName.charAt(0).toUpperCase()}${profile.lastName
        .charAt(0)
        .toUpperCase()}`;
    }
    // Fallback to email initials if no profile
    if (user?.email) {
      const emailParts = user.email.split("@")[0].split(".");
      if (emailParts.length >= 2) {
        return `${emailParts[0].charAt(0).toUpperCase()}${emailParts[1]
          .charAt(0)
          .toUpperCase()}`;
      }
      return user.email.charAt(0).toUpperCase();
    }
    return "U"; // Ultimate fallback
  }, [profile, user]);

  if (asHeader) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="User menu"
              className="inline-flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted/5 focus:outline-none focus:ring-0 focus-visible:ring-0">
              {/* Mobile: show only the dots icon */}
              <IconDotsVertical className="sm:hidden size-5" />

              {/* Desktop/web: show only avatar */}
              <span className="hidden sm:inline-flex items-center">
                <Avatar className="h-8 w-8 rounded-lg grayscale ring-0 border-0">
                  <AvatarFallback className="rounded-lg">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "bottom"}
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={handleProfileClick}
                disabled={isLoadingProfile}>
                <IconUserCircle />
                {isLoadingProfile ? "Loading..." : "Account"}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Modal for Header */}
        <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Update your profile information below.
              </DialogDescription>
            </DialogHeader>
            {isLoadingProfile ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-muted-foreground">
                  Loading profile data...
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName-header">First Name *</Label>
                      <Input
                        id="firstName-header"
                        value={profileFormData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        placeholder="Enter first name"
                        className={
                          validationErrors.firstName ? "border-red-500" : ""
                        }
                      />
                      {validationErrors.firstName && (
                        <p className="text-sm text-red-500">
                          {validationErrors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName-header">Last Name *</Label>
                      <Input
                        id="lastName-header"
                        value={profileFormData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        placeholder="Enter last name"
                        className={
                          validationErrors.lastName ? "border-red-500" : ""
                        }
                      />
                      {validationErrors.lastName && (
                        <p className="text-sm text-red-500">
                          {validationErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middleName-header">
                      Middle Name (Optional)
                    </Label>
                    <Input
                      id="middleName-header"
                      value={profileFormData.middleName}
                      onChange={(e) =>
                        handleInputChange("middleName", e.target.value)
                      }
                      placeholder="Enter middle name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="birthDate-header">Birth Date *</Label>
                      <Input
                        id="birthDate-header"
                        type="date"
                        value={profileFormData.birthDate}
                        onChange={(e) =>
                          handleInputChange("birthDate", e.target.value)
                        }
                        className={
                          validationErrors.birthDate ? "border-red-500" : ""
                        }
                      />
                      {validationErrors.birthDate && (
                        <p className="text-sm text-red-500">
                          {validationErrors.birthDate}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender-header">Gender</Label>
                      <select
                        id="gender-header"
                        value={profileFormData.gender}
                        onChange={(e) =>
                          handleInputChange("gender", e.target.value)
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value={Gender.MALE}>Male</option>
                        <option value={Gender.FEMALE}>Female</option>
                        <option value={Gender.OTHER}>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber-header">
                      Contact Number *
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                        +63
                      </span>
                      <Input
                        id="contactNumber-header"
                        value={profileFormData.contactNumber}
                        onChange={(e) =>
                          handleInputChange("contactNumber", e.target.value)
                        }
                        placeholder="9XX XXX XXXX"
                        className={`pl-12 ${
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
                  <div className="space-y-2">
                    <Label htmlFor="address-header">Address *</Label>
                    <Input
                      id="address-header"
                      value={profileFormData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      placeholder="Enter address"
                      className={
                        validationErrors.address ? "border-red-500" : ""
                      }
                    />
                    {validationErrors.address && (
                      <p className="text-sm text-red-500">
                        {validationErrors.address}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t border-border/50">
                  <Button
                    variant="outline"
                    onClick={() => setIsProfileModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleProfileSave} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground focus:outline-none focus:ring-0 focus-visible:ring-0 border-0">
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarFallback className="rounded-lg">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
                <IconDotsVertical className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={handleProfileClick}
                  disabled={isLoadingProfile}>
                  <IconUserCircle />
                  {isLoadingProfile ? "Loading..." : "Account"}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconCreditCard />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconNotification />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <IconLogout />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Profile Modal */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information below.
            </DialogDescription>
          </DialogHeader>
          {isLoadingProfile ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-muted-foreground">
                Loading profile data...
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={profileFormData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      placeholder="Enter first name"
                      className={
                        validationErrors.firstName ? "border-red-500" : ""
                      }
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
                      value={profileFormData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      placeholder="Enter last name"
                      className={
                        validationErrors.lastName ? "border-red-500" : ""
                      }
                    />
                    {validationErrors.lastName && (
                      <p className="text-sm text-red-500">
                        {validationErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name (Optional)</Label>
                  <Input
                    id="middleName"
                    value={profileFormData.middleName}
                    onChange={(e) =>
                      handleInputChange("middleName", e.target.value)
                    }
                    placeholder="Enter middle name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Birth Date *</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={profileFormData.birthDate}
                      onChange={(e) =>
                        handleInputChange("birthDate", e.target.value)
                      }
                      className={
                        validationErrors.birthDate ? "border-red-500" : ""
                      }
                    />
                    {validationErrors.birthDate && (
                      <p className="text-sm text-red-500">
                        {validationErrors.birthDate}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      value={profileFormData.gender}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value={Gender.MALE}>Male</option>
                      <option value={Gender.FEMALE}>Female</option>
                      <option value={Gender.OTHER}>Other</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                      +63
                    </span>
                    <Input
                      id="contactNumber"
                      value={profileFormData.contactNumber}
                      onChange={(e) =>
                        handleInputChange("contactNumber", e.target.value)
                      }
                      placeholder="9XX XXX XXXX"
                      className={`pl-12 ${
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
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={profileFormData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Enter address"
                    className={validationErrors.address ? "border-red-500" : ""}
                  />
                  {validationErrors.address && (
                    <p className="text-sm text-red-500">
                      {validationErrors.address}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t border-border/50">
                <Button
                  variant="outline"
                  onClick={() => setIsProfileModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleProfileSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
