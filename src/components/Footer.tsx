"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Heart, Shield, Sparkles, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/lib/auth";

const AUTH_ROUTES = [
  "/dashboard",
  "/workouts",
  "/nutrition",
  "/progress",
  "/ai-agent",
  "/profile",
];

export default function Footer() {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();

  const isAuthPage = AUTH_ROUTES.some(
    (route) => pathname === route || pathname?.startsWith(`${route}/`)
  );
  const showAppLinks = isLoggedIn && isAuthPage;

  return (
    <footer
      className="footer mt-auto"
      style={{
        backgroundColor: "var(--bg-card)",
        borderTop: "1px solid var(--border)",
        paddingTop: "3.5rem",
        paddingBottom: "2rem",
      }}
    >
      <div
        className="page-container"
        style={{
          paddingTop: 0,
          paddingBottom: 0,
          display: "flex",
          flexDirection: "column",
          gap: "2.5rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "2.5rem",
          }}
        >
          {/* Brand Info */}
          <div className="flex flex-col gap-sm">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div
                className="flex items-center justify-center rounded-xl p-2 transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: "var(--emerald-subtle)",
                  color: "var(--emerald)",
                }}
              >
                <Dumbbell size={20} strokeWidth={2.5} />
              </div>
              <span className="font-extrabold text-lg tracking-tight">
                FITNESS <span style={{ color: "var(--emerald)" }}>HUB</span>
              </span>
            </Link>
            <p className="text-sm text-muted" style={{ lineHeight: 1.6, maxWidth: "300px" }}>
              Your intelligent fitness, nutrition, and recovery companion engineered
              to help you reach your goals with clarity and consistency.
            </p>
            <div className="flex items-center gap-2 mt-xs text-xs font-semibold" style={{ color: "var(--emerald)" }}>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>AI Engine Operational</span>
            </div>
          </div>

          {/* Quick Navigation: Conditioned on Auth / Public Page */}
          <div>
            <h4 className="font-bold text-sm mb-md" style={{ color: "var(--text-primary)" }}>
              Explore Platform
            </h4>
            <ul className="flex flex-col gap-xs text-sm text-muted">
              {showAppLinks ? (
                <>
                  <li>
                    <Link href="/dashboard" className="hover:text-emerald transition-colors flex items-center gap-1">
                      Dashboard <ArrowUpRight size={14} opacity={0.6} />
                    </Link>
                  </li>
                  <li>
                    <Link href="/workouts" className="hover:text-emerald transition-colors flex items-center gap-1">
                      Smart Workouts <ArrowUpRight size={14} opacity={0.6} />
                    </Link>
                  </li>
                  <li>
                    <Link href="/nutrition" className="hover:text-emerald transition-colors flex items-center gap-1">
                      Nutrition Guide <ArrowUpRight size={14} opacity={0.6} />
                    </Link>
                  </li>
                  <li>
                    <Link href="/bmi" className="hover:text-emerald transition-colors flex items-center gap-1">
                      BMI Calculator <ArrowUpRight size={14} opacity={0.6} />
                    </Link>
                  </li>
                  <li>
                    <Link href="/progress" className="hover:text-emerald transition-colors flex items-center gap-1">
                      Progress Analytics <ArrowUpRight size={14} opacity={0.6} />
                    </Link>
                  </li>
                  <li>
                    <Link href="/ai-agent" className="hover:text-emerald transition-colors flex items-center gap-1">
                      AI Agent <ArrowUpRight size={14} opacity={0.6} />
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/" className="hover:text-emerald transition-colors flex items-center gap-1">
                      Home <ArrowUpRight size={14} opacity={0.6} />
                    </Link>
                  </li>
                  <li>
                    <Link href="/goals" className="hover:text-emerald transition-colors flex items-center gap-1">
                      Choose Your Goal <ArrowUpRight size={14} opacity={0.6} />
                    </Link>
                  </li>
                  <li>
                    <Link href="/bmi" className="hover:text-emerald transition-colors flex items-center gap-1">
                      BMI Calculator <ArrowUpRight size={14} opacity={0.6} />
                    </Link>
                  </li>
                  <li>
                    <Link href="/login" className="hover:text-emerald transition-colors flex items-center gap-1">
                      Log In <ArrowUpRight size={14} opacity={0.6} />
                    </Link>
                  </li>
                  <li>
                    <Link href="/signup" className="hover:text-emerald transition-colors flex items-center gap-1">
                      Sign Up <ArrowUpRight size={14} opacity={0.6} />
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Features Highlights */}
          <div>
            <h4 className="font-bold text-sm mb-md" style={{ color: "var(--text-primary)" }}>
              Core Features
            </h4>
            <ul className="flex flex-col gap-xs text-sm text-muted">
              <li className="flex items-center gap-2">
                <Sparkles size={14} style={{ color: "var(--emerald)" }} />
                <span>AI-Powered Routine Generator</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield size={14} style={{ color: "var(--emerald)" }} />
                <span>Interactive Workout Timer</span>
              </li>
              <li className="flex items-center gap-2">
                <Heart size={14} style={{ color: "var(--emerald)" }} />
                <span>Calorie & Macro Tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <Dumbbell size={14} style={{ color: "var(--emerald)" }} />
                <span>Strength & PR Records</span>
              </li>
            </ul>
          </div>

          {/* Health Disclaimer */}
          <div>
            <h4 className="font-bold text-sm mb-md" style={{ color: "var(--text-primary)" }}>
              Health & Wellness
            </h4>
            <p className="text-xs text-muted" style={{ lineHeight: 1.6 }}>
              All recommendations, metrics, and insights provided by Fitness Hub are for educational and lifestyle optimization purposes. Always consult a certified physician before starting new high-intensity routines.
            </p>
          </div>
        </div>

        {/* Divider & Sub-footer */}
        <div
          className="flex flex-col sm:flex-row justify-between items-center pt-md gap-sm text-xs text-muted"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <p>&copy; 2026 FITNESS HUB. Designed for a healthier you.</p>
          <div className="flex items-center gap-md">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span className="flex items-center gap-1" style={{ color: "var(--emerald)" }}>
              Made with <Heart size={12} fill="currentColor" /> for fitness
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
