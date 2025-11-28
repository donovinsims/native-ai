"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Home, Share2, Check } from "lucide-react";
import { AppData } from "@/lib/data/app-schema";
import { toast } from "sonner";

interface AppHeroProps {
  app: AppData;
}

export function AppHero({ app }: AppHeroProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="w-full">
      {/* Breadcrumb with Share Button */}
      <div className="flex items-center justify-between mb-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-gray-900 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href={`/category/${app.categorySlug}`}
            className="hover:text-gray-900 transition-colors"
          >
            {app.category}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">{app.name}</span>
        </nav>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Share app"
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-600" />
          ) : (
            <Share2 className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Hero Image */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
        {app.media.video ? (
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster={app.media.heroImage}
          >
            <source src={app.media.video.webm} type="video/webm" />
            <source src={app.media.video.mp4} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={app.media.heroImage}
            alt={`${app.name} screenshot`}
            fill
            className="object-cover"
            priority
          />
        )}
      </div>

      {/* App Title - Without Icon */}
      <div className="mt-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-1">
          {app.name}
        </h1>
        <p className="text-base md:text-lg text-gray-500">{app.tagline}</p>
      </div>
    </div>
  );
}