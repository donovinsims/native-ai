"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

export interface WebsiteCardProps {
  name: string;
  description: string;
  href: string;
  videoWebm: string;
  videoMp4: string;
  faviconUrl?: string;
}

export default function WebsiteCard({
  name,
  description,
  href,
  videoWebm,
  videoMp4,
  faviconUrl,
}: WebsiteCardProps) {
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
    <a
      ref={containerRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-3 transition-all rounded-xl cursor-pointer hover:bg-gray-50 ease-in-out"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden rounded-lg border border-gray-200 select-none aspect-video bg-gray-100 mb-3">
        <div
          role="overlay"
          className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-all ease-in-out z-20"
        />

        <div className="absolute inset-0 z-0 flex items-center justify-center mix-blend-difference">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        </div>

        {isInView && !hasError && (
          <video
            ref={videoRef}
            width={640}
            height={400}
            className="relative z-10 block h-full w-full object-cover"
            playsInline
            muted
            loop
            preload="auto"
            onError={() => setHasError(true)}
          >
            <source src={videoWebm} type="video/webm" />
            <source src={videoMp4} type="video/mp4" />
          </video>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-gray-700 transition-colors">{name}</h3>
        <p className="text-xs text-gray-500 truncate">{description}</p>
      </div>
    </a>
  );
}