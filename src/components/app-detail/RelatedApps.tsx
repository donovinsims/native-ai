"use client";

import Link from "next/link";
import Image from "next/image";
import { AppData } from "@/lib/data/app-schema";
import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface RelatedAppsProps {
  apps: AppData[];
  currentAppId: string;
}

export function RelatedApps({ apps, currentAppId }: RelatedAppsProps) {
  const relatedApps = apps.filter((app) => app.id !== currentAppId).slice(0, 6);

  if (relatedApps.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 pt-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-8">Related Apps</h2>
      
      {/* Grid: 3 cols desktop (>1200px), 2 tablet, 1 mobile - with wider max-width and generous gaps */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 xl:gap-10 w-full max-w-[1360px] mx-auto"
      >
        {relatedApps.map((app) => (
          <RelatedAppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}

function RelatedAppCard({ app }: { app: AppData }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLAnchorElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleMouseEnter = () => {
    if (videoRef.current && !hasError) {
      videoRef.current.play().catch(() => setHasError(true));
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Link
      ref={containerRef}
      href={`/apps/${app.slug}`}
      className="group block bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-0.5"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Tall thumbnail - 350px desktop, 300px tablet, 280px mobile */}
      <div className="relative overflow-hidden rounded-t-2xl select-none h-[280px] md:h-[300px] xl:h-[350px] bg-gray-100">
        <div
          role="overlay"
          className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-all ease-in-out z-20"
        />

        <div className="absolute inset-0 z-0 flex items-center justify-center mix-blend-difference">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        </div>

        {isInView && !hasError && app.media.video && (
          <video
            ref={videoRef}
            width={640}
            height={400}
            className="relative z-10 block h-full w-full object-cover"
            playsInline
            muted
            loop
            preload="auto"
            poster={app.media.heroImage}
            onError={() => setHasError(true)}
          >
            <source src={app.media.video.webm} type="video/webm" />
            <source src={app.media.video.mp4} type="video/mp4" />
          </video>
        )}

        {isInView && !hasError && !app.media.video && (
          <Image
            src={app.media.heroImage}
            alt={app.name}
            fill
            className="relative z-10 object-cover"
          />
        )}
      </div>

      {/* Content area with overlapping icon */}
      <div className="relative px-6 pb-6 pt-10">
        {/* Overlapping app icon */}
        <div className="absolute -top-8 left-6 w-16 h-16 rounded-[14px] overflow-hidden bg-white border-4 border-white shadow-md">
          <Image
            src={app.media.icon}
            alt={`${app.name} icon`}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>

        {/* App info */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-tight group-hover:text-gray-700 transition-colors">
          {app.name}
        </h3>
        <p className="text-[15px] text-gray-500 leading-relaxed line-clamp-2 mb-4">
          {app.tagline}
        </p>

        {/* Platform badges */}
        {app.platforms && app.platforms.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {app.platforms.map((platform) => (
              <span
                key={platform}
                className="text-[13px] bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg"
              >
                {platform}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}