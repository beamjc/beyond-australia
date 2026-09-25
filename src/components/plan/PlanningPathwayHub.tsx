'use client'

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, GraduationCap, Info, Plane } from "lucide-react";
import { hubCopy as h } from "@/data/visaExplorer";
import StudyPathwayFinder from "./StudyPathwayFinder";
import VisaOptionsExplorer from "./VisaOptionsExplorer";
import { PlanNavContext, usePlanNav, useKeepTopInView, useT } from "./shared";

export type HubView = "hub" | "study" | "visa";
export interface HubRequest { view: HubView; visaStart?: "student"; nonce: number }

/**
 * One planning hub with two independent tools. Both tools stay mounted so
 * answers survive moving between them.
 */
const PlanningPathwayHub = ({ request }: { request: HubRequest }) => {
  const { t } = useT();
  const parent = usePlanNav();
  const [view, setView] = useState<HubView>(request.view);
  const [visaPreset, setVisaPreset] = useState<{ start?: "student"; nonce: number }>({ nonce: 0 });
  const topRef = useKeepTopInView(view);

  useEffect(() => {
    if (!request.nonce) return;
    setView(request.view);
    if (request.view === "visa") setVisaPreset({ start: request.visaStart, nonce: request.nonce });
  }, [request]);

  const nav = useMemo(
    () => ({
      openTab: parent.openTab,
      openTool: (tool: "study" | "visa", visaStart?: "student") => {
        setView(tool);
        if (tool === "visa" && visaStart) setVisaPreset({ start: visaStart, nonce: Date.now() });
      },
    }),
    [parent.openTab],
  );

  const toHub = () => setView("hub");

  return (
    <PlanNavContext.Provider value={nav}>
      <div ref={topRef} className="max-w-3xl mx-auto scroll-mt-24">
        <div hidden={view !== "hub"}>
          <header className="text-center mb-6">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">{t(h.title)}</h3>
            <p className="mt-2 text-muted-foreground">
              {t(h.intro1)}
              <br className="hidden sm:block" /> {t(h.intro2)}
            </p>
          </header>
          <div className="grid gap-4 sm:grid-cols-2">
            <HubCard
              icon={GraduationCap}
              title={t(h.studyTitle)}
              desc={t(h.studyDesc)}
              cta={t(h.studyCta)}
              tags={["ELICOS", "VET", "University"]}
              onClick={() => setView("study")}
            />
            <HubCard
              icon={Plane}
              title={t(h.visaTitle)}
              desc={t(h.visaDesc)}
              cta={t(h.visaCta)}
              tags={["WHM", "Student", "Skilled", "Sponsored"]}
              onClick={() => setView("visa")}
            />
          </div>
          <p className="mt-6 flex items-start gap-2 px-1 text-xs leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden /> {t(h.disclaimer)}
          </p>
        </div>

        <div hidden={view !== "study"}><StudyPathwayFinder onHub={toHub} /></div>
        <div hidden={view !== "visa"}>
          <VisaOptionsExplorer onHub={toHub} preset={visaPreset} />
          <p className="mt-6 px-1 text-xs leading-relaxed text-muted-foreground">{t(h.disclaimer)}</p>
        </div>
      </div>
    </PlanNavContext.Provider>
  );
};

const HubCard = ({
  icon: Icon, title, desc, cta, tags, onClick,
}: { icon: typeof Plane; title: string; desc: string; cta: string; tags: string[]; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 text-left transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-6"
  >
    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
      <Icon className="h-5 w-5 text-primary" aria-hidden />
    </span>
    <span className="mt-4 block text-lg font-semibold text-foreground">{title}</span>
    <span className="mt-1.5 block flex-1 text-sm leading-relaxed text-muted-foreground">{desc}</span>
    <span className="mt-4 flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span key={tag} className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{tag}</span>
      ))}
    </span>
    <span className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-primary">
      {cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
    </span>
  </button>
);

export default PlanningPathwayHub;
