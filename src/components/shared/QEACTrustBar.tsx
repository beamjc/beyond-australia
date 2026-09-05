'use client'

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

const SITE_URL = "https://www.beyondstudycenter.com/inquiry-form/";

const QEACTrustBar = ({ className = "" }: { className?: string }) => {
  const { language } = useLanguage();
  const isTh = language === "th";

  const intro = isTh
    ? "ต้องการปรึกษาเรื่องเรียนต่อออสเตรเลีย?"
    : "Need advice on studying in Australia?";
  const agency = "Beyond Study Center";
  const linkLabel = isTh ? "ปรึกษาฟรี" : "Free consultation";

  return (
    <div
      className={`w-full rounded-xl border border-primary/15 bg-primary/5 dark:bg-primary/10 px-4 py-3 sm:px-5 sm:py-3.5 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <Image
            src="/icons/beyond_study_logo.png"
            alt="Beyond Study Center"
            width={168}
            height={88}
            className="h-10 w-auto sm:h-12 shrink-0 object-contain"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground leading-snug">{intro}</p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-snug mt-0.5">
              <span className="font-medium text-foreground/80">{agency}</span>
            </p>
          </div>
        </div>
        <a
          href={SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1 rounded-lg bg-primary px-4 py-2 text-xs sm:text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 shrink-0 sm:ml-auto"
        >
          {linkLabel}
          <ArrowRight className="w-3.5 h-3.5" aria-hidden />
        </a>
      </div>
    </div>
  );
};

export default QEACTrustBar;