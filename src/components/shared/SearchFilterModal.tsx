"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";

export interface FilterState {
  search?: string;
  category?: string;
  platform?: string;
  pricing?: string;
  sort?: string;
}

interface SearchFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: "apps" | "workflows" | "shortcuts" | "mcps" | "creators";
  currentFilters?: FilterState;
  onApplyFilters: (filters: FilterState) => void;
}

const CATEGORIES = {
  apps: [
    "Productivity",
    "Design",
    "Developer Tools",
    "Utilities",
    "Social",
    "Entertainment",
    "Finance",
  ],
  workflows: [
    "Automation",
    "Data Processing",
    "Marketing",
    "Sales",
    "HR",
    "Finance",
  ],
  shortcuts: [
    "Productivity",
    "Social Media",
    "Utilities",
    "Health",
    "Entertainment",
  ],
  mcps: ["AI", "Data", "Communication", "Development", "Utilities"],
  creators: ["Developer", "Designer", "Content Creator", "Educator"],
};

const PLATFORMS = {
  apps: ["iOS", "macOS", "Cross-platform"],
  shortcuts: ["iOS", "macOS", "Both"],
  mcps: ["Claude Desktop", "Any MCP Client"],
  workflows: [],
  creators: [],
};

const SORT_OPTIONS = {
  apps: [
    { value: "newest", label: "Newest" },
    { value: "popular", label: "Most Popular" },
    { value: "top-rated", label: "Top Rated" },
    { value: "recently-updated", label: "Recently Updated" },
    { value: "a-z", label: "A-Z" },
  ],
  workflows: [
    { value: "newest", label: "Newest" },
    { value: "popular", label: "Most Popular" },
    { value: "top-rated", label: "Top Rated" },
  ],
  shortcuts: [
    { value: "newest", label: "Newest" },
    { value: "popular", label: "Most Popular" },
    { value: "top-rated", label: "Top Rated" },
  ],
  mcps: [
    { value: "newest", label: "Newest" },
    { value: "popular", label: "Most Popular" },
    { value: "top-rated", label: "Top Rated" },
  ],
  creators: [
    { value: "newest", label: "Newest" },
    { value: "popular", label: "Most Popular" },
    { value: "a-z", label: "A-Z" },
  ],
};

export function SearchFilterModal({
  isOpen,
  onClose,
  contentType,
  currentFilters = {},
  onApplyFilters,
}: SearchFilterModalProps) {
  const [activeTab, setActiveTab] = useState<"search" | "filters">("search");
  const [searchValue, setSearchValue] = useState(currentFilters.search || "");
  const [filters, setFilters] = useState<FilterState>(currentFilters);
  const [debouncedSearch, setDebouncedSearch] = useState(searchValue);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchValue(currentFilters.search || "");
      setFilters(currentFilters);
    }
  }, [isOpen, currentFilters]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const categories = CATEGORIES[contentType] || [];
  const platforms = PLATFORMS[contentType] || [];
  const sortOptions = SORT_OPTIONS[contentType] || [];

  const handleCategoryToggle = useCallback((category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === category ? undefined : category,
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSearchValue("");
  }, []);

  const handleApply = useCallback(() => {
    const finalFilters: FilterState = {
      ...filters,
      search: searchValue || undefined,
    };
    // Remove undefined values
    Object.keys(finalFilters).forEach((key) => {
      if (finalFilters[key as keyof FilterState] === undefined) {
        delete finalFilters[key as keyof FilterState];
      }
    });
    onApplyFilters(finalFilters);
    onClose();
  }, [filters, searchValue, onApplyFilters, onClose]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchValue) count++;
    if (filters.category) count++;
    if (filters.platform) count++;
    if (filters.pricing && filters.pricing !== "all") count++;
    if (filters.sort && filters.sort !== "newest") count++;
    return count;
  }, [searchValue, filters]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <DialogTitle className="text-lg font-semibold">
            Search & Filter
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "search" | "filters")}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="grid w-full grid-cols-2 mx-4 mt-2" style={{ width: 'calc(100% - 32px)' }}>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="filters">
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                  {activeFilterCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-4">
            <TabsContent value="search" className="mt-0 h-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={`Search ${contentType}...`}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-10"
                  autoFocus
                />
              </div>
              {debouncedSearch && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Press &quot;Apply&quot; to search for &quot;{debouncedSearch}&quot;
                </p>
              )}
            </TabsContent>

            <TabsContent value="filters" className="mt-0 space-y-6">
              {/* Platform Filter */}
              {platforms.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Platform</Label>
                  <RadioGroup
                    value={filters.platform || ""}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        platform: value || undefined,
                      }))
                    }
                    className="flex flex-wrap gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="" id="platform-all" />
                      <Label htmlFor="platform-all" className="cursor-pointer">
                        All
                      </Label>
                    </div>
                    {platforms.map((platform) => (
                      <div key={platform} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={platform}
                          id={`platform-${platform}`}
                        />
                        <Label
                          htmlFor={`platform-${platform}`}
                          className="cursor-pointer"
                        >
                          {platform}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Pricing Filter (Apps only) */}
              {contentType === "apps" && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Pricing</Label>
                  <RadioGroup
                    value={filters.pricing || "all"}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        pricing: value === "all" ? undefined : value,
                      }))
                    }
                    className="flex flex-wrap gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="pricing-all" />
                      <Label htmlFor="pricing-all" className="cursor-pointer">
                        All
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="free" id="pricing-free" />
                      <Label htmlFor="pricing-free" className="cursor-pointer">
                        Free
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paid" id="pricing-paid" />
                      <Label htmlFor="pricing-paid" className="cursor-pointer">
                        Paid
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Category Filter */}
              {categories.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Category</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge
                        key={category}
                        variant={
                          filters.category === category ? "default" : "outline"
                        }
                        className="cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
                        onClick={() => handleCategoryToggle(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Sort By */}
              {sortOptions.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Sort By</Label>
                  <Select
                    value={filters.sort || "newest"}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, sort: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select sort order" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 border-t bg-muted/50">
          <Button variant="ghost" onClick={handleClearFilters}>
            Clear Filters
          </Button>
          <Button onClick={handleApply}>
            Apply
            {activeFilterCount > 0 && ` (${activeFilterCount})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
