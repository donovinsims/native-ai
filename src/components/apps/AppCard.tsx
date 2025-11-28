"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { App } from "@/lib/db/queries";

interface AppCardProps {
  app: App;
}

export function AppCard({ app }: AppCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const screenshots = app.screenshotUrls as string[] | null;
  const displayImage =
    screenshots && screenshots.length > 0 && !imageError
      ? screenshots[0]
      : app.iconUrl;

  return (
    <Link href={`/apps/${app.slug}`} className="group block">
      {/* Screenshot/Image Section */}
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        )}
        <Image
          src={displayImage}
          alt={app.name}
          fill
          className="object-cover relative z-10"
          onError={() => setImageError(true)}
          onLoad={() => setIsLoading(false)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity z-20" />
      </div>

      {/* Title & Description - Simple layout below image */}
      <div className="mt-3">
        <h3 className="text-sm font-medium text-gray-900">{app.name}</h3>
        <p className="text-sm text-gray-400 mt-0.5 line-clamp-2">
          {app.shortDescription || app.description}
        </p>
      </div>
    </Link>
  );
}