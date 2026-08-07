'use client'

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, GraduationCap, Send } from "lucide-react";
import BSCConsultationCTA from "../shared/BSCConsultationCTA";

interface FormData {
  age: string;
  englishLevel: string;
  goals: string[];
  goalsOther: string;
  preferredCity: string;
  budget: string;
  intendedCourse: string;
  qualification: string;
  workExperience: string;
  visaSituation: string;
  visaDetails: string;
}

const initialForm: FormData = {
  age: "",
  englishLevel: "",
  goals: [],
  goalsOther: "",
  preferredCity: "",
  budget: "",
  intendedCourse: "",
  qualification: "",
  workExperience: "",
  visaSituation: "",
  visaDetails: "",
};

const englishLevels = [
  "No score",
  "IELTS 4.5 or lower",
  "IELTS 5.0–5.5",
  "IELTS 6.0–6.5",
  "IELTS 7.0 or higher",
];

const goalOptions = [
  "Migrate permanently",
  "Improve my English skills",
  "Get a certain qualification",
  "Other",
];

const budgetOptions = [
  "10,000 AUD or lower",
  "10,001–15,000 AUD",
  "15,001 AUD or more",
];

const cityOptions = [
  "Sydney",
  "Melbourne",
  "Brisbane",
  "Perth",
  "Adelaide",
  "Gold Coast",
  "Canberra",
  "Hobart",
  "Darwin",
  "Other / No preference",
];

const courseOptions = [
  "ELICOS (English course)",
  "VET (Vocational Education)",
  "Higher Education (University)",
  "Not sure yet",
];

const qualificationOptions = [
  "High school or equivalent",
  "Diploma / Certificate",
  "Bachelor's degree",
  "Master's degree or higher",
];

const visaOptions = [
  "Currently holding a visa",
  "Want to come to Australia in 6 months",
  "Want to come to Australia in 12 months",
  "Not sure",
];

const steps = [
  { key: "age", label: "How old are you?" },
  { key: "englishLevel", label: "What is your English level?" },
  { key: "goals", label: "What are your goals?" },
  { key: "preferredCity", label: "Preferred city in Australia?" },
  { key: "budget", label: "What is your annual budget for tuition?" },
  { key: "intendedCourse", label: "What type of course interests you?" },
  { key: "qualification", label: "Highest qualification & work experience?" },
  { key: "visaSituation", label: "Current visa situation / plan?" },
];

const StudyOptionsForm = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const canProceed = () => {
    switch (step) {
      case 0: return form.age !== "";
      case 1: return form.englishLevel !== "";
      case 2: return form.goals.length > 0;
      case 3: return form.preferredCity !== "";
      case 4: return form.budget !== "";
      case 5: return form.intendedCourse !== "";
      case 6: return form.qualification !== "";
      case 7: return form.visaSituation !== "";
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else setSubmitted(true);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const toggleGoal = (goal: string) => {
    setForm((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const RadioOption = ({
    label,
    selected,
    onClick,
  }: {
    label: string;
    selected: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border px-5 py-4 text-left transition-all w-full ${
        selected
          ? "border-primary bg-primary/10 text-foreground"
          : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40"
      }`}
    >
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
          selected ? "border-primary" : "border-border"
        }`}
      >
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
      </div>
      <span className="font-medium">{label}</span>
    </button>
  );

  const CheckOption = ({
    label,
    checked,
    onClick,
  }: {
    label: string;
    checked: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border px-5 py-4 text-left transition-all w-full ${
        checked
          ? "border-primary bg-primary/10 text-foreground"
          : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40"
      }`}
    >
      <div
        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
          checked ? "border-primary bg-primary" : "border-border"
        }`}
      >
        {checked && (
          <svg className="w-3 h-3 text-primary-foreground" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="font-medium">{label}</span>
    </button>
  );

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="rounded-2xl border-2 border-accent bg-accent/10 p-8">
          <GraduationCap className="w-12 h-12 text-accent mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-3">
            Here's your study direction!
          </h3>
          <StudyRecommendation form={form} />
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(0);
              setForm(initialForm);
            }}
            className="mt-6 text-sm font-medium text-primary hover:underline"
          >
            Start Over
          </button>
        </div>
        <div className="mt-6">
          <BSCConsultationCTA />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">Study Options Finder</h3>
        <p className="text-muted-foreground">
          Answer a few questions and we'll help you find the right study pathway.
        </p>
      </div>

      {/* Progress */}
      <div className="flex gap-1.5 mb-8">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-border bg-card p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            Step {step + 1} of {steps.length}
          </p>
          <h4 className="text-xl font-bold text-foreground mb-6">{steps[step].label}</h4>

          <div className="flex flex-col gap-3">
            {step === 0 && (
              <input
                type="number"
                min={15}
                max={70}
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                placeholder="Enter your age"
                className="w-full px-5 py-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-lg"
              />
            )}

            {step === 1 &&
              englishLevels.map((level) => (
                <RadioOption
                  key={level}
                  label={level}
                  selected={form.englishLevel === level}
                  onClick={() => setForm({ ...form, englishLevel: level })}
                />
              ))}

            {step === 2 && (
              <>
                {goalOptions.map((goal) => (
                  <CheckOption
                    key={goal}
                    label={goal}
                    checked={form.goals.includes(goal)}
                    onClick={() => toggleGoal(goal)}
                  />
                ))}
                {form.goals.includes("Other") && (
                  <input
                    type="text"
                    value={form.goalsOther}
                    onChange={(e) => setForm({ ...form, goalsOther: e.target.value })}
                    placeholder="Please specify your goal..."
                    className="w-full px-5 py-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                )}
              </>
            )}

            {step === 3 &&
              cityOptions.map((city) => (
                <RadioOption
                  key={city}
                  label={city}
                  selected={form.preferredCity === city}
                  onClick={() => setForm({ ...form, preferredCity: city })}
                />
              ))}

            {step === 4 &&
              budgetOptions.map((b) => (
                <RadioOption
                  key={b}
                  label={b}
                  selected={form.budget === b}
                  onClick={() => setForm({ ...form, budget: b })}
                />
              ))}

            {step === 5 &&
              courseOptions.map((c) => (
                <RadioOption
                  key={c}
                  label={c}
                  selected={form.intendedCourse === c}
                  onClick={() => setForm({ ...form, intendedCourse: c })}
                />
              ))}

            {step === 6 && (
              <>
                <p className="text-sm text-muted-foreground mb-1">Highest qualification:</p>
                {qualificationOptions.map((q) => (
                  <RadioOption
                    key={q}
                    label={q}
                    selected={form.qualification === q}
                    onClick={() => setForm({ ...form, qualification: q })}
                  />
                ))}
                <p className="text-sm text-muted-foreground mt-4 mb-1">Work experience (years):</p>
                <input
                  type="text"
                  value={form.workExperience}
                  onChange={(e) => setForm({ ...form, workExperience: e.target.value })}
                  placeholder="e.g. 3 years in hospitality"
                  className="w-full px-5 py-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </>
            )}

            {step === 7 && (
              <>
                {visaOptions.map((v) => (
                  <RadioOption
                    key={v}
                    label={v}
                    selected={form.visaSituation === v}
                    onClick={() => setForm({ ...form, visaSituation: v })}
                  />
                ))}
                {form.visaSituation === "Currently holding a visa" && (
                  <input
                    type="text"
                    value={form.visaDetails}
                    onChange={(e) => setForm({ ...form, visaDetails: e.target.value })}
                    placeholder="Visa type and expiry date (e.g. WHM 462, expires Dec 2025)"
                    className="w-full px-5 py-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                )}
              </>
            )}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-gold text-primary-foreground font-semibold shadow-warm hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
            >
              {step === steps.length - 1 ? (
                <>
                  See Results <Send className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const StudyRecommendation = ({ form }: { form: FormData }) => {
  const age = parseInt(form.age) || 0;
  const lowEnglish = ["No score", "IELTS 4.5 or lower"].includes(form.englishLevel);
  const midEnglish = form.englishLevel === "IELTS 5.0–5.5";
  const wantsMigration = form.goals.includes("Migrate permanently");
  const wantsEnglish = form.goals.includes("Improve my English skills");
  const lowBudget = form.budget === "10,000 AUD or lower";

  const recommendations: string[] = [];

  if (lowEnglish) {
    recommendations.push("🔤 Start with an ELICOS (English) course to build your language skills to the required level for further study or work.");
  }
  if (wantsEnglish && !lowEnglish) {
    recommendations.push("🔤 Consider a short English course to polish your skills, even though your level is adequate for most programs.");
  }
  if (midEnglish && !wantsEnglish) {
    recommendations.push("📚 With IELTS 5.0–5.5, you can enter most VET courses directly. University may require further English preparation.");
  }
  if (wantsMigration) {
    recommendations.push("🌏 For permanent migration, choose a course aligned with skilled occupation lists (e.g., aged care, childcare, nursing, IT, engineering).");
    if (age > 30) {
      recommendations.push("⏰ Age affects points for skilled migration. Consider starting your study pathway soon to maximise your points.");
    }
  }
  if (lowBudget) {
    recommendations.push("💰 VET courses can be very affordable (from ~A$6,000/year) and offer practical skills with strong visa pathway outcomes.");
  }
  if (form.intendedCourse === "Not sure yet") {
    recommendations.push("🤔 Not sure about courses? We can help — as an education agent, we provide free course guidance tailored to your goals and budget.");
  }
  if (age >= 18 && age <= 30 && !lowEnglish) {
    recommendations.push("✈️ You may also be eligible for a WHM visa (ages 18–30) as a stepping stone before or alongside study.");
  }
  recommendations.push("📞 Contact us for a personalised study plan — our education agent services are free for students.");

  return (
    <div className="text-left mt-4 space-y-3">
      {recommendations.map((rec, i) => (
        <p key={i} className="text-sm text-foreground/80 leading-relaxed">
          {rec}
        </p>
      ))}
    </div>
  );
};

export default StudyOptionsForm;
