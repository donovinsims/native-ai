"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterChipsProps {
  filters: {
    search?: string;
    category?: string;
    platform?: string;
    pricing?: string;
    sort?: string;
  };
  onRemoveFilter: (filterKey: string) => void;
  onClearAll: () => void;
}

const SORT_LABELS: Record<string, string> = {
  newest: "Newest",
  popular: "Most Popular",
  "top-rated": "Top Rated",
  "recently-updated": "Recently Updated",
  "a-z": "A-Z",
};

export function FilterChips({
  filters,
  onRemoveFilter,
  onClearAll,
}: FilterChipsProps) {
  const activeFilters: { key: string; label: string; value: string }[] = [];

  if (filters.search) {
    activeFilters.push({
      key: "search",
      label: "Search",
      value: filters.search,
    });
  }

  if (filters.platform) {
    activeFilters.push({
      key: "platform",
      label: "Platform",
      value: filters.platform,
    });
  }

  if (filters.pricing && filters.pricing !== "all") {
    activeFilters.push({
      key: "pricing",
      label: "Pricing",
      value: filters.pricing === "free" ? "Free" : "Paid",
    });
  }

  if (filters.category) {
    activeFilters.push({
      key: "category",
      label: "Category",
      value: filters.category,
    });
  }

  if (filters.sort && filters.sort !== "newest") {
    activeFilters.push({
      key: "sort",
      label: "Sort",
      value: SORT_LABELS[filters.sort] || filters.sort,
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4">
      <span className="text-sm text-muted-foreground">Filtered by:</span>
      {activeFilters.map((filter) => (
        <Badge
          key={filter.key}
          variant="secondary"
          className="flex items-center gap-1 pl-2 pr-1 py-1"
        >
          <span className="text-xs">
            {filter.key === "search" ? `"${filter.value}"` : filter.value}
          </span>
          <button
            onClick={() => onRemoveFilter(filter.key)}
            className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
            aria-label={`Remove ${filter.label} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
      >
        Clear all
      </Button>
    </div>
  );
}
