"use client";

/**
 * Authentication Context Provider
 * Manages global authentication state and provides auth methods to the entire app
 *
 * Features:
 * - JWT cookie-based authentication
 * - Persistent state management
 * - Role-based access control
 * - Profile management integration
 * - Automatic token refresh
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import {
  AuthState,
  AuthContextType,
  LoginRequest,
  UserResponse,
  ProfileResponse,
  Role,
} from "@/types/auth";
import { PageLoading } from "@/components/utils";

// Storage key for persisting auth state
const AUTH_STORAGE_KEY = "ctu_auth_state";

// Initial state - always return consistent state for SSR
const getInitialState = (): AuthState => {
  return {
    isAuthenticated: false,
    isLoading: true,
    user: null,
    profile: null,
    error: null,
  };
};

const initialState: AuthState = getInitialState();

// Action types for auth state management
type AuthAction =
  | { type: "INIT_AUTH" }
  | { type: "LOGIN_START" }
  | {
      type: "LOGIN_SUCCESS";
      payload: { user: UserResponse; profile: ProfileResponse | null };
    }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "PROFILE_UPDATE"; payload: ProfileResponse }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "RESTORE_FROM_STORAGE"; payload: Partial<AuthState> };

// Reducer function with improved state management
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "INIT_AUTH":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "LOGIN_SUCCESS":
      const newState = {
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        profile: action.payload.profile,
        error: null,
      };

      // Persist to localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({
              isAuthenticated: true,
              user: action.payload.user,
              profile: action.payload.profile,
            })
          );
        } catch (error) {
          console.warn("Failed to persist auth state:", error);
        }
      }

      return newState;

    case "LOGIN_FAILURE":
      // Clear storage on login failure
      if (typeof window !== "undefined") {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }

      return {
        isAuthenticated: false,
        isLoading: false,
        user: null,
        profile: null,
        error: action.payload,
      };

    case "LOGOUT":
      // Clear storage on logout
      if (typeof window !== "undefined") {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }

      return {
        isAuthenticated: false,
        isLoading: false,
        user: null,
        profile: null,
        error: null,
      };

    case "PROFILE_UPDATE":
      const updatedState = {
        ...state,
        profile: action.payload,
      };

      // Update storage with new profile
      if (typeof window !== "undefined" && state.isAuthenticated) {
        try {
          localStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({
              isAuthenticated: true,
              user: state.user,
              profile: action.payload,
            })
          );
        } catch (error) {
          console.warn("Failed to persist profile update:", error);
        }
      }

      return updatedState;

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "RESTORE_FROM_STORAGE":
      return {
        ...state,
        ...action.payload,
        isLoading: true, // Keep loading true until auth verification
      };

    default:
      return state;
  }
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component props
interface AuthProviderProps {
  children: React.ReactNode;
}

// Provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  // Initialize auth state on component mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Initialize authentication state
  const initializeAuth = useCallback(async () => {
    dispatch({ type: "INIT_AUTH" });

    // Restore from localStorage if available (client-side only)
    if (typeof window !== "undefined") {
      try {
        const savedState = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedState) {
          const parsed = JSON.parse(savedState);
          console.log("🔄 Restoring auth state from localStorage:", parsed);

          // If we have valid cached auth data, use it immediately
          if (parsed.isAuthenticated && parsed.user) {
            console.log("✅ Using cached auth state without verification");
            dispatch({
              type: "LOGIN_SUCCESS",
              payload: {
                user: parsed.user,
                profile: parsed.profile || null,
              },
            });
            return;
          }
        }
      } catch (error) {
        console.warn("Failed to restore auth state from localStorage:", error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }

    // If no cached data, just finish loading without auth verification
    // Let the app show the landing page or redirect to login naturally
    dispatch({ type: "SET_LOADING", payload: false });
  }, []);

  // Login function
  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        dispatch({ type: "LOGIN_START" });

        console.log("🔐 Starting login process...");
        const loginResponse = await authService.login(credentials);
        console.log("✅ Login successful:", loginResponse);

        // Try to get current user profile from /api/profiles/me after successful login
        let profile: ProfileResponse | null = null;
        let needsProfileCompletion = false;

        try {
          console.log("📱 Fetching user profile from /api/profiles/me...");
          profile = await authService.getCurrentUser();
          console.log("📱 Profile fetched successfully:", profile);
        } catch (profileError) {
          console.warn(
            "⚠️ Could not fetch user profile - user may need to complete profile:",
            profileError
          );
          // If profile doesn't exist (404), mark for completion
          needsProfileCompletion = true;
        }

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: loginResponse.userResponse,
            profile: profile,
          },
        });

        // If profile is missing, don't redirect yet - let ProfileGuard handle it
        if (needsProfileCompletion) {
          console.log(
            "📝 Profile completion required - staying on current page"
          );
          return; // Don't redirect, let ProfileGuard show completion modal
        }

        // Determine redirect path only if profile exists
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPath =
          urlParams.get("redirect") ||
          getRedirectPath(loginResponse.userResponse.role);

        console.log("🚀 Redirecting to:", redirectPath);
        router.push(redirectPath);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Login failed";
        console.error("❌ Login failed:", errorMessage);
        dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
        throw error;
      }
    },
    [router]
  );

  // Logout function
  const logout = useCallback(async () => {
    try {
      console.log("🚪 Starting logout process...");
      await authService.logout();
      console.log("✅ Logout successful");
    } catch (error) {
      console.error("❌ Logout error:", error);
    } finally {
      dispatch({ type: "LOGOUT" });
      router.push("/login");
    }
  }, [router]);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      if (!authState.user?.id) {
        throw new Error("No user ID available for token refresh");
      }

      console.log("🔄 Refreshing token...");
      await authService.refreshToken(authState.user.id);
      console.log("✅ Token refresh successful");
    } catch (error) {
      console.error("❌ Token refresh failed:", error);
      dispatch({ type: "LOGOUT" });
    }
  }, [authState.user?.id]);

  // Get current user function - only call when explicitly needed
  const getCurrentUser = useCallback(async () => {
    try {
      console.log("👤 Fetching current user...");
      const profile = await authService.getCurrentUser();
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: profile.user,
          profile: profile,
        },
      });
    } catch (error) {
      console.error("❌ Failed to get current user:", error);
      // Don't logout automatically, let user decide
      throw error;
    }
  }, []);

  // Refresh profile function - only call when explicitly needed
  const refreshProfile = useCallback(async () => {
    try {
      console.log("🔄 Refreshing profile...");
      const profile = await authService.getCurrentUser();
      dispatch({
        type: "PROFILE_UPDATE",
        payload: profile,
      });
    } catch (error) {
      console.error("❌ Failed to refresh profile:", error);
      // Don't logout on profile refresh failure, just log the error
    }
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  // Computed properties
  const isAdmin = authState.user?.role === Role.ADMIN;
  const isTeacher = authState.user?.role === Role.TEACHER;
  const isStudent = authState.user?.role === Role.STUDENT;
  const isProfileComplete = Boolean(
    authState.profile?.firstName && authState.profile?.lastName
  );
  const hasValidSession = authState.isAuthenticated && Boolean(authState.user);

  // Context value
  const contextValue: AuthContextType = {
    authState,
    login,
    logout,
    refreshToken,
    getCurrentUser,
    refreshProfile,
    clearError,
    user: authState.user,
    profile: authState.profile,
    isProfileComplete,
    isAdmin,
    isTeacher,
    isStudent,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Helper function to determine redirect path based on role
function getRedirectPath(role: Role): string {
  switch (role) {
    case Role.ADMIN:
      return "/admin-dashboard";
    case Role.TEACHER:
      return "/teacher-dashboard";
    case Role.STUDENT:
      return "/student-dashboard";
    default:
      return "/dashboard";
  }
}

// HOC for components that require authentication
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    const { authState } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!authState.isLoading && !authState.isAuthenticated) {
        const currentPath = window.location.pathname + window.location.search;
        const redirectUrl = `/login?redirect=${encodeURIComponent(
          currentPath
        )}`;
        console.log("🔒 Not authenticated, redirecting to:", redirectUrl);
        router.push(redirectUrl);
      }
    }, [authState.isAuthenticated, authState.isLoading, router]);

    // Show loading spinner while checking authentication
    if (authState.isLoading) {
      return <PageLoading text="Verifying authentication..." />;
    }

    // Don't render component if not authenticated
    if (!authState.isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}

// HOC for components that require specific roles
export function withRole<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles: Role[]
): React.ComponentType<P> {
  return function RoleProtectedComponent(props: P) {
    const { authState } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!authState.isLoading && authState.isAuthenticated) {
        if (!authState.user || !requiredRoles.includes(authState.user.role)) {
          console.log(
            "🚫 Access denied. User role:",
            authState.user?.role,
            "Required:",
            requiredRoles
          );
          router.push("/unauthorized");
        }
      }
    }, [authState, router]);

    // Show loading spinner while checking roles
    if (authState.isLoading) {
      return <PageLoading text="Checking permissions..." />;
    }

    // Don't render if not authenticated or wrong role
    if (
      !authState.isAuthenticated ||
      !authState.user ||
      !requiredRoles.includes(authState.user.role)
    ) {
      return null;
    }

    return <Component {...props} />;
  };
}

// HOC for components that require a complete profile
export function withProfile<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function ProfileRequiredComponent(props: P) {
    const { authState, isProfileComplete } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (
        !authState.isLoading &&
        authState.isAuthenticated &&
        !isProfileComplete
      ) {
        console.log("📝 Profile incomplete, redirecting to profile setup");
        router.push("/profile-setup");
      }
    }, [
      authState.isAuthenticated,
      authState.isLoading,
      isProfileComplete,
      router,
    ]);

    // Show loading spinner while checking profile
    if (authState.isLoading) {
      return <PageLoading text="Loading profile..." />;
    }

    // Don't render if profile is not complete
    if (!authState.isAuthenticated || !isProfileComplete) {
      return null;
    }

    return <Component {...props} />;
  };
}

export default AuthProvider;
