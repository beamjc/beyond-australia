'use client'

import { ArrowRight, ShieldCheck, Star } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

const SITE_URL = "https://www.beyondstudycenter.com/inquiry-form/";

const QEACTrustBar = ({ className = "" }: { className?: string }) => {
  const { language } = useLanguage();
  const isTh = language === "th";

  const intro = isTh
    ? "ต้องการปรึกษาเรื่องเรียนต่อออสเตรเลีย?"
    : "Need advice on studying in Australia?";
  const agency = "Beyond Study Center";
  const licenseLabel = isTh ? "ตัวแทน QEAC ที่ได้รับใบอนุญาต" : "Licensed QEAC agent";
  const licenseNumbers = "#1855 · #2588 · #4069";
  const rating = isTh ? "4.9 (93 รีวิวจาก Google)" : "4.9 (93 Google reviews)";
  const experience = isTh ? "ประสบการณ์ 15 ปี" : "15 years experience";
  const linkLabel = isTh ? "ปรึกษาฟรี" : "Free consultation";

  return (
    <div
      className={`w-full rounded-xl border border-primary/15 bg-primary/5 dark:bg-primary/10 px-4 py-3 sm:px-5 sm:py-3.5 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex items-start gap-2.5 min-w-0">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground leading-snug">{intro}</p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-snug mt-0.5">
              <span className="font-medium text-foreground/80">{agency}</span>
              {" — "}
              {licenseLabel}
              <span className="font-mono text-[11px] sm:text-xs text-foreground/70"> ({licenseNumbers})</span>
              {" · "}
              <span className="inline-flex items-center gap-0.5 align-middle">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" aria-hidden />
                {rating}
              </span>
              {" · "}
              {experience}
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