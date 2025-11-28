"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Star,
  Share2,
  Bookmark,
  Smartphone,
  Monitor,
  Layers,
  Calendar,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import HeaderNavigation from "@/components/sections/header-navigation";
import SidebarNavigation from "@/components/sections/sidebar-navigation";
import { AppCard } from "@/components/apps/AppCard";
import { useModal } from "@/hooks/useModal";
import { SubscribeModal } from "@/components/modals/SubscribeModal";
import { SubmitAppModal } from "@/components/modals/SubmitAppModal";
import { toast } from "sonner";
import type { App } from "@/lib/db/queries";

interface AppDetailContentProps {
  app: App;
  relatedApps: App[];
}

function getPlatformIcon(platform: string) {
  switch (platform) {
    case "iOS":
      return <Smartphone className="h-4 w-4" />;
    case "macOS":
      return <Monitor className="h-4 w-4" />;
    case "Cross-platform":
      return <Layers className="h-4 w-4" />;
    default:
      return null;
  }
}

function formatDate(date: Date | null): string {
  if (!date) return "Unknown";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function AppDetailContent({ app, relatedApps }: AppDetailContentProps) {
  const router = useRouter();
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const subscribeModal = useModal();
  const submitModal = useModal();

  const screenshots = (app.screenshotUrls as string[]) || [];
  const features = (app.features as string[]) || [];
  const tags = (app.tags as string[]) || [];

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleVisitAppStore = () => {
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      window.parent.postMessage(
        { type: "OPEN_EXTERNAL_URL", data: { url: app.appStoreUrl } },
        "*"
      );
    } else {
      window.open(app.appStoreUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleVisitWebsite = () => {
    if (!app.websiteUrl) return;
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      window.parent.postMessage(
        { type: "OPEN_EXTERNAL_URL", data: { url: app.websiteUrl } },
        "*"
      );
    } else {
      window.open(app.websiteUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="relative min-h-screen bg-white">
      <HeaderNavigation
        onSubscribeClick={subscribeModal.open}
        onSubmitClick={submitModal.open}
      />

      <div className="flex pt-[67px]">
        <SidebarNavigation onSubmitClick={submitModal.open} />

        <main className="flex-1 sm:ml-[250px]">
          <div className="container mx-auto px-3 sm:px-5 py-4 sm:py-8 max-w-5xl">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/apps"
                className="hover:text-foreground transition-colors"
              >
                Apps
              </Link>
              <span>/</span>
              <span className="text-foreground">{app.name}</span>
            </nav>

            {/* Back Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {/* Hero Section */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              {/* App Icon */}
              <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <Image
                  src={app.iconUrl}
                  alt={`${app.name} icon`}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>

              {/* App Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-semibold tracking-tight mb-1">
                      {app.name}
                    </h1>
                    <p className="text-muted-foreground mb-2">
                      by {app.developer}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      {app.rating && (
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {app.rating.toFixed(1)}
                          <span className="text-muted-foreground">
                            ({app.reviewsCount?.toLocaleString()} reviews)
                          </span>
                        </span>
                      )}
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {getPlatformIcon(app.platform)}
                        {app.platform}
                      </Badge>
                      <Badge
                        variant={app.isPaid ? "default" : "secondary"}
                      >
                        {app.isPaid ? app.price : "Free"}
                      </Badge>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-3 mt-4">
                  <Button onClick={handleVisitAppStore}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit App Store
                  </Button>
                  {app.websiteUrl && (
                    <Button variant="outline" onClick={handleVisitWebsite}>
                      Visit Website
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Screenshots */}
            {screenshots.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Screenshots</h2>
                <div className="relative">
                  {/* Main Screenshot */}
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 mb-3">
                    <Image
                      src={screenshots[activeScreenshot]}
                      alt={`${app.name} screenshot ${activeScreenshot + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                  </div>
                  {/* Thumbnail Strip */}
                  {screenshots.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {screenshots.map((screenshot, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveScreenshot(index)}
                          className={`relative w-24 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                            activeScreenshot === index
                              ? "border-primary"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Image
                            src={screenshot}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* About */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <Card className="p-4">
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {app.description}
                </p>
              </Card>
            </section>

            {/* Features */}
            {features.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Features</h2>
                <Card className="p-4">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-muted-foreground"
                      >
                        <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              </section>
            )}

            {/* Details */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <Card className="p-4">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-muted-foreground flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Category
                    </dt>
                    <dd className="font-medium">{app.category}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground flex items-center gap-2">
                      {getPlatformIcon(app.platform)}
                      Platform
                    </dt>
                    <dd className="font-medium">{app.platform}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Added
                    </dt>
                    <dd className="font-medium">{formatDate(app.createdAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Last Updated
                    </dt>
                    <dd className="font-medium">{formatDate(app.updatedAt)}</dd>
                  </div>
                </dl>
              </Card>
            </section>

            {/* Tags */}
            {tags.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {/* Related Apps */}
            {relatedApps.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Related Apps</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {relatedApps.map((relatedApp) => (
                    <AppCard key={relatedApp.id} app={relatedApp} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <SubscribeModal
        isOpen={subscribeModal.isOpen}
        onClose={subscribeModal.close}
      />
      <SubmitAppModal
        isOpen={submitModal.isOpen}
        onClose={submitModal.close}
      />
    </div>
  );
}
