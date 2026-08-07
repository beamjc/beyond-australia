'use client'

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

const LINE_URL = "https://line.me/ti/p/@beyondstudy";

const FloatingLineButton = () => {
  const { language } = useLanguage();
  const tooltip = language === "th" ? "แชทกับเราทาง LINE" : "Chat with us on LINE";

  return (
    <motion.a
      href={LINE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={tooltip}
      title={tooltip}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
      className="fixed z-50 flex items-center justify-center rounded-full shadow-lg hover:scale-105 transition-transform"
      style={{
        bottom: "84px",
        right: "20px",
        width: "52px",
        height: "52px",
        backgroundColor: "#00B900",
      }}
    >
      <MessageCircle className="w-6 h-6 text-white" fill="white" strokeWidth={0} />
    </motion.a>
  );
};

export default FloatingLineButton;
