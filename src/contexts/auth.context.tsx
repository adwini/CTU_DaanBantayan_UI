"use client";

/**
 * Authentication Context Provider
 * Manages global authentication state and provides auth methods to the entire app
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

// Initial state
const getInitialState = (): AuthState => {
  // Try to restore state from localStorage if available
  if (typeof window !== "undefined") {
    try {
      const savedState = localStorage.getItem("auth_state");
      console.log("🔍 Restoring auth state from localStorage:", savedState);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        console.log("✅ Parsed saved state:", parsed);
        return {
          ...parsed,
          isLoading: true, // Always start with loading to verify auth
        };
      }
    } catch (error) {
      console.warn("Failed to restore auth state from localStorage:", error);
    }
  }

  console.log("🔄 Using default initial state");
  return {
    isAuthenticated: false,
    isLoading: true,
    user: null,
    profile: null,
    error: null,
  };
};

const initialState: AuthState = getInitialState();

// Action types
type AuthAction =
  | { type: "AUTH_START" }
  | {
      type: "AUTH_SUCCESS";
      payload: { user: UserResponse; profile: ProfileResponse | null };
    }
  | { type: "AUTH_FAILURE"; payload: string }
  | { type: "AUTH_LOGOUT" }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LOADING"; payload: boolean };

// Reducer function
function authReducer(state: AuthState, action: AuthAction): AuthState {
  let newState: AuthState;

  switch (action.type) {
    case "AUTH_START":
      newState = {
        ...state,
        isLoading: true,
        error: null,
      };
      break;

    case "AUTH_SUCCESS":
      newState = {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        profile: action.payload.profile,
        error: null,
      };
      break;

    case "AUTH_FAILURE":
      newState = {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        profile: null,
        error: action.payload,
      };
      break;

    case "AUTH_LOGOUT":
      newState = {
        isAuthenticated: false,
        isLoading: false,
        user: null,
        profile: null,
        error: null,
      };
      break;

    case "CLEAR_ERROR":
      newState = {
        ...state,
        error: null,
      };
      break;

    case "SET_LOADING":
      newState = {
        ...state,
        isLoading: action.payload,
      };
      break;

    default:
      newState = state;
  }

  // Save to localStorage (except during SSR)
  if (typeof window !== "undefined" && newState !== state) {
    try {
      if (newState.isAuthenticated) {
        const stateToSave = {
          isAuthenticated: newState.isAuthenticated,
          user: newState.user,
          profile: newState.profile,
          isLoading: false,
          error: null,
        };
        console.log("💾 Saving auth state to localStorage:", stateToSave);
        localStorage.setItem("auth_state", JSON.stringify(stateToSave));
      } else {
        console.log("🗑️ Removing auth state from localStorage");
        localStorage.removeItem("auth_state");
      }
    } catch (error) {
      console.warn("Failed to save auth state to localStorage:", error);
    }
  }

  return newState;
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

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check authentication status
  const checkAuthStatus = useCallback(async () => {
    try {
      console.log("🔍 Context: Starting auth check...");
      dispatch({ type: "AUTH_START" });

      // First try to get the profile (which includes user info)
      const authStatus = await authService.checkAuthStatus();
      console.log("📊 Context: Auth status response:", authStatus);

      if (authStatus.isAuthenticated && authStatus.user) {
        console.log(
          "✅ Context: User is authenticated, dispatching AUTH_SUCCESS"
        );
        dispatch({
          type: "AUTH_SUCCESS",
          payload: {
            user: authStatus.user,
            profile: authStatus.profile || null,
          },
        });
      } else {
        console.log("❌ Context: User not authenticated, clearing state");
        // Clear localStorage and set to logged out
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_state");
        }
        dispatch({ type: "AUTH_LOGOUT" });
      }
    } catch (error) {
      console.warn("❌ Context: Auth check failed:", error);
      // Clear localStorage and set to logged out
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_state");
      }
      dispatch({ type: "AUTH_LOGOUT" });
    }
  }, []);

  // Login function
  const login = useCallback(
    async (credentials: LoginRequest) => {
      try {
        dispatch({ type: "AUTH_START" });

        const loginResponse = await authService.login(credentials);

        // Try to get current user profile after successful login
        // Make this optional - some users (like admins) might not have profiles
        let profile: ProfileResponse | null = null;
        try {
          profile = await authService.getCurrentUser();
        } catch (profileError) {
          console.warn("Could not fetch user profile:", profileError);
          // Continue with login even if profile fetch fails
        }

        dispatch({
          type: "AUTH_SUCCESS",
          payload: {
            user: loginResponse.userResponse,
            profile: profile,
          },
        });

        // Check for redirect parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPath =
          urlParams.get("redirect") ||
          getRedirectPath(loginResponse.userResponse.role);

        router.push(redirectPath);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Login failed";
        dispatch({ type: "AUTH_FAILURE", payload: errorMessage });
        throw error;
      }
    },
    [router]
  );

  // Logout function
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_state");
      }
      dispatch({ type: "AUTH_LOGOUT" });
      router.push("/login");
    }
  }, [router]);

  // Refresh token function
  const refreshToken = useCallback(async () => {
    try {
      if (!authState.user?.id) {
        throw new Error("No user ID available for token refresh");
      }

      await authService.refreshToken(authState.user.id);

      // Re-fetch user data to ensure we have the latest information
      await getCurrentUser();
    } catch (error) {
      console.error("Token refresh failed:", error);
      dispatch({ type: "AUTH_LOGOUT" });
      router.push("/login");
    }
  }, [authState.user?.id, router]);

  // Get current user function
  const getCurrentUser = useCallback(async () => {
    try {
      const profile = await authService.getCurrentUser();
      dispatch({
        type: "AUTH_SUCCESS",
        payload: {
          user: profile.user,
          profile: profile,
        },
      });
    } catch (error) {
      console.error("Failed to get current user:", error);
      dispatch({ type: "AUTH_LOGOUT" });
      router.push("/login");
    }
  }, [router]);

  // Refresh profile function
  const refreshProfile = useCallback(async () => {
    try {
      const profile = await authService.getCurrentUser();
      dispatch({
        type: "AUTH_SUCCESS",
        payload: {
          user: authState.user || profile.user, // Use existing user or fallback to profile user
          profile: profile,
        },
      });
    } catch (error) {
      console.error("Failed to refresh profile:", error);
      // Don't logout on profile refresh failure, just log the error
    }
  }, [authState.user]);

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  // Computed properties
  const isAdmin = authState.user?.role === Role.ADMIN;
  const isTeacher = authState.user?.role === Role.TEACHER;
  const isStudent = authState.user?.role === Role.STUDENT;
  const isProfileComplete = authState.profile !== null;

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
      // Only redirect to login if we're definitely not loading and not authenticated
      if (!authState.isLoading && !authState.isAuthenticated) {
        const currentPath = window.location.pathname;
        const redirectUrl = `/login?redirect=${encodeURIComponent(
          currentPath
        )}`;
        router.push(redirectUrl);
      }
    }, [authState.isAuthenticated, authState.isLoading, router]);

    // Show loading spinner while checking authentication
    if (authState.isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <span className="ml-4 text-gray-600">Checking authentication...</span>
        </div>
      );
    }

    // Don't render anything if not authenticated (will redirect)
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
          router.push("/unauthorized");
        }
      }
    }, [authState, router]);

    if (authState.isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      );
    }

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

export default AuthProvider;
