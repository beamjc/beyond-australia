'use client'

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, DollarSign, Info } from "lucide-react";
import BSCConsultationCTA from "../shared/BSCConsultationCTA";

const FinancialCalculator = () => {
  const [annualCourseFee, setAnnualCourseFee] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [isOneYearOrMore, setIsOneYearOrMore] = useState<boolean | null>(null);
  const [courseMonths, setCourseMonths] = useState<number | null>(null);
  const [hasPartner, setHasPartner] = useState(false);
  const [numChildren, setNumChildren] = useState(0);
  const [numSchoolChildren, setNumSchoolChildren] = useState(0);
  const [applyingFrom, setApplyingFrom] = useState<"outside" | "inside">("outside");

  const LIVING_COST_STUDENT = 29710;
  const LIVING_COST_PARTNER = 10394;
  const LIVING_COST_CHILD = 4449;
  const SCHOOL_COST_CHILD = 13502;
  const TRAVEL_OUTSIDE = 2000; // most applicants (non-Africa)
  const TRAVEL_INSIDE = 1000;

  const result = useMemo(() => {
    const fee = parseFloat(annualCourseFee) || 0;
    const paid = parseFloat(amountPaid) || 0;
    const remainingFee = Math.max(0, fee - paid);

    // Determine living cost multiplier
    let livingMonths = 12;
    if (isOneYearOrMore === false && courseMonths !== null) {
      // For short courses: add 1 month if ≤9, add 2 months if 10+
      const adjustedMonths = courseMonths <= 9 ? courseMonths + 1 : courseMonths + 2;
      livingMonths = Math.min(adjustedMonths, 12);
    }

    const livingMultiplier = livingMonths / 12;

    const studentLiving = LIVING_COST_STUDENT * livingMultiplier;
    const partnerLiving = hasPartner ? LIVING_COST_PARTNER * livingMultiplier : 0;
    const childrenLiving = numChildren * LIVING_COST_CHILD * livingMultiplier;
    const schoolCosts = numSchoolChildren * SCHOOL_COST_CHILD * livingMultiplier;
    const travelCost = applyingFrom === "inside" ? TRAVEL_INSIDE : TRAVEL_OUTSIDE;

    const totalFamilyTravel = travelCost * (1 + (hasPartner ? 1 : 0) + numChildren);

    const total =
      remainingFee +
      studentLiving +
      partnerLiving +
      childrenLiving +
      schoolCosts +
      totalFamilyTravel;

    return {
      remainingFee,
      studentLiving,
      partnerLiving,
      childrenLiving,
      schoolCosts,
      totalFamilyTravel,
      total,
      livingMonths,
    };
  }, [annualCourseFee, amountPaid, isOneYearOrMore, courseMonths, hasPartner, numChildren, numSchoolChildren, applyingFrom]);

  const formatAUD = (n: number) =>
    new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Financial Capacity Calculator
        </h3>
        <p className="text-muted-foreground">
          Estimate the minimum funds needed for your Student Visa (subclass 500) application.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6">
        {/* Course fees */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Annual course fee (AUD)
          </label>
          <input
            type="number"
            min={0}
            value={annualCourseFee}
            onChange={(e) => setAnnualCourseFee(e.target.value)}
            placeholder="e.g. 15000"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Amount already paid (AUD)
          </label>
          <input
            type="number"
            min={0}
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            placeholder="e.g. 5000"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Course duration */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Is your course 1 year or longer?
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => { setIsOneYearOrMore(true); setCourseMonths(null); }}
              className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-all ${
                isOneYearOrMore === true
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => setIsOneYearOrMore(false)}
              className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-all ${
                isOneYearOrMore === false
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              No
            </button>
          </div>
        </div>

        {isOneYearOrMore === false && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
            <label className="block text-sm font-semibold text-foreground mb-2">
              How many months is your course?
            </label>
            <select
              value={courseMonths ?? ""}
              onChange={(e) => setCourseMonths(parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select months</option>
              {Array.from({ length: 11 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m} month{m > 1 ? "s" : ""}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-2 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              For courses ≤9 months, we add 1 extra month for living costs. For 10–11 months, we add 2 extra months.
            </p>
          </motion.div>
        )}

        {/* Family */}
        <div className="border-t border-border pt-6">
          <h4 className="text-sm font-semibold text-foreground mb-4">Family members</h4>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasPartner}
                onChange={(e) => setHasPartner(e.target.checked)}
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground">Partner coming with you</span>
            </label>

            <div>
              <label className="block text-sm text-foreground mb-1">
                Number of children coming with you
              </label>
              <input
                type="number"
                min={0}
                max={10}
                value={numChildren}
                onChange={(e) => {
                  const v = parseInt(e.target.value) || 0;
                  setNumChildren(v);
                  if (v < numSchoolChildren) setNumSchoolChildren(v);
                }}
                className="w-24 px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {numChildren > 0 && (
              <div>
                <label className="block text-sm text-foreground mb-1">
                  Of these, how many are school-age?
                </label>
                <input
                  type="number"
                  min={0}
                  max={numChildren}
                  value={numSchoolChildren}
                  onChange={(e) => setNumSchoolChildren(Math.min(parseInt(e.target.value) || 0, numChildren))}
                  className="w-24 px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
          </div>
        </div>

        {/* Applying from */}
        <div className="border-t border-border pt-6">
          <label className="block text-sm font-semibold text-foreground mb-2">
            Where are you applying from?
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setApplyingFrom("outside")}
              className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-all ${
                applyingFrom === "outside"
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              Outside Australia
            </button>
            <button
              onClick={() => setApplyingFrom("inside")}
              className={`flex-1 px-4 py-3 rounded-xl border font-medium transition-all ${
                applyingFrom === "inside"
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              Inside Australia
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {(annualCourseFee || isOneYearOrMore !== null) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-2xl border-2 border-primary bg-primary/5 p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <h4 className="text-lg font-bold text-foreground">Estimated Minimum Funds</h4>
          </div>

          <div className="space-y-3 text-sm">
            <Row label={`Course fees (remaining for first ${result.livingMonths === 12 ? "12" : result.livingMonths} months)`} value={formatAUD(result.remainingFee)} />
            <Row label={`Living costs — You (${result.livingMonths} months)`} value={formatAUD(result.studentLiving)} />
            {hasPartner && (
              <Row label={`Living costs — Partner (${result.livingMonths} months)`} value={formatAUD(result.partnerLiving)} />
            )}
            {numChildren > 0 && (
              <Row label={`Living costs — ${numChildren} child${numChildren > 1 ? "ren" : ""} (${result.livingMonths} months)`} value={formatAUD(result.childrenLiving)} />
            )}
            {numSchoolChildren > 0 && (
              <Row label={`Schooling — ${numSchoolChildren} child${numSchoolChildren > 1 ? "ren" : ""}`} value={formatAUD(result.schoolCosts)} />
            )}
            <Row label="Travel costs (all applicants)" value={formatAUD(result.totalFamilyTravel)} />

            <div className="border-t border-primary/20 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-foreground">Total Required</span>
                <span className="text-2xl font-bold text-primary">{formatAUD(result.total)}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            This is an estimate based on Department of Home Affairs guidelines. Actual requirements may vary. Always verify with the official DHA website or a registered migration agent.
          </p>
        </motion.div>
      )}

      {(annualCourseFee || isOneYearOrMore !== null) && (
        <div className="mt-6">
          <BSCConsultationCTA />
        </div>
      )}
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-semibold text-foreground">{value}</span>
  </div>
);

export default FinancialCalculator;
