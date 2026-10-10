"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Line } from "react-chartjs-2";
import { registerChartJS } from "@/lib/chartjs";
import {
  Scale,
  Target,
  ArrowRight,
  Flame,
  Lock,
  Calendar,
  Sparkles,
  Camera,
  Info,
} from "lucide-react";

export default function ProgressPage() {
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [userGoal, setUserGoal] = useState<string>("Build Muscle");
  const [goalDetails, setGoalDetails] = useState<string>("Intermediate • 45m Gym • High Protein");
  const [streakDays, setStreakDays] = useState(0);
  const [hasWeightEntries, setHasWeightEntries] = useState(false);
  const [showDemoWeight, setShowDemoWeight] = useState(false);

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    registerChartJS();

    try {
      const savedGoals = localStorage.getItem("fithub_goals");
      if (savedGoals) {
        const parsed = JSON.parse(savedGoals);
        if (parsed.goal) setUserGoal(parsed.goal);
        if (parsed.level && parsed.location) {
          setGoalDetails(`${parsed.level} • ${parsed.time || 45}m ${parsed.location} • ${parsed.diet || "Balanced"}`);
        }
      }

      const savedStreak = localStorage.getItem("fithub_streak");
      if (savedStreak) setStreakDays(Number(savedStreak));

      const savedWeightHistory = localStorage.getItem("fithub_weight_history");
      if (savedWeightHistory) {
        const parsed = JSON.parse(savedWeightHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHasWeightEntries(true);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "before" | "after"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === "before") setBeforeImage(url);
      else setAfterImage(url);
    }
  };

  const demoChartData = {
    labels: ["Day 1", "Day 5", "Day 10", "Day 15", "Day 20", "Day 25", "Day 30"],
    datasets: [
      {
        label: "Weight (kg)",
        data: [78.0, 77.8, 77.2, 76.5, 76.8, 75.3, 74.5],
        borderColor: "#059669",
        borderWidth: 2.5,
        backgroundColor: "rgba(5, 150, 105, 0.12)",
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#059669",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: (context: { parsed: { y: number | null } }) => {
            return ` ${context.parsed.y ?? 0} kg`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 73,
        max: 79,
        title: {
          display: true,
          text: "Weight (kg)",
          color: "#94A3B8",
          font: { family: "Inter", size: 12 },
        },
        grid: {
          color: "#E5E7EB",
        },
        ticks: {
          color: "#94A3B8",
          font: { family: "Inter", size: 12 },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#94A3B8",
          font: { family: "Inter", size: 12 },
        },
      },
    },
  };

  const achievementsList = [
    { icon: "🏋️", label: "First Workout", desc: "Complete 1 workout" },
    { icon: "🔥", label: "7-Day Streak", desc: "Train 7 days in a row" },
    { icon: "💪", label: "10K Steps", desc: "Log 10,000 steps" },
    { icon: "🥗", label: "Clean Eating", desc: "Track 3 days of nutrition" },
    { icon: "🏃", label: "5K Runner", desc: "Finish a cardio run" },
    { icon: "⭐", label: "Consistency", desc: "Train 4 weeks active" },
  ];

  return (
    <main
      className="page-container mt-md mb-xl"
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        paddingLeft: "1.25rem",
        paddingRight: "1.25rem",
      }}
    >
      <div className="bento-grid" style={{ gap: "1.25rem" }}>
        {/* 1. Weight Chart Card (Shows "Log your first weight" when empty) */}
        <div className="bento-card span-2 span-row-2 no-hover flex flex-col justify-between">
          <div className="card-header mb-sm flex justify-between items-center">
            <div>
              <h2 className="card-title heading-lg">Weight Progress</h2>
              <p className="card-label text-xs text-muted">30-day weight tracking</p>
            </div>
            {hasWeightEntries || showDemoWeight ? (
              <span className="badge badge-gray text-xs font-semibold px-2 py-1">
                Demo data
              </span>
            ) : (
              <span className="badge badge-emerald text-xs">Getting Started</span>
            )}
          </div>

          {!hasWeightEntries && !showDemoWeight ? (
            <div
              className="flex flex-col items-center justify-center text-center p-lg my-auto"
              style={{ minHeight: "280px" }}
            >
              <div
                className="p-3 rounded-full mb-md flex items-center justify-center"
                style={{
                  backgroundColor: "var(--emerald-subtle)",
                  color: "var(--emerald)",
                  width: "56px",
                  height: "56px",
                }}
              >
                <Scale size={28} />
              </div>
              <h3 className="heading-md font-bold mb-xs">Log your first weight</h3>
              <p className="text-xs text-muted max-w-sm mb-md leading-relaxed">
                No weight history recorded yet. Calculate your BMI or enter your baseline weight to begin charting your progress over time.
              </p>
              <div className="flex flex-wrap gap-xs justify-center">
                <Link
                  href="/bmi"
                  className="btn btn-primary btn-sm inline-flex items-center gap-1.5"
                >
                  <span>Log Weight via BMI</span>
                  <ArrowRight size={14} />
                </Link>
                <button
                  type="button"
                  onClick={() => setShowDemoWeight(true)}
                  className="btn btn-outline btn-sm text-xs"
                >
                  Preview Demo Chart
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-grow justify-between">
              <div
                className="chart-container relative w-full my-auto"
                style={{ minHeight: "260px", height: "100%", flexGrow: 1 }}
              >
                <Line data={demoChartData} options={chartOptions} />
              </div>
              <div className="mt-sm pt-xs border-t border-gray-100 flex justify-between items-center text-xs">
                <span className="text-muted">Trend: -3.5 kg over 30 days</span>
                <button
                  type="button"
                  onClick={() => setShowDemoWeight(false)}
                  className="text-xs text-muted hover:text-emerald"
                >
                  Hide demo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. Streak Card (Starts at 0) */}
        <div className="bento-card flex flex-col items-center justify-center text-center">
          <div className="streak-fire" style={{ fontSize: "2.5rem" }}>
            {streakDays > 0 ? "🔥" : "⚡"}
          </div>
          <div className="streak-number heading-xl font-bold mt-xs">{streakDays}</div>
          <div className="card-label font-semibold text-sm">Day Streak</div>
          <div className="text-xs text-muted mt-xs">
            {streakDays === 0 ? "Complete today's session to begin!" : "Keep up the momentum!"}
          </div>
        </div>

        {/* 3. Goals Card (Displays user's actual selected goal) */}
        <div className="bento-card no-hover flex flex-col justify-between">
          <div className="flex justify-between items-start mb-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted">
                Your Primary Target
              </span>
              <h2 className="card-title text-base font-bold mt-0.5">{userGoal}</h2>
            </div>
            <Link href="/goals" className="text-xs text-emerald font-semibold hover:underline">
              Edit
            </Link>
          </div>

          <div className="goal-item mb-sm">
            <div className="goal-header flex justify-between items-center mb-xs">
              <span className="goal-name font-medium text-xs">Program Progress</span>
              <span className="goal-progress-text text-xs text-emerald font-semibold">
                0% (Getting Started)
              </span>
            </div>
            <div
              className="progress-bar w-full rounded-full overflow-hidden"
              style={{ backgroundColor: "var(--soft-gray, #E5E7EB)", height: "8px" }}
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
            <p className="text-[11px] text-muted mt-1">{goalDetails}</p>
          </div>

          <div className="goal-item mb-xs">
            <div className="goal-header flex justify-between items-center mb-xs">
              <span className="goal-name font-medium text-xs">Weekly Consistency</span>
              <span className="goal-progress-text text-xs text-muted">0 / 4 sessions</span>
            </div>
            <div
              className="progress-bar w-full rounded-full overflow-hidden"
              style={{ backgroundColor: "var(--soft-gray, #E5E7EB)", height: "8px" }}
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
          </div>
        </div>

        {/* 4. Body Measurements Card */}
        <div className="bento-card span-2 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-md">
            <h2 className="card-title">Body Measurements</h2>
            <span className="badge badge-gray text-xs">Demo data</span>
          </div>
          <div
            className="flex flex-wrap gap-md justify-between"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
              gap: "1rem",
            }}
          >
            <div className="measurement-item flex flex-col">
              <span className="measurement-label text-xs text-muted">Chest</span>
              <span className="measurement-value font-bold text-lg">102 cm</span>
              <span
                className="stat-trend up text-xs flex items-center text-muted"
              >
                Sample baseline
              </span>
            </div>
            <div className="measurement-item flex flex-col">
              <span className="measurement-label text-xs text-muted">Waist</span>
              <span className="measurement-value font-bold text-lg">82 cm</span>
              <span
                className="stat-trend down text-xs flex items-center text-muted"
              >
                Sample baseline
              </span>
            </div>
            <div className="measurement-item flex flex-col">
              <span className="measurement-label text-xs text-muted">Hips</span>
              <span className="measurement-value font-bold text-lg">96 cm</span>
              <span className="stat-trend text-xs text-muted flex items-center">
                Sample baseline
              </span>
            </div>
            <div className="measurement-item flex flex-col">
              <span className="measurement-label text-xs text-muted">Arms</span>
              <span className="measurement-value font-bold text-lg">35 cm</span>
              <span
                className="stat-trend up text-xs flex items-center text-muted"
              >
                Sample baseline
              </span>
            </div>
            <div className="measurement-item flex flex-col">
              <span className="measurement-label text-xs text-muted">Thighs</span>
              <span className="measurement-value font-bold text-lg">58 cm</span>
              <span className="stat-trend text-xs text-muted flex items-center">
                Sample baseline
              </span>
            </div>
          </div>
        </div>

        {/* 5. Before/After Card */}
        <div className="bento-card span-2">
          <div className="flex justify-between items-center mb-sm">
            <h2 className="card-title">Transformation Photos</h2>
            <span className="badge badge-gray text-xs">Optional upload</span>
          </div>
          <div className="photo-slots flex gap-md w-full">
            <input
              type="file"
              ref={beforeInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleImageUpload(e, "before")}
            />
            <div
              onClick={() => beforeInputRef.current?.click()}
              className="photo-slot flex-1 border-dashed border-2 rounded-md flex flex-col items-center justify-center p-md text-center cursor-pointer"
              style={{
                borderColor: "var(--soft-gray, #E5E7EB)",
                backgroundColor: "var(--bg-subtle, #F1F5F9)",
                minHeight: "150px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {beforeImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={beforeImage}
                  alt="Before"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <>
                  <Camera size={24} className="text-muted mb-xs" />
                  <span className="text-sm font-medium">Starting Photo</span>
                  <span className="text-xs text-muted mt-xs">Upload Photo</span>
                </>
              )}
            </div>

            <input
              type="file"
              ref={afterInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleImageUpload(e, "after")}
            />
            <div
              onClick={() => afterInputRef.current?.click()}
              className="photo-slot flex-1 border-dashed border-2 rounded-md flex flex-col items-center justify-center p-md text-center cursor-pointer"
              style={{
                borderColor: "var(--soft-gray, #E5E7EB)",
                backgroundColor: "var(--bg-subtle, #F1F5F9)",
                minHeight: "150px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {afterImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={afterImage}
                  alt="After"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <>
                  <Camera size={24} className="text-muted mb-xs" />
                  <span className="text-sm font-medium">Current Photo</span>
                  <span className="text-xs text-muted mt-xs">Upload Photo</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 6. Achievement Badges Card (Locked & greyed until earned) */}
        <div className="bento-card span-2">
          <div className="flex justify-between items-center mb-sm">
            <h2 className="card-title">Achievements</h2>
            <span className="badge badge-gray text-xs">0 / 6 Unlocked</span>
          </div>
          <div
            className="badge-grid mt-md"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "0.5rem",
            }}
          >
            {achievementsList.map((badge, idx) => (
              <div
                key={idx}
                className="achievement-badge rounded-md p-sm flex items-center justify-between gap-xs"
                style={{
                  backgroundColor: "var(--bg-subtle, #F1F5F9)",
                  border: "1px solid var(--border)",
                  opacity: 0.65,
                }}
                title={`${badge.label}: ${badge.desc}`}
              >
                <div className="flex items-center gap-xs">
                  <span style={{ fontSize: "1.1rem", filter: "grayscale(80%)" }}>{badge.icon}</span>
                  <div>
                    <div className="text-xs font-semibold text-muted">{badge.label}</div>
                    <div className="text-[10px] text-gray-400">{badge.desc}</div>
                  </div>
                </div>
                <Lock size={12} className="text-gray-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
