'use client'

import { useCallback, useEffect, useMemo, useState } from "react";
import { Route, Calculator, Shield, Search, Trophy, PiggyBank } from "lucide-react";
import PlanningPathwayHub, { type HubRequest } from "../plan/PlanningPathwayHub";
import { PlanNavContext } from "../plan/shared";
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
  { id: "options", labelKey: "study.tabs.options", icon: Route },
  { id: "calculator", labelKey: "study.tabs.calculator", icon: Calculator },
  { id: "savings", labelKey: "study.tabs.savings", icon: PiggyBank },
  { id: "strength", labelKey: "study.tabs.strength", icon: Shield },
];

type SubTab = (typeof subTabs)[number]["id"];

const StudySection = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<SubTab>("courses");
  const [hubRequest, setHubRequest] = useState<HubRequest>({ view: "hub", nonce: 0 });

  const showTab = useCallback((tab: SubTab) => {
    setActiveTab(tab);
    // Let the panel un-hide before scrolling to it.
    requestAnimationFrame(() => {
      const el = document.getElementById(`study-panel-${tab}`);
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
  }, []);

  // Deep links: #plan opens the planning hub; #visa-pathway (old section) opens its visa tool.
  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash;
      if (hash !== "#plan" && hash !== "#visa-pathway") return;
      setActiveTab("options");
      setHubRequest({ view: hash === "#plan" ? "hub" : "visa", nonce: Date.now() });
      requestAnimationFrame(() => document.getElementById("study-panel-options")?.scrollIntoView({ block: "start" }));
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const nav = useMemo(
    () => ({
      openTab: showTab,
      openTool: (tool: "study" | "visa", visaStart?: "student") => {
        showTab("options");
        setHubRequest({ view: tool, visaStart, nonce: Date.now() });
      },
    }),
    [showTab],
  );

  return (
    <PlanNavContext.Provider value={nav}>
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
        {/* No justify-center here: it would push the first tabs off-screen (unscrollable) when the bar is wider than the viewport; the inner mx-auto still centres it when it fits. */}
        <div className="mb-12 -mx-4 px-4 overflow-x-auto [-webkit-overflow-scrolling:touch] flex">
          <div role="tablist" className="inline-flex rounded-xl border border-border bg-muted/50 p-1.5 gap-1 mx-auto">
            {subTabs.map((tab) => (
              <button
                key={tab.id}
                id={`study-tab-${tab.id}`}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`study-panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-warm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" aria-hidden />
                {t(tab.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Panels stay mounted (hidden) so visitors keep their inputs and
            results when they switch tabs to compare. */}
        <div role="tabpanel" id="study-panel-courses" aria-labelledby="study-tab-courses" hidden={activeTab !== "courses"}>
          <BudgetStudyPlanner />
        </div>
        <div role="tabpanel" id="study-panel-universities" aria-labelledby="study-tab-universities" hidden={activeTab !== "universities"}>
          <TopUniversities />
        </div>
        <div role="tabpanel" id="study-panel-options" aria-labelledby="study-tab-options" hidden={activeTab !== "options"} className="scroll-mt-24">
          <PlanningPathwayHub request={hubRequest} />
        </div>
        <div role="tabpanel" id="study-panel-calculator" aria-labelledby="study-tab-calculator" hidden={activeTab !== "calculator"}>
          <FinancialCalculator />
        </div>
        <div role="tabpanel" id="study-panel-savings" aria-labelledby="study-tab-savings" hidden={activeTab !== "savings"}>
          <SavingsCalculator />
        </div>
        <div role="tabpanel" id="study-panel-strength" aria-labelledby="study-tab-strength" hidden={activeTab !== "strength"}>
          <VisaStrengthAssessment />
        </div>
      </div>
    </section>
    </PlanNavContext.Provider>
  );
};

export default StudySection;
