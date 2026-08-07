'use client'

import { useState } from "react";
import { GraduationCap, Calculator, Shield, Search, Trophy, PiggyBank } from "lucide-react";
import StudyOptionsForm from "./StudyOptionsForm";
import FinancialCalculator from "./FinancialCalculator";
import VisaStrengthAssessment from "./VisaStrengthAssessment";
import BudgetStudyPlanner from "./BudgetStudyPlanner";
import TopUniversities from "./TopUniversities";
import SavingsCalculator from "./SavingsCalculator";
import QEACTrustBar from "../shared/QEACTrustBar";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { TranslationKey } from "@/i18n/translations";
import SectionHeader from "../shared/SectionHeader";

const subTabs: { id: "courses" | "universities" | "options" | "calculator" | "savings" | "strength"; labelKey: TranslationKey; icon: typeof Search }[] = [
  { id: "courses", labelKey: "study.tabs.courses", icon: Search },
  { id: "universities", labelKey: "study.tabs.universities", icon: Trophy },
  { id: "options", labelKey: "study.tabs.options", icon: GraduationCap },
  { id: "calculator", labelKey: "study.tabs.calculator", icon: Calculator },
  { id: "savings", labelKey: "study.tabs.savings", icon: PiggyBank },
  { id: "strength", labelKey: "study.tabs.strength", icon: Shield },
];

type SubTab = (typeof subTabs)[number]["id"];

const StudySection = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<SubTab>("courses");

  return (
    <section id="study" className="py-20 bg-card">
      <div className="container">
        <SectionHeader
          eyebrow={t("study.eyebrow")}
          title={t("study.title")}
          subtitle={t("study.subtitle")}
        />

        {/* QEAC trust bar */}
        <div className="max-w-3xl mx-auto mb-6">
          <QEACTrustBar />
        </div>

        {/* Sub-tab bar */}
        <div className="mb-12 -mx-4 px-4 overflow-x-auto [-webkit-overflow-scrolling:touch] flex md:justify-center">
          <div className="inline-flex rounded-xl border border-border bg-muted/50 p-1.5 gap-1 mx-auto">
            {subTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-warm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {t(tab.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "courses" && <BudgetStudyPlanner />}
        {activeTab === "universities" && <TopUniversities />}
        {activeTab === "options" && <StudyOptionsForm />}
        {activeTab === "calculator" && <FinancialCalculator />}
        {activeTab === "savings" && <SavingsCalculator />}
        {activeTab === "strength" && <VisaStrengthAssessment />}
      </div>
    </section>
  );
};

export default StudySection;
