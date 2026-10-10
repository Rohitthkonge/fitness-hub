"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Dumbbell, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please fill in your email and password.");
      return;
    }

    const userName = email.split("@")[0] || "Athlete";
    const userSession = {
      name: userName.charAt(0).toUpperCase() + userName.slice(1),
      email: email.trim(),
      loggedIn: true,
      joinedAt: "Member",
    };

    // Save session and update auth context
    login(userSession);

    // Navigate to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="auth-split-wrapper">
      {/* LEFT PANEL (~55% on Desktop): Emerald gradient with hero image & tagline */}
      <div className="auth-split-left">
        {/* Hero fitness image background with overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Image
            src="/hero-illustration.jpg"
            alt="FITNESS HUB Athlete Runner"
            fill
            priority
            sizes="55vw"
            style={{ objectFit: "cover" }}
          />
          {/* Emerald Gradient Overlay for text contrast */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(6, 78, 59, 0.90) 0%, rgba(4, 120, 87, 0.85) 50%, rgba(2, 44, 34, 0.94) 100%)",
            }}
          />
        </div>

        {/* Brand header on left */}
        <div style={{ position: "relative", zIndex: 10 }}>
          <Link href="/" className="inline-flex items-center gap-2 group w-fit">
            <div
              className="flex items-center justify-center rounded-xl p-2 transition-transform group-hover:scale-105"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
                backdropFilter: "blur(8px)",
              }}
            >
              <Dumbbell size={22} strokeWidth={2.5} />
            </div>
            <span className="font-extrabold tracking-tight text-xl text-white">
              FITNESS <span style={{ color: "#A7F3D0" }}>HUB</span>
            </span>
          </Link>
        </div>

        {/* Center/Bottom Tagline Content */}
        <div style={{ position: "relative", zIndex: 10, maxWidth: "520px" }}>
          <h2
            className="font-heading font-extrabold text-white text-3xl xl:text-4xl tracking-tight"
            style={{ lineHeight: 1.18, marginBottom: "0.75rem" }}
          >
            Your fitness journey, personalized.
          </h2>
          <p
            className="text-base text-emerald-100 font-medium"
            style={{ opacity: 0.95, lineHeight: 1.5 }}
          >
            Log in to continue your plan.
          </p>
        </div>

        {/* Bottom copyright notice */}
        <div style={{ position: "relative", zIndex: 10 }}>
          <p className="text-xs text-white/60">
            &copy; 2026 FITNESS HUB. Intelligent fitness for everyone.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL (~45% on Desktop): Centered Form */}
      <div className="auth-split-right">
        {/* Mobile Header Banner (shown only on mobile) */}
        <div className="auth-mobile-banner">
          <Dumbbell size={14} />
          <span>FITNESS HUB • Your AI Fitness Companion</span>
        </div>

        <div className="auth-form-container">
          {/* FITNESS HUB logo centered at top (no green strip behind it) */}
          <div className="flex flex-col items-center mb-6 text-center">
            <Link href="/" className="inline-flex items-center gap-2 group mb-3">
              <div
                className="flex items-center justify-center rounded-xl p-2 transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: "var(--emerald-subtle)",
                  color: "var(--emerald)",
                }}
              >
                <Dumbbell size={22} strokeWidth={2.5} />
              </div>
              <span className="font-extrabold tracking-tight text-xl" style={{ color: "var(--text-primary)" }}>
                FITNESS <span style={{ color: "var(--emerald)" }}>HUB</span>
              </span>
            </Link>

            <h1 className="heading-xl font-extrabold tracking-tight mt-1 mb-1">
              Welcome Back
            </h1>
            <p className="text-xs text-muted">
              Enter your details to access your account.
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div
              className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-semibold"
              style={{ border: "1px solid #fee2e2" }}
            >
              {errorMsg}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--text-primary)" }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="auth-input-control"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--text-primary)" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="auth-input-control"
                  style={{ paddingRight: "2.75rem" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.25rem",
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-btn-primary mt-2"
            >
              <span>Log In</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Thin Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "1.5rem 0",
              gap: "1rem",
            }}
          >
            <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border)" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 500 }}>
              or
            </span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border)" }} />
          </div>

          {/* Secondary Outlined Button */}
          <Link
            href="/signup"
            className="auth-btn-secondary"
          >
            Create new account
          </Link>

          {/* Small Note */}
          <div
            className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted"
            style={{ color: "var(--text-tertiary)" }}
          >
            <ShieldCheck size={13} style={{ color: "var(--emerald)" }} />
            <span>Simulated session for demo.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
