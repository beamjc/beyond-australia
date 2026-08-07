'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import BSCConsultationCTA from "../shared/BSCConsultationCTA";

interface RiskFactor {
  id: string;
  label: string;
  lowLabel: string;
  highLabel: string;
  lowDesc: string;
  highDesc: string;
  weight: number;
  inverted?: boolean; // true = higher slider value means LESS risk
}

const riskFactors: RiskFactor[] = [
  {
    id: "age",
    label: "Age",
    lowLabel: "Younger",
    highLabel: "Older",
    lowDesc: "Under 25 – typical student age",
    highDesc: "Over 35 – may raise GTE concerns",
    weight: 1,
  },
  {
    id: "studyGap",
    label: "Study Gap",
    lowLabel: "No gap / recent study",
    highLabel: "Long gap (5+ years)",
    lowDesc: "Recently completed education",
    highDesc: "Extended time since last qualification",
    weight: 1.2,
  },
  {
    id: "downgrade",
    label: "Qualification Level Change",
    lowLabel: "Upgrading / same level",
    highLabel: "Downgrading",
    lowDesc: "e.g. Bachelor's → Master's",
    highDesc: "e.g. Master's → Diploma",
    weight: 1.3,
  },
  {
    id: "fieldChange",
    label: "Change of Study Field",
    lowLabel: "Same field / evidenced change",
    highLabel: "Unrelated field, no evidence",
    lowDesc: "Supported by work experience or career plan",
    highDesc: "No clear reason for the switch",
    weight: 1,
  },
  {
    id: "immigrationHistory",
    label: "Immigration History",
    lowLabel: "Clean record",
    highLabel: "Visa refusals / non-compliance",
    lowDesc: "No adverse findings",
    highDesc: "History of refusals, overstays, or breaches",
    weight: 1.5,
  },
  {
    id: "timeInAustralia",
    label: "Time Already Spent in Australia",
    lowLabel: "Short / none",
    highLabel: "Extended stay",
    lowDesc: "First-time or short previous visit",
    highDesc: "Multiple years already in Australia",
    weight: 1,
  },
  {
    id: "evidence",
    label: "Quality of Supporting Evidence",
    lowLabel: "Non-verifiable",
    highLabel: "Verifiable & strong",
    lowDesc: "Self-declared, no documentation",
    highDesc: "Official documents, employer letters, transcripts",
    weight: 0.8,
    inverted: true,
  },
  {
    id: "postStudyPlans",
    label: "Post-Study Plans",
    lowLabel: "Vague / no plans",
    highLabel: "Solid, detailed plans",
    lowDesc: "No clear intention after graduation",
    highDesc: "Clear career pathway back home or onward study",
    weight: 1.1,
    inverted: true,
  },
];

const getScoreColor = (score: number) => {
  if (score <= 30) return "text-emerald-400";
  if (score <= 55) return "text-amber-400";
  return "text-red-400";
};

const getProgressColor = (score: number) => {
  if (score <= 30) return "bg-emerald-500";
  if (score <= 55) return "bg-amber-500";
  return "bg-red-500";
};

const getBgColor = (score: number) => {
  if (score <= 30) return "bg-emerald-500/10 border-emerald-500/30";
  if (score <= 55) return "bg-amber-500/10 border-amber-500/30";
  return "bg-red-500/10 border-red-500/30";
};

const getVerdict = (score: number) => {
  if (score <= 20)
    return {
      icon: CheckCircle,
      title: "Strong Application",
      desc: "Your profile shows low risk indicators. You're well-positioned for a student visa application.",
    };
  if (score <= 40)
    return {
      icon: CheckCircle,
      title: "Moderate-Low Risk",
      desc: "Generally positive profile. Consider strengthening any amber areas with additional evidence.",
    };
  if (score <= 55)
    return {
      icon: AlertTriangle,
      title: "Moderate Risk",
      desc: "Some risk factors present. Professional guidance recommended to strengthen your application.",
    };
  if (score <= 75)
    return {
      icon: AlertTriangle,
      title: "Higher Risk",
      desc: "Multiple risk factors identified. Strongly consider consulting a registered migration agent.",
    };
  return {
    icon: AlertTriangle,
    title: "High Risk",
    desc: "Significant risk factors present. We recommend professional migration advice before applying.",
  };
};

const VisaStrengthAssessment = () => {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(riskFactors.map((f) => [f.id, 50]))
  );

  const handleChange = (id: string, val: number[]) => {
    setValues((prev) => ({ ...prev, [id]: val[0] }));
  };

  // Calculate weighted risk score (0-100)
  const totalWeight = riskFactors.reduce((sum, f) => sum + f.weight, 0);
  const weightedScore =
    riskFactors.reduce((sum, f) => {
      const raw = values[f.id];
      const risk = f.inverted ? 100 - raw : raw;
      return sum + (risk * f.weight) / 100;
    }, 0) /
    totalWeight *
    100;

  const riskScore = Math.round(weightedScore);
  const verdict = getVerdict(riskScore);
  const VerdictIcon = verdict.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-muted/30 mb-8">
        <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground">
          This tool provides a <strong>general indication only</strong> and does
          not constitute migration advice. Every application is assessed
          individually by the Department of Home Affairs. For personalised
          guidance, consult a registered migration agent.
        </p>
      </div>

      {/* Risk Score Summary */}
      <Card className={`mb-8 border ${getBgColor(riskScore)}`}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full border-4 border-border bg-background flex items-center justify-center">
                <div className="text-center">
                  <span className={`text-3xl font-bold ${getScoreColor(riskScore)}`}>
                    {riskScore}
                  </span>
                  <span className="block text-xs text-muted-foreground">/100 risk</span>
                </div>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                <VerdictIcon className={`w-5 h-5 ${getScoreColor(riskScore)}`} />
                <h3 className="text-lg font-semibold text-foreground">
                  {verdict.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">{verdict.desc}</p>
              <div className="mt-3 w-full">
                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(riskScore)}`}
                    style={{ width: `${riskScore}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Low Risk</span>
                  <span>High Risk</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Factor Sliders */}
      <div className="space-y-6">
        {riskFactors.map((factor, i) => {
          const raw = values[factor.id];
          const risk = factor.inverted ? 100 - raw : raw;

          return (
            <motion.div
              key={factor.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border border-border">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className={`w-4 h-4 ${
                      risk <= 33
                        ? "text-emerald-400"
                        : risk <= 66
                        ? "text-amber-400"
                        : "text-red-400"
                    }`} />
                    <h4 className="font-medium text-foreground text-sm">
                      {factor.label}
                    </h4>
                    <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${
                      risk <= 33
                        ? "bg-emerald-500/15 text-emerald-400"
                        : risk <= 66
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-red-500/15 text-red-400"
                    }`}>
                      {risk <= 33 ? "Low" : risk <= 66 ? "Medium" : "High"} risk
                    </span>
                  </div>

                  <Slider
                    value={[raw]}
                    onValueChange={(val) => handleChange(factor.id, val)}
                    max={100}
                    step={1}
                    className="mb-3"
                  />

                  <div className="flex justify-between">
                    <div className="max-w-[45%]">
                      <span className="text-xs font-medium text-emerald-400 block">
                        {factor.inverted ? "⚠ " : "✓ "}
                        {factor.lowLabel}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {factor.lowDesc}
                      </span>
                    </div>
                    <div className="max-w-[45%] text-right">
                      <span className="text-xs font-medium text-red-400 block">
                        {factor.inverted ? "✓ " : "⚠ "}
                        {factor.highLabel}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {factor.highDesc}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Tips */}
      <Card className="mt-8 border border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-primary" />
            Tips to Strengthen Your Application
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Provide <strong>verifiable evidence</strong> — employer letters, transcripts, bank statements</li>
            <li>• Explain any <strong>change in study field</strong> with a clear career rationale</li>
            <li>• Prepare a strong <strong>Statement of Purpose</strong> linking your study to post-graduation plans</li>
            <li>• Address any <strong>study gaps</strong> by showing productive activity (work, training, etc.)</li>
            <li>• Have a detailed <strong>post-study plan</strong> showing how the course benefits your home country career</li>
            <li>• If you have <strong>adverse immigration history</strong>, consider professional migration advice</li>
          </ul>
        </CardContent>
      </Card>

      <div className="mt-6">
        <BSCConsultationCTA variant="prominent" />
      </div>
    </motion.div>
  );
};

export default VisaStrengthAssessment;
