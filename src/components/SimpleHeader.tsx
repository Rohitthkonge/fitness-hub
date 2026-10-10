"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Dumbbell, ArrowRight } from "lucide-react";
import { useAuth, hasActiveSession } from "@/lib/auth";

export default function SimpleHeader() {
  const pathname = usePathname();
  const { isLoggedIn, isLoaded } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine whether an active session exists
  const hasSession = mounted ? (isLoaded ? isLoggedIn : hasActiveSession()) : false;

  return (
    <header className="sticky top-0 z-50 w-full transition-all">
      <nav className="nav flex items-center justify-between">
        {/* Brand logo on the left */}
        <Link href="/" className="nav-brand flex items-center gap-2 group">
          <div
            className="flex items-center justify-center rounded-xl p-2 transition-transform group-hover:scale-105"
            style={{
              backgroundColor: "var(--emerald-subtle)",
              color: "var(--emerald)",
            }}
          >
            <Dumbbell size={22} strokeWidth={2.5} />
          </div>
          <span className="font-extrabold tracking-tight text-lg">
            FITNESS <span style={{ color: "var(--emerald)" }}>HUB</span>
          </span>
        </Link>

        {/* On "/" only:
            - No session: show "Log in" (links to /login).
            - Session exists: show "Dashboard" (links to /dashboard).
            On other public pages, show no nav links. */}
        {pathname === "/" && (
          <div>
            {hasSession ? (
              <Link
                href="/dashboard"
                className="btn btn-outline btn-sm text-xs font-semibold inline-flex items-center gap-1.5"
                style={{
                  padding: "0.4rem 0.9rem",
                  borderColor: "var(--emerald-muted)",
                  color: "var(--emerald-dark)",
                  backgroundColor: "var(--emerald-subtle)",
                }}
              >
                <span>Dashboard</span>
                <ArrowRight size={14} />
              </Link>
            ) : (
              <Link
                href="/login"
                className="btn btn-outline btn-sm text-xs font-semibold inline-flex items-center gap-1"
                style={{
                  padding: "0.4rem 0.9rem",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              >
                <span>Log in</span>
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
