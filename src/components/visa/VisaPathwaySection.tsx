'use client'

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Briefcase,
  GraduationCap,
  ExternalLink,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Plane,
  BookOpen,
  DollarSign,
  Calendar,
  MessageSquare,
} from "lucide-react";
import QEACTrustBar from "../shared/QEACTrustBar";
import BSCConsultationCTA from "../shared/BSCConsultationCTA";
import SectionHeader from "../shared/SectionHeader";

type NodeId =
  | "start"
  | "employer"
  | "employer-yes"
  | "employer-proceed"
  | "points"
  | "points-yes-high"
  | "points-yes-low"
  | "points-no"
  | "points-unsure"
  | "no-employer"
  | "whm-check"
  | "whm-eligible"
  | "whm-not-eligible"
  | "student-check"
  | "student-eligible"
  | "student-budget"
  | "student-budget-low"
  | "both-options";

interface FlowNode {
  id: NodeId;
  question: string;
  icon: React.ElementType;
  details?: string;
  options?: { label: string; next: NodeId; icon?: React.ElementType }[];
  isEnd?: boolean;
  endType?: "success" | "warning" | "info";
  bullets?: string[];
}

const flowData: FlowNode[] = [
  {
    id: "start",
    question: "Is there an Australian employer willing to sponsor and pay ≥ A$76,515/year?",
    icon: Briefcase,
    details:
      "This determines whether you may be eligible for an Employer-Sponsored visa pathway.",
    options: [
      { label: "Yes", next: "employer-yes", icon: CheckCircle2 },
      { label: "No / Not yet", next: "no-employer", icon: XCircle },
    ],
  },
  {
    id: "employer-yes",
    question: "Employer-Sponsored Pathway — Further Checks",
    icon: Briefcase,
    bullets: [
      "Is the occupation on a Skill List (CSOL, etc.)?",
      "Sufficient work experience?",
      "Required educational qualifications?",
      "English test results (IELTS/PTE)?",
    ],
    options: [
      { label: "I meet the requirements", next: "employer-proceed", icon: CheckCircle2 },
    ],
  },
  {
    id: "employer-proceed",
    question: "Consult your employer + a migration agent/lawyer",
    icon: Briefcase,
    isEnd: true,
    endType: "success",
    details:
      "You're on a strong path. Work with professionals to proceed with the Employer-Sponsored Visa application.",
  },
  // --- No employer branch: points OR WHM/student ---
  {
    id: "no-employer",
    question: "What would you like to explore?",
    icon: HelpCircle,
    details:
      "Without employer sponsorship, you have several options depending on your occupation, age, English skills, and budget.",
    options: [
      { label: "Skilled / Points-based visa (permanent pathway)", next: "points", icon: GraduationCap },
      { label: "Working Holiday Maker (WHM) visa", next: "whm-check", icon: Plane },
      { label: "Student visa", next: "student-check", icon: BookOpen },
      { label: "I'm not sure — show me all options", next: "both-options", icon: HelpCircle },
    ],
  },
  // --- Points-based branch (existing) ---
  {
    id: "points",
    question: "Is your occupation on the list for a Points-based visa?",
    icon: GraduationCap,
    details: "Check the Skilled Occupation Lists on the Department of Home Affairs website.",
    options: [
      { label: "Yes, and I have ≥65 points", next: "points-yes-high", icon: CheckCircle2 },
      { label: "Yes, but my points are low", next: "points-yes-low" },
      { label: "No, it's not on the list", next: "points-no", icon: XCircle },
      { label: "Not sure", next: "points-unsure", icon: HelpCircle },
    ],
  },
  {
    id: "points-yes-high",
    question: "You're competitive! Submit an EOI",
    icon: GraduationCap,
    isEnd: true,
    endType: "success",
    details:
      "With competitive points, strong English (IELTS ≥ 6.0 each band), and a valid Skill Assessment, consult a migration agent and submit your Expression of Interest.",
  },
  {
    id: "points-yes-low",
    question: "Plan strategically with a migration agent",
    icon: GraduationCap,
    isEnd: true,
    endType: "warning",
    bullets: [
      "Can you increase your points? (age, experience, English, partner skills)",
      "Should you pursue further study — same field or new?",
      "A WHM or Student visa could be a stepping stone while you build points",
      "Is your current occupation still viable long-term?",
    ],
  },
  {
    id: "points-no",
    question: "Your current occupation pathway may be difficult",
    icon: GraduationCap,
    isEnd: true,
    endType: "warning",
    bullets: [
      "You may need to study a new field to qualify",
      "Consider a Student Visa or WHM as a stepping stone",
      "A WHM visa lets you work and explore options in Australia",
      "Seek professional migration advice",
    ],
    details:
      "We can help you explore study options — VET, ELICOS, or Higher Education — that lead to occupations on the skilled list.",
  },
  {
    id: "points-unsure",
    question: "Check the official resources",
    icon: HelpCircle,
    isEnd: true,
    endType: "info",
    details:
      "Visit the Department of Home Affairs website or watch Thaiwahclub Migration 102 on YouTube, featuring a Registered Migration Agent explaining how to do an initial self-check.",
  },
  // --- WHM branch ---
  {
    id: "whm-check",
    question: "Working Holiday Maker (WHM) — Quick Eligibility Check",
    icon: Plane,
    details: "The WHM visa (subclass 462) has specific requirements for Thai applicants.",
    bullets: [
      "Age: 18–30 at time of application",
      "English: IELTS 4.5 overall (or equivalent PTE/TOEFL)",
      "Budget: Sufficient funds (~A$5,000+) and return airfare",
      "Education: Tertiary qualification (or 2+ years university study)",
      "Must obtain a letter of government support from DCY",
    ],
    options: [
      { label: "I meet all requirements", next: "whm-eligible", icon: CheckCircle2 },
      { label: "I'm over 30 or don't qualify", next: "whm-not-eligible", icon: XCircle },
    ],
  },
  {
    id: "whm-eligible",
    question: "Great! Follow our WHM timeline & checklist",
    icon: Plane,
    isEnd: true,
    endType: "success",
    bullets: [
      "Follow the DCY pre-application timeline above",
      "Prepare IELTS/PTE — we offer discount codes & courses",
      "Use our checklist to ensure you're ready for quota day",
      "Once onshore, explore study & work options to extend your stay",
    ],
    details:
      "The WHM visa is a fantastic stepping stone. Many holders transition to Student or Skilled visas afterwards. We'll guide you through every step.",
  },
  {
    id: "whm-not-eligible",
    question: "WHM may not be an option, but a Student Visa could work",
    icon: BookOpen,
    isEnd: true,
    endType: "warning",
    bullets: [
      "Over 30? No age limit for Student visas",
      "Student visa allows 48 hrs/fortnight of work",
      "Study can lead to skilled occupation pathways",
      "We can help you find the right course & institution",
    ],
    details:
      "Contact us to explore Student Visa options — VET, ELICOS, or Higher Education — tailored to your goals and budget.",
  },
  // --- Student branch ---
  {
    id: "student-check",
    question: "Student Visa — What's your situation?",
    icon: BookOpen,
    details:
      "Student visas have no upper age limit and can be a pathway to skilled migration.",
    bullets: [
      "English: Typically IELTS 5.5+ (varies by course)",
      "No age limit (but age affects points for future PR)",
      "Can work up to 48 hrs/fortnight while studying",
      "Course choice impacts future visa pathways",
    ],
    options: [
      { label: "I have IELTS 5.5+ and budget for tuition", next: "student-eligible", icon: CheckCircle2 },
      { label: "My English needs improvement", next: "student-budget", icon: MessageSquare },
      { label: "I'm concerned about costs", next: "student-budget-low", icon: DollarSign },
    ],
  },
  {
    id: "student-eligible",
    question: "You're ready to explore courses!",
    icon: BookOpen,
    isEnd: true,
    endType: "success",
    bullets: [
      "Choose a course aligned with skilled occupation lists for PR pathway",
      "VET courses: more affordable, practical skills (aged care, childcare, etc.)",
      "Higher Ed: university degrees for professional pathways",
      "We'll help you find the right institution as your education agent",
    ],
    details:
      "As an education agent, we provide free course guidance and application support. Contact us to get started.",
  },
  {
    id: "student-budget",
    question: "Start with an English course (ELICOS)",
    icon: MessageSquare,
    isEnd: true,
    endType: "info",
    bullets: [
      "ELICOS courses improve your English to the required level",
      "Can be done onshore (if on WHM) or offshore",
      "We offer PTE courses and IELTS prep with discount codes",
      "After English, transition to VET or university studies",
    ],
    details:
      "Many students start with English preparation. We can help you find affordable ELICOS programs and prepare for IELTS/PTE.",
  },
  {
    id: "student-budget-low",
    question: "Budget-friendly study options exist",
    icon: DollarSign,
    isEnd: true,
    endType: "warning",
    bullets: [
      "VET courses can be more affordable than university",
      "Some courses start from ~A$6,000/year",
      "Work rights (48 hrs/fortnight) help offset costs",
      "Consider a WHM first to save money, then study",
      "Scholarships may be available for some programs",
    ],
    details:
      "We'll help you find courses that balance affordability with strong visa pathway outcomes. Contact us for a personalised plan.",
  },
  // --- Show all options ---
  {
    id: "both-options",
    question: "Here's an overview of your main options",
    icon: HelpCircle,
    isEnd: true,
    endType: "info",
    bullets: [
      "WHM Visa (462): Ages 18–30, IELTS 4.5, work & travel for 1 year. Great stepping stone.",
      "Student Visa (500): No age limit, IELTS 5.5+, study leads to skilled pathways. Work 48 hrs/fortnight.",
      "Skilled Visa (Points-based): Need occupation on skill list, 65+ points, skill assessment. Leads to PR.",
      "Employer-Sponsored: Need a sponsor willing to pay ≥A$76,515. Fastest to PR if eligible.",
    ],
    details:
      "Not sure which fits? Factors like your age, English level, budget, and long-term goals matter most. Contact us or a migration agent for personalised advice.",
  },
];

const endTypeStyles = {
  success: "border-accent bg-accent/10",
  warning: "border-primary bg-primary/10",
  info: "border-secondary bg-secondary/10",
};

const VisaPathwaySection = () => {
  const [history, setHistory] = useState<NodeId[]>(["start"]);
  const currentId = history[history.length - 1];
  const currentNode = flowData.find((n) => n.id === currentId)!;

  const handleSelect = (next: NodeId) => {
    setHistory((prev) => [...prev, next]);
  };

  const handleBack = () => {
    if (history.length > 1) {
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  const handleReset = () => setHistory(["start"]);

  return (
    <section id="visa-pathway" className="py-20 bg-background">
      <div className="container">
        <div className="max-w-3xl mx-auto mb-8">
          <QEACTrustBar />
        </div>
        <SectionHeader
          eyebrow="Interactive Guide"
          title="Visa Pathway Finder"
          subtitle="Not sure which visa to pursue? Answer a few questions to find your best pathway — whether it's WHM, Student, Skilled, or Employer-Sponsored."
          className="mb-16"
        />

        <div className="max-w-2xl mx-auto">
          {/* Breadcrumb */}
          {history.length > 1 && (
            <div className="flex items-center gap-1 mb-6 flex-wrap text-sm text-muted-foreground">
              {history.map((id, i) => {
                const node = flowData.find((n) => n.id === id)!;
                return (
                  <span key={id} className="flex items-center gap-1">
                    {i > 0 && <ChevronRight className="w-3 h-3" />}
                    <button
                      onClick={() => setHistory(history.slice(0, i + 1))}
                      className={`hover:text-primary transition-colors ${i === history.length - 1 ? "text-foreground font-medium" : ""}`}
                    >
                      {node.question.slice(0, 30)}…
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className={`rounded-2xl border-2 p-8 ${
                currentNode.isEnd
                  ? endTypeStyles[currentNode.endType || "info"]
                  : "border-border bg-background"
              }`}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <currentNode.icon className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground leading-snug pt-2">
                  {currentNode.question}
                </h3>
              </div>

              {currentNode.details && (
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {currentNode.details}
                </p>
              )}

              {currentNode.bullets && (
                <ul className="space-y-2 mb-6">
                  {currentNode.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-muted-foreground">
                      <ChevronRight className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {currentNode.options && (
                <div className="flex flex-col gap-3">
                  {currentNode.options.map((opt) => (
                    <button
                      key={opt.next}
                      onClick={() => handleSelect(opt.next)}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/50 px-5 py-4 text-left transition-all hover:border-primary hover:shadow-warm group"
                    >
                      <div className="flex items-center gap-3">
                        {opt.icon && (
                          <opt.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                        <span className="font-medium text-foreground">{opt.label}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              )}

              {currentNode.isEnd && currentNode.endType === "info" && (
                <a
                  href="https://immi.homeaffairs.gov.au/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-primary font-medium hover:underline"
                >
                  Visit Home Affairs <ExternalLink className="w-4 h-4" />
                </a>
              )}

              <div className="flex gap-3 mt-8">
                {history.length > 1 && (
                  <button
                    onClick={handleBack}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Back
                  </button>
                )}
                {currentNode.isEnd && (
                  <button
                    onClick={handleReset}
                    className="text-sm font-medium text-primary hover:underline ml-auto"
                  >
                    Start Over
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* BSC CTA — only on study-linked outcomes */}
          {(currentId.startsWith("student") ||
            currentId === "points-no" ||
            currentId === "whm-not-eligible") && (
            <div className="mt-6">
              <BSCConsultationCTA />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VisaPathwaySection;
