"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeaderNavigation from "@/components/sections/header-navigation";
import SidebarNavigation from "@/components/sections/sidebar-navigation";
import { AppCard } from "@/components/apps/AppCard";
import { FilterChips } from "@/components/shared/FilterChips";
import { EmptyState } from "@/components/shared/EmptyState";
import { SearchFilterModal, type FilterState } from "@/components/shared/SearchFilterModal";
import { useFilterState } from "@/hooks/useFilterState";
import { useModal } from "@/hooks/useModal";
import { SubscribeModal } from "@/components/modals/SubscribeModal";
import { SubmitAppModal } from "@/components/modals/SubmitAppModal";
import type { App } from "@/lib/db/queries";

interface AppsContentProps {
  apps: App[];
  currentFilters: {
    search?: string;
    category?: string;
    platform?: string;
    pricing?: string;
    sort?: string;
  };
}

export function AppsContent({ apps, currentFilters }: AppsContentProps) {
  const router = useRouter();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const { updateFilters, removeFilter, clearAllFilters } = useFilterState();
  const subscribeModal = useModal();
  const submitModal = useModal();

  const handleApplyFilters = (filters: FilterState) => {
    updateFilters(filters);
  };

  const handleClearAll = () => {
    clearAllFilters();
  };

  return (
    <div className="relative min-h-screen bg-white">
      <HeaderNavigation
        onSubscribeClick={subscribeModal.open}
        onSubmitClick={submitModal.open}
      />

      <div className="flex pt-[67px]">
        <SidebarNavigation onSubmitClick={submitModal.open} />

        <main className="flex-1 sm:ml-[250px]">
          <div className="container mx-auto px-3 sm:px-5 py-4 sm:py-8">
            {/* Hero Section */}
            <div className="mb-8">
              <h1 className="text-4xl font-semibold tracking-tight mb-2">
                iOS & macOS Apps
              </h1>
              <p className="text-xl text-muted-foreground font-normal leading-8">
                Discover curated apps for iPhone, iPad, and Mac
              </p>
            </div>

            {/* Search Bar + Filter Button */}
            <div className="mb-6">
              <div className="flex gap-3">
                <button
                  onClick={() => setSearchModalOpen(true)}
                  className="flex-1 flex items-center gap-3 px-4 py-2.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-left"
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {currentFilters.search
                      ? `Searching "${currentFilters.search}"`
                      : "Search for apps..."}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground hidden sm:block">
                    ⌘ K
                  </span>
                </button>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => setSearchModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                </Button>
              </div>

              {/* Filter Chips */}
              <FilterChips
                filters={currentFilters}
                onRemoveFilter={removeFilter}
                onClearAll={handleClearAll}
              />
            </div>

            {/* Apps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {apps.length === 0 ? (
                <EmptyState
                  title="No apps found"
                  description="Try adjusting your filters or search terms"
                  action={{
                    label: "Clear Filters",
                    onClick: handleClearAll,
                  }}
                />
              ) : (
                apps.map((app) => <AppCard key={app.id} app={app} />)
              )}
            </div>

            {/* Results count */}
            {apps.length > 0 && (
              <p className="mt-8 text-center text-sm text-muted-foreground">
                Showing {apps.length} apps
              </p>
            )}
          </div>
        </main>
      </div>

      {/* Search/Filter Modal */}
      <SearchFilterModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        contentType="apps"
        currentFilters={currentFilters}
        onApplyFilters={handleApplyFilters}
      />

      {/* Other Modals */}
      <SubscribeModal isOpen={subscribeModal.isOpen} onClose={subscribeModal.close} />
      <SubmitAppModal isOpen={submitModal.isOpen} onClose={submitModal.close} />
    </div>
  );
}
