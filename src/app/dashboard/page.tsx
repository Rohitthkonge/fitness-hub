"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bar } from "react-chartjs-2";
import { registerChartJS } from "@/lib/chartjs";
import {
  Target,
  Dumbbell,
  Utensils,
  TrendingUp,
  Bot,
  User,
  Scale,
  ArrowRight,
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info,
} from "lucide-react";

export default function DashboardPage() {
  const [userName, setUserName] = useState("Athlete");
  const [selectedGoal, setSelectedGoal] = useState<string>("Build Muscle");
  const [goalDetails, setGoalDetails] = useState<string>("Intermediate • 45m Gym • High Protein");
  const [greeting, setGreeting] = useState("Good Morning");
  const [formattedDate, setFormattedDate] = useState("");
  const [streakDays, setStreakDays] = useState(0);
  const [waterGlasses, setWaterGlasses] = useState(0);
  const totalGlasses = 8;
  const [stepsCount, setStepsCount] = useState(0);
  const stepsGoal = 10000;
  const [calorieCurrent, setCalorieCurrent] = useState(0);
  const calorieGoal = 2200;
  const [weeklyWorkouts, setWeeklyWorkouts] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [todayDayIndex, setTodayDayIndex] = useState(0);
  const [baselineWeight, setBaselineWeight] = useState<string | null>(null);

  useEffect(() => {
    registerChartJS();

    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Good Morning");
    else if (hour >= 12 && hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    setFormattedDate(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );

    // Today's day index (0 = Monday, ..., 6 = Sunday)
    const dayIdx = (new Date().getDay() + 6) % 7;
    setTodayDayIndex(dayIdx);

    // Load saved user session and preferences
    try {
      const savedUser = localStorage.getItem("fithub_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.name) setUserName(parsed.name);
      }

      const savedGoals = localStorage.getItem("fithub_goals");
      if (savedGoals) {
        const parsed = JSON.parse(savedGoals);
        if (parsed.goal) setSelectedGoal(parsed.goal);
        if (parsed.level && parsed.location) {
          setGoalDetails(`${parsed.level} • ${parsed.time || 45}m ${parsed.location} • ${parsed.diet || "Balanced"}`);
        }
      }

      const savedBmi = localStorage.getItem("fithub_bmi");
      if (savedBmi) {
        const parsed = JSON.parse(savedBmi);
        if (parsed.weight) setBaselineWeight(parsed.weight);
      }

      const savedWater = localStorage.getItem("fithub_water");
      if (savedWater) {
        setWaterGlasses(Number(savedWater));
      }

      const savedStreak = localStorage.getItem("fithub_streak");
      if (savedStreak) {
        setStreakDays(Number(savedStreak));
      }

      const savedWeekly = localStorage.getItem("fithub_weekly_workouts");
      if (savedWeekly) {
        setWeeklyWorkouts(JSON.parse(savedWeekly));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleWaterClick = (index: number) => {
    const nextVal = index === waterGlasses - 1 ? waterGlasses - 1 : index + 1;
    setWaterGlasses(nextVal);
    try {
      localStorage.setItem("fithub_water", nextVal.toString());
    } catch {
      // storage full
    }
  };

  // Calorie ring calculations (fresh user starts at 0 eaten)
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference - (calorieCurrent / calorieGoal) * circumference;

  const totalWeeklyWorkouts = weeklyWorkouts.reduce((a, b) => a + b, 0);

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayFullNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const activityChartData = {
    labels: dayLabels,
    datasets: [
      {
        label: "Workouts",
        data: weeklyWorkouts,
        backgroundColor: weeklyWorkouts.map((count, i) =>
          count > 0 ? "#059669" : i === todayDayIndex ? "#10B981" : "#E2E8F0"
        ),
        borderRadius: 6,
        barThickness: 16,
      },
    ],
  };

  const activityChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#111827",
        padding: 10,
        titleFont: { family: "Inter", size: 12 },
        bodyFont: { family: "Inter", size: 13, weight: "bold" as const },
        displayColors: false,
        callbacks: {
          title: (items: { label: string }[]) => {
            const label = items[0]?.label;
            const full = dayFullNames[dayLabels.indexOf(label)] || label;
            return label === dayLabels[todayDayIndex] ? `${full} (Today)` : full;
          },
          label: (context: { raw: unknown }) => {
            const count = Number(context.raw);
            return `${count} Workout${count !== 1 ? "s" : ""}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { family: "Inter", size: 12, weight: 600 as const },
          color: (context: { index: number }) => (context.index === todayDayIndex ? "#059669" : "#64748B"),
        },
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: 1,
        grid: {
          color: "#E5E7EB",
        },
        ticks: {
          font: { family: "Inter", size: 11 },
          color: "#94A3B8",
          stepSize: 1,
          callback: (value: string | number) => (Number(value) === 1 ? "1" : Number(value) === 0 ? "0" : ""),
        },
      },
    },
  };

  return (
    <main
      className="page-container mt-lg mb-lg"
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        paddingLeft: "1.25rem",
        paddingRight: "1.25rem",
      }}
    >
      <div className="bento-grid" style={{ gap: "1.25rem" }}>
        {/* Welcome Card with Personalized Name & Streak (starts at 0) */}
        <div className="bento-card span-2 card-emerald text-white greeting-section">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm mb-xs" style={{ opacity: 0.85 }}>
                {formattedDate || "Today"}
              </div>
              <h1 className="heading-xl mb-xs font-extrabold">{greeting}, {userName}!</h1>
              <p className="max-w-md text-sm" style={{ opacity: 0.9 }}>
                Welcome to your fitness hub. Complete your first session today to start your training streak.
              </p>
            </div>
            <div
              className="badge font-bold px-3 py-1 flex items-center gap-1 rounded-full text-xs shadow-sm"
              style={{ backgroundColor: "white", color: "var(--emerald)" }}
            >
              <Flame size={14} className={streakDays > 0 ? "text-amber-500 fill-amber-500" : "text-gray-400"} />
              <span>{streakDays} Day Streak</span>
            </div>
          </div>
        </div>

        {/* Selected Goal Banner Card */}
        <div className="bento-card span-2 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-sm">
              <div
                className="p-2.5 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "var(--emerald-subtle)", color: "var(--emerald)" }}
              >
                <Target size={20} strokeWidth={2.5} />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  Active Goal
                </span>
                <h3 className="heading-md font-bold text-emerald">{selectedGoal}</h3>
              </div>
            </div>
            <Link
              href="/goals"
              className="text-xs font-semibold text-emerald hover:underline inline-flex items-center gap-1"
            >
              <span>Modify</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="mt-sm pt-sm border-t border-gray-100 flex justify-between items-center text-xs text-muted">
            <span>{goalDetails}</span>
            <span className="badge badge-emerald text-xs">Active Program</span>
          </div>
        </div>

        {/* Quick Hub Working Links Toolbar */}
        <div className="bento-card span-4 p-md">
          <div className="flex items-center justify-between mb-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              Quick Hub Links
            </span>
            <span className="badge badge-emerald text-xs">Navigation Hub</span>
          </div>
          <div
            className="grid gap-sm"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "0.5rem",
            }}
          >
            <Link
              href="/workouts"
              className="p-2.5 rounded-xl border border-gray-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/40 transition-all flex items-center gap-2 text-xs font-semibold"
            >
              <Dumbbell size={16} className="text-emerald" />
              <span>Workouts</span>
            </Link>
            <Link
              href="/nutrition"
              className="p-2.5 rounded-xl border border-gray-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/40 transition-all flex items-center gap-2 text-xs font-semibold"
            >
              <Utensils size={16} className="text-emerald" />
              <span>Nutrition</span>
            </Link>
            <Link
              href="/progress"
              className="p-2.5 rounded-xl border border-gray-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/40 transition-all flex items-center gap-2 text-xs font-semibold"
            >
              <TrendingUp size={16} className="text-emerald" />
              <span>Progress</span>
            </Link>
            <Link
              href="/ai-agent"
              className="p-2.5 rounded-xl border border-gray-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/40 transition-all flex items-center gap-2 text-xs font-semibold"
            >
              <Bot size={16} className="text-emerald" />
              <span>AI Agent</span>
            </Link>
            <Link
              href="/profile"
              className="p-2.5 rounded-xl border border-gray-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/40 transition-all flex items-center gap-2 text-xs font-semibold"
            >
              <User size={16} className="text-emerald" />
              <span>Profile</span>
            </Link>
            <Link
              href="/bmi"
              className="p-2.5 rounded-xl border border-gray-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/40 transition-all flex items-center gap-2 text-xs font-semibold"
            >
              <Scale size={16} className="text-emerald" />
              <span>BMI Calculator</span>
            </Link>
          </div>
        </div>

        {/* Calories Card (starts at 0 eaten) */}
        <div className="bento-card flex flex-col items-center justify-between text-center">
          <div className="w-full flex justify-between items-center mb-sm">
            <h3 className="card-title text-left">Calories</h3>
            <span className="badge badge-gray text-xs" style={{ fontSize: "10px" }}>Today</span>
          </div>
          <div
            className="relative flex items-center justify-center"
            style={{ width: "128px", height: "128px", position: "relative" }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 120 120"
              style={{ transform: "rotate(-90deg)" }}
            >
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="12"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="var(--emerald)"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={dashoffset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s ease-out" }}
              />
            </svg>
            <div
              className="progress-ring-text flex flex-col items-center justify-center"
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
              }}
            >
              <span className="font-bold text-lg">
                {calorieCurrent.toLocaleString()}
              </span>
              <span className="text-xs text-muted">
                / {calorieGoal.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="text-center mt-2">
            <div className="text-xs text-muted font-medium mb-1">
              {calorieCurrent === 0 ? "0 eaten • 2,200 remaining" : `${calorieCurrent} eaten • ${calorieGoal - calorieCurrent} left`}
            </div>
            <Link href="/nutrition" className="text-xs text-emerald font-semibold hover:underline">
              Log Nutrition &rarr;
            </Link>
          </div>
        </div>

        {/* Steps Card (starts at 0 steps) */}
        <div className="bento-card flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <h3 className="card-title">Steps Today</h3>
            <span className="badge badge-gray text-xs" style={{ fontSize: "10px" }}>Today</span>
          </div>
          <div className="mt-auto">
            <div className="stat-value heading-xl font-bold">{stepsCount}</div>
            <div className="stat-label text-sm text-muted mb-md">
              / {stepsGoal.toLocaleString()} goal
            </div>
            <div
              className="progress-bar w-full rounded-full overflow-hidden"
              style={{
                backgroundColor: "var(--soft-gray, #E5E7EB)",
                height: "8px",
              }}
            >
              <div
                className="progress-fill"
                style={{
                  width: `${Math.round((stepsCount / stepsGoal) * 100)}%`,
                  backgroundColor: "var(--emerald)",
                  height: "100%",
                }}
              />
            </div>
            <div className="text-xs text-muted mt-2">
              {stepsCount === 0 ? "No steps recorded yet today" : `${stepsCount} steps taken`}
            </div>
          </div>
          <Link href="/progress" className="text-xs text-emerald font-semibold hover:underline mt-2">
            View Progress &rarr;
          </Link>
        </div>

        {/* Weekly Activity Card (fixed height 220px, 0-1 scale, thinner bars, today highlighted) */}
        <div className="bento-card span-2 span-row-2 no-hover flex flex-col justify-between">
          <div className="card-header mb-sm flex justify-between items-center">
            <div>
              <h3 className="card-title">Weekly Activity</h3>
              <p className="text-xs text-muted">
                Today is {dayFullNames[todayDayIndex]} • {totalWeeklyWorkouts} session{totalWeeklyWorkouts !== 1 ? "s" : ""} this week
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge badge-emerald text-xs" style={{ fontSize: "11px" }}>
                {totalWeeklyWorkouts} Workout{totalWeeklyWorkouts !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <div
            className="chart-container relative w-full"
            style={{ height: "220px" }}
          >
            <Bar data={activityChartData} options={activityChartOptions} />
          </div>
          <div className="mt-sm pt-xs border-t border-gray-100 flex justify-between items-center text-xs">
            <span className="text-muted">Target: 4-5 sessions/week</span>
            <Link href="/workouts" className="font-bold text-emerald hover:underline">
              Start Session &rarr;
            </Link>
          </div>
        </div>

        {/* Water Intake Card (starts empty at 0/8) */}
        <div className="bento-card no-hover flex flex-col justify-between">
          <div className="card-header mb-sm flex justify-between items-center">
            <h3 className="card-title">Water Intake</h3>
            <span className="text-sm font-medium">
              {waterGlasses}/{totalGlasses} glasses
            </span>
          </div>
          <div
            className="water-grid my-auto py-sm"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "0.5rem",
            }}
          >
            {Array.from({ length: totalGlasses }).map((_, i) => {
              const isFilled = i < waterGlasses;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleWaterClick(i)}
                  className="rounded flex items-center justify-center cursor-pointer transition-colors"
                  style={{
                    aspectRatio: "1 / 1",
                    border: isFilled
                      ? "none"
                      : "1px solid var(--soft-gray, #E5E7EB)",
                    backgroundColor: isFilled
                      ? "var(--emerald-subtle)"
                      : "var(--bg-card)",
                    color: isFilled ? "var(--emerald)" : "var(--text-tertiary)",
                  }}
                  title={`Glass ${i + 1}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill={isFilled ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-5.3c-.5 1.3-2 3.7-4 5.3s-3 3.5-3 5.5a7 7 0 0 0 7 7z" />
                  </svg>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-muted text-center">
            {waterGlasses === 0 ? "Tap a glass to log your hydration" : `${waterGlasses * 250}ml of 2,000ml logged`}
          </p>
        </div>

        {/* Friendly Empty State: Today's Workout Preview Card */}
        <div className="bento-card flex flex-col justify-between">
          <div>
            <div className="card-header mb-sm flex justify-between items-center">
              <h3 className="card-title">Today&apos;s Workout</h3>
              <span className="badge badge-gray text-xs">Ready</span>
            </div>
            <div className="mt-sm">
              <h4 className="font-bold text-base mb-xs">No workouts yet today</h4>
              <p className="text-xs text-muted mb-md">
                Start your first session to build your habit and make progress on your {selectedGoal} goal.
              </p>
              <div
                className="progress-bar w-full rounded-full overflow-hidden mb-xs"
                style={{
                  backgroundColor: "var(--soft-gray, #E5E7EB)",
                  height: "8px",
                }}
              >
                <div
                  className="progress-fill"
                  style={{
                    width: "0%",
                    backgroundColor: "var(--emerald)",
                    height: "100%",
                  }}
                />
              </div>
              <p className="text-xs text-right mt-1 text-muted">0% Complete</p>
            </div>
          </div>
          <Link
            href="/workouts"
            className="btn btn-primary btn-sm w-full mt-sm text-center inline-flex items-center justify-center gap-1"
          >
            <span>Start First Session</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Body Stats Overview Card */}
        <div className="bento-card span-2">
          <div className="card-header mb-md flex justify-between items-center">
            <h3 className="card-title">Body Stats Overview</h3>
            <span className="badge badge-gray text-xs" style={{ fontSize: "10px" }}>Demo data</span>
          </div>
          <div
            className="body-stats-grid grid gap-md"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
            }}
          >
            <div
              className="stat p-sm rounded text-center"
              style={{
                backgroundColor: "var(--bg-subtle, #F1F5F9)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="stat-label text-xs text-muted mb-xs">Weight</div>
              <div className="stat-value font-bold text-base">
                {baselineWeight ? `${baselineWeight} kg` : "74.5 kg"}
              </div>
              <div
                className="stat-trend down text-xs mt-1 flex items-center justify-center gap-xs text-muted"
              >
                {baselineWeight ? "Baseline record" : "↓ 1.2 kg (demo)"}
              </div>
            </div>

            <div
              className="stat p-sm rounded text-center"
              style={{
                backgroundColor: "var(--bg-subtle, #F1F5F9)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="stat-label text-xs text-muted mb-xs">Body Fat</div>
              <div className="stat-value font-bold text-base">18.2%</div>
              <div
                className="stat-trend text-xs mt-1 flex items-center justify-center gap-xs text-muted"
              >
                Demo estimate
              </div>
            </div>

            <div
              className="stat p-sm rounded text-center"
              style={{
                backgroundColor: "var(--bg-subtle, #F1F5F9)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="stat-label text-xs text-muted mb-xs">Muscle Mass</div>
              <div className="stat-value font-bold text-base">32.1 kg</div>
              <div
                className="stat-trend text-xs mt-1 flex items-center justify-center gap-xs text-muted"
              >
                Demo estimate
              </div>
            </div>
          </div>
          <div className="mt-sm pt-xs border-t border-gray-100 flex justify-between items-center text-xs">
            <Link href="/bmi" className="text-muted hover:text-emerald">
              Recalculate BMI & Baseline &rarr;
            </Link>
            <Link href="/progress" className="font-bold text-emerald hover:underline">
              Weight Progress &rarr;
            </Link>
          </div>
        </div>

        {/* Upcoming Workouts & Schedule Card */}
        <div className="bento-card span-2">
          <div className="card-header mb-md flex justify-between items-center">
            <h3 className="card-title">Upcoming Schedule</h3>
            <span className="badge badge-gray text-xs" style={{ fontSize: "10px" }}>Demo data</span>
          </div>
          <div className="flex flex-col gap-sm">
            <div
              className="list-item flex justify-between items-center p-sm rounded"
              style={{ border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-sm">
                <div
                  className="rounded-xl flex items-center justify-center"
                  style={{
                    width: "36px",
                    height: "36px",
                    backgroundColor: "var(--emerald-subtle)",
                    color: "var(--emerald)",
                  }}
                >
                  <Dumbbell size={16} />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Upper Body Power (Suggested)</h4>
                  <p className="text-xs text-muted">Today, 5:30 PM</p>
                </div>
              </div>
              <span className="badge badge-amber text-xs">Strength</span>
            </div>

            <div
              className="list-item flex justify-between items-center p-sm rounded"
              style={{ border: "1px solid var(--border)" }}
            >
              <div className="flex items-center gap-sm">
                <div
                  className="rounded-xl flex items-center justify-center"
                  style={{
                    width: "36px",
                    height: "36px",
                    backgroundColor: "var(--emerald-subtle)",
                    color: "var(--emerald)",
                  }}
                >
                  <Flame size={16} />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Morning Interval Run (Suggested)</h4>
                  <p className="text-xs text-muted">Tomorrow, 7:00 AM</p>
                </div>
              </div>
              <span className="badge badge-blue text-xs">Cardio</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
