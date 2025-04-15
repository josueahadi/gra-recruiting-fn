import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "@/types/auth";
import { cleanToken } from "@/lib/utils/auth-utils";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber?: string;
  isEmailVerified: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
  decodedToken: DecodedToken | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number; // Timestamp to track state freshness
  
  // Actions
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string) => void;
  clearError: () => void;
  logout: () => void;
  initializeAuth: () => void;
}

// Create a storage object that uses localStorage but also syncs with cookies
const createSyncedStorage = () => {
  if (typeof localStorage === 'undefined' || typeof document === 'undefined') {
    // Return a no-op storage for SSR
    return {
      getItem: () => Promise.resolve(null),
      setItem: () => Promise.resolve(),
      removeItem: () => Promise.resolve()
    };
  }

  return {
    getItem: async (name: string) => {
      const str = localStorage.getItem(name);
      return str ? JSON.parse(str) : null;
    },
    
    setItem: async (name: string, value: unknown) => {
      const stringValue = JSON.stringify(value);
      localStorage.setItem(name, stringValue);
      
      // Also set a synchronization cookie with minimal auth info for server middleware
      try {
        // @ts-ignore - We know value has the shape we expect
        if (value?.state?.token) {
          // Set a simpler cookie with just the token for server middleware
          // @ts-ignore - We know we can access this property
          document.cookie = `auth-token=${value.state.token}; path=/; max-age=2592000; SameSite=Lax`;
        } else {
          // Clear the cookie if no token
          document.cookie = 'auth-token=; path=/; max-age=0';
        }
      } catch (e) {
        console.error('[Auth Store] Error syncing with cookies:', e);
      }
    },
    
    removeItem: async (name: string) => {
      localStorage.removeItem(name);
      // Clear the cookie
      document.cookie = 'auth-token=; path=/; max-age=0';
    }
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      decodedToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      lastUpdated: Date.now(),

      initializeAuth: () => {
        const { token, lastUpdated } = get();
        
        // Only initialize if token exists and state is at least 1 second old
        // This prevents constant re-initialization during navigation
        const now = Date.now();
        if (token && (now - lastUpdated > 1000)) {
          console.log("[Auth Store] Initializing auth state from token");
          try {
            const cleanedToken = cleanToken(token);
            const decodedToken = jwtDecode<DecodedToken>(cleanedToken);
            
            set({
              token: cleanedToken,
              isAuthenticated: true,
              decodedToken,
              error: null,
              lastUpdated: now
            });
          } catch (error) {
            console.error("[Auth Store] Failed to initialize auth:", error);
            set({
              token: null,
              user: null,
              decodedToken: null,
              isAuthenticated: false,
              error: "Session invalid. Please login again.",
              lastUpdated: now
            });
          }
        }
      },

      setToken: (token: string) => {
        if (!token) {
          set({ error: "Invalid token received" });
          return;
        }

        try {
          const cleanedToken = cleanToken(token);
          const decodedToken = jwtDecode<DecodedToken>(cleanedToken);
          
          set({
            token: cleanedToken,
            decodedToken,
            isAuthenticated: true,
            error: null,
            lastUpdated: Date.now()
          });
          
          // Initialize a basic user if none exists
          const { user } = get();
          if (!user && decodedToken) {
            set({
              user: {
                id: decodedToken.id.toString(),
                firstName: "User",
                lastName: "",
                email: "",
                role: decodedToken.role,
                isEmailVerified: false
              }
            });
          }
        } catch (error) {
          console.error("[Auth Store] Error decoding token:", error);
          set({
            decodedToken: null,
            error: "Error processing authentication token",
            lastUpdated: Date.now()
          });
        }
      },

      setUser: (user: User) => {
        set({ 
          user,
          error: null,
          lastUpdated: Date.now()
        });
      },

      setLoading: (isLoading: boolean) => {
        set({ 
          isLoading,
          ...(isLoading ? { error: null } : {}),
          lastUpdated: Date.now()
        });
      },

      setError: (error: string) => {
        set({ 
          error,
          isLoading: false,
          lastUpdated: Date.now()
        });
      },

      clearError: () => {
        set({ 
          error: null,
          lastUpdated: Date.now()
        });
      },

      logout: () => {
        console.log("[Auth Store] User logged out, auth state reset");
        set({
          token: null,
          user: null,
          decodedToken: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
          lastUpdated: Date.now()
        });
      }
    }),
    {
      name: 'gra-auth',
      storage: createSyncedStorage(),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        decodedToken: state.decodedToken,
      }),
    }
  )
); 