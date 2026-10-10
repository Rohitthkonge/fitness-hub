"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Scale, ArrowRight, CheckCircle2, Info } from "lucide-react";

interface BMIHistoryItem {
  id: string;
  bmi: string;
  category: string;
  date: string;
  unit: "metric" | "imperial";
}

export default function BMIPage() {
  const router = useRouter();
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");

  // Inputs
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weightLbs, setWeightLbs] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // History
  const [history, setHistory] = useState<BMIHistoryItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("fithub_bmi_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    let bmiValue = 0;

    if (unit === "metric") {
      const h = parseFloat(heightCm);
      const w = parseFloat(weightKg);
      if (!h || !w || h <= 0 || w <= 0) {
        setErrorMsg("Please enter valid height and weight values.");
        return;
      }
      const heightM = h / 100;
      bmiValue = w / (heightM * heightM);
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inc = parseFloat(heightIn) || 0;
      const w = parseFloat(weightLbs);
      const totalInches = ft * 12 + inc;
      if (totalInches <= 0 || !w || w <= 0) {
        setErrorMsg("Please enter valid height (ft/in) and weight (lbs).");
        return;
      }
      bmiValue = (w / (totalInches * totalInches)) * 703;
    }

    const roundedBmi = bmiValue.toFixed(1);
    let category = "Normal Weight";
    let color = "#059669";
    let badgeClass = "badge-emerald";

    if (bmiValue < 18.5) {
      category = "Underweight";
      color = "#3B82F6";
      badgeClass = "badge-blue";
    } else if (bmiValue < 25) {
      category = "Normal Weight";
      color = "#059669";
      badgeClass = "badge-emerald";
    } else if (bmiValue < 30) {
      category = "Overweight";
      color = "#F59E0B";
      badgeClass = "badge-amber";
    } else {
      category = "Obese";
      color = "#EF4444";
      badgeClass = "badge-red";
    }

    const newResult = {
      bmi: roundedBmi,
      category,
      color,
      badgeClass,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      unit,
    };

    // Save current result for /bmi-result
    try {
      localStorage.setItem("fithub_bmi", JSON.stringify(newResult));
    } catch {
      // storage full
    }

    // Save to history
    const newItem: BMIHistoryItem = {
      id: Date.now().toString(),
      bmi: roundedBmi,
      category,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      unit,
    };

    const updatedHistory = [newItem, ...history].slice(0, 10);
    setHistory(updatedHistory);
    try {
      localStorage.setItem("fithub_bmi_history", JSON.stringify(updatedHistory));
    } catch {
      // storage full
    }

    // Phase 3 requirement: On success, navigate to /bmi-result
    router.push("/bmi-result");
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("fithub_bmi_history");
    } catch {
      // ignore
    }
  };

  return (
    <main className="page-container mt-lg mb-lg">
      <div className="bento-grid">
        {/* Calculator Card */}
        <div className="bento-card span-2 span-row-2 no-hover">
          <div className="card-header mb-md">
            <div className="flex items-center gap-sm">
              <div
                className="card-icon rounded-xl flex items-center justify-center"
                style={{
                  width: "44px",
                  height: "44px",
                  backgroundColor: "var(--emerald-subtle)",
                  color: "var(--emerald)",
                }}
              >
                <Scale size={24} strokeWidth={2.2} />
              </div>
              <div>
                <h2 className="card-title text-xl font-bold">BMI Calculator</h2>
                <p className="text-xs text-muted">Estimate your adult Body Mass Index</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-md">
            <div
              className="unit-toggle flex rounded-full p-1"
              style={{
                backgroundColor: "var(--soft-gray, #E5E7EB)",
                borderRadius: "999px",
                padding: "4px",
              }}
            >
              <button
                type="button"
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                  unit === "metric" ? "font-semibold" : "text-muted"
                }`}
                style={{
                  backgroundColor: unit === "metric" ? "white" : "transparent",
                  boxShadow: unit === "metric" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => setUnit("metric")}
              >
                Metric
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                  unit === "imperial" ? "font-semibold" : "text-muted"
                }`}
                style={{
                  backgroundColor: unit === "imperial" ? "white" : "transparent",
                  boxShadow: unit === "imperial" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => setUnit("imperial")}
              >
                Imperial
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-md p-sm rounded bg-red-50 text-red-600 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form className="bmi-form mb-md" onSubmit={calculateBMI}>
            {unit === "metric" ? (
              <div
                className="bmi-inputs grid gap-md"
                style={{ display: "grid", gap: "1rem" }}
              >
                <div className="form-group">
                  <label className="form-label text-sm font-medium mb-xs block">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="form-input w-full"
                    placeholder="e.g. 175"
                    min="50"
                    max="300"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label text-sm font-medium mb-xs block">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="form-input w-full"
                    placeholder="e.g. 70"
                    min="20"
                    max="300"
                    step="0.1"
                    required
                  />
                </div>
              </div>
            ) : (
              <div
                className="bmi-inputs grid gap-md"
                style={{ display: "grid", gap: "1rem" }}
              >
                <div className="flex gap-sm">
                  <div className="form-group w-full">
                    <label className="form-label text-sm font-medium mb-xs block">
                      Height (ft)
                    </label>
                    <input
                      type="number"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      className="form-input w-full"
                      placeholder="e.g. 5"
                      min="2"
                      max="8"
                      required
                    />
                  </div>
                  <div className="form-group w-full">
                    <label className="form-label text-sm font-medium mb-xs block">
                      Height (in)
                    </label>
                    <input
                      type="number"
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                      className="form-input w-full"
                      placeholder="e.g. 9"
                      min="0"
                      max="11"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label text-sm font-medium mb-xs block">
                    Weight (lbs)
                  </label>
                  <input
                    type="number"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(e.target.value)}
                    className="form-input w-full"
                    placeholder="e.g. 150"
                    min="40"
                    max="600"
                    step="0.1"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg w-full mt-md inline-flex items-center justify-center gap-2 group"
            >
              <span>Calculate BMI & View Result</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </div>

        {/* Categories Card */}
        <div className="bento-card">
          <h3 className="card-title mb-md">BMI Categories</h3>
          <div className="bmi-categories flex flex-col gap-sm">
            <div className="bmi-category flex items-center justify-between pb-xs">
              <div className="flex items-center gap-sm">
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#3B82F6",
                    display: "inline-block",
                  }}
                />
                <span className="text-sm font-medium">Underweight</span>
              </div>
              <span className="text-sm text-muted">&lt; 18.5</span>
            </div>
            <div className="bmi-category flex items-center justify-between pb-xs">
              <div className="flex items-center gap-sm">
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "var(--emerald)",
                    display: "inline-block",
                  }}
                />
                <span className="text-sm font-medium">Normal Weight</span>
              </div>
              <span className="text-sm text-muted">18.5 – 24.9</span>
            </div>
            <div className="bmi-category flex items-center justify-between pb-xs">
              <div className="flex items-center gap-sm">
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#F59E0B",
                    display: "inline-block",
                  }}
                />
                <span className="text-sm font-medium">Overweight</span>
              </div>
              <span className="text-sm text-muted">25 – 29.9</span>
            </div>
            <div className="bmi-category flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#EF4444",
                    display: "inline-block",
                  }}
                />
                <span className="text-sm font-medium">Obese</span>
              </div>
              <span className="text-sm text-muted">&ge; 30</span>
            </div>
          </div>
        </div>

        {/* Health Tips Card */}
        <div className="bento-card">
          <h3 className="card-title mb-md">Health Tips</h3>
          <ul className="flex flex-col gap-sm text-sm" style={{ listStyle: "none" }}>
            <li className="flex gap-sm items-start">
              <CheckCircle2 size={16} style={{ color: "var(--emerald)", flexShrink: 0 }} />
              <span>Stay hydrated by drinking at least 8 glasses of water a day.</span>
            </li>
            <li className="flex gap-sm items-start">
              <CheckCircle2 size={16} style={{ color: "var(--emerald)", flexShrink: 0 }} />
              <span>Aim for at least 150 minutes of moderate aerobic activity weekly.</span>
            </li>
            <li className="flex gap-sm items-start">
              <CheckCircle2 size={16} style={{ color: "var(--emerald)", flexShrink: 0 }} />
              <span>Incorporate strength training exercises at least twice a week.</span>
            </li>
            <li className="flex gap-sm items-start">
              <CheckCircle2 size={16} style={{ color: "var(--emerald)", flexShrink: 0 }} />
              <span>Ensure you get 7-9 hours of restorative sleep each night.</span>
            </li>
          </ul>
        </div>

        {/* History Card */}
        <div className="bento-card span-2">
          <div className="card-header mb-md flex justify-between items-center">
            <h3 className="card-title">Recent Calculations</h3>
            {history.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                className="btn btn-ghost btn-sm text-muted"
              >
                Clear
              </button>
            )}
          </div>
          <div className="bmi-history-list flex flex-col gap-sm">
            {history.length === 0 ? (
              <div className="text-sm text-muted text-center py-md">
                No calculations yet. Enter your height and weight above!
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="p-sm rounded flex justify-between items-center"
                  style={{
                    backgroundColor: "var(--bg-subtle, #F1F5F9)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div>
                    <span className="font-bold text-base mr-sm">
                      BMI: {item.bmi}
                    </span>
                    <span className="text-xs text-muted">({item.category})</span>
                  </div>
                  <span className="text-xs text-muted">{item.date}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Understanding BMI Info Card */}
        <div className="bento-card span-2">
          <div className="card-header mb-md flex items-center gap-2">
            <Info size={18} className="text-muted" />
            <h3 className="card-title">Understanding BMI</h3>
          </div>
          <div className="text-sm text-muted flex flex-col gap-sm">
            <p>
              Body Mass Index (BMI) is a person&apos;s weight in kilograms divided
              by the square of height in meters. It is a widely used screening
              indicator to identify potential weight categories.
            </p>
            <p>
              <strong>Clinical context:</strong> BMI does not distinguish between
              muscle mass and fat tissue. Athletes with high muscle mass may have
              an elevated BMI while maintaining optimal body composition.
            </p>
            <p>
              Always pair BMI readings with waist-to-hip measurements, body fat
              percentages, and guidance from certified health professionals.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
