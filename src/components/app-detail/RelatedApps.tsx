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
      
      {/* Grid: 3 equal columns on desktop, 2 on tablet, 1 on mobile - matching home page */}
      <div 
        className="w-full grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
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
      className="group block p-3 transition-all rounded-xl cursor-pointer hover:bg-gray-50 ease-in-out"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thumbnail - aspect-video like home page cards */}
      <div className="relative overflow-hidden rounded-lg border border-gray-200 select-none aspect-video bg-gray-100 mb-3">
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

      {/* Content area - simple text like home page cards */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-gray-700 transition-colors">
          {app.name}
        </h3>
        <p className="text-xs text-gray-500 truncate">
          {app.tagline}
        </p>
      </div>
    </Link>
  );
}