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
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  profile: null,
  error: null,
};

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
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "AUTH_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        profile: action.payload.profile,
        error: null,
      };

    case "AUTH_FAILURE":
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        profile: null,
        error: action.payload,
      };

    case "AUTH_LOGOUT":
      return {
        ...initialState,
        isLoading: false,
      };

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

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check authentication status
  const checkAuthStatus = useCallback(async () => {
    try {
      dispatch({ type: "AUTH_START" });
      const authStatus = await authService.checkAuthStatus();

      if (authStatus.isAuthenticated && authStatus.user && authStatus.profile) {
        dispatch({
          type: "AUTH_SUCCESS",
          payload: {
            user: authStatus.user,
            profile: authStatus.profile,
          },
        });
      } else {
        dispatch({ type: "AUTH_LOGOUT" });
      }
    } catch (error) {
      // Silently handle auth check failure - user is not authenticated
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

        // Redirect to dashboard based on role
        const redirectPath = getRedirectPath(loginResponse.userResponse.role);
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

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  // Computed properties
  const isAdmin = authState.user?.role === Role.ADMIN;
  const isTeacher = authState.user?.role === Role.TEACHER;
  const isStudent = authState.user?.role === Role.STUDENT;

  // Context value
  const contextValue: AuthContextType = {
    authState,
    login,
    logout,
    refreshToken,
    getCurrentUser,
    clearError,
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
        router.push("/login");
      }
    }, [authState.isAuthenticated, authState.isLoading, router]);

    if (authState.isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      );
    }

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
