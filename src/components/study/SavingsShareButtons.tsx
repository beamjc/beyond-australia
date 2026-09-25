'use client'

import { MessageCircle, Facebook, Share2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

interface Props {
  netIncome: string;
  annualSavings: string;
  bufferLabel: string; // e.g. "ยังขาดอีก" / "Still short by"
  bufferAmount: string;
}

const SavingsShareButtons = ({ netIncome, annualSavings, bufferLabel, bufferAmount }: Props) => {
  const { language } = useLanguage();
  const isTh = language === "th";
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  const messageTh = `คำนวณเงินออมออสเตรเลียแล้ว 🇦🇺 รายได้สุทธิ: ${netIncome} · ออมได้: ${annualSavings} · ${bufferLabel}: ${bufferAmount} ลองคำนวณของคุณที่: ${pageUrl}`;
  const messageEn = `I calculated my Australia savings 🇦🇺 Net income: ${netIncome} · Annual savings: ${annualSavings} · ${bufferLabel}: ${bufferAmount} Calculate yours: ${pageUrl}`;
  const message = isTh ? messageTh : messageEn;

  const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(message)}`;
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(message)}`;

  const handleFb = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(fbUrl, "fbshare", "width=600,height=600,noopener,noreferrer");
  };

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="mr-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <Share2 className="w-4 h-4" aria-hidden />
        {isTh ? "แชร์ผลคำนวณ" : "Share your result"}
      </span>
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        <MessageCircle className="w-4 h-4 text-[#00B900]" aria-hidden />
        {isTh ? "แชร์ไป LINE" : "Share to LINE"}
      </a>
      <a
        href={fbUrl}
        onClick={handleFb}
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        <Facebook className="w-4 h-4 text-[#1877F2]" aria-hidden />
        {isTh ? "แชร์ใน Facebook" : "Share on Facebook"}
      </a>
    </div>
  );
};

export default SavingsShareButtons;