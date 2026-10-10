"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface UserSession {
  name: string;
  email: string;
  loggedIn: boolean;
  joinedAt?: string;
}

interface AuthContextType {
  user: UserSession | null;
  isLoggedIn: boolean;
  isLoaded: boolean;
  login: (userData: UserSession) => void;
  logout: () => void;
}

export function hasActiveSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem("fithub_user");
    if (!stored) return false;
    const parsed = JSON.parse(stored);
    return !!parsed?.loggedIn;
  } catch {
    return false;
  }
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isLoaded: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  const syncAuth = useCallback(() => {
    try {
      const stored = localStorage.getItem("fithub_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.loggedIn) {
          setUser(parsed);
          return;
        }
      }
    } catch {
      // storage access fail
    }
    setUser(null);
  }, []);

  useEffect(() => {
    syncAuth();
    setIsLoaded(true);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "fithub_user" || e.key === null) {
        syncAuth();
      }
    };

    const handleCustomAuth = () => {
      syncAuth();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("fithub_auth_change", handleCustomAuth);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("fithub_auth_change", handleCustomAuth);
    };
  }, [syncAuth]);

  const login = useCallback((userData: UserSession) => {
    try {
      localStorage.setItem("fithub_user", JSON.stringify(userData));
    } catch {
      // storage quota
    }
    setUser(userData);
    window.dispatchEvent(new Event("fithub_auth_change"));
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem("fithub_user");
    } catch {
      // storage quota
    }
    setUser(null);
    window.dispatchEvent(new Event("fithub_auth_change"));
    router.replace("/");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user?.loggedIn,
        isLoaded,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
