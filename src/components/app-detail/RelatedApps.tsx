"use client";

import Link from "next/link";
import Image from "next/image";
import { AppData, getPlatformLabel } from "@/lib/data/app-schema";

interface RelatedAppsProps {
  apps: AppData[];
  currentAppId: string;
}

export function RelatedApps({ apps, currentAppId }: RelatedAppsProps) {
  const relatedApps = apps.filter((app) => app.id !== currentAppId).slice(0, 4);

  if (relatedApps.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Apps</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {relatedApps.map((app) => (
          <Link
            key={app.id}
            href={`/apps/${app.slug}`}
            className="group rounded-xl hover:bg-gray-50 transition-all duration-200"
          >
            {/* Video/Image Preview - Larger */}
            <div className="relative aspect-video rounded-t-xl overflow-hidden bg-gray-100 border border-gray-200 mb-3" style={{ minHeight: "180px" }}>
              {app.media.video ? (
                <video
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  poster={app.media.heroImage}
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                >
                  <source src={app.media.video.webm} type="video/webm" />
                  <source src={app.media.video.mp4} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={app.media.heroImage}
                  alt={app.name}
                  fill
                  className="object-cover"
                />
              )}
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>

            {/* App Info - Larger */}
            <div className="flex items-start gap-3 px-3 pb-4">
              <div className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0" style={{ width: "48px", height: "48px" }}>
                <Image
                  src={app.media.icon}
                  alt={`${app.name} icon`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-gray-700 transition-colors mb-1">
                  {app.name}
                </h3>
                <p className="text-sm text-[#6b7280] line-clamp-2 mb-2">{app.tagline}</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {app.platforms.slice(0, 3).map((platform) => (
                    <span
                      key={platform}
                      className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                    >
                      {getPlatformLabel(platform)}
                    </span>
                  ))}
                  {app.platforms.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{app.platforms.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}