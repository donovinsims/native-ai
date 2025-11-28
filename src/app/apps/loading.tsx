export default function AppsLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex pt-[67px]">
        <div className="hidden sm:block w-[250px]" />
        <main className="flex-1 sm:ml-[250px]">
          <div className="container mx-auto px-3 sm:px-5 py-4 sm:py-8">
            {/* Hero Skeleton */}
            <div className="mb-8">
              <div className="h-10 bg-muted rounded w-64 mb-2 animate-pulse" />
              <div className="h-5 bg-muted rounded w-96 max-w-full animate-pulse" />
            </div>

            {/* Search Bar Skeleton */}
            <div className="mb-6">
              <div className="flex gap-3">
                <div className="flex-1 h-10 bg-muted rounded-full animate-pulse" />
                <div className="h-10 w-24 bg-muted rounded-lg animate-pulse" />
              </div>
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-lg border bg-card p-3">
                  <div className="aspect-video bg-muted rounded-md mb-3 animate-pulse" />
                  <div className="flex gap-2 mb-2">
                    <div className="w-8 h-8 bg-muted rounded-lg animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-3/4 mb-1 animate-pulse" />
                      <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                    </div>
                  </div>
                  <div className="h-4 bg-muted rounded w-full mb-2 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
