import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import AnimatedCounter from "@/components/AnimatedCounter";
import {
  Dumbbell,
  Scale,
  Utensils,
  TrendingUp,
  Bot,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Quote,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Home — FITNESS HUB",
  description:
    "Transform your fitness journey with personalized AI workouts, precision nutrition plans, and intelligent progress tracking.",
};

export default function HomePage() {
  return (
    <main className="page-container mt-md mb-xl">
      <div className="bento-grid">
        {/* 1. Hero Card with Dual User Journey Paths */}
        <div
          className="bento-card card-emerald span-2 span-row-2 flex flex-col justify-between overflow-hidden relative"
          style={{
            background:
              "linear-gradient(135deg, #059669 0%, #047857 50%, #065F46 100%)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          {/* Subtle background glow */}
          <div
            style={{
              position: "absolute",
              top: "-20%",
              right: "-10%",
              width: "300px",
              height: "300px",
              background: "radial-gradient(circle, rgba(167, 243, 208, 0.25) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div>
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-md uppercase tracking-wider"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.18)",
                backdropFilter: "blur(8px)",
                color: "#ECFDF5",
                width: "fit-content",
              }}
            >
              <Sparkles size={13} />
              YOUR AI-POWERED FITNESS COMPANION
            </div>

            <h1 className="heading-2xl mb-md font-extrabold tracking-tight" style={{ lineHeight: 1.15 }}>
              Transform Your Fitness Journey
            </h1>

            <p
              className="text-base mb-md font-medium"
              style={{ color: "#ECFDF5", opacity: 0.95, maxWidth: "560px" }}
            >
              Achieve your goals with personalized AI workouts, precision nutrition
              plans, and intelligent progress tracking—all in one place.
            </p>

            {/* Phase 2: Dual User Journey Path Cards positioned beside Hero Graphic */}
            <div
              className="w-full mt-sm"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1rem",
                alignItems: "stretch",
              }}
            >
              {/* Path Cards Column (Left / Top) */}
              <div className="flex flex-col gap-md justify-between">
                {/* Path A: I'm Not Sure */}
                <div
                  style={{
                    padding: "20px",
                    borderRadius: "14px",
                    backgroundColor: "rgba(255, 255, 255, 0.18)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "#A7F3D0", margin: 0 }}
                  >
                    Path A • I&apos;m Not Sure
                  </div>
                  <p
                    className="text-xs leading-relaxed font-normal"
                    style={{ color: "#ECFDF5", opacity: 0.95, margin: 0 }}
                  >
                    Not sure where to start? Understand your BMI and explore your fitness options.
                  </p>
                  <Link
                    href="/bmi"
                    className="btn btn-white btn-sm font-semibold shadow-sm text-center inline-flex items-center justify-center gap-1 hover:scale-105 transition-transform"
                    style={{ color: "#065F46", margin: 0 }}
                  >
                    <span>Calculate My BMI</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Path B: I Know My Goal */}
                <div
                  style={{
                    padding: "20px",
                    borderRadius: "14px",
                    backgroundColor: "rgba(255, 255, 255, 0.18)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "#A7F3D0", margin: 0 }}
                  >
                    Path B • I Know My Goal
                  </div>
                  <p
                    className="text-xs leading-relaxed font-normal"
                    style={{ color: "#ECFDF5", opacity: 0.95, margin: 0 }}
                  >
                    Already know what you want to achieve? Build your fitness plan around your goal.
                  </p>
                  <Link
                    href="/goals"
                    className="btn btn-white btn-sm font-semibold shadow-sm text-center inline-flex items-center justify-center gap-1 hover:scale-105 transition-transform"
                    style={{ color: "#065F46", margin: 0 }}
                  >
                    <span>Choose My Goal</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Hero Graphic - Positioned beside the path cards */}
              <div
                className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/20 group flex-1"
                style={{
                  position: "relative",
                  minHeight: "220px",
                }}
              >
                <Image
                  src="/hero-illustration.jpg"
                  alt="Dynamic Athletic Runner with Fitness Metrics Illustration"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(6, 95, 70, 0.45) 0%, transparent 60%)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Quick Stats Card with Animated Counters */}
        <div className="bento-card span-2 flex flex-col justify-center">
          <div className="stats-grid flex justify-between items-center w-full">
            <div className="text-center flex-1">
              <div className="stat-number heading-xl font-extrabold text-emerald">
                <AnimatedCounter value={10} suffix="K+" />
              </div>
              <div className="stat-label text-sm text-muted font-medium mt-1">
                Active Members
              </div>
            </div>

            <div
              className="divider"
              style={{
                width: "1px",
                height: "44px",
                backgroundColor: "var(--border)",
              }}
            />

            <div className="text-center flex-1">
              <div className="stat-number heading-xl font-extrabold text-emerald">
                <AnimatedCounter value={500} suffix="+" />
              </div>
              <div className="stat-label text-sm text-muted font-medium mt-1">
                Workout Plans
              </div>
            </div>

            <div
              className="divider"
              style={{
                width: "1px",
                height: "44px",
                backgroundColor: "var(--border)",
              }}
            />

            <div className="text-center flex-1">
              <div className="stat-number heading-xl font-extrabold text-emerald">
                <AnimatedCounter value={98} suffix="%" />
              </div>
              <div className="stat-label text-sm text-muted font-medium mt-1">
                Success Rate
              </div>
            </div>
          </div>
        </div>

        {/* 3. Features Card with Lucide-React Icons (Scale for BMI, Dumbbell for Workouts) */}
        <div className="bento-card span-2 span-row-2">
          <div className="card-header mb-md">
            <h2 className="card-title heading-lg">Everything You Need</h2>
          </div>

          <div className="feature-list flex flex-col gap-md">
            <Link
              href="/bmi"
              className="flex items-center gap-md p-2 rounded-xl transition-all hover:bg-emerald-50/50 group"
            >
              <div
                className="card-icon flex items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "var(--emerald-subtle)",
                  color: "var(--emerald)",
                }}
              >
                <Scale size={22} strokeWidth={2.2} />
              </div>
              <div>
                <div className="font-semibold text-base" style={{ color: "var(--charcoal)" }}>
                  BMI Calculator
                </div>
                <div className="text-sm text-muted">
                  Track your body mass index with precision
                </div>
              </div>
            </Link>

            <Link
              href="/workouts"
              className="flex items-center gap-md p-2 rounded-xl transition-all hover:bg-emerald-50/50 group"
            >
              <div
                className="card-icon flex items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "var(--emerald-subtle)",
                  color: "var(--emerald)",
                }}
              >
                <Dumbbell size={22} strokeWidth={2.2} />
              </div>
              <div>
                <div className="font-semibold text-base" style={{ color: "var(--charcoal)" }}>
                  Smart Workouts
                </div>
                <div className="text-sm text-muted">
                  Interactive routines with live progress & timer
                </div>
              </div>
            </Link>

            <Link
              href="/nutrition"
              className="flex items-center gap-md p-2 rounded-xl transition-all hover:bg-emerald-50/50 group"
            >
              <div
                className="card-icon flex items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "var(--emerald-subtle)",
                  color: "var(--emerald)",
                }}
              >
                <Utensils size={22} strokeWidth={2.2} />
              </div>
              <div>
                <div className="font-semibold text-base" style={{ color: "var(--charcoal)" }}>
                  Nutrition Guide
                </div>
                <div className="text-sm text-muted">
                  Balanced meal plans and macro analytics
                </div>
              </div>
            </Link>

            <Link
              href="/progress"
              className="flex items-center gap-md p-2 rounded-xl transition-all hover:bg-emerald-50/50 group"
            >
              <div
                className="card-icon flex items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "var(--emerald-subtle)",
                  color: "var(--emerald)",
                }}
              >
                <TrendingUp size={22} strokeWidth={2.2} />
              </div>
              <div>
                <div className="font-semibold text-base" style={{ color: "var(--charcoal)" }}>
                  Progress Analytics
                </div>
                <div className="text-sm text-muted">
                  Visual insights into your fitness trends
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* 4. BMI Teaser Card */}
        <div className="bento-card span-2 flex flex-col justify-between">
          <div className="card-header mb-sm flex justify-between items-start">
            <div>
              <h2 className="card-title heading-md mb-xs">Quick BMI Check</h2>
              <p className="text-sm text-muted" style={{ maxWidth: "380px" }}>
                Instantly know where you stand and get personalized health
                recommendations based on your metrics.
              </p>
            </div>
            <div
              className="card-icon flex items-center justify-center rounded-xl"
              style={{
                width: "44px",
                height: "44px",
                backgroundColor: "var(--emerald-subtle)",
                color: "var(--emerald)",
              }}
            >
              <Scale size={22} strokeWidth={2.2} />
            </div>
          </div>
          <div>
            <Link
              href="/bmi"
              className="btn btn-primary mt-sm inline-flex items-center gap-2 group"
            >
              <span>Calculate Your BMI</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* 5. Workout Preview Card */}
        <div className="bento-card flex flex-col justify-between">
          <div>
            <div className="card-header mb-sm flex justify-between items-center">
              <h3 className="card-title font-bold text-base">Today&apos;s Pick</h3>
              <span
                className="badge badge-emerald text-xs inline-flex items-center gap-1"
                style={{
                  padding: "3px 10px",
                  borderRadius: "999px",
                  backgroundColor: "var(--emerald-subtle)",
                  color: "var(--emerald)",
                  fontWeight: 600,
                }}
              >
                <Clock size={12} /> 30 min
              </span>
            </div>
            <h4 className="font-bold text-base mb-xs" style={{ color: "var(--charcoal)" }}>
              Full Body HIIT
            </h4>
            <ul className="text-sm text-muted flex flex-col gap-xs mt-sm" style={{ listStyle: "none", padding: 0 }}>
              <li className="flex items-center gap-2 text-xs">
                <CheckCircle2 size={14} style={{ color: "var(--emerald)" }} />
                <span>Jumping Jacks (45s)</span>
              </li>
              <li className="flex items-center gap-2 text-xs">
                <CheckCircle2 size={14} style={{ color: "var(--emerald)" }} />
                <span>Burpees (45s)</span>
              </li>
              <li className="flex items-center gap-2 text-xs">
                <CheckCircle2 size={14} style={{ color: "var(--emerald)" }} />
                <span>Mountain Climbers (45s)</span>
              </li>
            </ul>
          </div>
          <Link
            href="/workouts"
            className="text-xs font-bold text-emerald flex items-center gap-1 mt-md hover:underline"
          >
            Start Session &rarr;
          </Link>
        </div>

        {/* 6. Nutrition Tip Card */}
        <div
          className="bento-card flex flex-col justify-center"
          style={{
            backgroundColor: "var(--emerald-subtle)",
            border: "1px solid var(--emerald-muted)",
          }}
        >
          <div className="flex items-center gap-sm mb-sm">
            <span style={{ fontSize: "1.75rem" }}>🥑</span>
            <div>
              <h3 className="card-title font-bold text-base" style={{ color: "var(--emerald-dark)" }}>
                Daily Tip
              </h3>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--emerald)" }}>
                Healthy Fats
              </span>
            </div>
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--emerald-dark)", lineHeight: 1.55 }}>
            Add healthy fats to your meals! A quarter of an avocado provides essential nutrients and keeps you full longer.
          </p>
        </div>

        {/* 7. AI Agent Promo Card: DARK GREEN BACKGROUND WITH CRISP WHITE TEXT */}
        <div
          className="bento-card span-2 flex flex-col justify-between relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #064E3B 0%, #065F46 60%, #022C22 100%)",
            color: "#FFFFFF",
            border: "1px solid rgba(167, 243, 208, 0.25)",
            boxShadow: "0 12px 30px -4px rgba(6, 78, 59, 0.4)",
          }}
        >
          {/* Subtle green ambient glow in corner */}
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div className="flex justify-between items-start mb-md relative z-10">
            <div>
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold mb-sm"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  color: "#A7F3D0",
                }}
              >
                <Bot size={13} />
                24/7 AI AGENT
              </div>
              <h2
                className="card-title heading-md mb-xs font-extrabold text-white"
                style={{ color: "#FFFFFF" }}
              >
                Meet Your AI Fitness Agent
              </h2>
              <p
                className="text-sm font-normal"
                style={{ color: "#ECFDF5", opacity: 0.95, maxWidth: "420px", lineHeight: 1.55 }}
              >
                Get real-time feedback, personalized workout adjustments, and precision nutrition advice powered by advanced AI.
              </p>
            </div>

            <div
              className="card-icon flex items-center justify-center rounded-xl flex-shrink-0"
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                color: "#A7F3D0",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <Bot size={24} strokeWidth={2.2} />
            </div>
          </div>

          <div className="relative z-10 pt-sm">
            <Link
              href="/ai-agent"
              className="btn btn-white inline-flex items-center gap-2 group font-semibold shadow-md hover:scale-105 transition-transform"
              style={{
                color: "#064E3B",
                backgroundColor: "#FFFFFF",
              }}
            >
              <span>Try AI Agent</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* 8. Testimonial Card */}
        <div className="bento-card span-2 flex flex-col justify-between">
          <div>
            <div className="mb-sm text-emerald">
              <Quote size={28} style={{ color: "var(--emerald-muted)", fill: "var(--emerald-subtle)" }} />
            </div>
            <p
              className="text-base italic mb-md font-medium"
              style={{ color: "var(--charcoal)", lineHeight: 1.6 }}
            >
              &ldquo;FitHub completely transformed my routine. The AI coach is
              like having an elite personal trainer in my pocket. I&apos;ve never felt
              stronger or more consistent!&rdquo;
            </p>
          </div>

          <div className="flex items-center gap-sm">
            <div
              className="flex items-center justify-center rounded-full text-white font-bold shadow-sm"
              style={{
                width: "42px",
                height: "42px",
                backgroundColor: "var(--emerald)",
              }}
            >
              SK
            </div>
            <div>
              <div className="font-bold text-sm" style={{ color: "var(--charcoal)" }}>
                Sarah Jenkins
              </div>
              <div className="text-xs text-muted">Pro Member since 2025</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
