'use client'

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Facebook, MessageCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { sectionLinks } from "./Navbar";

const FB_URL = "https://www.facebook.com/Thaiwahclub";
const LINE_URL = "https://line.me/ti/p/@beyondstudy";

const Footer = () => {
  const { t, language } = useLanguage();
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <footer className="pt-14 pb-8 bg-primary text-primary-foreground">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-8 border-b border-primary-foreground/10">
          <div className="flex items-center gap-2 font-display font-bold text-lg shrink-0">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white p-1">
              <Image src="/beyond-study-logo.png" alt="Beyond Study" width={28} height={28} className="h-full w-full object-contain" />
            </span>
            Beyond Australia
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-primary-foreground/70">
            {sectionLinks.map((link) =>
              isHome ? (
                <a key={link.href} href={link.href} className="hover:text-primary-foreground transition-colors">
                  {t(link.key)}
                </a>
              ) : (
                <Link key={link.href} href={`/${link.href}`} className="hover:text-primary-foreground transition-colors">
                  {t(link.key)}
                </Link>
              )
            )}
            <Link href="/events" className="hover:text-primary-foreground transition-colors">
              {t("nav.events")}
            </Link>
            <Link href="/articles" className="hover:text-primary-foreground transition-colors">
              {language === "th" ? "บทความ" : "Articles"}
            </Link>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={FB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LINE"
              className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        <p className="text-sm text-primary-foreground/60 pt-6 text-center md:text-left">
          {t("footer.tagline", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
