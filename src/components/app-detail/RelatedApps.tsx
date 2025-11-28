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
    <div className="mt-[60px] pt-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-8">Related Apps</h2>
      
      {/* Mobile: Horizontal scrolling carousel */}
      <div className="md:hidden flex gap-5 overflow-x-auto pb-4 -mx-3 px-3 snap-x snap-mandatory scrollbar-hide">
        {relatedApps.map((app) => (
          <Link
            key={app.id}
            href={`/apps/${app.slug}`}
            className="group flex-shrink-0 w-[340px] bg-white border border-gray-200 rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-200 snap-start"
          >
            {/* Thumbnail - 240px height on mobile */}
            <div className="relative w-full h-[240px] rounded-t-xl overflow-hidden bg-gray-100">
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
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
              
              {/* Overlapping Icon */}
              <div 
                className="absolute -bottom-7 left-5 w-14 h-14 rounded-xl overflow-hidden bg-white shadow-lg z-10"
                style={{ border: "3px solid white" }}
              >
                <Image
                  src={app.media.icon}
                  alt={`${app.name} icon`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Card Content */}
            <div className="pt-10 px-5 pb-5 rounded-b-xl">
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2 line-clamp-1 group-hover:text-gray-700 transition-colors">
                {app.name}
              </h3>
              <p className="text-sm text-[#6b7280] leading-[1.5] line-clamp-2 mb-3">
                {app.tagline}
              </p>
              
              <div className="flex items-center gap-1.5 flex-wrap">
                {app.platforms.slice(0, 3).map((platform) => (
                  <span
                    key={platform}
                    className="text-xs text-gray-600 bg-[#f3f4f6] px-2.5 py-1 rounded-md"
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
          </Link>
        ))}
      </div>

      {/* Tablet & Desktop: Grid layout with wider cards */}
      <div 
        className="hidden md:grid w-full max-w-[1440px] mx-auto"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
          gap: "24px",
        }}
      >
        {relatedApps.map((app) => (
          <Link
            key={app.id}
            href={`/apps/${app.slug}`}
            className="group bg-white border border-gray-200 rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            style={{ maxWidth: "480px" }}
          >
            {/* Large Thumbnail - 280px tablet, 320px desktop */}
            <div className="relative w-full h-[280px] lg:h-[320px] rounded-t-xl overflow-hidden bg-gray-100">
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
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
              
              {/* Overlapping Icon - 56px with white border */}
              <div 
                className="absolute -bottom-7 left-5 w-14 h-14 rounded-xl overflow-hidden bg-white shadow-lg z-10"
                style={{ border: "3px solid white" }}
              >
                <Image
                  src={app.media.icon}
                  alt={`${app.name} icon`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Card Content with extra top padding for overlapping icon */}
            <div className="pt-10 px-5 pb-5 rounded-b-xl">
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2 line-clamp-1 group-hover:text-gray-700 transition-colors">
                {app.name}
              </h3>
              <p className="text-sm text-[#6b7280] leading-[1.5] line-clamp-2 mb-3">
                {app.tagline}
              </p>
              
              {/* Platform Badges */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {app.platforms.slice(0, 3).map((platform) => (
                  <span
                    key={platform}
                    className="text-xs text-gray-600 bg-[#f3f4f6] px-2.5 py-1 rounded-md"
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
          </Link>
        ))}
      </div>
    </div>
  );
}