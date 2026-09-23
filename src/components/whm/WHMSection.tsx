'use client'

import { useState } from "react";
import { Calendar, CheckSquare, Search, HelpCircle } from "lucide-react";
import TimelineSection from "./TimelineSection";
import ChecklistSection from "./ChecklistSection";
import PostcodeChecker from "./PostcodeChecker";
import FAQ2026 from "./FAQ2026";
import FloatingFacebookButton from "../shared/FloatingFacebookButton";
import FloatingLineButton from "../shared/FloatingLineButton";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { TranslationKey } from "@/i18n/translations";
import SectionHeader from "../shared/SectionHeader";

const subTabs: { id: "timeline" | "checklist" | "postcode" | "faq2026"; labelKey: TranslationKey; icon: typeof Calendar }[] = [
  { id: "timeline", labelKey: "whm.tabs.timeline", icon: Calendar },
  { id: "checklist", labelKey: "whm.tabs.checklist", icon: CheckSquare },
  { id: "postcode", labelKey: "whm.tabs.postcode", icon: Search },
  { id: "faq2026", labelKey: "whm.tabs.faq2026", icon: HelpCircle },
];

type SubTab = (typeof subTabs)[number]["id"];

const WHMSection = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<SubTab>("timeline");

  return (
    <section id="whm" className="py-20 bg-muted/30">
      <div className="container">
        <SectionHeader
          eyebrow={t("whm.eyebrow")}
          title={t("whm.title")}
          subtitle={t("whm.subtitle")}
        />

        {/* Sub-tab bar */}
        <div className="mb-12 -mx-4 px-4 overflow-x-auto [-webkit-overflow-scrolling:touch] flex md:justify-center">
          <div role="tablist" className="inline-flex rounded-xl border border-border bg-muted/50 p-1.5 gap-1 mx-auto">
            {subTabs.map((tab) => (
              <button
                key={tab.id}
                id={`whm-tab-${tab.id}`}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`whm-panel-${tab.id}`}
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
        <div role="tabpanel" id="whm-panel-timeline" aria-labelledby="whm-tab-timeline" hidden={activeTab !== "timeline"}>
          <TimelineSection embedded />
        </div>
        <div role="tabpanel" id="whm-panel-checklist" aria-labelledby="whm-tab-checklist" hidden={activeTab !== "checklist"}>
          <ChecklistSection embedded />
        </div>
        <div role="tabpanel" id="whm-panel-postcode" aria-labelledby="whm-tab-postcode" hidden={activeTab !== "postcode"}>
          <PostcodeChecker />
        </div>
        <div role="tabpanel" id="whm-panel-faq2026" aria-labelledby="whm-tab-faq2026" hidden={activeTab !== "faq2026"}>
          <FAQ2026 />
        </div>
      </div>
      <FloatingLineButton />
      <FloatingFacebookButton />
    </section>
  );
};

export default WHMSection;
