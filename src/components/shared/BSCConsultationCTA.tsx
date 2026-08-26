'use client'

import { ExternalLink, MessageCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

interface Props {
  variant?: "standard" | "compact" | "prominent";
  className?: string;
}

const LINE_URL = "https://line.me/ti/p/@beyondstudy";
const SITE_URL = "https://www.beyondstudycenter.com/inquiry-form/";

const BSCConsultationCTA = ({ variant = "standard", className = "" }: Props) => {
  const { language } = useLanguage();
  const isTh = language === "th";
  const isCompact = variant === "compact";
  const isProminent = variant === "prominent";

  const heading = isTh ? "ต้องการคำแนะนำจากผู้เชี่ยวชาญ?" : "Want expert guidance?";
  const sub = isTh
    ? "ปรึกษา Beyond Study Center ฟรี ด้วยประสบการณ์มากกว่า 15 ปี"
    : "Free consultation with Beyond Study Center 15 years+ experience";
  const lineLabel = "LINE: @beyondstudy";
  const siteLabel = isTh ? "เว็บไซต์ BSC" : "BSC Website";

  const bgClass = isProminent
    ? "bg-primary/[0.07] dark:bg-primary/15"
    : "bg-primary/5 dark:bg-primary/10";

  return (
    <div
      className={`mx-auto w-full max-w-2xl rounded-xl border border-primary/15 border-l-4 border-l-accent ${bgClass} ${
        isCompact ? "p-3 sm:p-4" : "p-4 sm:p-5"
      } ${className}`}
    >
      <div className={`flex flex-col gap-3 ${isCompact ? "" : "sm:gap-4"}`}>
        <div>
          <h4
            className={`font-semibold text-foreground ${
              isProminent ? "text-lg sm:text-xl" : isCompact ? "text-sm" : "text-base sm:text-lg"
            }`}
          >
            {heading}
          </h4>
          <p
            className={`text-muted-foreground mt-1 ${
              isCompact ? "text-xs leading-snug" : "text-xs sm:text-sm leading-relaxed"
            }`}
          >
            {sub}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#00B900" }}
          >
            <MessageCircle className="w-4 h-4" />
            {lineLabel}
          </a>
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            {siteLabel}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default BSCConsultationCTA;