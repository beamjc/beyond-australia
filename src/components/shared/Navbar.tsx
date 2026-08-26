'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Languages } from 'lucide-react'
import { useLanguage } from '@/i18n/LanguageProvider'
import type { Language, TranslationKey } from '@/i18n/translations'

export const sectionLinks: { key: TranslationKey; href: string }[] = [
  { key: 'nav.whm', href: '#whm' },
  { key: 'nav.study', href: '#study' },
  { key: 'nav.visaPathways', href: '#visa-pathway' },
  { key: 'nav.services', href: '#services' },
]

const SITE_URL = 'https://www.beyondstudycenter.com/inquiry-form/'

const LanguageSwitcher = ({ className = '' }: { className?: string }) => {
  const { language, setLanguage, t } = useLanguage()
  const options: Language[] = ['en', 'th']
  return (
    <div className={`inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/10 px-1.5 py-1 ${className}`} role="group" aria-label={t('nav.switchLanguage')}>
      <Languages className="w-3.5 h-3.5 ml-1 text-white/70" aria-hidden />
      {options.map((lng) => (
        <button key={lng} onClick={() => setLanguage(lng)} aria-pressed={language === lng}
          className={`text-xs font-semibold uppercase px-2 py-0.5 rounded-full transition-colors ${language === lng ? 'bg-accent text-accent-foreground' : 'text-white/70 hover:text-white'}`}>
          {lng}
        </button>
      ))}
    </div>
  )
}

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const { t, language } = useLanguage()
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg text-white">
          <Image src="/beyond-study-logo.png" alt="Beyond Study" width={36} height={36} className="h-9 w-9 object-contain" priority />
          Beyond Australia
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {sectionLinks.map((link) => (
            isHome
              ? <a key={link.href} href={link.href} className="text-sm font-medium text-white/80 hover:text-white transition-colors">{t(link.key)}</a>
              : <Link key={link.href} href={`/${link.href}`} className="text-sm font-medium text-white/80 hover:text-white transition-colors">{t(link.key)}</Link>
          ))}
          <Link href="/events" className={`text-sm font-medium transition-colors ${pathname.startsWith('/events') ? 'text-white' : 'text-white/80 hover:text-white'}`}>
            {t('nav.events')}
          </Link>
          <Link href="/articles" className={`text-sm font-medium transition-colors ${pathname.startsWith('/articles') ? 'text-white' : 'text-white/80 hover:text-white'}`}>
            {language === 'th' ? 'บทความ' : 'Articles'}
          </Link>
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            {t('nav.getInTouch')}
          </a>
          <LanguageSwitcher />
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-white" aria-label={t('nav.toggleMenu')}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 bg-primary">
          <div className="container py-4 flex flex-col gap-3">
            {sectionLinks.map((link) => (
              isHome
                ? <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-sm font-medium text-white/80 hover:text-white py-2">{t(link.key)}</a>
                : <Link key={link.href} href={`/${link.href}`} onClick={() => setOpen(false)} className="text-sm font-medium text-white/80 hover:text-white py-2">{t(link.key)}</Link>
            ))}
            <Link href="/events" onClick={() => setOpen(false)} className="text-sm font-medium text-white/80 hover:text-white py-2">
              {t('nav.events')}
            </Link>
            <Link href="/articles" onClick={() => setOpen(false)} className="text-sm font-medium text-white/80 hover:text-white py-2">
              {language === 'th' ? 'บทความ' : 'Articles'}
            </Link>
            <div className="pt-2 flex items-center justify-between gap-3">
              <a
                href={SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
              >
                {t('nav.getInTouch')}
              </a>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
