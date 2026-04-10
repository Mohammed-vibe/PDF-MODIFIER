'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Shield, Github, Twitter, Heart } from 'lucide-react';
import { type Locale, locales, localeConfig, getLocalizedPath } from '@/lib/i18n/config';

export interface FooterProps {
  locale: Locale;
}

export const Footer: React.FC<FooterProps> = ({ locale }) => {
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { href: `/${locale}/about`, label: t('navigation.about') },
    { href: `/${locale}/faq`, label: t('navigation.faq') },
    { href: `/${locale}/privacy`, label: t('navigation.privacy') },
    { href: `/${locale}/contact`, label: t('navigation.contact') },
  ];

  const handleLanguageChange = (newLocale: Locale) => {
    const newPath = getLocalizedPath(pathname, newLocale);
    router.push(newPath);
  };

  return (
    <footer className="border-t border-[hsl(var(--color-border))] bg-[hsl(var(--color-background-elevated))]">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Main Footer Content */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2 text-[hsl(var(--color-foreground))] mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[hsl(var(--color-primary))] to-[hsl(var(--color-accent))]">
                <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <span className="font-semibold text-sm">{t('brand')}</span>
            </Link>
            <p className="text-xs text-[hsl(var(--color-muted-foreground))] leading-relaxed max-w-xs">
              {t('tagline') || 'Professional PDF tools. Private, fast, and free. All processing happens in your browser.'}
            </p>
            <div className="flex items-center gap-2 mt-3 text-xs text-[hsl(var(--color-success))]">
              <Shield className="w-3.5 h-3.5" />
              <span>{t('footer.privacyBadge') || '100% Private - No uploads'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-[hsl(var(--color-foreground))] uppercase tracking-wider mb-3">
              Links
            </h4>
            <ul className="space-y-1.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-primary))] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-xs font-semibold text-[hsl(var(--color-foreground))] uppercase tracking-wider mb-3">
              Popular Tools
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href={`/${locale}/tools/merge-pdf`} className="text-xs text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-primary))] transition-colors">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/tools/split-pdf`} className="text-xs text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-primary))] transition-colors">
                  Split PDF
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/tools/compress-pdf`} className="text-xs text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-primary))] transition-colors">
                  Compress PDF
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/tools/pdf-to-word`} className="text-xs text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-primary))] transition-colors">
                  PDF to Word
                </Link>
              </li>
            </ul>
          </div>

          {/* Language Selector */}
          <div>
            <h4 className="text-xs font-semibold text-[hsl(var(--color-foreground))] uppercase tracking-wider mb-3">
              {t('buttons.selectLanguage') || 'Language'}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {locales.map((loc) => {
                const config = localeConfig[loc];
                const isActive = loc === locale;
                return (
                  <button
                    key={loc}
                    onClick={() => handleLanguageChange(loc)}
                    className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                      isActive
                        ? 'bg-[hsl(var(--color-primary))] text-white'
                        : 'bg-[hsl(var(--color-muted))] text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-foreground))]'
                    }`}
                  >
                    {config.nativeName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 border-t border-[hsl(var(--color-border))] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[hsl(var(--color-muted-foreground))]">
            &copy; {currentYear} {t('brand')}. {t('footer.copyright') || 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/terms`}
              className="text-[11px] text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-foreground))] transition-colors"
            >
              Terms
            </Link>
            <Link
              href={`/${locale}/privacy`}
              className="text-[11px] text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-foreground))] transition-colors"
            >
              Privacy
            </Link>
            <Link
              href={`/${locale}/cookies`}
              className="text-[11px] text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-foreground))] transition-colors"
            >
              Cookies
            </Link>
            <span className="text-[11px] text-[hsl(var(--color-muted-foreground))] flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-[hsl(var(--color-destructive))]" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
