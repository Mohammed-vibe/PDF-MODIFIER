'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Edit3,
  FilePlus,
  FileOutput,
  FolderOpen,
  Wrench,
  Lock,
  Sparkles,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getAllTools, getToolsByCategory } from '@/config/tools';
import { type Locale } from '@/lib/i18n/config';
import {
  CATEGORY_INFO,
  TOOL_CATEGORIES,
  type ToolCategory,
} from '@/types/tool';

interface HomePageClientProps {
  locale: Locale;
}

const categoryTranslationKeys: Record<ToolCategory, string> = {
  'edit-annotate': 'editAnnotate',
  'convert-to-pdf': 'convertToPdf',
  'convert-from-pdf': 'convertFromPdf',
  'organize-manage': 'organizeManage',
  'optimize-repair': 'optimizeRepair',
  'secure-pdf': 'securePdf',
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  edit: Edit3,
  'file-plus': FilePlus,
  'file-output': FileOutput,
  folder: FolderOpen,
  wrench: Wrench,
  shield: Lock,
};

const categoryGradients: Record<ToolCategory, string> = {
  'edit-annotate': 'from-amber-500 to-orange-500',
  'convert-to-pdf': 'from-emerald-500 to-teal-500',
  'convert-from-pdf': 'from-cyan-500 to-blue-500',
  'organize-manage': 'from-violet-500 to-purple-500',
  'optimize-repair': 'from-rose-500 to-pink-500',
  'secure-pdf': 'from-indigo-500 to-blue-600',
};

export default function HomePageClient({ locale }: HomePageClientProps) {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');
  const allTools = getAllTools();

  // Get featured tools (most popular ones)
  const featuredTools = [
    'merge-pdf',
    'split-pdf',
    'compress-pdf',
    'pdf-to-word',
    'pdf-to-jpg',
    'protect-pdf',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--color-background))]">
      <Header locale={locale} />

      <main className="flex-1 pt-14">
        {/* Hero Section - Modern gradient background */}
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--color-primary))]/5 via-transparent to-[hsl(var(--color-accent))]/5" />
          <div className="absolute top-0 end-0 w-[500px] h-[500px] bg-[hsl(var(--color-primary))]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 start-0 w-[400px] h-[400px] bg-[hsl(var(--color-accent))]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

          <div className="relative max-w-7xl mx-auto px-4 lg:px-6 py-12 lg:py-16">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(var(--color-primary))]/10 border border-[hsl(var(--color-primary))]/20 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--color-primary))]" />
                <span className="text-xs font-medium text-[hsl(var(--color-primary))]">
                  {allTools.length}+ Free PDF Tools
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[hsl(var(--color-foreground))] mb-4">
                {t('hero.title').split(' ').map((word, i, arr) => {
                  // Highlight the last 2 words
                  if (i >= arr.length - 2) {
                    return <span key={i} className="text-gradient"> {word}</span>;
                  }
                  return i === 0 ? word : ` ${word}`;
                })}
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[hsl(var(--color-muted-foreground))] leading-relaxed mb-8 max-w-2xl">
                {t('hero.subtitle')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={`/${locale}/tools`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[hsl(var(--color-primary))] to-[hsl(var(--color-accent))] rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-[hsl(var(--color-primary))]/25"
                >
                  {t('hero.cta')}
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
                <Link
                  href={`/${locale}/tools?category=organize-manage`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-foreground))] transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  Popular Tools
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-6 mt-8 pt-8 border-t border-[hsl(var(--color-border-subtle))]">
                <div className="flex items-center gap-2 text-xs text-[hsl(var(--color-muted-foreground))]">
                  <Shield className="w-4 h-4 text-[hsl(var(--color-success))]" />
                  <span>100% Private</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[hsl(var(--color-muted-foreground))]">
                  <Globe className="w-4 h-4 text-[hsl(var(--color-primary))]" />
                  <span>Browser-based</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[hsl(var(--color-muted-foreground))]">
                  <Zap className="w-4 h-4 text-[hsl(var(--color-warning))]" />
                  <span>Lightning Fast</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid - Modern compact cards */}
        <section className="py-10 border-t border-[hsl(var(--color-border))]">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-[hsl(var(--color-foreground))]">
                  {t('categoriesSection.title')}
                </h2>
                <p className="text-sm text-[hsl(var(--color-muted-foreground))] mt-1">
                  {t('categoriesSection.description', { count: allTools.length })}
                </p>
              </div>
              <Link
                href={`/${locale}/tools`}
                className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-[hsl(var(--color-primary))] hover:opacity-80 transition-opacity"
              >
                View all
                <ChevronRight className="w-4 h-4 rtl:scale-x-[-1]" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {TOOL_CATEGORIES.map((categoryId, index) => {
                const key = categoryTranslationKeys[categoryId];
                const info = CATEGORY_INFO[categoryId];
                const Icon = CATEGORY_ICONS[info.icon] ?? FolderOpen;
                const count = getToolsByCategory(categoryId).length;
                const gradient = categoryGradients[categoryId];
                const href = `/${locale}/tools?category=${categoryId}`;

                return (
                  <Link
                    key={categoryId}
                    href={href}
                    className="group relative flex items-center gap-4 p-4 rounded-xl bg-[hsl(var(--color-card))] border border-[hsl(var(--color-border))] hover:border-[hsl(var(--color-border-strong))] hover:bg-[hsl(var(--color-card-hover))] transition-all duration-200 overflow-hidden"
                  >
                    {/* Gradient accent */}
                    <div className={`absolute start-0 top-0 bottom-0 w-1 bg-gradient-to-b ${gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

                    {/* Icon */}
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-[hsl(var(--color-foreground))] group-hover:text-[hsl(var(--color-primary))] transition-colors">
                          {t(`categories.${key}`)}
                        </h3>
                        <ChevronRight className="w-4 h-4 rtl:scale-x-[-1] text-[hsl(var(--color-muted-foreground))] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-xs text-[hsl(var(--color-muted-foreground))] mt-0.5 line-clamp-1">
                        {t(`categoriesDescription.${key}`)}
                      </p>
                      <p className="text-[11px] text-[hsl(var(--color-muted-foreground))]/70 mt-1.5 tabular-nums">
                        {count} tools
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Tools - Quick access */}
        <section className="py-10 border-t border-[hsl(var(--color-border))] bg-[hsl(var(--color-background-elevated))]/50">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-[hsl(var(--color-foreground))]">
                  Popular Tools
                </h2>
                <p className="text-sm text-[hsl(var(--color-muted-foreground))] mt-1">
                  Most used PDF tools by our community
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {featuredTools.map((toolId) => {
                const tool = allTools.find(t => t.id === toolId);
                if (!tool) return null;

                return (
                  <Link
                    key={toolId}
                    href={`/${locale}/tools/${tool.slug}`}
                    className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-[hsl(var(--color-card))] border border-[hsl(var(--color-border))] hover:border-[hsl(var(--color-border-strong))] hover:bg-[hsl(var(--color-card-hover))] transition-all duration-200 text-center"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${categoryGradients[tool.category]} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-[hsl(var(--color-foreground))] line-clamp-1">
                      {tool.id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
