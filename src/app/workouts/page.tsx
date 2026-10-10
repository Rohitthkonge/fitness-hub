"use client";

import { useState, useEffect, useRef } from "react";
import { Info, X, Dumbbell, Clock, Flame, ShieldCheck } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  detail: string;
  muscle: string;
  completed: boolean;
}

const INITIAL_EXERCISES: Exercise[] = [
  {
    id: "ex-1",
    name: "Bench Press",
    detail: "4 sets × 10 reps",
    muscle: "Chest",
    completed: false,
  },
  {
    id: "ex-2",
    name: "Overhead Press",
    detail: "3 sets × 12 reps",
    muscle: "Shoulders",
    completed: false,
  },
  {
    id: "ex-3",
    name: "Bent Over Row",
    detail: "4 sets × 10 reps",
    muscle: "Back",
    completed: false,
  },
  {
    id: "ex-4",
    name: "Bicep Curls",
    detail: "3 sets × 15 reps",
    muscle: "Arms",
    completed: false,
  },
  {
    id: "ex-5",
    name: "Tricep Dips",
    detail: "3 sets × 12 reps",
    muscle: "Arms",
    completed: false,
  },
  {
    id: "ex-6",
    name: "Lateral Raises",
    detail: "3 sets × 15 reps",
    muscle: "Shoulders",
    completed: false,
  },
];

export default function WorkoutsPage() {
  const [selectedPlan, setSelectedPlan] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [exercises, setExercises] = useState<Exercise[]>(INITIAL_EXERCISES);
  const [showDetails, setShowDetails] = useState(false);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [todayDayIndex, setTodayDayIndex] = useState(0);

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const dayIdx = (new Date().getDay() + 6) % 7;
    setTodayDayIndex(dayIdx);
    try {
      const savedWeekly = localStorage.getItem("fithub_weekly_workouts");
      if (savedWeekly) setWeeklyWorkouts(JSON.parse(savedWeekly));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const toggleExercise = (id: string) => {
    setExercises((prev) => {
      const next = prev.map((ex) => (ex.id === id ? { ...ex, completed: !ex.completed } : ex));
      const allDone = next.every((e) => e.completed);
      if (allDone) {
        const updated = [...weeklyWorkouts];
        updated[todayDayIndex] = 1;
        setWeeklyWorkouts(updated);
        try {
          localStorage.setItem("fithub_weekly_workouts", JSON.stringify(updated));
          localStorage.setItem("fithub_streak", "1");
        } catch {
          // ignore
        }
      }
      return next;
    });
  };

  const completedCount = exercises.filter((e) => e.completed).length;
  const progressPercent = Math.round((completedCount / exercises.length) * 100);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60)
      .toString()
      .padStart(2, "0");
    const secs = (totalSecs % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleStartTimer = () => setIsTimerRunning(true);
  const handlePauseTimer = () => setIsTimerRunning(false);
  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

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
      <div className="bento-grid">
        {/* Plan Selector Card */}
        <div className="bento-card span-4 card-subtle">
          <div className="flex justify-between items-center mb-sm">
            <h1 className="heading-xl">Workout Plans</h1>
          </div>
          <div className="tabs">
            <button
              type="button"
              className={`tab ${selectedPlan === "beginner" ? "active" : ""}`}
              onClick={() => setSelectedPlan("beginner")}
            >
              Beginner
            </button>
            <button
              type="button"
              className={`tab ${selectedPlan === "intermediate" ? "active" : ""}`}
              onClick={() => setSelectedPlan("intermediate")}
            >
              Intermediate
            </button>
            <button
              type="button"
              className={`tab ${selectedPlan === "advanced" ? "active" : ""}`}
              onClick={() => setSelectedPlan("advanced")}
            >
              Advanced
            </button>
          </div>
        </div>

        {/* Today's Workout Card */}
        <div className="bento-card span-2 span-row-2 no-hover">
          <div className="flex flex-col gap-xs mb-sm">
            <div className="flex justify-between items-start gap-2">
              <h2 className="heading-lg">Today&apos;s Session — Upper Body Strength</h2>
              <button
                type="button"
                onClick={() => setShowDetails(true)}
                className="btn btn-outline btn-sm inline-flex items-center gap-1.5 whitespace-nowrap text-xs"
              >
                <Info size={14} className="text-emerald" />
                <span>Workout Details</span>
              </button>
            </div>
            <div className="flex gap-xs">
              <span className="badge badge-emerald" style={{ textTransform: "capitalize" }}>
                {selectedPlan}
              </span>
              <span className="badge badge-amber">45 min</span>
            </div>
          </div>

          <div
            className="progress-bar mt-sm mb-sm w-full rounded-full overflow-hidden"
            style={{ backgroundColor: "var(--soft-gray, #E5E7EB)", height: "8px" }}
          >
            <div
              className="progress-fill"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: "var(--emerald)",
                height: "100%",
                transition: "width 0.3s ease",
              }}
            />
          </div>

          <p className="text-sm text-muted mb-sm">
            <span>{completedCount}</span>/{exercises.length} Exercises Completed ({progressPercent}%)
          </p>

          <div className="exercise-list flex flex-col gap-sm">
            {exercises.map((ex) => (
              <div
                key={ex.id}
                className={`exercise-item flex items-center justify-between p-sm rounded ${
                  ex.completed ? "completed" : ""
                }`}
                style={{
                  backgroundColor: "var(--bg-subtle, #F1F5F9)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="exercise-info flex flex-col gap-1">
                  <span
                    className="exercise-name font-semibold"
                    style={{
                      textDecoration: ex.completed ? "line-through" : "none",
                      color: ex.completed ? "var(--text-tertiary)" : "var(--text-primary)",
                    }}
                  >
                    {ex.name}
                  </span>
                  <span className="exercise-detail text-xs text-muted">{ex.detail}</span>
                  <span
                    className="exercise-muscle text-xs rounded-full px-2 py-0.5"
                    style={{
                      backgroundColor: "var(--emerald-subtle)",
                      color: "var(--emerald-dark)",
                      width: "fit-content",
                      fontWeight: 500,
                    }}
                  >
                    {ex.muscle}
                  </span>
                </div>
                <div className="checkbox">
                  <input
                    type="checkbox"
                    id={ex.id}
                    checked={ex.completed}
                    onChange={() => toggleExercise(ex.id)}
                    style={{
                      width: "18px",
                      height: "18px",
                      accentColor: "var(--emerald)",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workout Timer Card */}
        <div className="bento-card span-1 no-hover flex flex-col items-center justify-center">
          <h3 className="card-title text-center mb-sm">Timer</h3>
          <div className="workout-timer flex flex-col items-center justify-center gap-md py-sm">
            <div
              className="timer-display"
              style={{
                fontSize: "2.75rem",
                fontWeight: 700,
                fontFamily: "var(--font-heading)",
                color: "var(--charcoal)",
              }}
            >
              {formatTimer(timerSeconds)}
            </div>
            <div className="timer-controls flex gap-xs">
              {!isTimerRunning ? (
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleStartTimer}
                >
                  Start
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handlePauseTimer}
                >
                  Pause
                </button>
              )}
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleResetTimer}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Muscle Focus Card */}
        <div className="bento-card span-1">
          <div className="flex justify-between items-center mb-sm">
            <h3 className="card-title">Muscle Focus</h3>
            <span className="badge badge-gray text-xs">Demo data</span>
          </div>
          <div className="muscle-list flex flex-col gap-sm mt-sm">
            <div
              className="flex justify-between items-center pb-xs"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <span className="font-medium text-sm">Chest</span>
              <span className="badge badge-emerald">Primary</span>
            </div>
            <div
              className="flex justify-between items-center pb-xs"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <span className="font-medium text-sm">Shoulders</span>
              <span className="badge badge-emerald">Primary</span>
            </div>
            <div
              className="flex justify-between items-center pb-xs"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <span className="font-medium text-sm">Back</span>
              <span className="badge" style={{ backgroundColor: "var(--bg-subtle)" }}>
                Secondary
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">Arms</span>
              <span className="badge" style={{ backgroundColor: "var(--bg-subtle)" }}>
                Secondary
              </span>
            </div>
          </div>
        </div>

        {/* Weekly Schedule Card (matches dashboard weekly activity & highlights today) */}
        <div className="bento-card span-2">
          <div className="flex justify-between items-center mb-sm">
            <h3 className="card-title">This Week</h3>
            <span className="badge badge-emerald text-xs">
              {weeklyWorkouts.reduce((a, b) => a + b, 0)} Completed
            </span>
          </div>
          <div
            className="schedule-grid mt-sm"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "0.5rem",
              textAlign: "center",
            }}
          >
            {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => {
              const isCompleted = weeklyWorkouts[idx] > 0;
              const isToday = idx === todayDayIndex;
              return (
                <div
                  key={idx}
                  className="schedule-day flex flex-col items-center gap-xs p-xs rounded"
                  style={{
                    backgroundColor: isToday ? "var(--emerald-subtle)" : "transparent",
                    border: isToday ? "1.5px solid var(--emerald)" : "1px solid transparent",
                    fontWeight: isToday ? 700 : 500,
                  }}
                  title={isToday ? "Today" : undefined}
                >
                  <span className="text-xs" style={{ color: isToday ? "var(--emerald-dark)" : "inherit" }}>
                    {day}
                  </span>
                  <div
                    className="schedule-dot"
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: isCompleted
                        ? "var(--emerald)"
                        : isToday
                        ? "#10B981"
                        : "var(--soft-gray, #E5E7EB)",
                    }}
                  />
                  {isToday && (
                    <span className="text-[9px] font-bold" style={{ color: "var(--emerald)" }}>
                      Today
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Personal Records Card */}
        <div className="bento-card span-2">
          <div className="flex justify-between items-center mb-sm">
            <h3 className="card-title">Personal Records 🏆</h3>
            <span className="badge badge-gray text-xs">Demo data</span>
          </div>
          <div
            className="pr-grid mt-sm"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "0.75rem",
            }}
          >
            <div
              className="stat p-sm rounded"
              style={{
                backgroundColor: "var(--bg-subtle, #F1F5F9)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="stat-label text-xs text-muted">Bench Press</div>
              <div className="stat-value font-bold text-lg">85kg</div>
              <div
                className="stat-trend up text-xs"
                style={{ color: "var(--emerald)" }}
              >
                ↑ 2.5kg
              </div>
            </div>
            <div
              className="stat p-sm rounded"
              style={{
                backgroundColor: "var(--bg-subtle, #F1F5F9)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="stat-label text-xs text-muted">Squat</div>
              <div className="stat-value font-bold text-lg">110kg</div>
              <div
                className="stat-trend up text-xs"
                style={{ color: "var(--emerald)" }}
              >
                ↑ 5kg
              </div>
            </div>
            <div
              className="stat p-sm rounded"
              style={{
                backgroundColor: "var(--bg-subtle, #F1F5F9)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="stat-label text-xs text-muted">Deadlift</div>
              <div className="stat-value font-bold text-lg">130kg</div>
              <div
                className="stat-trend up text-xs"
                style={{ color: "var(--emerald)" }}
              >
                ↑ 5kg
              </div>
            </div>
            <div
              className="stat p-sm rounded"
              style={{
                backgroundColor: "var(--bg-subtle, #F1F5F9)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="stat-label text-xs text-muted">Pull-ups</div>
              <div className="stat-value font-bold text-lg">15 reps</div>
              <div
                className="stat-trend up text-xs"
                style={{ color: "var(--emerald)" }}
              >
                ↑ 2 reps
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workout Details Modal Dialog */}
      {showDetails && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setShowDetails(false)}
        >
          <div
            className="bento-card"
            style={{
              maxWidth: "680px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              backgroundColor: "white",
              borderRadius: "1rem",
              padding: "1.75rem",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-md pb-sm border-b border-gray-100">
              <div className="flex items-center gap-sm">
                <div
                  className="p-2 rounded-xl"
                  style={{ backgroundColor: "var(--emerald-subtle)", color: "var(--emerald)" }}
                >
                  <Dumbbell size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-xs">
                    <span className="badge badge-emerald text-xs" style={{ textTransform: "capitalize" }}>
                      {selectedPlan} Plan
                    </span>
                    <span className="text-xs text-muted flex items-center gap-1">
                      <Clock size={12} /> 45 min
                    </span>
                  </div>
                  <h3 className="heading-lg mt-0.5">Workout Details: Upper Body Strength</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="btn btn-ghost btn-sm p-1.5 rounded-lg text-muted hover:text-charcoal"
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </div>

            {/* Overview Stats */}
            <div
              className="grid gap-sm mb-md p-sm rounded-xl"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                backgroundColor: "var(--bg-subtle, #F8FAFC)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="text-center">
                <div className="text-xs text-muted">Primary Focus</div>
                <div className="text-sm font-bold text-emerald">Hypertrophy</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted">Target RPE</div>
                <div className="text-sm font-bold">7.5 — 8.5</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted">Rest Intervals</div>
                <div className="text-sm font-bold">60 — 90 sec</div>
              </div>
            </div>

            {/* Warm-Up Sequence */}
            <div className="mb-md">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-xs flex items-center gap-1.5">
                <Flame size={14} className="text-amber-500" />
                <span>Phase 1: Dynamic Warm-Up (5 Mins)</span>
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                2 rounds of: 10 arm circles forward/back, 10 band pull-aparts, 8 scapular push-ups, and 10 bodyweight thoracic rotations to activate shoulder stabilizers.
              </p>
            </div>

            {/* Detailed Exercises */}
            <div className="mb-md">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-xs flex items-center gap-1.5">
                <Dumbbell size={14} className="text-emerald" />
                <span>Phase 2: Working Sets & Form Guidelines</span>
              </h4>
              <div className="flex flex-col gap-xs mt-sm">
                {exercises.map((ex, idx) => (
                  <div
                    key={ex.id}
                    className="p-sm rounded-lg flex items-center justify-between text-xs"
                    style={{
                      backgroundColor: "var(--bg-subtle, #F8FAFC)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div>
                      <div className="font-semibold text-charcoal">
                        {idx + 1}. {ex.name}
                      </div>
                      <div className="text-muted text-[11px] mt-0.5">
                        Target: {ex.muscle} • Tempo: 3-0-1-0 • 90s rest
                      </div>
                    </div>
                    <span className="badge badge-gray font-mono text-xs">{ex.detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Post-Workout Recovery */}
            <div
              className="p-sm rounded-xl mb-md flex items-start gap-sm"
              style={{
                backgroundColor: "var(--emerald-subtle)",
                border: "1px solid rgba(5, 150, 105, 0.2)",
              }}
            >
              <ShieldCheck size={18} className="text-emerald shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed" style={{ color: "var(--emerald-dark)" }}>
                <strong>Post-Workout Recovery:</strong> Hydrate with 500ml water and consume 25-30g of fast-digesting protein within 45 minutes to support muscle protein synthesis.
              </div>
            </div>

            <div className="flex justify-end gap-sm pt-xs border-t border-gray-100">
              <button
                type="button"
                className="btn btn-primary btn-sm px-4"
                onClick={() => setShowDetails(false)}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
