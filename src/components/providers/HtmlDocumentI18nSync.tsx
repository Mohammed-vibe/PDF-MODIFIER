'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  defaultLocale,
  localeConfig,
  type Locale,
  getLocaleFromPath,
} from '@/lib/i18n/config';

/**
 * Keeps <html lang dir> in sync with the active locale route so RTL locales
 * (e.g. Arabic) apply document-wide and match the [locale] layout wrapper.
 */
export function HtmlDocumentI18nSync() {
  const pathname = usePathname();

  useEffect(() => {
    const locale = (getLocaleFromPath(pathname ?? '') ?? defaultLocale) as Locale;
    const { direction } = localeConfig[locale];
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [pathname]);

  return null;
}
