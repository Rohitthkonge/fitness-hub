"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Scale, ArrowRight, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";

interface BMIResultData {
  bmi: string;
  category: string;
  color: string;
  badgeClass: string;
  date?: string;
  unit?: string;
}

export default function BMIResultPage() {
  const [result, setResult] = useState<BMIResultData | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("fithub_bmi");
      if (saved) {
        setResult(JSON.parse(saved));
      } else {
        // Fallback default if visited directly
        setResult({
          bmi: "22.5",
          category: "Normal Weight",
          color: "#059669",
          badgeClass: "badge-emerald",
          date: "Today",
        });
      }
    } catch {
      setResult({
        bmi: "22.5",
        category: "Normal Weight",
        color: "#059669",
        badgeClass: "badge-emerald",
      });
    }
  }, []);

  if (!result) return null;

  const bmiNum = parseFloat(result.bmi) || 22.5;

  // Calculate percentage along the gauge (15 to 35 range)
  const minRange = 15;
  const maxRange = 35;
  const clampedBmi = Math.max(minRange, Math.min(maxRange, bmiNum));
  const markerPercent = ((clampedBmi - minRange) / (maxRange - minRange)) * 100;

  return (
    <main className="page-container mt-lg mb-xl">
      <div className="bento-grid">
        {/* Main Result Card */}
        <div className="bento-card span-4 flex flex-col items-center text-center p-xl">
          <div
            className="flex items-center justify-center rounded-2xl mb-md"
            style={{
              width: "56px",
              height: "56px",
              backgroundColor: "var(--emerald-subtle)",
              color: "var(--emerald)",
            }}
          >
            <Scale size={28} strokeWidth={2.2} />
          </div>

          <div className="text-xs font-bold uppercase tracking-widest text-muted mb-xs">
            Your Health Assessment
          </div>
          <h1 className="heading-xl font-extrabold mb-sm">Your Calculated BMI</h1>

          <div
            className="heading-3xl font-extrabold my-sm"
            style={{
              fontSize: "4rem",
              lineHeight: 1,
              color: result.color,
            }}
          >
            {result.bmi}
          </div>

          <div
            className={`badge ${result.badgeClass} text-sm font-bold px-4 py-1.5 rounded-full mb-lg`}
          >
            {result.category}
          </div>

          {/* Visual Indicator Gauge */}
          <div className="w-full max-w-xl mx-auto my-md">
            <div className="relative pt-4 pb-2">
              {/* Pointer Marker */}
              <div
                className="absolute top-0 transition-all duration-700 flex flex-col items-center"
                style={{
                  left: `${markerPercent}%`,
                  transform: "translateX(-50%)",
                }}
              >
                <div
                  className="w-3 h-3 rotate-45"
                  style={{ backgroundColor: result.color }}
                />
              </div>

              {/* Gauge Track */}
              <div
                className="h-3 w-full rounded-full overflow-hidden flex"
                style={{ backgroundColor: "var(--border)" }}
              >
                <div style={{ width: "17.5%", backgroundColor: "#3B82F6" }} title="Underweight (< 18.5)" />
                <div style={{ width: "32%", backgroundColor: "#059669" }} title="Normal (18.5 - 24.9)" />
                <div style={{ width: "25%", backgroundColor: "#F59E0B" }} title="Overweight (25 - 29.9)" />
                <div style={{ width: "25.5%", backgroundColor: "#EF4444" }} title="Obese (≥ 30)" />
              </div>

              {/* Range Labels */}
              <div className="flex justify-between text-xs text-muted mt-2 font-medium">
                <span>&lt; 18.5 Underweight</span>
                <span>18.5 – 24.9 Normal</span>
                <span>25 – 29.9 Overweight</span>
                <span>&ge; 30 Obese</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-md justify-center mt-lg">
            <Link
              href="/goals"
              className="btn btn-primary btn-lg inline-flex items-center gap-2 group shadow-md"
            >
              <span>Continue to Fitness Goals</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/bmi"
              className="btn btn-outline inline-flex items-center gap-2"
            >
              <RotateCcw size={16} />
              <span>Recalculate BMI</span>
            </Link>
          </div>
        </div>

        {/* Short Note on BMI Limitations Card */}
        <div className="bento-card span-2 flex flex-col justify-between">
          <div className="flex items-center gap-sm mb-sm text-amber-600">
            <AlertCircle size={20} style={{ color: "#F59E0B" }} />
            <h3 className="font-bold text-base" style={{ color: "var(--charcoal)" }}>
              Important: Not a Medical Diagnosis
            </h3>
          </div>
          <p className="text-sm text-muted leading-relaxed">
            BMI is a broad screening metric, not a clinical diagnostic tool. It relies solely on height and weight, meaning it does not measure body fat percentage directly and does not distinguish between muscle mass, bone density, and adipose tissue.
          </p>
          <div className="mt-md text-xs font-medium text-muted">
            Athletes and strength trainers often show higher BMI values while maintaining exceptional health and low body fat.
          </div>
        </div>

        {/* Personalized Next Step Card */}
        <div className="bento-card span-2 flex flex-col justify-between">
          <div className="flex items-center gap-sm mb-sm text-emerald">
            <CheckCircle2 size={20} style={{ color: "var(--emerald)" }} />
            <h3 className="font-bold text-base" style={{ color: "var(--charcoal)" }}>
              What&apos;s Next?
            </h3>
          </div>
          <p className="text-sm text-muted leading-relaxed">
            Now that you know your BMI baseline, the next step is choosing your target fitness goal. Whether you want to build strength, lose weight, or increase endurance, we&apos;ll tailor your routine to you.
          </p>
          <div className="mt-md">
            <Link
              href="/goals"
              className="text-sm font-bold text-emerald hover:underline inline-flex items-center gap-1"
            >
              Set up your workout & diet preferences &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
