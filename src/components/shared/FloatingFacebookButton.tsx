'use client'

import { motion } from "framer-motion";
import { Facebook } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

const FB_URL = "https://www.facebook.com/Thaiwahclub";

const FloatingFacebookButton = () => {
  const { language } = useLanguage();
  const tooltip = language === "th" ? "ถามคำถามใน Facebook" : "Ask on Facebook";

  return (
    <motion.a
      href={FB_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={tooltip}
      title={tooltip}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed z-50 flex items-center justify-center rounded-full shadow-lg hover:scale-105 transition-transform"
      style={{
        bottom: "20px",
        right: "20px",
        width: "52px",
        height: "52px",
        backgroundColor: "#1877F2",
      }}
    >
      <Facebook className="w-6 h-6 text-white" fill="white" strokeWidth={0} />
    </motion.a>
  );
};

export default FloatingFacebookButton;