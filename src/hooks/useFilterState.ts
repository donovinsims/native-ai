"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export interface FilterState {
  search?: string;
  category?: string;
  platform?: string;
  pricing?: string;
  sort?: string;
}

export function useFilterState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilters = useCallback(
    (newFilters: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [router, pathname, searchParams]
  );

  const removeFilter = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [router, pathname, searchParams]
  );

  const clearAllFilters = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  const currentFilters = useMemo(() => {
    const filters: FilterState = {};
    searchParams.forEach((value, key) => {
      if (value) {
        filters[key as keyof FilterState] = value;
      }
    });
    return filters;
  }, [searchParams]);

  const hasActiveFilters = useMemo(() => {
    return Object.keys(currentFilters).length > 0;
  }, [currentFilters]);

  return {
    updateFilters,
    removeFilter,
    clearAllFilters,
    currentFilters,
    hasActiveFilters,
  };
}
