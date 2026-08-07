'use client'

import { MessageCircle, Facebook, Share2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

interface Props {
  netIncome: string;
  annualSavings: string;
  bufferLabel: string; // "Buffer" or "Shortfall"
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
    <div className="flex flex-wrap items-center gap-2 mt-3">
      <span className="text-xs text-muted-foreground inline-flex items-center gap-1 mr-1">
        <Share2 className="w-3.5 h-3.5" />
      </span>
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#00B900" }}
      >
        <MessageCircle className="w-3.5 h-3.5" />
        {isTh ? "แชร์ไป LINE" : "Share to LINE"}
      </a>
      <a
        href={fbUrl}
        onClick={handleFb}
        className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#1877F2" }}
      >
        <Facebook className="w-3.5 h-3.5" fill="white" strokeWidth={0} />
        {isTh ? "แชร์ใน Facebook" : "Share on Facebook"}
      </a>
    </div>
  );
};

export default SavingsShareButtons;