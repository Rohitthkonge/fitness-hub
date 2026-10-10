"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Target,
  Scale,
  Dumbbell,
  Utensils,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Bot,
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string; joinedAt?: string } | null>(null);
  const [goals, setGoals] = useState<{
    goal?: string;
    level?: string;
    location?: string;
    time?: number;
    diet?: string;
  } | null>(null);
  const [bmiData, setBmiData] = useState<{ bmi?: string; category?: string; date?: string } | null>(null);
  const [acceptedWorkout, setAcceptedWorkout] = useState<string | null>(null);
  const [acceptedDiet, setAcceptedDiet] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("fithub_user");
      if (savedUser) setUser(JSON.parse(savedUser));
      else setUser({ name: "Athlete", email: "demo@fithub.local", joinedAt: "Oct 2026" });

      const savedGoals = localStorage.getItem("fithub_goals");
      if (savedGoals) setGoals(JSON.parse(savedGoals));
      else setGoals({ goal: "Build Muscle", level: "Intermediate", location: "Gym", time: 45, diet: "High Protein" });

      const savedBmi = localStorage.getItem("fithub_bmi");
      if (savedBmi) setBmiData(JSON.parse(savedBmi));

      const savedWorkout = localStorage.getItem("fithub_plan_workout");
      if (savedWorkout) setAcceptedWorkout(savedWorkout);

      const savedDiet = localStorage.getItem("fithub_plan_nutrition");
      if (savedDiet) setAcceptedDiet(savedDiet);
    } catch {
      // ignore
    }
  }, []);

  return (
    <main className="page-container mt-lg mb-xl">
      <div className="bento-grid">
        {/* Profile Card */}
        <div className="bento-card span-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
          <div className="flex items-center gap-md">
            <div
              className="flex items-center justify-center rounded-2xl p-4 shadow-sm"
              style={{
                backgroundColor: "var(--emerald-subtle)",
                color: "var(--emerald)",
                width: "64px",
                height: "64px",
              }}
            >
              <User size={32} strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="heading-lg font-extrabold">{user?.name || "Athlete"}</h1>
                <span className="badge badge-emerald text-xs">Active Member</span>
              </div>
              <p className="text-xs text-muted mt-0.5">{user?.email || "demo@fithub.local"}</p>
              <div className="flex items-center gap-3 text-xs text-muted mt-2">
                <span className="flex items-center gap-1">
                  <Calendar size={13} /> Joined {user?.joinedAt || "Recently"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald">
                  <ShieldCheck size={13} /> Demo Account
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-sm">
            <Link href="/goals" className="btn btn-outline btn-sm inline-flex items-center gap-1">
              <span>Edit Fitness Goals</span>
              <ArrowRight size={14} />
            </Link>
            <Link href="/dashboard" className="btn btn-primary btn-sm">
              Dashboard
            </Link>
          </div>
        </div>

        {/* Saved Goals Summary */}
        <div className="bento-card span-2 flex flex-col justify-between">
          <div className="card-header mb-md flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Target size={20} style={{ color: "var(--emerald)" }} />
              <h2 className="heading-md font-bold">Selected Goals</h2>
            </div>
            <Link href="/goals" className="text-xs text-emerald font-semibold hover:underline">
              Change
            </Link>
          </div>

          <div className="flex flex-col gap-sm">
            <div className="p-sm rounded bg-gray-50 flex justify-between items-center text-sm">
              <span className="text-muted">Primary Goal</span>
              <span className="font-bold text-emerald">{goals?.goal || "Build Muscle"}</span>
            </div>
            <div className="p-sm rounded bg-gray-50 flex justify-between items-center text-sm">
              <span className="text-muted">Experience Level</span>
              <span className="font-semibold">{goals?.level || "Intermediate"}</span>
            </div>
            <div className="p-sm rounded bg-gray-50 flex justify-between items-center text-sm">
              <span className="text-muted">Preferred Location</span>
              <span className="font-semibold">{goals?.location || "Gym"}</span>
            </div>
            <div className="p-sm rounded bg-gray-50 flex justify-between items-center text-sm">
              <span className="text-muted">Target Duration</span>
              <span className="font-semibold">{goals?.time || 45} mins</span>
            </div>
            <div className="p-sm rounded bg-gray-50 flex justify-between items-center text-sm">
              <span className="text-muted">Dietary Preference</span>
              <span className="font-semibold">{goals?.diet || "High Protein"}</span>
            </div>
          </div>
        </div>

        {/* Health Baseline & BMI */}
        <div className="bento-card span-2 flex flex-col justify-between">
          <div className="card-header mb-md flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Scale size={20} style={{ color: "var(--emerald)" }} />
              <h2 className="heading-md font-bold">Health & BMI Baseline</h2>
            </div>
            <Link href="/bmi" className="text-xs text-emerald font-semibold hover:underline">
              {bmiData?.bmi ? "Recalculate" : "Calculate"}
            </Link>
          </div>

          {bmiData?.bmi ? (
            <div className="flex flex-col items-center justify-center p-md text-center my-auto">
              <div className="text-xs text-muted mb-xs">Latest Calculated BMI</div>
              <div className="heading-3xl font-extrabold text-emerald mb-xs">{bmiData.bmi}</div>
              <span className="badge badge-emerald text-xs font-bold px-3 py-1 mb-md">
                {bmiData.category || "Normal Weight"}
              </span>
              <Link
                href="/bmi-result"
                className="btn btn-outline btn-sm inline-flex items-center gap-1"
              >
                <span>View Full Result & Limitations</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="text-center p-lg my-auto text-muted">
              <p className="text-sm mb-md">No BMI calculation recorded yet.</p>
              <Link href="/bmi" className="btn btn-primary btn-sm inline-flex items-center gap-1">
                <span>Calculate My BMI</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

        {/* Active AI Agent Accepted Plans */}
        <div className="bento-card span-4 no-hover">
          <div className="card-header mb-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={20} style={{ color: "var(--emerald)" }} />
              <h2 className="heading-md font-bold">AI Agent Customized Plans</h2>
            </div>
            <Link href="/ai-agent" className="btn btn-primary btn-sm inline-flex items-center gap-1">
              <Sparkles size={14} />
              <span>Consult AI Agent</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            <div className="p-md rounded-xl border border-gray-200 bg-gray-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted mb-xs">
                  <Dumbbell size={14} style={{ color: "var(--emerald)" }} />
                  <span>Accepted Workout Plan</span>
                </div>
                <div className="font-bold text-base mb-xs" style={{ color: "var(--charcoal)" }}>
                  {acceptedWorkout ? "Personalized AI Routine" : "Default Upper Body Power (Intermediate)"}
                </div>
                <p className="text-xs text-muted line-clamp-2">
                  {acceptedWorkout || "4 sets Bench Press, 3 sets Overhead Press, 4 sets Bent Over Rows, 3 sets Biceps & Triceps."}
                </p>
              </div>
              <div className="mt-md pt-sm border-t border-gray-200 flex justify-between items-center">
                <span className="text-xs text-emerald font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} /> Active in workouts
                </span>
                <Link href="/workouts" className="text-xs font-bold hover:underline">
                  Open Workouts &rarr;
                </Link>
              </div>
            </div>

            <div className="p-md rounded-xl border border-gray-200 bg-gray-50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted mb-xs">
                  <Utensils size={14} style={{ color: "var(--emerald)" }} />
                  <span>Accepted Nutrition Plan</span>
                </div>
                <div className="font-bold text-base mb-xs" style={{ color: "var(--charcoal)" }}>
                  {acceptedDiet ? "Customized Dietary Targets" : `${goals?.diet || "High Protein"} Macro Plan`}
                </div>
                <p className="text-xs text-muted line-clamp-2">
                  {acceptedDiet || "Calibrated for 2.0g protein/kg body weight, with balanced complex carbohydrates and essential fats."}
                </p>
              </div>
              <div className="mt-md pt-sm border-t border-gray-200 flex justify-between items-center">
                <span className="text-xs text-emerald font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} /> Active in nutrition
                </span>
                <Link href="/nutrition" className="text-xs font-bold hover:underline">
                  Open Nutrition &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
