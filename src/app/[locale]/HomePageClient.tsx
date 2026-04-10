'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
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
