"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Dumbbell,
  LayoutDashboard,
  Utensils,
  Scale,
  TrendingUp,
  Bot,
  Home,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/workouts", label: "Workouts", icon: Dumbbell },
  { href: "/nutrition", label: "Nutrition", icon: Utensils },
  { href: "/bmi", label: "BMI", icon: Scale },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/ai-agent", label: "AI Agent", icon: Bot },
];

export default function Navigation() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile drawer on route transition
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all">
      <nav className="nav flex items-center justify-between">
        {/* Brand Logo */}
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

        {/* Desktop Nav Links */}
        <div className="nav-links flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname?.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? "active" : ""}`}
              >
                <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          {/* Desktop Visible Log Out Action */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ml-2"
            style={{
              color: "#dc2626",
              backgroundColor: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
            title="Log out of session"
          >
            <LogOut size={15} strokeWidth={2.2} />
            <span>Log out</span>
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          className="nav-toggle"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="mobile-menu-drawer"
          style={{
            position: "fixed",
            top: "65px",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            padding: "1.5rem",
            gap: "0.75rem",
            zIndex: 99,
            overflowY: "auto",
            animation: "drawer-slide-down 0.25s ease-out",
          }}
        >
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname?.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl text-base font-medium transition-all ${
                  isActive ? "font-bold shadow-sm" : ""
                }`}
                style={{
                  backgroundColor: isActive
                    ? "var(--emerald-subtle)"
                    : "transparent",
                  color: isActive ? "var(--emerald)" : "var(--text-primary)",
                  border: isActive
                    ? "1px solid var(--emerald-muted)"
                    : "1px solid transparent",
                }}
              >
                <div
                  className="rounded-lg p-2"
                  style={{
                    backgroundColor: isActive
                      ? "var(--emerald)"
                      : "var(--bg-subtle)",
                    color: isActive ? "white" : "var(--text-secondary)",
                  }}
                >
                  <Icon size={18} strokeWidth={2} />
                </div>
                <span>{link.label}</span>
              </Link>
            );
          })}

          {/* Mobile Log Out Option */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-xl text-base font-medium transition-all mt-2 cursor-pointer"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.08)",
              color: "#dc2626",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              width: "100%",
              textAlign: "left",
            }}
          >
            <div
              className="rounded-lg p-2"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                color: "#dc2626",
              }}
            >
              <LogOut size={18} strokeWidth={2} />
            </div>
            <span>Log out</span>
          </button>
        </div>
      )}
    </header>
  );
}
