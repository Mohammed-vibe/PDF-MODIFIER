'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  X,
  Filter,
  Star,
  Grid3X3,
  List,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolGrid } from '@/components/tools/ToolGrid';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getAllTools, getToolsByCategory, getToolById } from '@/config/tools';
import { toolMatchesQuery } from '@/lib/utils/search';
import { type Locale } from '@/lib/i18n/config';
import { CATEGORY_INFO, type ToolCategory } from '@/types/tool';
import { useFavorites } from '@/hooks/useFavorites';

type CategoryFilter = ToolCategory | 'all' | 'favorites';
type ViewMode = 'grid' | 'compact';

interface ToolsPageClientProps {
  locale: Locale;
  localizedToolContent?: Record<string, { title: string; description: string }>;
}

const categoryColors: Record<string, string> = {
  all: 'from-slate-500 to-slate-600',
  favorites: 'from-amber-500 to-yellow-500',
  'edit-annotate': 'from-amber-500 to-orange-500',
  'convert-to-pdf': 'from-emerald-500 to-teal-500',
  'convert-from-pdf': 'from-cyan-500 to-blue-500',
  'organize-manage': 'from-violet-500 to-purple-500',
  'optimize-repair': 'from-rose-500 to-pink-500',
  'secure-pdf': 'from-indigo-500 to-blue-600',
};

export default function ToolsPageClient({ locale, localizedToolContent }: ToolsPageClientProps) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const allTools = getAllTools();
  const { favorites, isLoaded: favoritesLoaded, favoritesCount } = useFavorites();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const categoryTranslationKeys: Record<ToolCategory, string> = {
    'edit-annotate': 'editAnnotate',
    'convert-to-pdf': 'convertToPdf',
    'convert-from-pdf': 'convertFromPdf',
    'organize-manage': 'organizeManage',
    'optimize-repair': 'optimizeRepair',
    'secure-pdf': 'securePdf',
  };

  // Read initial values from URL
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(
    (initialCategory as ToolCategory) || 'all'
  );

  // Sync state with URL params
  useEffect(() => {
    const category = searchParams.get('category') || 'all';
    const query = searchParams.get('q') || '';
    setSelectedCategory(category as CategoryFilter);
    setSearchQuery(query);
  }, [searchParams]);

  // Filter tools
  const filteredTools = useMemo(() => {
    let tools = allTools;

    if (selectedCategory === 'favorites') {
      tools = favorites
        .map(id => getToolById(id))
        .filter((tool): tool is NonNullable<typeof tool> => tool !== undefined);
    } else if (selectedCategory !== 'all') {
      tools = getToolsByCategory(selectedCategory as ToolCategory);
    }

    if (searchQuery.trim()) {
      tools = tools.filter(tool =>
        toolMatchesQuery(tool, searchQuery, localizedToolContent?.[tool.id])
      );
    }

    return tools;
  }, [allTools, selectedCategory, searchQuery, favorites]);

  // Category options
  const categories: { value: CategoryFilter; label: string; count?: number }[] = [
    { value: 'all', label: t('toolsPage.allTools'), count: allTools.length },
    {
      value: 'favorites',
      label: t('tools.favorite.title'),
      count: favoritesLoaded ? favoritesCount : 0,
    },
    { value: 'edit-annotate', label: t('home.categories.editAnnotate'), count: getToolsByCategory('edit-annotate').length },
    { value: 'convert-to-pdf', label: t('home.categories.convertToPdf'), count: getToolsByCategory('convert-to-pdf').length },
    { value: 'convert-from-pdf', label: t('home.categories.convertFromPdf'), count: getToolsByCategory('convert-from-pdf').length },
    { value: 'organize-manage', label: t('home.categories.organizeManage'), count: getToolsByCategory('organize-manage').length },
    { value: 'optimize-repair', label: t('home.categories.optimizeRepair'), count: getToolsByCategory('optimize-repair').length },
    { value: 'secure-pdf', label: t('home.categories.securePdf'), count: getToolsByCategory('secure-pdf').length },
  ];

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
  }, []);

  const activeGradient = categoryColors[selectedCategory] || categoryColors.all;
  const resultsText = selectedCategory === 'favorites'
    ? `${filteredTools.length} ${t('tools.favorite.title')}`
    : filteredTools.length === allTools.length
      ? t('toolsPage.showingAll', { count: allTools.length })
      : t('toolsPage.showingFiltered', { filtered: filteredTools.length, total: allTools.length });

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--color-background))]">
      <Header locale={locale} />

      <main className="flex-1 pt-14">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-[hsl(var(--color-border))]">
          <div className={`absolute inset-0 bg-linear-to-br ${activeGradient} opacity-5`} />

          <div className="relative max-w-7xl mx-auto px-4 lg:px-6 py-10">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              {/* Title & Description */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--color-muted))] text-[hsl(var(--color-muted-foreground))] text-xs font-medium mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  {allTools.length}+ {t('toolsPage.allTools')}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[hsl(var(--color-foreground))] mb-2">
                  <span className="text-gradient">{t('toolsPage.title')}</span>
                </h1>
                <p className="text-sm text-[hsl(var(--color-muted-foreground))] max-w-xl">
                  {t('toolsPage.subtitle', { count: allTools.length })}
                </p>
              </div>

              {/* Search Box */}
              <div className="w-full lg:w-auto lg:min-w-[320px]">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--color-muted-foreground))] group-focus-within:text-[hsl(var(--color-primary))] transition-colors" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('tools.search.placeholder')}
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-[hsl(var(--color-card))] border border-[hsl(var(--color-border))] rounded-lg text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary))]/20 focus:border-[hsl(var(--color-primary))] transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[hsl(var(--color-muted))] rounded transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-[hsl(var(--color-muted-foreground))]" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Bar */}
        <div className="sticky top-14 z-30 border-b border-[hsl(var(--color-border))] bg-[hsl(var(--color-background-elevated))]/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {/* Category Pills */}
              <div className="flex-1 flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                      selectedCategory === cat.value
                        ? cat.value === 'favorites'
                          ? 'bg-amber-500/10 border-amber-500/50 text-amber-500'
                          : 'bg-[hsl(var(--color-primary))]/10 border-[hsl(var(--color-primary))]/50 text-[hsl(var(--color-primary))]'
                        : 'bg-[hsl(var(--color-card))] border-[hsl(var(--color-border))] text-[hsl(var(--color-muted-foreground))] hover:border-[hsl(var(--color-border-strong))] hover:text-[hsl(var(--color-foreground))]'
                    }`}
                  >
                    {cat.value === 'favorites' && <Star className="w-3 h-3 fill-current" />}
                    {cat.label}
                    {cat.count !== undefined && (
                      <span className={`ml-0.5 ${selectedCategory === cat.value ? 'opacity-100' : 'opacity-60'}`}>
                        {cat.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* View Toggle & Clear */}
              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-[hsl(var(--color-muted))] rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-[hsl(var(--color-card))] text-[hsl(var(--color-foreground))] shadow-sm'
                        : 'text-[hsl(var(--color-muted-foreground))]'
                    }`}
                    title="عرض شبكي"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('compact')}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'compact'
                        ? 'bg-[hsl(var(--color-card))] text-[hsl(var(--color-foreground))] shadow-sm'
                        : 'text-[hsl(var(--color-muted-foreground))]'
                    }`}
                    title="عرض مختصر"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Clear Filters */}
                {(searchQuery || selectedCategory !== 'all') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-xs text-[hsl(var(--color-muted-foreground))]"
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    {t('toolsPage.clearAll')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <section className="py-6">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                {resultsText}
                {searchQuery && ` ${t('toolsPage.forQuery', { query: searchQuery })}`}
              </p>
            </div>

            {/* Tools Grid */}
            {filteredTools.length > 0 ? (
              <ToolGrid
                tools={filteredTools}
                locale={locale}
                localizedToolContent={localizedToolContent}
                showCategoryHeaders={selectedCategory === 'all' && !searchQuery}
                compact={viewMode === 'compact'}
              />
            ) : selectedCategory === 'favorites' ? (
              // Empty favorites state
              <Card className="p-12 text-center border-dashed border-2 border-[hsl(var(--color-border-subtle))] bg-[hsl(var(--color-muted))]/30">
                <div className="max-w-sm mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <Star className="h-8 w-8 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-[hsl(var(--color-foreground))] mb-2">
                    {t('tools.favorite.empty')}
                  </h3>
                  <p className="text-sm text-[hsl(var(--color-muted-foreground))] mb-6">
                    {t('tools.favorite.hint')}
                  </p>
                  <Button variant="outline" onClick={() => setSelectedCategory('all')}>
                    {t('toolsPage.allTools')}
                  </Button>
                </div>
              </Card>
            ) : (
              // No results
              <Card className="p-12 text-center border-dashed border-2 border-[hsl(var(--color-border-subtle))] bg-[hsl(var(--color-muted))]/30">
                <div className="max-w-sm mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[hsl(var(--color-muted))] flex items-center justify-center">
                    <Search className="h-8 w-8 text-[hsl(var(--color-muted-foreground))]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[hsl(var(--color-foreground))] mb-2">
                    {t('toolsPage.noToolsFound')}
                  </h3>
                  <p className="text-sm text-[hsl(var(--color-muted-foreground))] mb-6">
                    {t('tools.search.noResults', { query: searchQuery })}
                  </p>
                  <Button variant="outline" onClick={handleClearFilters}>
                    {t('toolsPage.clearFilters')}
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
