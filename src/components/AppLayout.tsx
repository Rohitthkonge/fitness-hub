"use client";

import React, { useEffect, useState, useLayoutEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth, hasActiveSession } from "@/lib/auth";
import Navigation from "@/components/Navigation";
import SimpleHeader from "@/components/SimpleHeader";
import Footer from "@/components/Footer";

// All protected authenticated routes
const AUTH_ROUTES = [
  "/dashboard",
  "/workouts",
  "/nutrition",
  "/progress",
  "/ai-agent",
  "/profile",
];

function isAuthRoute(path: string | null): boolean {
  if (!path) return false;
  return AUTH_ROUTES.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, isLoaded } = useAuth();
  const [mounted, setMounted] = useState(false);

  const isProtected = isAuthRoute(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Synchronous client session check
  const hasClientSession = typeof window !== "undefined" ? hasActiveSession() : false;
  const userHasSession = mounted ? (isLoaded ? isLoggedIn : hasClientSession) : false;

  // ROUTE GUARD: Intercept unauthenticated access before browser paint
  useIsomorphicLayoutEffect(() => {
    if (isProtected) {
      const active = hasActiveSession();
      if (!active) {
        router.replace("/login");
      }
    }
  }, [pathname, isProtected, router]);

  // Handle browser back/forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      if (isAuthRoute(currentPath) && !hasActiveSession()) {
        router.replace("/login");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [router]);

  // Determine whether to show full nav:
  // - Authenticated routes: full nav only when simulated session exists.
  // - BMI routes (/bmi, /bmi-result): full nav when logged-in user opens it, otherwise public header.
  // - Public routes (/, /goals, /signup, /login): simple header only.
  const isBmiRoute = pathname === "/bmi" || pathname === "/bmi-result";
  const showFullNav = userHasSession && (isProtected || isBmiRoute);

  // ROUTE GUARD: If protected route and user has no active session,
  // do not render protected children so content never flashes.
  if (isProtected && (!mounted || !userHasSession)) {
    return (
      <div className="min-h-screen flex flex-col">
        <SimpleHeader />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"
              style={{
                borderColor: "var(--emerald)",
                borderTopColor: "transparent",
              }}
            />
            <p className="text-xs text-muted font-medium">Checking session...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {showFullNav ? <Navigation /> : <SimpleHeader />}
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </AuthProvider>
  );
}
