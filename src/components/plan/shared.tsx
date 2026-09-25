'use client'

import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import {
  ArrowLeft, ArrowRight, BookOpen, Briefcase, Building2, Calculator, Check, ExternalLink,
  GraduationCap, HelpCircle, Landmark, MessageCircle, PiggyBank, Plane, Shield, Wallet, Route, Search,
} from "lucide-react";
import type { Bi } from "@/data/visaReadiness";
import { explorerCopy, toolLabels, type Action, type IconKey, type ToolId } from "@/data/visaExplorer";
import { LINE_URL, SITE_URL } from "../shared/BSCConsultationCTA";
import { useT } from "../study/savings/shared";

export { useT };

/** Study tabs other tools can open (provided by StudySection). */
export type StudyTabId = "courses" | "universities" | "options" | "calculator" | "savings" | "strength";

export interface PlanNav {
  openTab: (tab: StudyTabId) => void;
  /** Open a hub tool; `visaPath` preloads explorer answers (e.g. from the study result). */
  openTool: (tool: "study" | "visa", visaStart?: "student") => void;
}

export const PlanNavContext = createContext<PlanNav>({ openTab: () => {}, openTool: () => {} });
export const usePlanNav = () => useContext(PlanNavContext);

export const iconFor: Record<IconKey, typeof Plane> = {
  plane: Plane, cap: GraduationCap, briefcase: Briefcase, building: Building2, help: HelpCircle,
  check: Check, wallet: Wallet, book: BookOpen,
};

const toolIcon: Record<ToolId, typeof Plane> = {
  studyFinder: Route, planner: Search, calculator: Calculator, savings: PiggyBank, strength: Shield, universities: Landmark,
};

const toolTab: Partial<Record<ToolId, StudyTabId>> = {
  planner: "courses", calculator: "calculator", savings: "savings", strength: "strength", universities: "universities",
};

/** Run an action from data (open a tool/tab, go to a node, go back, or follow a link). */
export const useRunAction = (onNode?: (node: string) => void, onBack?: () => void) => {
  const nav = usePlanNav();
  return (a: Action) => {
    if (a.kind === "tool") {
      if (a.tool === "studyFinder") nav.openTool("study");
      else nav.openTab(toolTab[a.tool]!);
    } else if (a.kind === "node") onNode?.(a.node);
    else if (a.kind === "back") onBack?.();
  };
};

const btnBase =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
export const btnPrimary = `${btnBase} bg-primary text-primary-foreground hover:opacity-90`;
export const btnSecondary = `${btnBase} border border-border bg-background text-foreground hover:bg-muted`;

export const ActionButton = ({ action, primary, onNode, onBack }: { action: Action; primary?: boolean; onNode?: (n: string) => void; onBack?: () => void }) => {
  const { t } = useT();
  const run = useRunAction(onNode, onBack);
  const cls = primary ? btnPrimary : btnSecondary;
  if (action.kind === "link") {
    return (
      <a
        href={action.href}
        {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={cls}
      >
        {t(action.label)}
        {action.external ? <ExternalLink className="h-4 w-4" aria-hidden /> : <ArrowRight className="h-4 w-4" aria-hidden />}
      </a>
    );
  }
  return (
    <button type="button" onClick={() => run(action)} className={cls}>
      {action.kind === "back" && <ArrowLeft className="h-4 w-4" aria-hidden />}
      {t(action.label)}
      {action.kind !== "back" && <ArrowRight className="h-4 w-4" aria-hidden />}
    </button>
  );
};

/** Compact header used inside a tool: back to hub, tool name, progress. */
export const ToolHeader = ({
  title, onHub, progress, progressLabel,
}: { title: string; onHub: () => void; progress?: number; progressLabel?: string }) => {
  const { t } = useT();
  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={onHub}
        className="-ml-2 inline-flex min-h-[40px] items-center gap-1.5 rounded-lg px-2 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {t({ th: "วางแผนเส้นทางไปออสเตรเลีย", en: "Plan your pathway to Australia" })}
      </button>
      <h3 className="mt-1 text-xl font-bold text-foreground">{title}</h3>
      {progressLabel && (
        <div className="mt-2">
          <p className="text-xs font-medium text-muted-foreground">{progressLabel}</p>
          <div
            className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round((progress ?? 0) * 100)}
            aria-label={progressLabel}
          >
            <div className="h-full rounded-full bg-primary transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(progress ?? 0) * 100}%` }} />
          </div>
        </div>
      )}
    </div>
  );
};

/** Selectable card for single-choice (radio) or multi-choice (checkbox) questions. */
export const PathwayOption = ({
  label, desc, selected, onClick, multi, icon, disabled,
}: {
  label: string; desc?: string; selected: boolean; onClick: () => void; multi?: boolean; icon?: IconKey; disabled?: boolean;
}) => {
  const Icon = icon ? iconFor[icon] : null;
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={selected}
      onClick={onClick}
      disabled={disabled}
      className={`flex min-h-[48px] w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default ${
        selected ? "border-primary bg-primary/10" : "border-border bg-background hover:border-primary/40"
      }`}
    >
      {Icon ? (
        <Icon className={`h-5 w-5 shrink-0 ${selected ? "text-primary" : "text-muted-foreground"}`} aria-hidden />
      ) : (
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center border-2 ${multi ? "rounded" : "rounded-full"} ${
            selected ? "border-primary bg-primary" : "border-border"
          }`}
          aria-hidden
        >
          {selected && <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />}
        </span>
      )}
      <span className="min-w-0">
        <span className={`block text-sm ${selected ? "font-semibold text-foreground" : "font-medium text-foreground"}`}>{label}</span>
        {desc && <span className="mt-0.5 block text-xs text-muted-foreground">{desc}</span>}
      </span>
    </button>
  );
};

export const CheckList = ({ items, numbered }: { items: string[]; numbered?: boolean }) => (
  <ul className="space-y-2">
    {items.map((s, i) => (
      <li key={s} className="flex items-start gap-2.5 text-sm text-foreground/90">
        {numbered ? (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{i + 1}</span>
        ) : (
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
        )}
        <span className={numbered ? "pt-0.5" : ""}>{s}</span>
      </li>
    ))}
  </ul>
);

export const Sequence = ({ steps }: { steps: string[] }) => (
  <ol className="flex flex-wrap items-center gap-2" aria-label={steps.join(" → ")}>
    {steps.map((s, i) => (
      <li key={s} className="flex items-center gap-2">
        {i > 0 && <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden />}
        <span className="rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm font-medium text-foreground">{s}</span>
      </li>
    ))}
  </ol>
);

export const RelatedTools = ({ tools }: { tools: ToolId[] }) => {
  const { t } = useT();
  const run = useRunAction();
  if (!tools.length) return null;
  return (
    <div>
      <p className="text-sm font-semibold text-foreground">{t(explorerCopy.relatedTitle)}</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-3">
        {tools.slice(0, 3).map((tool) => {
          const Icon = toolIcon[tool];
          return (
            <button
              key={tool}
              type="button"
              onClick={() => run({ kind: "tool", tool, label: toolLabels[tool] })}
              className="flex min-h-[48px] items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-left text-sm font-medium text-foreground hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              {t(toolLabels[tool])}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const OfficialSourceLink = ({ label, href }: { label: Bi; href: string }) => {
  const { t } = useT();
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[36px] items-center gap-1.5 text-sm text-primary underline-offset-2 hover:underline">
      {t(label)}
      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
    </a>
  );
};

/** Consultation block. Migration topics point to qualified advisers, not BSC. */
export const ConsultBlock = ({ kind, title, sub, siteLabel }: { kind: "study" | "migration"; title?: Bi; sub?: Bi; siteLabel?: Bi }) => {
  const { t } = useT();
  if (kind === "migration") {
    return (
      <div className="rounded-xl bg-muted/40 p-4 text-sm text-muted-foreground">
        <p>{t(explorerCopy.consultMigration)}</p>
        <a
          href="https://portal.mara.gov.au/search-the-register-of-migration-agents/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex min-h-[36px] items-center gap-1.5 font-medium text-primary hover:underline"
        >
          {t(explorerCopy.consultMigrationLink)} <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>
    );
  }
  return (
    <div className="rounded-xl bg-primary/5 p-4 sm:p-5 dark:bg-primary/10">
      <p className="font-semibold text-foreground">{t(title ?? explorerCopy.consultStudyTitle)}</p>
      <p className="mt-1 text-sm text-muted-foreground">{t(sub ?? explorerCopy.consultStudySub)}</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
          <MessageCircle className="h-4 w-4" aria-hidden />
          {t(explorerCopy.consultLine)}
        </a>
        {siteLabel && (
          <a href={SITE_URL} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
            {t(siteLabel)} <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        )}
      </div>
    </div>
  );
};

export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <section className={`rounded-2xl border border-border bg-card p-5 sm:p-6 ${className}`}>{children}</section>
);

/** Keep the top of a tool in view after moving between steps (mobile). */
export const useKeepTopInView = (dep: unknown) => {
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const el = ref.current;
    if (el && el.getBoundingClientRect().top < 72) {
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }, [dep]);
  return ref;
};

/** Short selected state before moving on (owner: 150–250 ms). */
export const AUTO_ADVANCE_MS = 200;
