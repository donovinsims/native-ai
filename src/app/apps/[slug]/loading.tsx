export default function AppDetailLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex pt-[67px]">
        <div className="hidden sm:block w-[250px]" />
        <main className="flex-1 sm:ml-[250px]">
          <div className="container mx-auto px-3 sm:px-5 py-4 sm:py-8 max-w-5xl">
            {/* Breadcrumbs Skeleton */}
            <div className="flex gap-2 mb-6">
              <div className="h-4 bg-muted rounded w-12 animate-pulse" />
              <div className="h-4 bg-muted rounded w-4 animate-pulse" />
              <div className="h-4 bg-muted rounded w-12 animate-pulse" />
              <div className="h-4 bg-muted rounded w-4 animate-pulse" />
              <div className="h-4 bg-muted rounded w-24 animate-pulse" />
            </div>

            {/* Back Button Skeleton */}
            <div className="h-9 bg-muted rounded w-20 mb-6 animate-pulse" />

            {/* Hero Section Skeleton */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              {/* Icon Skeleton */}
              <div className="w-24 h-24 md:w-32 md:h-32 bg-muted rounded-2xl animate-pulse flex-shrink-0" />

              {/* Info Skeleton */}
              <div className="flex-1">
                <div className="h-8 bg-muted rounded w-48 mb-2 animate-pulse" />
                <div className="h-4 bg-muted rounded w-32 mb-4 animate-pulse" />
                <div className="flex gap-4 mb-4">
                  <div className="h-5 bg-muted rounded w-16 animate-pulse" />
                  <div className="h-5 bg-muted rounded w-20 animate-pulse" />
                  <div className="h-5 bg-muted rounded w-14 animate-pulse" />
                </div>
                <div className="flex gap-3">
                  <div className="h-10 bg-muted rounded w-32 animate-pulse" />
                  <div className="h-10 bg-muted rounded w-28 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Screenshots Skeleton */}
            <div className="mb-8">
              <div className="h-6 bg-muted rounded w-28 mb-4 animate-pulse" />
              <div className="aspect-video bg-muted rounded-lg mb-3 animate-pulse" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-24 h-16 bg-muted rounded-md animate-pulse flex-shrink-0"
                  />
                ))}
              </div>
            </div>

            {/* About Skeleton */}
            <div className="mb-8">
              <div className="h-6 bg-muted rounded w-16 mb-4 animate-pulse" />
              <div className="rounded-lg border p-4">
                <div className="h-4 bg-muted rounded w-full mb-2 animate-pulse" />
                <div className="h-4 bg-muted rounded w-full mb-2 animate-pulse" />
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
              </div>
            </div>

            {/* Features Skeleton */}
            <div className="mb-8">
              <div className="h-6 bg-muted rounded w-20 mb-4 animate-pulse" />
              <div className="rounded-lg border p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-4 bg-muted rounded w-3/4 animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
