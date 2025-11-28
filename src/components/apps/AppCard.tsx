"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Smartphone, Monitor, Layers } from "lucide-react";
import type { App } from "@/lib/db/queries";

interface AppCardProps {
  app: App;
  showBookmark?: boolean;
}

function formatReviewCount(count: number | null): string {
  if (!count) return "0";
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

function getPlatformIcon(platform: string) {
  switch (platform) {
    case "iOS":
      return <Smartphone className="h-3 w-3" />;
    case "macOS":
      return <Monitor className="h-3 w-3" />;
    case "Cross-platform":
      return <Layers className="h-3 w-3" />;
    default:
      return null;
  }
}

function getPricingBadgeVariant(
  isPaid: boolean,
  price: string | null
): "default" | "secondary" | "outline" {
  if (!isPaid) return "secondary"; // Free - green-ish
  if (price?.includes("/")) return "default"; // Subscription - purple
  return "outline"; // One-time paid - blue
}

function getPricingLabel(isPaid: boolean, price: string | null): string {
  if (!isPaid) return "Free";
  return price || "Paid";
}

export function AppCard({ app }: AppCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const screenshots = app.screenshotUrls as string[] | null;
  const tags = app.tags as string[] | null;
  const displayImage =
    screenshots && screenshots.length > 0 && !imageError
      ? screenshots[0]
      : app.iconUrl;

  return (
    <Link href={`/apps/${app.slug}`}>
      <Card
        className="group relative overflow-hidden border border-gray-100 bg-white p-3 transition-all duration-200 hover:bg-gray-50 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden rounded-md border border-gray-100 bg-gray-50">
          <Image
            src={displayImage}
            alt={`${app.name} screenshot`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Hover Overlay */}
          <div
            className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="text-white text-sm font-medium flex items-center gap-1">
              View Details
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>

          {/* Pricing Badge */}
          <Badge
            variant={getPricingBadgeVariant(app.isPaid, app.price)}
            className="absolute top-2 right-2 text-xs"
          >
            {getPricingLabel(app.isPaid, app.price)}
          </Badge>
        </div>

        {/* Content */}
        <div className="mt-3 space-y-2">
          {/* Header with Icon and Name */}
          <div className="flex items-start gap-2">
            <div className="relative w-8 h-8 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100">
              <Image
                src={app.iconUrl}
                alt={`${app.name} icon`}
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm text-gray-900 truncate">
                  {app.name}
                </h3>
                <span className="text-muted-foreground">
                  {getPlatformIcon(app.platform)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                by {app.developer}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {app.description}
          </p>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full"
                >
                  #{tag.replace(/\s+/g, "")}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {app.rating && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {app.rating.toFixed(1)}
              </span>
            )}
            <span className="flex items-center gap-1">
              👥 {formatReviewCount(app.reviewsCount)}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
