'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Tool, ToolCategory, CATEGORY_INFO } from '@/types/tool';
import { ToolCard } from './ToolCard';
import { Grid3X3, Layers } from 'lucide-react';

export interface ToolGridProps {
  /** Array of tools to display */
  tools: Tool[];
  /** Current locale for URL generation */
  locale: string;
  /** Optional category filter */
  category?: ToolCategory;
  /** Optional search query to filter tools */
  searchQuery?: string;
  /** Whether to show category headers */
  showCategoryHeaders?: boolean;
  /** Optional additional CSS classes */
  className?: string;
  /** Localized tool content */
  localizedToolContent?: Record<string, { title: string; description: string }>;
  /** Use compact cards for denser layouts */
  compact?: boolean;
}

const categoryTranslationKeys: Record<ToolCategory, string> = {
  'edit-annotate': 'editAnnotate',
  'convert-to-pdf': 'convertToPdf',
  'convert-from-pdf': 'convertFromPdf',
  'organize-manage': 'organizeManage',
  'optimize-repair': 'optimizeRepair',
  'secure-pdf': 'securePdf',
};

const categoryIcons: Record<ToolCategory, React.ReactNode> = {
  'edit-annotate': <Layers className="w-4 h-4" />,
  'convert-to-pdf': <Grid3X3 className="w-4 h-4" />,
  'convert-from-pdf': <Grid3X3 className="w-4 h-4" />,
  'organize-manage': <Layers className="w-4 h-4" />,
  'optimize-repair': <Layers className="w-4 h-4" />,
  'secure-pdf': <Layers className="w-4 h-4" />,
};

/**
 * Modern ToolGrid with responsive dense layouts
 * Supports filtering, grouping by category, and compact mode
 */
export function ToolGrid({
  tools,
  locale,
  category,
  searchQuery,
  showCategoryHeaders = false,
  className = '',
  localizedToolContent,
  compact = false,
}: ToolGridProps) {
  const t = useTranslations();

  // Filter tools
  const filteredTools = useMemo(() => {
    let result = tools;

    if (category) {
      result = result.filter(tool => tool.category === category);
    }

    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(tool => {
        if (localizedToolContent && localizedToolContent[tool.id]) {
          const { title, description } = localizedToolContent[tool.id];
          if (title.toLowerCase().includes(query) || description.toLowerCase().includes(query)) {
            return true;
          }
        }

        const toolName = tool.id.replace(/-/g, ' ').toLowerCase();
        const features = tool.features.map(f => f.replace(/-/g, ' ').toLowerCase()).join(' ');
        return toolName.includes(query) || features.includes(query);
      });
    }

    return result;
  }, [tools, category, searchQuery, localizedToolContent]);

  // Group by category
  const groupedTools = useMemo(() => {
    if (!showCategoryHeaders) return null;

    const groups: Record<ToolCategory, Tool[]> = {
      'edit-annotate': [],
      'convert-to-pdf': [],
      'convert-from-pdf': [],
      'organize-manage': [],
      'optimize-repair': [],
      'secure-pdf': [],
    };

    for (const tool of filteredTools) {
      groups[tool.category].push(tool);
    }

    return groups;
  }, [filteredTools, showCategoryHeaders]);

  if (filteredTools.length === 0) {
    return (
      <div className={`text-center py-16 ${className}`} data-testid="tool-grid-empty">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[hsl(var(--color-muted))] flex items-center justify-center">
          <Grid3X3 className="w-8 h-8 text-[hsl(var(--color-muted-foreground))]" />
        </div>
        <p className="text-sm text-[hsl(var(--color-muted-foreground))]">No tools found</p>
      </div>
    );
  }

  // Grid classes based on compact mode
  const gridClasses = compact
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2'
    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';

  // Render grouped by category
  if (showCategoryHeaders && groupedTools) {
    return (
      <div className={`space-y-8 ${className}`} data-testid="tool-grid">
        {Object.entries(groupedTools).map(([cat, categoryTools]) => {
          if (categoryTools.length === 0) return null;

          const categoryInfo = CATEGORY_INFO[cat as ToolCategory];
          const categoryName = t(`home.categories.${categoryTranslationKeys[cat as ToolCategory]}`);
          const Icon = categoryIcons[cat as ToolCategory];

          return (
            <section key={cat} data-testid={`tool-grid-category-${cat}`} className="animate-fade-in">
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[hsl(var(--color-border-subtle))]">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[hsl(var(--color-muted))] text-[hsl(var(--color-primary))]">
                  {Icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-semibold text-[hsl(var(--color-foreground))]">
                    {categoryName}
                  </h2>
                  <p className="text-xs text-[hsl(var(--color-muted-foreground))]">
                    {categoryTools.length} {categoryTools.length === 1 ? 'tool' : 'tools'} • {categoryInfo.description}
                  </p>
                </div>
              </div>

              {/* Tools Grid */}
              <div className={gridClasses}>
                {categoryTools.map((tool, index) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    locale={locale}
                    localizedContent={localizedToolContent?.[tool.id]}
                    compact={compact}
                    className={`stagger-${(index % 5) + 1}`}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    );
  }

  // Render flat grid
  return (
    <div className={`${gridClasses} ${className}`} data-testid="tool-grid">
      {filteredTools.map((tool, index) => (
        <ToolCard
          key={tool.id}
          tool={tool}
          locale={locale}
          localizedContent={localizedToolContent?.[tool.id]}
          compact={compact}
          className={`stagger-${(index % 5) + 1} animate-fade-in`}
        />
      ))}
    </div>
  );
}

export default ToolGrid;
