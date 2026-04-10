'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Search,
  Menu,
  X,
  Home,
  Wrench,
  Workflow,
  Info,
  HelpCircle,
  Command,
  FileText,
  Star,
  ChevronRight,
} from 'lucide-react';
import { type Locale } from '@/lib/i18n/config';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { searchTools, SearchResult } from '@/lib/utils/search';
import { getToolContent } from '@/config/tool-content';
import { getAllTools } from '@/config/tools';

export interface HeaderProps {
  locale: Locale;
  showSearch?: boolean;
}

const getCategoryIcon = (category: string) => {
  const icons: Record<string, React.ReactNode> = {
    'edit-annotate': <FileText className="w-4 h-4" />,
    'convert-to-pdf': <FileText className="w-4 h-4" />,
    'convert-from-pdf': <FileText className="w-4 h-4" />,
    'organize-manage': <FileText className="w-4 h-4" />,
    'optimize-repair': <Wrench className="w-4 h-4" />,
    'secure-pdf': <Star className="w-4 h-4" />,
  };
  return icons[category] || <FileText className="w-4 h-4" />;
};

export const Header: React.FC<HeaderProps> = ({ locale, showSearch = true }) => {
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localizedTools, setLocalizedTools] = useState<Record<string, { title: string; description: string }>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Load localized tool content
  useEffect(() => {
    const allTools = getAllTools();
    const contentMap: Record<string, { title: string; description: string }> = {};

    allTools.forEach(tool => {
      const content = getToolContent(locale, tool.id);
      if (content) {
        contentMap[tool.id] = {
          title: content.title,
          description: content.metaDescription
        };
      }
    });

    setLocalizedTools(contentMap);
  }, [locale]);

  // Handle search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchTools(searchQuery, localizedTools);
      setSearchResults(results.slice(0, 6));
      setSelectedIndex(-1);
    } else {
      setSearchResults([]);
      setSelectedIndex(-1);
    }
  }, [searchQuery, localizedTools]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSearchOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        navigateToTool(searchResults[selectedIndex].tool.slug);
      } else if (searchResults.length > 0) {
        navigateToTool(searchResults[0].tool.slug);
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [searchResults, selectedIndex]);

  const navigateToTool = useCallback((slug: string) => {
    router.push(`/${locale}/tools/${slug}`);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  }, [locale, router]);

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { href: `/${locale}`, label: t('navigation.home'), icon: Home, active: pathname === `/${locale}` },
    { href: `/${locale}/tools`, label: t('navigation.tools'), icon: Wrench, active: pathname.startsWith(`/${locale}/tools`) },
    { href: `/${locale}/workflow`, label: t('navigation.workflow') || 'Workflow', icon: Workflow, active: pathname.startsWith(`/${locale}/workflow`) },
    { href: `/${locale}/about`, label: t('navigation.about'), icon: Info, active: pathname === `/${locale}/about` },
    { href: `/${locale}/faq`, label: t('navigation.faq'), icon: HelpCircle, active: pathname === `/${locale}/faq` },
  ];

  return (
    <>
      {/* Desktop Header - Compact top bar */}
      <header className="fixed inset-x-0 top-0 z-50 h-14 border-b border-[hsl(var(--color-border))] bg-[hsl(var(--color-background-elevated))]/95 backdrop-blur-md">
        <div className="h-full flex items-center justify-between px-4 lg:px-6">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2.5 text-[hsl(var(--color-foreground))] hover:opacity-80 transition-opacity"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(var(--color-primary))] to-[hsl(var(--color-accent))] text-white shadow-md">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M8 13h8" />
                <path d="M8 17h5" />
              </svg>
            </div>
            <span className="font-semibold text-sm tracking-tight hidden sm:block">{t('brand')}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  item.active
                    ? 'text-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary))]/10'
                    : 'text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-muted))]'
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            {showSearch && (
              <div className="relative" ref={searchContainerRef}>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-[hsl(var(--color-muted-foreground))] bg-[hsl(var(--color-muted))] hover:bg-[hsl(var(--color-border))] rounded-md transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="hidden lg:block">Search...</span>
                  <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-[hsl(var(--color-background))] rounded">
                    <Command className="w-2.5 h-2.5" />
                    <span>K</span>
                  </kbd>
                </button>

                {/* Search Modal */}
                {isSearchOpen && (
                  <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-lg bg-[hsl(var(--color-card))] rounded-xl border border-[hsl(var(--color-border))] shadow-2xl overflow-hidden animate-slide-in">
                      {/* Search Input */}
                      <div className="flex items-center gap-3 px-4 py-3 border-b border-[hsl(var(--color-border))]">
                        <Search className="w-5 h-5 text-[hsl(var(--color-muted-foreground))]" />
                        <input
                          ref={searchInputRef}
                          type="search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Search tools..."
                          className="flex-1 bg-transparent text-sm text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted-foreground))] outline-none"
                          autoComplete="off"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="p-1 hover:bg-[hsl(var(--color-muted))] rounded transition-colors"
                          >
                            <X className="w-4 h-4 text-[hsl(var(--color-muted-foreground))]" />
                          </button>
                        )}
                        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-[hsl(var(--color-muted-foreground))] bg-[hsl(var(--color-muted))] rounded">
                          ESC
                        </kbd>
                      </div>

                      {/* Search Results */}
                      <div className="max-h-[50vh] overflow-y-auto">
                        {searchResults.length > 0 ? (
                          <ul className="py-2">
                            {searchResults.map((result, index) => {
                              const localized = localizedTools[result.tool.id];
                              const toolName = localized?.title || result.tool.id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                              const toolDescription = localized?.description || result.tool.features.slice(0, 2).join(' • ');
                              const isSelected = index === selectedIndex;

                              return (
                                <li key={result.tool.id}>
                                  <button
                                    onClick={() => navigateToTool(result.tool.slug)}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                    className={`w-full px-4 py-2.5 flex items-center gap-3 transition-colors ${
                                      isSelected
                                        ? 'bg-[hsl(var(--color-primary))]/10'
                                        : 'hover:bg-[hsl(var(--color-muted))]'
                                    }`}
                                  >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[hsl(var(--color-muted))] text-[hsl(var(--color-primary))]">
                                      {getCategoryIcon(result.tool.category)}
                                    </div>
                                    <div className="flex-1 text-start">
                                      <div className={`text-sm font-medium ${isSelected ? 'text-[hsl(var(--color-primary))]' : 'text-[hsl(var(--color-foreground))]'}`}>
                                        {toolName}
                                      </div>
                                      <div className="text-xs text-[hsl(var(--color-muted-foreground))] truncate">
                                        {toolDescription}
                                      </div>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 rtl:scale-x-[-1] transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        ) : searchQuery ? (
                          <div className="px-4 py-8 text-center">
                            <p className="text-sm text-[hsl(var(--color-muted-foreground))]">No tools found</p>
                          </div>
                        ) : (
                          <div className="px-4 py-6">
                            <p className="text-xs text-[hsl(var(--color-muted-foreground))] mb-3">Popular tools</p>
                            <div className="flex flex-wrap gap-2">
                              {['merge-pdf', 'split-pdf', 'compress-pdf', 'pdf-to-word'].map((toolId) => {
                                const tool = getAllTools().find(t => t.id === toolId);
                                if (!tool) return null;
                                const localized = localizedTools[tool.id];
                                const toolName = localized?.title || tool.id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

                                return (
                                  <button
                                    key={toolId}
                                    onClick={() => navigateToTool(tool.slug)}
                                    className="px-3 py-1.5 text-xs font-medium bg-[hsl(var(--color-muted))] hover:bg-[hsl(var(--color-border))] text-[hsl(var(--color-foreground))] rounded-md transition-colors"
                                  >
                                    {toolName}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="px-4 py-2 border-t border-[hsl(var(--color-border))] bg-[hsl(var(--color-muted))]/50 flex items-center justify-between text-[10px] text-[hsl(var(--color-muted-foreground))]">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <kbd className="px-1 bg-[hsl(var(--color-background))] rounded">↑↓</kbd>
                            <span>Navigate</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <kbd className="px-1 bg-[hsl(var(--color-background))] rounded">↵</kbd>
                            <span>Select</span>
                          </span>
                        </div>
                        <span>{searchResults.length} results</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <ThemeToggle className="h-8 w-8 p-0 text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-muted))] rounded-md" />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden h-8 w-8 flex items-center justify-center text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-muted))] rounded-md transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <nav className="absolute end-0 top-14 bottom-0 w-64 bg-[hsl(var(--color-background-elevated))] border-s border-[hsl(var(--color-border))] animate-slide-in">
            <div className="p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    item.active
                      ? 'text-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary))]/10'
                      : 'text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-muted))]'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
