"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  Dumbbell,
  Utensils,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Send,
  Loader2,
  Info,
  X,
  SlidersHorizontal,
} from "lucide-react";

interface Message {
  id: string;
  sender: "agent" | "user";
  text: string;
}

interface WorkoutExercise {
  name: string;
  setsReps: string;
  rest: string;
  instructions: string;
}

interface WorkoutPlan {
  title: string;
  totalDuration: string;
  target: string;
  exercises: WorkoutExercise[];
  explanation: string;
}

interface NutritionPlan {
  title: string;
  isVegetarian: boolean;
  breakfast: string;
  lunch: string;
  snack: string;
  dinner: string;
  tips: string;
}

const QUICK_ACTIONS = [
  "Create a beginner workout for 30 minutes at home",
  "Suggest a vegetarian diet for muscle building",
  "I only have 15 minutes today. Adjust my workout",
  "Explain why you recommended these exercises",
  "Change my goal to improve endurance",
];

const STAGES = [
  "Understanding request",
  "Checking preferences",
  "Planning workout",
  "Planning nutrition",
  "Reviewing recommendations",
  "Plan ready",
] as const;

const GOAL_OPTIONS = [
  "Lose Weight",
  "Build Muscle",
  "Increase Strength",
  "Improve Endurance",
  "General Fitness",
  "Flexibility & Mobility",
];
const TIME_OPTIONS = [15, 30, 45, 60];
const LOCATION_OPTIONS = ["Home", "Gym", "Outdoor"];
const DIET_OPTIONS = ["Balanced", "Vegetarian", "High Protein"];

export default function AIAgentPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-1",
      sender: "agent",
      text: "Hello! I am your AI Fitness Agent. Tap a quick prompt or type your goals below to generate a tailored workout and nutrition plan.",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Initial state is idle: all six stages grey (pending), no plan shown (-1)
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(-1);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showModifyModal, setShowModifyModal] = useState(false);

  // Active Preferences
  const [preferences, setPreferences] = useState({
    goal: "Build Muscle",
    level: "Intermediate",
    location: "Gym",
    time: 45,
    diet: "Balanced",
    bmiCategory: "Normal Weight",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load saved preferences
    try {
      const savedGoals = localStorage.getItem("fithub_goals");
      const savedBmi = localStorage.getItem("fithub_bmi");
      const initialPrefs = { ...preferences };

      if (savedGoals) {
        const parsed = JSON.parse(savedGoals);
        if (parsed.goal) initialPrefs.goal = parsed.goal;
        if (parsed.level) initialPrefs.level = parsed.level;
        if (parsed.location) initialPrefs.location = parsed.location;
        if (parsed.time) initialPrefs.time = Number(parsed.time);
        if (parsed.diet) initialPrefs.diet = parsed.diet;
      }

      if (savedBmi) {
        const parsedBmi = JSON.parse(savedBmi);
        if (parsedBmi.category) initialPrefs.bmiCategory = parsedBmi.category;
      }

      setPreferences(initialPrefs);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Engine: generates structured workout & nutrition output and steps through stages
  const runAgentEngine = (prompt: string, overridePrefs?: typeof preferences) => {
    const p = prompt.toLowerCase();
    const newPrefs = { ...(overridePrefs || preferences) };

    // Stage 0: Understanding request (Running)
    setCurrentStageIndex(0);
    setIsTyping(true);

    setTimeout(() => {
      // Stage 1: Checking preferences
      setCurrentStageIndex(1);

      // Detect preference adjustments in prompt
      if (p.includes("vegetarian")) {
        newPrefs.diet = "Vegetarian";
      } else if (p.includes("high protein")) {
        newPrefs.diet = "High Protein";
      }

      if (p.includes("15 minute") || p.includes("15 min")) {
        newPrefs.time = 15;
      } else if (p.includes("30 minute") || p.includes("30 min")) {
        newPrefs.time = 30;
      } else if (p.includes("45 min")) {
        newPrefs.time = 45;
      } else if (p.includes("60 min")) {
        newPrefs.time = 60;
      }

      if (p.includes("home")) {
        newPrefs.location = "Home";
      } else if (p.includes("gym")) {
        newPrefs.location = "Gym";
      } else if (p.includes("outdoor")) {
        newPrefs.location = "Outdoor";
      }

      if (p.includes("beginner")) {
        newPrefs.level = "Beginner";
      } else if (p.includes("intermediate")) {
        newPrefs.level = "Intermediate";
      } else if (p.includes("advanced")) {
        newPrefs.level = "Advanced";
      }

      if (p.includes("endurance")) {
        newPrefs.goal = "Improve Endurance";
      } else if (p.includes("muscle") || p.includes("hypertrophy")) {
        newPrefs.goal = "Build Muscle";
      } else if (p.includes("lose weight")) {
        newPrefs.goal = "Lose Weight";
      }

      setPreferences(newPrefs);

      try {
        localStorage.setItem("fithub_goals", JSON.stringify(newPrefs));
      } catch {
        // storage full
      }

      setTimeout(() => {
        // Stage 2: Planning workout
        setCurrentStageIndex(2);

        // Dynamically build workout based on updated preferences
        let newWorkout: WorkoutPlan;

        if (newPrefs.time === 15) {
          newWorkout = {
            title: `15-Minute Express HIIT Circuit (${newPrefs.location})`,
            totalDuration: "15 minutes",
            target: "Full Body & Cardiorespiratory Conditioning",
            exercises: [
              {
                name: "Jump Squats / Air Squats",
                setsReps: "45s work / 15s rest (3 rounds)",
                rest: "15s rest",
                instructions: "Explosive triple extension from bottom of squat, soft landing.",
              },
              {
                name: newPrefs.location === "Gym" ? "Kettlebell Swings" : "Push-Ups to Shoulder Taps",
                setsReps: "45s work / 15s rest (3 rounds)",
                rest: "15s rest",
                instructions: "Hinge at hips, keep spine neutral and core locked tight.",
              },
              {
                name: "Mountain Climbers",
                setsReps: "45s work / 15s rest (3 rounds)",
                rest: "15s rest",
                instructions: "Drive knees alternatively toward chest with high cadence.",
              },
              {
                name: "Hollow Body Hold",
                setsReps: "40s work / 20s rest (3 rounds)",
                rest: "20s rest",
                instructions: "Lower back pressed firmly into floor, arms and legs extended.",
              },
            ],
            explanation:
              "High-density circuit maximizes caloric expenditure and metabolic conditioning in minimal time.",
          };
        } else if (newPrefs.location === "Home") {
          newWorkout = {
            title: `At-Home Calisthenics & Strength (${newPrefs.level})`,
            totalDuration: `${newPrefs.time} minutes`,
            target: "Full Body Functional Strength",
            exercises: [
              {
                name: "Tempo Bodyweight Squats",
                setsReps: "4 sets × 15-20 reps",
                rest: "60s rest",
                instructions: "3 seconds descent, explosive drive up, engaging glutes and quads.",
              },
              {
                name: "Decline / Floor Push-Ups",
                setsReps: "3 sets × 12 reps",
                rest: "60s rest",
                instructions: "Elbows at 45 degrees, chest touches floor with full lockout.",
              },
              {
                name: "Single-Leg Romanian Deadlift",
                setsReps: "3 sets × 10 reps/side",
                rest: "60s rest",
                instructions: "Hinge at hip, maintain balance and hamstring tension.",
              },
              {
                name: "Plank Shoulder Taps",
                setsReps: "3 sets × 20 taps",
                rest: "45s rest",
                instructions: "Keep hips completely squared to the floor without swaying.",
              },
            ],
            explanation:
              "Designed specifically for home setup without complex equipment, focusing on foundational movement mechanics and joint safety.",
          };
        } else if (newPrefs.goal === "Improve Endurance") {
          newWorkout = {
            title: "Endurance & VO2 Max Capacity Circuit",
            totalDuration: `${newPrefs.time} minutes`,
            target: "Aerobic Base & Muscular Stamina",
            exercises: [
              {
                name: "Rowing / Incline Treadmill Intervals",
                setsReps: "5 rounds × 2 min work @ 85% MHR",
                rest: "60s active recovery",
                instructions: "Maintain steady stroke/cadence pacing without redlining.",
              },
              {
                name: "Walking Dumbbell Lunges",
                setsReps: "3 sets × 20 strides",
                rest: "60s rest",
                instructions: "Keep torso upright, knee lightly tapping the ground.",
              },
              {
                name: "Box Jumps & Step Downs",
                setsReps: "3 sets × 12 reps",
                rest: "45s rest",
                instructions: "Land softly with bent knees, step down to protect Achilles tendon.",
              },
            ],
            explanation:
              "Targeted to expand mitochondrial density and lactate threshold through structured aerobic intervals and high-rep movement complexes.",
          };
        } else {
          newWorkout = {
            title: `Custom Strength Split (${newPrefs.goal})`,
            totalDuration: `${newPrefs.time} minutes`,
            target: "Upper/Lower Compound Focus",
            exercises: [
              {
                name: "Barbell Squats or Leg Press",
                setsReps: "4 sets × 8-10 reps",
                rest: "90s rest",
                instructions: "Descend below parallel with knees tracking toes.",
              },
              {
                name: "Romanian Deadlifts (RDL)",
                setsReps: "3 sets × 10 reps",
                rest: "90s rest",
                instructions: "Hip hinge emphasis stretching hamstrings with flat back.",
              },
              {
                name: "Dumbbell Overhead Press",
                setsReps: "3 sets × 12 reps",
                rest: "60s rest",
                instructions: "Strict press overhead with core and glutes squeezed.",
              },
            ],
            explanation: `Calibrated specifically to advance your ${newPrefs.goal} goal using compound movement patterns suited for ${newPrefs.location}.`,
          };
        }

        setTimeout(() => {
          // Stage 3: Planning nutrition
          setCurrentStageIndex(3);

          // Dynamically build nutrition plan (Strict zero meat and fish when vegetarian)
          let newNutrition: NutritionPlan;

          if (newPrefs.diet === "Vegetarian" || p.includes("vegetarian")) {
            newNutrition = {
              title: "100% Vegetarian High-Protein Fuel",
              isVegetarian: true,
              breakfast: "Protein Oatmeal with rolled oats, plant/whey protein powder, chia seeds, walnuts, and sliced banana (490 kcal, 36g protein)",
              lunch: "Crispy Baked Tofu & Warm Quinoa Bowl with edamame, baby spinach, roasted bell peppers, and tahini dressing (580 kcal, 38g protein)",
              snack: "Cottage cheese or Greek yogurt with roasted sunflower seeds and fresh berries (220 kcal, 22g protein)",
              dinner: "Hearty Red Lentil & Chickpea Curry served over brown rice with steamed greens (530 kcal, 34g protein)",
              tips: "Contains 100% vegetarian whole foods (strictly zero meat or fish). Combine legumes with whole grains for complete amino acid profiles.",
            };
          } else {
            newNutrition = {
              title: `${newPrefs.diet} Performance Fuel`,
              isVegetarian: false,
              breakfast: "Scrambled eggs with smoked salmon or turkey breast, whole grain toast, and sliced avocado (510 kcal, 40g protein)",
              lunch: "Grilled lemon-herb chicken breast with sweet potato mash and asparagus (610 kcal, 46g protein)",
              snack: "Whey isolate protein shake with an apple and a tablespoon of almond butter (230 kcal, 28g protein)",
              dinner: "Pan-seared Atlantic salmon fillet with quinoa and mixed leafy greens (540 kcal, 42g protein)",
              tips: `Prioritize 2.0g protein/kg of body weight to support your ${newPrefs.goal} targets and maintain steady recovery.`,
            };
          }

          setTimeout(() => {
            // Stage 4: Reviewing recommendations
            setCurrentStageIndex(4);

            setTimeout(() => {
              // Stage 5: Plan ready (All stages done, both plans visible)
              setCurrentStageIndex(5);
              setWorkoutPlan(newWorkout);
              setNutritionPlan(newNutrition);

              let replySummary = `I've updated your plan based on your preferences: ${newPrefs.goal} • ${newPrefs.level} • ${newPrefs.time}m ${newPrefs.location} • ${newPrefs.diet}.`;

              if (newPrefs.diet === "Vegetarian") {
                replySummary += " Your nutrition plan is strictly vegetarian with zero meat or fish, prioritizing high-yield plant and dairy proteins.";
              }

              if (newPrefs.time === 15) {
                replySummary += " Your workout has been adapted into a high-density 15-minute circuit.";
              }

              const agentMsg: Message = {
                id: (Date.now() + 1).toString(),
                sender: "agent",
                text: replySummary,
              };

              setMessages((prev) => [...prev, agentMsg]);
              setIsTyping(false);
            }, 500);
          }, 500);
        }, 500);
      }, 500);
    }, 400);
  };

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    runAgentEngine(trimmed);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend(inputText);
    }
  };

  const handleAcceptPlan = () => {
    if (!workoutPlan || !nutritionPlan) return;
    try {
      localStorage.setItem("fithub_plan_workout", JSON.stringify(workoutPlan));
      localStorage.setItem("fithub_plan_nutrition", JSON.stringify(nutritionPlan));
      showToast("Plan accepted! Saved to your profile & workouts.");
    } catch {
      showToast("Plan accepted!");
    }
  };

  const handleModifyPlan = () => {
    setShowModifyModal(true);
  };

  const handleApplyModifications = (updatedPrefs: typeof preferences) => {
    setPreferences(updatedPrefs);
    setShowModifyModal(false);
    const promptDescription = `Update plan for ${updatedPrefs.goal}, ${updatedPrefs.time} minutes, ${updatedPrefs.location}, ${updatedPrefs.diet} diet`;
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: `Modify my plan: ${updatedPrefs.goal} • ${updatedPrefs.time}m • ${updatedPrefs.location} • ${updatedPrefs.diet}`,
    };
    setMessages((prev) => [...prev, userMsg]);
    runAgentEngine(promptDescription, updatedPrefs);
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
      {toastMessage && (
        <div
          className="toast show"
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            backgroundColor: "var(--charcoal, #111827)",
            color: "white",
            padding: "0.75rem 1.25rem",
            borderRadius: "0.75rem",
            zIndex: 9999,
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.875rem",
          }}
        >
          <CheckCircle2 size={16} className="text-emerald" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bento-card span-4 mb-md flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <div className="flex items-center gap-2 mb-xs">
            <span className="badge badge-emerald text-xs font-bold flex items-center gap-1">
              <Bot size={13} /> AI Fitness Agent
            </span>
            <span className="badge badge-gray text-xs" style={{ fontSize: "10px" }}>
              Demo recommendation engine
            </span>
          </div>
          <h1 className="heading-xl font-extrabold">Autonomous Fitness Planner</h1>
          <p className="text-sm text-muted">
            Calibrated around your goals: <strong>{preferences.goal}</strong> • {preferences.level} • {preferences.time}m {preferences.location} • {preferences.diet}
          </p>
        </div>

        <div className="flex gap-xs">
          <button
            type="button"
            onClick={() => setShowModifyModal(true)}
            className="btn btn-outline btn-sm inline-flex items-center gap-1.5"
          >
            <SlidersHorizontal size={14} />
            <span>Modify Plan</span>
          </button>
          <Link href="/profile" className="btn btn-ghost btn-sm">
            Saved Profile
          </Link>
        </div>
      </div>

      <div className="bento-grid" style={{ gap: "1.25rem" }}>
        {/* 1. Chat Panel (reduced empty space, right/left alignment, thinking indicator) */}
        <div className="bento-card span-2 span-row-2 flex flex-col justify-between" style={{ minHeight: "440px" }}>
          <div className="flex justify-between items-center mb-sm pb-xs border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: isTyping ? "#F59E0B" : "var(--emerald)" }}
              />
              <span className="font-bold text-sm">Agent Conversation</span>
            </div>
            <span className="text-xs text-muted">
              {isTyping ? "Thinking..." : "Online"}
            </span>
          </div>

          {/* Messages Container with max-height and custom scroll */}
          <div
            className="messages-container flex flex-col gap-sm p-xs"
            style={{
              maxHeight: "360px",
              overflowY: "auto",
              flexGrow: 1,
            }}
          >
            {messages.map((m) => {
              const isUser = m.sender === "user";
              return (
                <div
                  key={m.id}
                  className={`message-bubble p-sm rounded-2xl text-xs leading-relaxed ${
                    isUser ? "user-message" : "agent-message"
                  }`}
                  style={{
                    backgroundColor: isUser ? "var(--emerald)" : "var(--bg-subtle, #F1F5F9)",
                    color: isUser ? "white" : "var(--text-primary, #111827)",
                    marginLeft: isUser ? "auto" : "0",
                    marginRight: isUser ? "0" : "auto",
                    maxWidth: "82%",
                    borderRadius: isUser
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  {m.text}
                </div>
              );
            })}

            {isTyping && (
              <div
                className="flex items-center gap-2 p-sm rounded-2xl text-xs text-muted"
                style={{
                  backgroundColor: "var(--bg-subtle, #F1F5F9)",
                  width: "fit-content",
                  borderRadius: "16px 16px 16px 4px",
                }}
              >
                <Loader2 size={14} className="animate-spin text-emerald" />
                <span>Agent is analyzing preferences...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Text Input Area */}
          <div
            className="chat-input-area flex gap-sm pt-sm mt-xs"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              className="form-input flex-1 text-xs"
              placeholder="Ask for custom workouts or nutrition adjustments..."
            />
            <button
              type="button"
              onClick={() => handleSend(inputText)}
              className="btn btn-primary btn-sm px-3"
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </div>
        </div>

        {/* 2. Real-Time Status Pipeline (Pending -> Running -> Done) */}
        <div className="bento-card span-1">
          <div className="flex justify-between items-center mb-sm">
            <h2 className="card-title text-base font-bold">Pipeline Status</h2>
            <span className="badge badge-gray text-xs" style={{ fontSize: "10px" }}>
              {currentStageIndex === -1 ? "Idle" : currentStageIndex === 5 ? "Ready" : "Active"}
            </span>
          </div>

          <div className="task-status flex flex-col gap-sm">
            {STAGES.map((stg, i) => {
              // When idle (-1), all are pending (grey)
              const isIdle = currentStageIndex === -1;
              const isPast = !isIdle && i < currentStageIndex;
              const isRunning = !isIdle && i === currentStageIndex && isTyping;
              const isDone = !isIdle && (i < currentStageIndex || (i === 5 && currentStageIndex === 5));

              return (
                <div key={stg} className="step flex items-center gap-sm text-xs">
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: isDone
                        ? "var(--emerald)"
                        : isRunning
                        ? "#F59E0B"
                        : "#CBD5E1",
                    }}
                  />
                  <span
                    className={`font-medium ${
                      isDone
                        ? "text-charcoal"
                        : isRunning
                        ? "text-amber-600 font-bold"
                        : "text-muted"
                    }`}
                  >
                    {stg}
                  </span>
                  {isRunning && (
                    <span className="ml-auto badge badge-amber text-xs" style={{ fontSize: "10px" }}>
                      Running
                    </span>
                  )}
                  {isDone && (
                    <CheckCircle2 size={13} className="ml-auto text-emerald" />
                  )}
                  {isIdle && (
                    <span className="ml-auto text-[10px] text-gray-400">Pending</span>
                  )}
                  {!isIdle && !isDone && !isRunning && (
                    <span className="ml-auto text-[10px] text-gray-400">Pending</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-md pt-xs border-t border-gray-100 text-xs text-muted flex justify-between items-center">
            <span>Goal: <strong>{preferences.goal}</strong></span>
            <button
              type="button"
              onClick={() => setShowModifyModal(true)}
              className="text-emerald hover:underline text-xs"
            >
              Change
            </button>
          </div>
        </div>

        {/* 3. Quick Action Prompts (Restyled as rounded pill cards with hover lift) */}
        <div className="bento-card span-1">
          <h2 className="card-title text-base font-bold mb-xs">Quick Action Prompts</h2>
          <p className="text-xs text-muted mb-sm">Tap a prompt to generate or adjust plan:</p>
          <div className="flex flex-col gap-2">
            {QUICK_ACTIONS.map((action, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(action)}
                className="text-left text-xs font-semibold cursor-pointer transition-all"
                style={{
                  borderRadius: "14px",
                  padding: "10px 14px",
                  border: "1.5px solid rgba(5, 150, 105, 0.25)",
                  backgroundColor: "#ffffff",
                  color: "var(--text-primary, #111827)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(5, 150, 105, 0.15)";
                  e.currentTarget.style.borderColor = "var(--emerald)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.03)";
                  e.currentTarget.style.borderColor = "rgba(5, 150, 105, 0.25)";
                }}
              >
                &ldquo;{action}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* 4 & 5. Plan Area (Placeholder when idle, Plans when generated) */}
        {!workoutPlan || !nutritionPlan ? (
          <div
            className="bento-card span-4 flex flex-col items-center justify-center p-xl text-center"
            style={{
              minHeight: "300px",
              border: "2px dashed var(--border, #E2E8F0)",
              backgroundColor: "var(--bg-subtle, #F8FAFC)",
            }}
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
              <Sparkles size={28} />
            </div>
            <h3 className="heading-md font-bold mb-xs">No plan yet</h3>
            <p className="text-sm text-muted max-w-md mb-md leading-relaxed">
              Ask the agent or tap a quick prompt above to generate your customized workout and nutrition plans.
            </p>
            <button
              type="button"
              onClick={() => handleSend("Create a beginner workout for 30 minutes at home")}
              className="btn btn-primary btn-sm inline-flex items-center gap-1.5"
            >
              <Bot size={14} />
              <span>Generate Sample Plan</span>
            </button>
          </div>
        ) : (
          <>
            {/* Generated Workout Plan Card */}
            <div className="bento-card span-2 no-hover flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-md">
                  <div className="flex items-center gap-sm">
                    <div
                      className="p-2 rounded-xl"
                      style={{ backgroundColor: "var(--emerald-subtle)", color: "var(--emerald)" }}
                    >
                      <Dumbbell size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted">
                        Recommended Workout Plan
                      </span>
                      <h3 className="heading-md font-bold">{workoutPlan.title}</h3>
                    </div>
                  </div>
                  <span className="badge badge-emerald text-xs font-bold flex items-center gap-1">
                    <Clock size={12} /> {workoutPlan.totalDuration}
                  </span>
                </div>

                {/* Rounded exercise rows with consistent padding and readable rest labels */}
                <div className="flex flex-col gap-sm">
                  {workoutPlan.exercises.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-sm rounded-xl"
                      style={{
                        backgroundColor: "var(--bg-subtle, #F8FAFC)",
                        border: "1px solid var(--border)",
                        padding: "12px 14px",
                      }}
                    >
                      <div className="flex justify-between items-center mb-xs">
                        <span className="font-bold text-sm" style={{ color: "var(--charcoal, #111827)" }}>
                          {idx + 1}. {ex.name}
                        </span>
                        <span className="badge badge-gray font-semibold text-xs">{ex.setsReps}</span>
                      </div>
                      <div className="text-xs text-muted flex justify-between items-center">
                        <span className="pr-2">{ex.instructions}</span>
                        <span className="font-semibold text-emerald whitespace-nowrap">{ex.rest}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-md p-sm rounded bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-800 leading-relaxed">
                  <strong>Coach Note:</strong> {workoutPlan.explanation}
                </div>
              </div>

              <div className="flex gap-sm mt-md pt-sm border-t border-gray-100">
                <button
                  type="button"
                  className="btn btn-primary btn-sm inline-flex items-center gap-1.5"
                  onClick={handleAcceptPlan}
                >
                  <CheckCircle2 size={14} />
                  <span>Accept Workout Plan</span>
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleModifyPlan}
                >
                  Modify Plan
                </button>
              </div>
            </div>

            {/* Generated Nutrition Plan Card */}
            <div className="bento-card span-2 no-hover flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-md">
                  <div className="flex items-center gap-sm">
                    <div
                      className="p-2 rounded-xl"
                      style={{ backgroundColor: "var(--emerald-subtle)", color: "var(--emerald)" }}
                    >
                      <Utensils size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted">
                        Recommended Nutrition Plan
                      </span>
                      <h3 className="heading-md font-bold">{nutritionPlan.title}</h3>
                    </div>
                  </div>
                  {nutritionPlan.isVegetarian ? (
                    <span className="badge badge-emerald text-xs font-bold">100% Vegetarian (0 Meat/Fish)</span>
                  ) : (
                    <span className="badge badge-amber text-xs font-bold">{preferences.diet}</span>
                  )}
                </div>

                <div className="flex flex-col gap-sm text-xs">
                  <div
                    className="p-sm rounded-xl"
                    style={{
                      backgroundColor: "var(--bg-subtle, #F8FAFC)",
                      border: "1px solid var(--border)",
                      padding: "12px 14px",
                    }}
                  >
                    <span className="font-bold text-charcoal block mb-0.5">Breakfast</span>
                    <span className="text-muted">{nutritionPlan.breakfast}</span>
                  </div>
                  <div
                    className="p-sm rounded-xl"
                    style={{
                      backgroundColor: "var(--bg-subtle, #F8FAFC)",
                      border: "1px solid var(--border)",
                      padding: "12px 14px",
                    }}
                  >
                    <span className="font-bold text-charcoal block mb-0.5">Lunch</span>
                    <span className="text-muted">{nutritionPlan.lunch}</span>
                  </div>
                  <div
                    className="p-sm rounded-xl"
                    style={{
                      backgroundColor: "var(--bg-subtle, #F8FAFC)",
                      border: "1px solid var(--border)",
                      padding: "12px 14px",
                    }}
                  >
                    <span className="font-bold text-charcoal block mb-0.5">Snack</span>
                    <span className="text-muted">{nutritionPlan.snack}</span>
                  </div>
                  <div
                    className="p-sm rounded-xl"
                    style={{
                      backgroundColor: "var(--bg-subtle, #F8FAFC)",
                      border: "1px solid var(--border)",
                      padding: "12px 14px",
                    }}
                  >
                    <span className="font-bold text-charcoal block mb-0.5">Dinner</span>
                    <span className="text-muted">{nutritionPlan.dinner}</span>
                  </div>
                </div>

                <div className="mt-md p-sm rounded bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-800 leading-relaxed">
                  <strong>Dietary Guidance:</strong> {nutritionPlan.tips}
                </div>
              </div>

              <div className="flex gap-sm mt-md pt-sm border-t border-gray-100">
                <button
                  type="button"
                  className="btn btn-primary btn-sm inline-flex items-center gap-1.5"
                  onClick={handleAcceptPlan}
                >
                  <CheckCircle2 size={14} />
                  <span>Accept Nutrition Plan</span>
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleModifyPlan}
                >
                  Modify Diet
                </button>
              </div>
            </div>
          </>
        )}

        {/* 6. Transparency Card */}
        <div className="bento-card span-4 flex flex-col md:flex-row justify-between items-start md:items-center p-md gap-sm bg-gray-50 border border-gray-200">
          <div className="flex items-center gap-sm text-xs text-muted">
            <Info size={16} className="text-emerald flex-shrink-0" />
            <span>
              <strong>Demo recommendation engine:</strong> All workouts and nutritional splits are generated client-side from your configured parameters.
            </span>
          </div>
          <Link href="/profile" className="text-xs font-bold text-emerald hover:underline flex-shrink-0">
            View Saved Profile &rarr;
          </Link>
        </div>
      </div>

      {/* Modify Plan Interactive Modal Dialog */}
      {showModifyModal && (
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
          onClick={() => setShowModifyModal(false)}
        >
          <div
            className="bento-card"
            style={{
              maxWidth: "560px",
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
            <div className="flex justify-between items-start mb-md pb-xs border-b border-gray-100">
              <div>
                <h3 className="heading-lg">Modify Plan Parameters</h3>
                <p className="text-xs text-muted mt-0.5">
                  Change settings and instantly regenerate your workout & nutrition
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModifyModal(false)}
                className="btn btn-ghost btn-sm p-1 rounded-lg text-muted hover:text-charcoal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Goal Selector */}
            <div className="mb-md">
              <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
                Goal
              </label>
              <div
                className="grid gap-xs"
                style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}
              >
                {GOAL_OPTIONS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setPreferences((p) => ({ ...p, goal: g }))}
                    className={`p-2 rounded-lg text-xs font-semibold text-left border transition-all ${
                      preferences.goal === g
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selector */}
            <div className="mb-md">
              <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
                Session Duration
              </label>
              <div
                className="grid gap-xs"
                style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}
              >
                {TIME_OPTIONS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setPreferences((p) => ({ ...p, time: t }))}
                    className={`p-2 rounded-lg text-xs font-bold text-center border transition-all ${
                      preferences.time === t
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {t} min
                  </button>
                ))}
              </div>
            </div>

            {/* Location Selector */}
            <div className="mb-md">
              <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
                Workout Location
              </label>
              <div
                className="grid gap-xs"
                style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}
              >
                {LOCATION_OPTIONS.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setPreferences((p) => ({ ...p, location: loc }))}
                    className={`p-2 rounded-lg text-xs font-semibold text-center border transition-all ${
                      preferences.location === loc
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Preference */}
            <div className="mb-md">
              <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
                Dietary Preference
              </label>
              <div
                className="grid gap-xs"
                style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}
              >
                {DIET_OPTIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setPreferences((p) => ({ ...p, diet: d }))}
                    className={`p-2 rounded-lg text-xs font-semibold text-center border transition-all ${
                      preferences.diet === d
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-sm pt-sm border-t border-gray-100">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setShowModifyModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm inline-flex items-center gap-1.5"
                onClick={() => handleApplyModifications(preferences)}
              >
                <Sparkles size={14} />
                <span>Apply & Regenerate Plan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
