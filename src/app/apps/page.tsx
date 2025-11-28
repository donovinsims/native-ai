import { Suspense } from "react";
import { getApps, type GetAppsParams } from "@/lib/db/queries";
import { AppsContent } from "./AppsContent";

interface AppsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    platform?: string;
    pricing?: string;
    sort?: string;
  }>;
}

export const metadata = {
  title: "iOS & macOS Apps - Native AI",
  description: "Discover curated apps for iPhone, iPad, and Mac",
};

export default async function AppsPage({ searchParams }: AppsPageProps) {
  const params = await searchParams;

  const queryParams: GetAppsParams = {
    search: params.search,
    category: params.category,
    platform: params.platform as "iOS" | "macOS" | "Cross-platform" | undefined,
    pricing: params.pricing as "free" | "paid" | "all" | undefined,
    sort: (params.sort as GetAppsParams["sort"]) || "newest",
    limit: 24,
  };

  const apps = await getApps(queryParams);

  return (
    <Suspense fallback={<AppsLoadingSkeleton />}>
      <AppsContent apps={apps} currentFilters={params} />
    </Suspense>
  );
}

function AppsLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex pt-[67px]">
        <div className="hidden sm:block w-[250px]" />
        <main className="flex-1 sm:ml-[250px]">
          <div className="container mx-auto px-3 sm:px-5 py-4 sm:py-8">
            <div className="mb-8">
              <div className="h-10 bg-muted rounded w-64 mb-2 animate-pulse" />
              <div className="h-5 bg-muted rounded w-96 animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-lg border bg-card p-4">
                  <div className="aspect-video bg-muted rounded mb-4 animate-pulse" />
                  <div className="h-5 bg-muted rounded w-3/4 mb-2 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-full animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
