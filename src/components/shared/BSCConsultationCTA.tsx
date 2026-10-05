'use client'

import Image from "next/image";
import { ExternalLink, MessageCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

export interface CTAIllustration {
  src: string;
  width: number;
  height: number;
}

interface Props {
  variant?: "standard" | "compact" | "prominent";
  className?: string;
  /** Decorative artwork: right of the text on md+, below the buttons on mobile. */
  illustration?: CTAIllustration;
}

export const LINE_URL = "https://line.me/ti/p/@beyondstudy";
export const SITE_URL = "https://www.beyondstudycenter.com/inquiry-form/";

const BSCConsultationCTA = ({ variant = "standard", className = "", illustration }: Props) => {
  const { language } = useLanguage();
  const isTh = language === "th";
  const isCompact = variant === "compact";
  const isProminent = variant === "prominent";

  const heading = isTh ? "ต้องการคำแนะนำจากผู้เชี่ยวชาญ?" : "Want expert guidance?";
  const sub = isTh
    ? "ปรึกษา Beyond Study Center ฟรี ด้วยประสบการณ์มากกว่า 15 ปี"
    : "Free consultation with Beyond Study Center 15 years+ experience";
  const lineLabel = "LINE: @beyondstudy";
  const siteLabel = isTh ? "เว็บไซต์ Beyond Study Center" : "Beyond Study Center website";

  const bgClass = isProminent
    ? "bg-primary/[0.07] dark:bg-primary/15"
    : "bg-primary/5 dark:bg-primary/10";

  if (illustration) {
    return (
      <div
        className={`w-full overflow-hidden rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50 via-background to-sky-50 p-5 shadow-sm sm:p-6 dark:border-primary/20 dark:from-primary/10 dark:via-card dark:to-card ${className}`}
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-6">
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-bold text-foreground sm:text-xl">{heading}</h4>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{sub}</p>
            {/* Stacked from md: the text column beside the artwork is too narrow for two buttons in a row. */}
            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row md:max-w-xs md:flex-col">
              <a
                href={LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 whitespace-nowrap items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                style={{ backgroundColor: "#00B900" }}
              >
                <MessageCircle className="w-4 h-4" aria-hidden />
                {lineLabel}
              </a>
              <a
                href={SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 whitespace-nowrap items-center justify-center gap-2 rounded-xl border-2 border-primary bg-background px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {siteLabel}
                <ExternalLink className="w-3.5 h-3.5" aria-hidden />
              </a>
            </div>
          </div>
          <Image
            src={illustration.src}
            alt=""
            aria-hidden="true"
            width={illustration.width}
            height={illustration.height}
            sizes="(max-width: 768px) 260px, 240px"
            className="mx-auto h-auto w-full max-w-[260px] shrink-0 md:mx-0 md:w-[220px] lg:w-[240px] dark:rounded-xl dark:bg-white/90 dark:p-2"
          />
        </div>
      </div>
    );
  }

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