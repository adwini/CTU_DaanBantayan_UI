"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
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
import { useAuth } from "@/contexts/auth.context";
import { LoginFormData } from "@/types/auth";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login, authState } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // Check if user is already authenticated and redirect
  useEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      const redirectPath = searchParams.get("redirect") || "/admin-dashboard";
      router.push(redirectPath);
    }
  }, [authState.isAuthenticated, authState.isLoading, router, searchParams]);

  // Don't render the form if user is already authenticated
  if (authState.isAuthenticated && !authState.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">
          Redirecting to dashboard...
        </p>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || authState.isLoading) {
      return;
    }

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
      // If we reach here, login was successful and user will be redirected
    } catch (error) {
      // Error is handled by the auth context and displayed in the UI
      console.error("Login failed:", error);
      // The auth context will set the error state, which will be displayed in the form
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email and password to access the CTU system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                {/* Global Error Display */}
                {authState.error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-700">
                      {authState.error}
                    </span>
                  </div>
                )}

                {/* Email Field */}
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="student@ctu.edu.ph"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={fieldErrors.email ? "border-red-500" : ""}
                    required
                    disabled={authState.isLoading}
                  />
                  {fieldErrors.email && (
                    <span className="text-sm text-red-500">
                      {fieldErrors.email}
                    </span>
                  )}
                </div>

                {/* Password Field */}
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-muted-foreground">
                      Forgot your password?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={
                        fieldErrors.password ? "border-red-500 pr-10" : "pr-10"
                      }
                      required
                      disabled={authState.isLoading}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      disabled={authState.isLoading}>
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <span className="text-sm text-red-500">
                      {fieldErrors.password}
                    </span>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={authState.isLoading}>
                    {authState.isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </div>
              </div>

              {/* Demo Credentials for Testing */}
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Demo Credentials:
                </h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Admin: admin@admin.com / admin123</div>
                  {/* <div>Teacher: teacher@ctu.edu.ph / password123</div>
                  <div>Student: student@ctu.edu.ph / password123</div> */}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
