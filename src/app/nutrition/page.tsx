"use client";

import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { registerChartJS } from "@/lib/chartjs";
import { Info, X, Utensils, Apple, Sparkles, CheckCircle2 } from "lucide-react";

export default function NutritionPage() {
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
  const [showDietDetails, setShowDietDetails] = useState(false);
  const [waterGlasses, setWaterGlasses] = useState(0);

  useEffect(() => {
    registerChartJS();
    try {
      const savedWater = localStorage.getItem("fithub_water");
      if (savedWater) setWaterGlasses(Number(savedWater));
    } catch {
      // ignore
    }
  }, []);

  const loggedLiters = (waterGlasses * 0.25).toFixed(1);
  const hydrationPercent = Math.min(100, Math.round(((waterGlasses * 0.25) / 3.0) * 100));

  const calorieData = {
    labels: ["Eaten", "Remaining"],
    datasets: [
      {
        data: [0, 2200],
        backgroundColor: ["#059669", "#E5E7EB"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const calorieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: { label: string; raw: unknown }) => {
            return ` ${context.label}: ${context.raw} kcal`;
          },
        },
      },
    },
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
        {/* Macro Tracker Card */}
        <div className="bento-card span-2">
          <div className="flex justify-between items-center mb-sm">
            <h2 className="heading-lg">Daily Macros</h2>
            <span className="badge badge-gray text-xs">Today</span>
          </div>

          <div className="macro-item mt-md">
            <div className="macro-header flex justify-between text-sm mb-xs">
              <span className="macro-name font-medium">Protein</span>
              <span className="macro-values text-muted">0g / 150g</span>
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

          <div className="macro-item mt-md">
            <div className="macro-header flex justify-between text-sm mb-xs">
              <span className="macro-name font-medium">Carbs</span>
              <span className="macro-values text-muted">0g / 250g</span>
            </div>
            <div
              className="progress-bar w-full rounded-full overflow-hidden"
              style={{ backgroundColor: "var(--soft-gray, #E5E7EB)", height: "8px" }}
            >
              <div
                className="progress-fill"
                style={{
                  width: "0%",
                  backgroundColor: "#F59E0B",
                  height: "100%",
                }}
              />
            </div>
          </div>

          <div className="macro-item mt-md">
            <div className="macro-header flex justify-between text-sm mb-xs">
              <span className="macro-name font-medium">Fat</span>
              <span className="macro-values text-muted">0g / 70g</span>
            </div>
            <div
              className="progress-bar w-full rounded-full overflow-hidden"
              style={{ backgroundColor: "var(--soft-gray, #E5E7EB)", height: "8px" }}
            >
              <div
                className="progress-fill"
                style={{
                  width: "0%",
                  backgroundColor: "#3B82F6",
                  height: "100%",
                }}
              />
            </div>
          </div>
        </div>

        {/* Calorie Summary Card */}
        <div className="bento-card span-1 no-hover flex flex-col items-center justify-between">
          <h3 className="card-title text-center">Calories</h3>
          <div
            style={{
              position: "relative",
              height: "150px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0.5rem 0",
            }}
          >
            <Doughnut data={calorieData} options={calorieOptions} />
          </div>
          <div className="text-center mt-xs">
            <div className="text-xs text-muted font-medium">
              0 eaten • 2,200 left
            </div>
          </div>
        </div>

        {/* Hydration Card */}
        <div className="bento-card span-1 flex flex-col justify-between">
          <h3 className="card-title text-center">Hydration</h3>
          <div className="hydration-container flex flex-col items-center justify-center gap-sm my-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="water-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
              style={{ color: "#3B82F6", width: "42px", height: "42px" }}
            >
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
            <div className="heading-md font-bold">{loggedLiters}L / 3.0L</div>
            <div
              className="progress-bar w-full rounded-full overflow-hidden"
              style={{ backgroundColor: "var(--soft-gray, #E5E7EB)", height: "8px" }}
            >
              <div
                className="progress-fill"
                style={{
                  width: `${hydrationPercent}%`,
                  backgroundColor: "#3B82F6",
                  height: "100%",
                }}
              />
            </div>
            <div className="text-xs text-muted">{hydrationPercent}% completed</div>
          </div>
        </div>

        {/* Meal Plan Card */}
        <div className="bento-card span-2 span-row-2 no-hover">
          <div className="flex justify-between items-start mb-md">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="heading-lg">Today&apos;s Meal Plan</h2>
                <span className="badge badge-gray text-xs">Demo data</span>
              </div>
              <p className="text-xs text-muted mt-0.5">Sample balanced nutrition schedule</p>
            </div>
            <button
              type="button"
              onClick={() => setShowDietDetails(true)}
              className="btn btn-outline btn-sm inline-flex items-center gap-1.5 whitespace-nowrap text-xs"
            >
              <Info size={14} className="text-emerald" />
              <span>Diet Details</span>
            </button>
          </div>

          <div
            className="meal-section mb-md pb-sm"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <div className="meal-header flex justify-between items-center mb-xs">
              <span className="meal-title font-semibold text-sm">Breakfast</span>
              <span className="meal-cals text-xs text-muted">480 cal</span>
            </div>
            <div className="meal-items flex flex-col gap-xs text-xs text-muted">
              <div>• Oatmeal with berries</div>
              <div>• Greek yogurt with honey</div>
              <div>• Spinach & green smoothie</div>
            </div>
          </div>

          <div
            className="meal-section mb-md pb-sm"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <div className="meal-header flex justify-between items-center mb-xs">
              <span className="meal-title font-semibold text-sm">Lunch</span>
              <span className="meal-cals text-xs text-muted">620 cal</span>
            </div>
            <div className="meal-items flex flex-col gap-xs text-xs text-muted">
              <div>• Grilled chicken salad</div>
              <div>• Quinoa & roasted veggies bowl</div>
              <div>• Handful of mixed nuts</div>
            </div>
          </div>

          <div
            className="meal-section mb-md pb-sm"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <div className="meal-header flex justify-between items-center mb-xs">
              <span className="meal-title font-semibold text-sm">Dinner</span>
              <span className="meal-cals text-xs text-muted">450 cal</span>
            </div>
            <div className="meal-items flex flex-col gap-xs text-xs text-muted">
              <div>• Atlantic salmon with steamed asparagus</div>
              <div>• Brown rice</div>
              <div>• Crisp lemon herb side salad</div>
            </div>
          </div>

          <div className="meal-section">
            <div className="meal-header flex justify-between items-center mb-xs">
              <span className="meal-title font-semibold text-sm">Snacks</span>
              <span className="meal-cals text-xs text-muted">130 cal</span>
            </div>
            <div className="meal-items flex flex-col gap-xs text-xs text-muted">
              <div>• Whey protein bar</div>
              <div>• Crisp green apple</div>
            </div>
          </div>
        </div>

        {/* Recipe Card 1 */}
        <div className="bento-card span-1 flex flex-col justify-between">
          <div
            className="recipe-card-img text-center py-md rounded mb-sm"
            style={{
              fontSize: "2.75rem",
              backgroundColor: "var(--bg-subtle, #F1F5F9)",
            }}
          >
            🥗
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-xs">Mediterranean Salad</h3>
            <p className="text-xs text-muted mb-sm">350 cal · 25 min</p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm w-full"
            onClick={() =>
              setSelectedRecipe(
                selectedRecipe === "Mediterranean Salad"
                  ? null
                  : "Mediterranean Salad"
              )
            }
          >
            {selectedRecipe === "Mediterranean Salad" ? "Hide" : "View Recipe"}
          </button>
          {selectedRecipe === "Mediterranean Salad" && (
            <div
              className="mt-sm p-xs rounded text-xs text-muted"
              style={{ backgroundColor: "var(--bg-subtle)" }}
            >
              Cucumbers, cherry tomatoes, kalamata olives, feta cheese, and extra
              virgin olive oil.
            </div>
          )}
        </div>

        {/* Recipe Card 2 */}
        <div className="bento-card span-1 flex flex-col justify-between">
          <div
            className="recipe-card-img text-center py-md rounded mb-sm"
            style={{
              fontSize: "2.75rem",
              backgroundColor: "var(--bg-subtle, #F1F5F9)",
            }}
          >
            🍗
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-xs">Grilled Chicken Bowl</h3>
            <p className="text-xs text-muted mb-sm">480 cal · 30 min</p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm w-full"
            onClick={() =>
              setSelectedRecipe(
                selectedRecipe === "Grilled Chicken Bowl"
                  ? null
                  : "Grilled Chicken Bowl"
              )
            }
          >
            {selectedRecipe === "Grilled Chicken Bowl" ? "Hide" : "View Recipe"}
          </button>
          {selectedRecipe === "Grilled Chicken Bowl" && (
            <div
              className="mt-sm p-xs rounded text-xs text-muted"
              style={{ backgroundColor: "var(--bg-subtle)" }}
            >
              Herb marinated chicken breast, brown rice, avocado slices, and lime
              vinaigrette.
            </div>
          )}
        </div>

        {/* Nutrition Tips Card */}
        <div className="bento-card span-4">
          <div className="flex justify-between items-center mb-md">
            <h2 className="heading-md">Nutrition Guidelines</h2>
            <span className="badge badge-gray text-xs">Demo guidance</span>
          </div>
          <div
            className="tips-flex"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            <div
              className="tip-item p-md rounded flex gap-sm items-start"
              style={{
                backgroundColor: "var(--bg-subtle, #F1F5F9)",
                border: "1px solid var(--border)",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>🥑</span>
              <div>
                <h4 className="font-semibold text-sm mb-xs">
                  Prioritize Whole Foods
                </h4>
                <p className="text-xs text-muted">
                  Focus on unprocessed whole proteins, complex carbs, and nutrient-dense
                  fats to nourish steady energy.
                </p>
              </div>
            </div>

            <div
              className="tip-item p-md rounded flex gap-sm items-start"
              style={{
                backgroundColor: "var(--bg-subtle, #F1F5F9)",
                border: "1px solid var(--border)",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>⚡</span>
              <div>
                <h4 className="font-semibold text-sm mb-xs">
                  Workout Nutrition Timing
                </h4>
                <p className="text-xs text-muted">
                  Consume moderate carbs 60 min before working out, followed by
                  25-30g of protein within 45 min after training.
                </p>
              </div>
            </div>

            <div
              className="tip-item p-md rounded flex gap-sm items-start"
              style={{
                backgroundColor: "var(--bg-subtle, #F1F5F9)",
                border: "1px solid var(--border)",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>💧</span>
              <div>
                <h4 className="font-semibold text-sm mb-xs">
                  Morning Hydration
                </h4>
                <p className="text-xs text-muted">
                  Start your day with 500ml of water with a pinch of electrolytes
                  to jumpstart metabolism and cognitive function.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diet Details Modal Dialog */}
      {showDietDetails && (
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
          onClick={() => setShowDietDetails(false)}
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
                  <Utensils size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-xs">
                    <span className="badge badge-emerald text-xs">Daily Nutrition Protocol</span>
                    <span className="text-xs text-muted">2,200 Total kcal</span>
                  </div>
                  <h3 className="heading-lg mt-0.5">Diet Details & Macro Strategy</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDietDetails(false)}
                className="btn btn-ghost btn-sm p-1.5 rounded-lg text-muted hover:text-charcoal"
                aria-label="Close diet details"
              >
                <X size={20} />
              </button>
            </div>

            {/* Macro Ratio Breakdown */}
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
                <div className="text-xs text-muted">Protein (27%)</div>
                <div className="text-sm font-bold text-emerald">150g (600 kcal)</div>
                <div className="text-[10px] text-muted">Target: 2.0g/kg bodyweight</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted">Carbohydrates (45%)</div>
                <div className="text-sm font-bold text-amber-600">250g (1000 kcal)</div>
                <div className="text-[10px] text-muted">Complex grains & fruit</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted">Healthy Fats (28%)</div>
                <div className="text-sm font-bold text-blue-600">70g (630 kcal)</div>
                <div className="text-[10px] text-muted">Omega-3s, nuts, olive oil</div>
              </div>
            </div>

            {/* Micronutrient Targets */}
            <div className="mb-md">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-xs flex items-center gap-1.5">
                <Apple size={14} className="text-emerald" />
                <span>Essential Micronutrients & Electrolytes</span>
              </h4>
              <div
                className="grid gap-xs mt-sm text-xs"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                }}
              >
                <div className="p-xs rounded border border-gray-100 bg-gray-50 flex justify-between">
                  <span className="text-muted">Dietary Fiber</span>
                  <span className="font-semibold text-charcoal">38g (Goal: &gt;30g)</span>
                </div>
                <div className="p-xs rounded border border-gray-100 bg-gray-50 flex justify-between">
                  <span className="text-muted">Sodium</span>
                  <span className="font-semibold text-charcoal">1,950 mg (&lt;2,300mg)</span>
                </div>
                <div className="p-xs rounded border border-gray-100 bg-gray-50 flex justify-between">
                  <span className="text-muted">Potassium</span>
                  <span className="font-semibold text-charcoal">3,400 mg</span>
                </div>
                <div className="p-xs rounded border border-gray-100 bg-gray-50 flex justify-between">
                  <span className="text-muted">Calcium</span>
                  <span className="font-semibold text-charcoal">1,100 mg</span>
                </div>
                <div className="p-xs rounded border border-gray-100 bg-gray-50 flex justify-between">
                  <span className="text-muted">Iron</span>
                  <span className="font-semibold text-charcoal">18 mg</span>
                </div>
                <div className="p-xs rounded border border-gray-100 bg-gray-50 flex justify-between">
                  <span className="text-muted">Vitamin D3</span>
                  <span className="font-semibold text-charcoal">2,000 IU</span>
                </div>
              </div>
            </div>

            {/* Meal Timing Strategy */}
            <div className="mb-md">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-xs flex items-center gap-1.5">
                <Sparkles size={14} className="text-emerald" />
                <span>Nutrient Timing Window</span>
              </h4>
              <div className="flex flex-col gap-xs text-xs text-muted leading-relaxed">
                <p>
                  • <strong>Pre-Workout (60 min before):</strong> 30-40g low-glycemic carbs (oats or banana) with 10g protein to optimize glycogen stores without insulin spikes.
                </p>
                <p>
                  • <strong>Post-Workout (Within 45 min):</strong> 25-35g fast whey or plant protein with 40g complex carbs to halt catabolism and trigger muscle recovery.
                </p>
                <p>
                  • <strong>Hydration:</strong> 3.0 Liters total baseline, sipping 500ml every 2-3 hours and 750ml during workouts.
                </p>
              </div>
            </div>

            {/* Dietary Preference Adherence */}
            <div
              className="p-sm rounded-xl mb-md flex items-start gap-sm"
              style={{
                backgroundColor: "var(--emerald-subtle)",
                border: "1px solid rgba(5, 150, 105, 0.2)",
              }}
            >
              <CheckCircle2 size={18} className="text-emerald shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed" style={{ color: "var(--emerald-dark)" }}>
                <strong>Personalization Note:</strong> Meals can be adapted for Vegetarian preferences by replacing meat with lentils, edamame, organic tempeh, and Greek yogurt while maintaining equal macro ratios.
              </div>
            </div>

            <div className="flex justify-end gap-sm pt-xs border-t border-gray-100">
              <button
                type="button"
                className="btn btn-primary btn-sm px-4"
                onClick={() => setShowDietDetails(false)}
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
