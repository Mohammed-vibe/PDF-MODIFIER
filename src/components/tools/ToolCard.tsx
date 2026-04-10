'use client';
import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Tool, ToolCategory } from '@/types/tool';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { getToolIcon } from '@/config/icons';
import { FavoriteButton } from '@/components/ui/FavoriteButton';

export interface ToolCardProps {
  /** Tool data to display */
  tool: Tool;
  /** Current locale for URL generation */
  locale: string;
  /** Optional additional CSS classes */
  className?: string;
  /** Localized content */
  localizedContent?: { title: string; description: string };
  /** Compact mode for denser layouts */
  compact?: boolean;
}

const categoryColors: Record<ToolCategory, string> = {
  'edit-annotate': 'from-amber-500/20 to-orange-500/20 text-amber-500',
  'convert-to-pdf': 'from-emerald-500/20 to-teal-500/20 text-emerald-500',
  'convert-from-pdf': 'from-cyan-500/20 to-blue-500/20 text-cyan-500',
  'organize-manage': 'from-violet-500/20 to-purple-500/20 text-violet-500',
  'optimize-repair': 'from-rose-500/20 to-pink-500/20 text-rose-500',
  'secure-pdf': 'from-indigo-500/20 to-blue-500/20 text-indigo-500',
};

const categoryBadgeColors: Record<ToolCategory, string> = {
  'edit-annotate': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  'convert-to-pdf': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  'convert-from-pdf': 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  'organize-manage': 'bg-violet-500/10 text-violet-500 border-violet-500/20',
  'optimize-repair': 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  'secure-pdf': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
};

function getDisplayDescription(description: string, locale: string) {
  if (!locale.startsWith('ar')) {
    return description;
  }

  const sentences = description
    .split(/[.!؟]\s*/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (sentences.length === 0) {
    return description;
  }

  const actionPattern = /(أضف|حوّل|حول|ادمج|قسّم|قسم|استخرج|اضغط|وقّع|وقع|احذف|دوّر|دور|رتّب|رتب|افتح|اقرأ|غيّر|غير|أنشئ|انشئ|أزل|ازل|احم|فك|أصلح|اصلح|قص|قارِن|قارن)/;
  const marketingPattern = /(مجاني|عبر الإنترنت|احترافية|سهلة الاستخدام|قوية|آمنة|شاملة)/;

  const bestSentence = [...sentences].sort((a, b) => {
    const score = (text: string) => {
      let value = Math.min(text.length, 80) / 20;
      if (actionPattern.test(text)) value += 4;
      if (marketingPattern.test(text)) value -= 2;
      return value;
    };

    return score(b) - score(a);
  })[0];

  return bestSentence
    .replace(/\s+/g, ' ')
    .replace(/\s+،/g, '،')
    .trim();
}

const categoryTranslationKeys: Record<ToolCategory, string> = {
  'edit-annotate': 'editAnnotate',
  'convert-to-pdf': 'convertToPdf',
  'convert-from-pdf': 'convertFromPdf',
  'organize-manage': 'organizeManage',
  'optimize-repair': 'optimizeRepair',
  'secure-pdf': 'securePdf',
};

/**
 * Modern compact ToolCard with gradient icon backgrounds
 * and improved information density
 */
export function ToolCard({ tool, locale, className = '', localizedContent, compact = false }: ToolCardProps) {
  const t = useTranslations();
  const toolUrl = `/${locale}/tools/${tool.slug}`;

  const toolName = localizedContent?.title || tool.id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const description = localizedContent?.description || tool.features
    .slice(0, 2)
    .map(f => f.replace(/-/g, ' '))
    .join(' • ');
  const displayDescription = getDisplayDescription(description, locale);

  const IconComponent = getToolIcon(tool.icon);
  const categoryColorClass = categoryColors[tool.category];
  const badgeColorClass = categoryBadgeColors[tool.category];
  const categoryName = t(`home.categories.${categoryTranslationKeys[tool.category]}`);

  if (compact) {
    // Ultra-compact version for dense grids
    return (
      <Link
        href={toolUrl}
        className={`group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--color-ring))] rounded-lg ${className}`}
        data-testid="tool-card-compact"
      >
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[hsl(var(--color-card))] border border-[hsl(var(--color-border))] hover:border-[hsl(var(--color-primary))/0.5] hover:bg-[hsl(var(--color-card-hover))] transition-all duration-200">
          {/* Icon */}
          <div className={`shrink-0 w-10 h-10 rounded-lg bg-linear-to-br ${categoryColorClass} flex items-center justify-center`}>
            <IconComponent className="w-5 h-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-[hsl(var(--color-foreground))] truncate group-hover:text-[hsl(var(--color-primary))] transition-colors">
              {toolName}
            </h3>
            <p className="text-[11px] text-[hsl(var(--color-muted-foreground))] truncate">
              {displayDescription}
            </p>
          </div>

          {/* Arrow */}
          <ArrowUpRight className="w-4 h-4 text-[hsl(var(--color-muted-foreground))] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={toolUrl}
      className={`group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--color-ring))] focus-visible:ring-offset-2 rounded-xl ${className}`}
      data-testid="tool-card"
    >
      <div className="relative h-full p-4 rounded-xl bg-[hsl(var(--color-card))] border border-[hsl(var(--color-border))] hover:border-[hsl(var(--color-border-strong))] hover:bg-[hsl(var(--color-card-hover))] transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden">
        {/* Favorite button */}
        <div className="absolute top-3 inset-e-3 z-10">
          <FavoriteButton toolId={tool.id} size="sm" />
        </div>

        {/* Gradient glow on hover */}
        <div className={`absolute -top-10 -inset-e-10 w-20 h-20 bg-linear-to-br ${categoryColorClass} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />

        <div className="flex flex-col h-full">
          {/* Icon & Title row */}
          <div className="flex items-start gap-3 mb-3">
            <div className={`shrink-0 w-11 h-11 rounded-xl bg-linear-to-br ${categoryColorClass} flex items-center justify-center`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 pe-8">
              <h3 className="text-sm font-semibold text-[hsl(var(--color-foreground))] leading-tight group-hover:text-[hsl(var(--color-primary))] transition-colors">
                {toolName}
              </h3>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-[hsl(var(--color-muted-foreground))] line-clamp-2 leading-relaxed mb-3 flex-1">
            {displayDescription}
          </p>

          {/* Footer row */}
          <div className="flex items-center justify-between pt-3 border-t border-[hsl(var(--color-border-subtle))]">
            {/* Category badge */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-md border ${badgeColorClass}`}>
              <Sparkles className="w-3 h-3" />
              {categoryName}
            </span>

            {/* Try now link */}
            <span className="text-xs font-medium text-[hsl(var(--color-primary))] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
              فتح
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ToolCard;
