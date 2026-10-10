"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Target,
  ArrowRight,
  ArrowLeft,
  Dumbbell,
  Flame,
  Zap,
  Heart,
  Activity,
  Sparkles,
  Home,
  Building2,
  TreePine,
  Clock,
  Utensils,
  CheckCircle2,
  Check,
  Scale,
} from "lucide-react";

const GOALS = [
  { id: "Lose Weight", label: "Lose Weight", icon: Flame, desc: "Shed body fat and boost metabolic rate" },
  { id: "Build Muscle", label: "Build Muscle", icon: Dumbbell, desc: "Hypertrophy training for lean mass" },
  { id: "Increase Strength", label: "Increase Strength", icon: Zap, desc: "Lift heavier with progressive overload" },
  { id: "Improve Endurance", label: "Improve Endurance", icon: Heart, desc: "Cardiovascular stamina and VO2 max" },
  { id: "General Fitness", label: "General Fitness", icon: Activity, desc: "Overall energy, health and well-being" },
  { id: "Flexibility & Mobility", label: "Flexibility & Mobility", icon: Sparkles, desc: "Joint health and range of motion" },
];

const FITNESS_LEVELS = [
  { id: "Beginner", label: "Beginner", icon: Sparkles },
  { id: "Intermediate", label: "Intermediate", icon: Zap },
  { id: "Advanced", label: "Advanced", icon: Flame },
] as const;

const LOCATIONS = [
  { id: "Home", label: "Home", icon: Home },
  { id: "Gym", label: "Gym", icon: Building2 },
  { id: "Outdoor", label: "Outdoor", icon: TreePine },
] as const;

const TIME_OPTIONS = [15, 30, 45, 60] as const;
const DIET_OPTIONS = ["Balanced", "Vegetarian", "High Protein"] as const;

export default function GoalsPage() {
  const router = useRouter();

  // Selections
  const [selectedGoal, setSelectedGoal] = useState<string>("Build Muscle");
  const [fitnessLevel, setFitnessLevel] = useState<string>("Intermediate");
  const [location, setLocation] = useState<string>("Gym");
  const [availableTime, setAvailableTime] = useState<number>(45);
  const [diet, setDiet] = useState<string>("High Protein");

  // Optional BMI note
  const [linkedBmi, setLinkedBmi] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    // Restore any previously saved goal preferences
    try {
      const savedGoals = localStorage.getItem("fithub_goals");
      if (savedGoals) {
        const parsed = JSON.parse(savedGoals);
        if (parsed.goal) setSelectedGoal(parsed.goal);
        if (parsed.level) setFitnessLevel(parsed.level);
        if (parsed.location) setLocation(parsed.location);
        if (parsed.time) setAvailableTime(parsed.time);
        if (parsed.diet) setDiet(parsed.diet);
      }

      // Check optional BMI
      const savedBmi = localStorage.getItem("fithub_bmi");
      if (savedBmi) {
        const parsedBmi = JSON.parse(savedBmi);
        setLinkedBmi(`${parsedBmi.bmi} (${parsedBmi.category})`);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) {
      setErrorMsg("Please select a primary fitness goal.");
      return;
    }

    const goalsData = {
      goal: selectedGoal,
      level: fitnessLevel,
      location,
      time: availableTime,
      diet,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("fithub_goals", JSON.stringify(goalsData));
    } catch {
      // storage full
    }

    // Phase 3 requirement: Continue -> /signup
    router.push("/signup");
  };

  return (
    <main className="page-container mt-lg mb-xl">
      <style>{`
        /* 1. Goal Cards: 4 columns desktop, 2 tablet, 1 mobile */
        .goals-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 1080px) {
          .goals-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .goals-cards-grid {
            grid-template-columns: 1fr;
          }
        }

        .goal-card {
          border-radius: 16px;
          padding: 20px;
          min-height: 190px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          position: relative;
          cursor: pointer;
          background-color: var(--bg-card, #ffffff);
          border: 1.5px solid var(--border, #E5E7EB);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
        }
        .goal-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
        }
        .goal-card.selected {
          border: 2px solid var(--emerald, #059669);
          background-color: var(--emerald-subtle, #ECFDF5);
          box-shadow: 0 4px 14px rgba(5, 150, 105, 0.15);
        }
        .goal-card.selected:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(5, 150, 105, 0.22);
        }

        .goal-icon-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: var(--emerald-subtle, #ECFDF5);
          color: var(--emerald, #059669);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          transition: background-color 0.2s ease, color 0.2s ease;
        }
        .goal-card.selected .goal-icon-circle {
          background-color: var(--emerald, #059669);
          color: #ffffff;
        }

        .goal-title {
          font-family: var(--font-heading, 'Manrope', sans-serif);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary, #111827);
          margin-bottom: 6px;
          line-height: 1.25;
        }
        .goal-desc {
          font-size: 0.8125rem;
          color: var(--text-secondary, #64748B);
          line-height: 1.45;
        }
        .goal-check-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background-color: var(--emerald, #059669);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(5, 150, 105, 0.35);
        }

        /* 2. Options list: Level & Location */
        .options-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .option-card {
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          cursor: pointer;
          background-color: var(--bg-card, #ffffff);
          border: 1.5px solid var(--border, #E5E7EB);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
        }
        .option-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        }
        .option-card.selected {
          border: 2px solid var(--emerald, #059669);
          background-color: var(--emerald-subtle, #ECFDF5);
          box-shadow: 0 4px 14px rgba(5, 150, 105, 0.12);
        }
        .option-icon-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: var(--emerald-subtle, #ECFDF5);
          color: var(--emerald, #059669);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .option-card.selected .option-icon-circle {
          background-color: var(--emerald, #059669);
          color: #ffffff;
        }
        .option-label {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary, #111827);
        }

        /* 3 & 4. Rounded Pill Buttons: Time & Diet */
        .pills-grid-time {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        @media (max-width: 520px) {
          .pills-grid-time {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .pills-grid-diet {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        @media (max-width: 520px) {
          .pills-grid-diet {
            grid-template-columns: 1fr;
          }
        }

        .pill-btn {
          border-radius: 9999px;
          padding: 13px 16px;
          font-size: 1.05rem;
          font-weight: 700;
          cursor: pointer;
          text-align: center;
          background-color: var(--bg-card, #ffffff);
          border: 1.5px solid var(--border, #E5E7EB);
          color: var(--text-primary, #111827);
          transition: all 0.2s ease;
          width: 100%;
        }
        .pill-btn:hover {
          border-color: var(--emerald-hover, #047857);
        }
        .pill-btn.selected {
          background-color: var(--emerald, #059669);
          border-color: var(--emerald, #059669);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25);
        }

        /* 6. Sticky Continue Bar */
        .continue-sticky-card {
          position: sticky;
          bottom: 1rem;
          z-index: 30;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          background-color: rgba(255, 255, 255, 0.95);
          border: 1px solid var(--border, #E5E7EB);
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
        }
        .continue-btn {
          font-size: 1.05rem;
          font-weight: 700;
          padding: 16px 36px;
          border-radius: 14px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: none;
        }
        .continue-btn:not(:disabled) {
          background-color: var(--emerald, #059669);
          color: #ffffff;
          box-shadow: 0 4px 16px rgba(5, 150, 105, 0.35);
          cursor: pointer;
        }
        .continue-btn:not(:disabled):hover {
          background-color: var(--emerald-hover, #047857);
          box-shadow: 0 6px 20px rgba(5, 150, 105, 0.45);
          transform: translateY(-1px);
        }
        .continue-btn:disabled {
          background-color: #E2E8F0;
          color: #94A3B8;
          border: 1px solid #CBD5E1;
          cursor: not-allowed;
          box-shadow: none;
        }
      `}</style>

      <div className="bento-grid">
        {/* Header Card */}
        <div className="bento-card span-4 card-subtle flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
          <div className="flex-1 w-full max-w-xl">
            {/* Slim emerald progress bar (66% filled) plus label and linked BMI */}
            <div className="flex flex-wrap items-center gap-sm mb-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  Step 2 of 3 • Fitness Goals
                </span>
                <div
                  className="rounded-full overflow-hidden"
                  style={{
                    backgroundColor: "var(--border, #E2E8F0)",
                    height: "6px",
                    width: "120px",
                  }}
                  title="Step 2 of 3 (66% complete)"
                >
                  <div
                    style={{
                      width: "66%",
                      backgroundColor: "var(--emerald)",
                      height: "100%",
                      borderRadius: "9999px",
                    }}
                  />
                </div>
              </div>

              {linkedBmi && (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: "var(--emerald-subtle)",
                    color: "var(--emerald-dark)",
                    border: "1px solid rgba(5, 150, 105, 0.25)",
                  }}
                >
                  <Scale size={12} className="text-emerald" />
                  <span>Linked BMI: <strong>{linkedBmi}</strong></span>
                </span>
              )}
            </div>

            <h1 className="heading-xl font-extrabold" style={{ fontFamily: "var(--font-heading)" }}>
              Personalize Your Fitness Goals
            </h1>
            <p className="text-sm text-muted mt-1">
              Select your targets to calibrate your customized workouts and nutrition plans.
            </p>
          </div>

          <Link
            href="/"
            className="btn btn-ghost btn-sm inline-flex items-center gap-1 text-muted hover:text-emerald self-start md:self-auto"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </Link>
        </div>

        {errorMsg && (
          <div className="span-4 p-sm rounded bg-red-50 text-red-600 text-sm font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleContinue} className="span-4 grid gap-lg" style={{ display: "contents" }}>
          {/* 1. Primary Goal Selection */}
          <div className="bento-card span-4 no-hover">
            <div className="card-header mb-md">
              <div className="flex items-center gap-2">
                <Target size={20} style={{ color: "var(--emerald)" }} />
                <h2 className="heading-md font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                  1. Choose Your Primary Goal (Required)
                </h2>
              </div>
            </div>

            {/* Responsive: 4 columns desktop, 2 on tablet, 1 on mobile */}
            <div className="goals-cards-grid">
              {GOALS.map((g) => {
                const Icon = g.icon;
                const isSelected = selectedGoal === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      setSelectedGoal(g.id);
                      setErrorMsg("");
                    }}
                    className={`goal-card ${isSelected ? "selected" : ""}`}
                  >
                    {isSelected && (
                      <div className="goal-check-badge">
                        <Check size={13} strokeWidth={3} />
                      </div>
                    )}
                    <div className="goal-icon-circle">
                      <Icon size={22} strokeWidth={2.2} />
                    </div>
                    <div className="goal-title">{g.label}</div>
                    <div className="goal-desc">{g.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Fitness Level */}
          <div className="bento-card span-2 no-hover flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-md">
              <Zap size={18} style={{ color: "var(--emerald)" }} />
              <h3 className="heading-md font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                2. Experience Level
              </h3>
            </div>
            <div className="options-list">
              {FITNESS_LEVELS.map((lvl) => {
                const Icon = lvl.icon;
                const isSelected = fitnessLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setFitnessLevel(lvl.id)}
                    className={`option-card ${isSelected ? "selected" : ""}`}
                  >
                    <div className="flex items-center">
                      <div className="option-icon-circle">
                        <Icon size={18} strokeWidth={2.2} />
                      </div>
                      <span className="option-label">{lvl.label}</span>
                    </div>
                    {isSelected && (
                      <div className="option-check">
                        <CheckCircle2 size={18} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Workout Location */}
          <div className="bento-card span-2 no-hover flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-md">
              <Home size={18} style={{ color: "var(--emerald)" }} />
              <h3 className="heading-md font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                3. Workout Location
              </h3>
            </div>
            <div className="options-list">
              {LOCATIONS.map((loc) => {
                const Icon = loc.icon;
                const isSelected = location === loc.id;
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => setLocation(loc.id)}
                    className={`option-card ${isSelected ? "selected" : ""}`}
                  >
                    <div className="flex items-center">
                      <div className="option-icon-circle">
                        <Icon size={18} strokeWidth={2.2} />
                      </div>
                      <span className="option-label">{loc.label}</span>
                    </div>
                    {isSelected && (
                      <div className="option-check">
                        <CheckCircle2 size={18} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Available Time */}
          <div className="bento-card span-2 no-hover flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-md">
              <Clock size={18} style={{ color: "var(--emerald)" }} />
              <h3 className="heading-md font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                4. Available Session Time
              </h3>
            </div>
            <div className="pills-grid-time">
              {TIME_OPTIONS.map((mins) => {
                const isSelected = availableTime === mins;
                return (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setAvailableTime(mins)}
                    className={`pill-btn ${isSelected ? "selected" : ""}`}
                  >
                    {mins} min
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Dietary Preference */}
          <div className="bento-card span-2 no-hover flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-md">
              <Utensils size={18} style={{ color: "var(--emerald)" }} />
              <h3 className="heading-md font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                5. Dietary Preference
              </h3>
            </div>
            <div className="pills-grid-diet">
              {DIET_OPTIONS.map((d) => {
                const isSelected = diet === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDiet(d)}
                    className={`pill-btn ${isSelected ? "selected" : ""}`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Sticky / Clearly Visible Continue Action Card */}
          <div className="bento-card span-4 continue-sticky-card flex flex-col sm:flex-row justify-between items-center p-md md:p-lg gap-md">
            <div>
              <div
                className="font-bold text-base"
                style={{ color: "var(--charcoal, #111827)", fontFamily: "var(--font-heading)" }}
              >
                Ready to unlock your plan?
              </div>
              <div className="text-xs text-muted mt-0.5">
                {selectedGoal ? (
                  <>
                    Selected: <strong style={{ color: "var(--emerald)" }}>{selectedGoal}</strong> • {fitnessLevel} • {availableTime} min • {diet}
                  </>
                ) : (
                  <span className="text-amber-600 font-medium">Please select a primary goal above to continue</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedGoal}
              className="continue-btn w-full sm:w-auto"
            >
              <span>Continue to Account Setup</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
