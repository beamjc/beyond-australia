'use client'

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { explorerCopy, START_NODE, type CompareNode, type ResultNode } from "@/data/visaExplorer";
import { fill } from "@/data/savingsCopy";
import { getNode, progressFor, reasonsFor, type PathStep } from "@/lib/visaExplorer";
import {
  ActionButton, AUTO_ADVANCE_MS, Card, CheckList, ConsultBlock, OfficialSourceLink, PathwayOption,
  RelatedTools, Sequence, ToolHeader, iconFor, useKeepTopInView, useT,
} from "./shared";

interface Props {
  onHub: () => void;
  /** Changes when another tool asks to open the explorer at a given branch. */
  preset: { start?: "student"; nonce: number };
}

const startPath = (preset: Props["preset"]): PathStep[] =>
  preset.start === "student"
    ? [{ node: START_NODE, choice: "study" }, { node: "student-plan" }]
    : [{ node: START_NODE }];

const VisaOptionsExplorer = ({ onHub, preset }: Props) => {
  const { t } = useT();
  const [path, setPath] = useState<PathStep[]>(() => startPath(preset));
  const [pending, setPending] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const topRef = useKeepTopInView(path.length);

  useEffect(() => {
    if (preset.nonce) setPath(startPath(preset));
  }, [preset]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const current = path[path.length - 1];
  const node = getNode(current.node);

  const choose = (optionId: string, next: string) => {
    if (pending) return;
    setPending(optionId);
    timer.current = setTimeout(() => {
      setPath((p) => [...p.slice(0, -1), { node: p[p.length - 1].node, choice: optionId }, { node: next }]);
      setPending(null);
    }, AUTO_ADVANCE_MS);
  };
  const goTo = (id: string) => setPath((p) => [...p, { node: id }]);
  // Going back keeps the earlier answer highlighted so it can be kept or changed.
  const back = () => setPath((p) => (p.length > 1 ? p.slice(0, -1) : p));
  const reset = () => setPath([{ node: START_NODE }]);

  const progress = node.kind === "question" ? progressFor(path) : null;

  return (
    <div ref={topRef} className="scroll-mt-24">
      <ToolHeader
        title={t(explorerCopy.title)}
        onHub={onHub}
        progress={progress ? (progress.n - 1) / progress.total : undefined}
        progressLabel={progress ? fill(t(explorerCopy.question), progress) : undefined}
      />
      {path.length === 1 && <p className="-mt-2 mb-4 text-sm text-muted-foreground">{t(explorerCopy.subtitle)}</p>}

      {node.kind === "question" && (
        <Card>
          <h4 id={`vx-q-${node.id}`} className="text-lg font-semibold text-foreground">{t(node.title)}</h4>
          {node.helper && <p className="mt-1 text-sm text-muted-foreground">{t(node.helper)}</p>}
          <div role="radiogroup" aria-labelledby={`vx-q-${node.id}`} className="mt-4 grid gap-2">
            {node.options.map((o) => (
              <PathwayOption
                key={o.id}
                label={t(o.label)}
                icon={o.icon}
                selected={(pending ?? current.choice) === o.id}
                disabled={!!pending}
                onClick={() => choose(o.id, o.next)}
              />
            ))}
          </div>
        </Card>
      )}

      {node.kind === "result" && <ExplorerResult node={node} path={path} onNode={goTo} onBack={back} />}
      {node.kind === "compare" && <ExplorerCompare node={node} onNode={goTo} />}

      <div className="mt-4 flex items-center justify-between gap-3">
        {path.length > 1 ? (
          <button type="button" onClick={back} className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {t(explorerCopy.back)}
          </button>
        ) : <span />}
        {node.kind !== "question" && (
          <button type="button" onClick={reset} className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <RotateCcw className="h-4 w-4" aria-hidden />
            {t(explorerCopy.startOver)}
          </button>
        )}
      </div>
    </div>
  );
};

const ExplorerResult = ({ node, path, onNode, onBack }: { node: ResultNode; path: PathStep[]; onNode: (n: string) => void; onBack: () => void }) => {
  const { t } = useT();
  const reasons = reasonsFor(path);
  return (
    <div className="space-y-4">
      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{t(node.eyebrow)}</p>
        <h4 className="mt-1 text-xl font-bold text-foreground">{t(node.title)}</h4>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(node.summary)}</p>

        {reasons.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-semibold text-foreground">{t(explorerCopy.whyTitle)}</p>
            <div className="mt-2"><CheckList items={reasons.map(t)} /></div>
          </div>
        )}

        {node.sequence && (
          <div className="mt-5">
            <p className="text-sm font-semibold text-foreground">{t(explorerCopy.sequenceTitle)}</p>
            <div className="mt-2"><Sequence steps={node.sequence.map(t)} /></div>
          </div>
        )}

        {node.checks && (
          <div className="mt-5">
            <p className="text-sm font-semibold text-foreground">{t(node.checksTitle!)}</p>
            <div className="mt-2"><CheckList items={node.checks.map(t)} numbered={node.numbered} /></div>
          </div>
        )}
        {!node.checks && node.checksTitle && <p className="mt-5 text-sm font-semibold text-foreground">{t(node.checksTitle)}</p>}

        {node.actions.length > 0 && (
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {node.actions.map((a, i) => (
              <ActionButton key={i} action={a} primary={i === 0} onNode={onNode} onBack={onBack} />
            ))}
          </div>
        )}

        <div className="mt-5 border-t border-border pt-3">
          <p className="text-xs font-medium text-muted-foreground">{t(explorerCopy.sourcesTitle)}</p>
          <div className="flex flex-wrap gap-x-4">
            {node.sources.map((s) => <OfficialSourceLink key={s.href} label={s.label} href={s.href} />)}
          </div>
        </div>
      </Card>

      {node.bridge && (
        <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-foreground">{t(node.bridge.title)}</p>
          <ActionButton action={node.bridge.action} primary />
        </Card>
      )}

      <RelatedTools tools={node.related} />
      <ConsultBlock kind={node.consult} />
    </div>
  );
};

const ExplorerCompare = ({ node, onNode }: { node: CompareNode; onNode: (n: string) => void }) => {
  const { t } = useT();
  return (
    <div className="space-y-4">
      <h4 className="text-xl font-bold text-foreground">{t(node.title)}</h4>
      <div className="grid gap-3 sm:grid-cols-2">
        {node.cards.map((c) => {
          const Icon = iconFor[c.icon];
          return (
            <Card key={c.title.en} className="flex flex-col">
              <p className="flex items-center gap-2 font-semibold text-foreground">
                <Icon className="h-5 w-5 text-primary" aria-hidden />
                {t(c.title)}
              </p>
              <p className="mt-2 text-xs font-medium text-muted-foreground">{t({ th: "เหมาะกับ", en: "Suits" })}</p>
              <p className="mt-0.5 flex-1 text-sm text-foreground/90">{t(c.fit)}</p>
              <div className="mt-3"><ActionButton action={c.action} onNode={onNode} /></div>
            </Card>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-4">
        {node.sources.map((s) => <OfficialSourceLink key={s.href} label={s.label} href={s.href} />)}
      </div>
      <ConsultBlock kind="migration" />
    </div>
  );
};

export default VisaOptionsExplorer;
