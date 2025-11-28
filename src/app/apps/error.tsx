"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function AppsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("[AppsError]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white">
      <div className="flex pt-[67px]">
        <div className="hidden sm:block w-[250px]" />
        <main className="flex-1 sm:ml-[250px]">
          <div className="container mx-auto px-3 sm:px-5 py-16 text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-red-100 p-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {error.message || "An unexpected error occurred while loading the apps."}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={reset}>Try Again</Button>
              <Button variant="outline" asChild>
                <a href="/">Go Home</a>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
