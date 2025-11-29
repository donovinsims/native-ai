"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Share2, Bookmark, ChevronRight, Home } from "lucide-react";
import HeaderNavigation from "@/components/sections/header-navigation";
import SidebarNavigation from "@/components/sections/sidebar-navigation";
import { AppCard } from "@/components/apps/AppCard";
import { useModal } from "@/hooks/useModal";
import { SubscribeModal } from "@/components/modals/SubscribeModal";
import { SubmitAppModal } from "@/components/modals/SubmitAppModal";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import type { App } from "@/lib/db/queries";

interface AppDetailContentProps {
  app: App;
  relatedApps: App[];
}

function formatPlatform(platform: string): string {
  if (platform === "Cross-platform") {
    return "macOS, Windows, Web";
  }
  return platform;
}

function getPricingDisplay(isPaid: boolean, price: string | null, pricingModel?: string | null): string {
  if (!isPaid) return "Free";
  if (pricingModel) return pricingModel;
  if (price?.includes("/")) return `Freemium (${price})`;
  return price || "Paid";
}

export function AppDetailContent({ app, relatedApps }: AppDetailContentProps) {
  const subscribeModal = useModal();
  const submitModal = useModal();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const screenshots = (app.screenshotUrls as string[]) || [];
  const heroImage = screenshots.length > 0 ? screenshots[0] : app.iconUrl;

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleVisitWebsite = () => {
    const url = app.websiteUrl || app.appStoreUrl;
    if (!url) return;
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      window.parent.postMessage(
        { type: "OPEN_EXTERNAL_URL", data: { url } },
        "*"
      );
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleBookmark = () => {
    if (!session?.user) {
      toast.error("Please sign in to bookmark apps");
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    toast.success("Bookmarked!");
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
          <div className="px-4 sm:px-6 py-4 sm:py-6 max-w-3xl mx-auto">
            {/* Breadcrumbs */}
            <div className="flex items-center justify-between mb-4">
              <nav className="flex items-center gap-2 text-sm text-gray-400">
                <Link href="/" className="hover:text-gray-900 transition-colors flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  Home
                </Link>
                <ChevronRight className="h-4 w-4" />
                <Link
                  href={`/apps?category=${app.category}`}
                  className="hover:text-gray-900 transition-colors"
                >
                  {app.category}
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900">{app.name}</span>
              </nav>

              <button
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Hero Screenshot */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              <Image
                src={heroImage}
                alt={app.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>

            {/* Title + Tagline */}
            <div className="mt-6">
              <h1 className="text-2xl font-semibold text-gray-900">{app.name}</h1>
              <p className="text-base text-gray-400 mt-1">
                {app.description?.slice(0, 100)}
              </p>
            </div>

            {/* CTAs - Full Width Stacked - Matching screenshot exactly */}
            <div className="mt-6 space-y-3">
              {(app.websiteUrl || app.appStoreUrl) && (
                <button
                  onClick={handleVisitWebsite}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium hover:bg-gray-50 transition-colors"
                >
                  Visit Website
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={handleBookmark}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
              >
                <Bookmark className="w-4 h-4" />
                Bookmark
              </button>
            </div>

            {/* App Information */}
            <section className="mt-8">
              <div className="rounded-xl bg-gray-50 p-5">
                <h2 className="text-base font-semibold text-gray-900 mb-4">App Information</h2>

                <dl className="grid grid-cols-2 gap-y-4">
                  <div>
                    <dt className="text-sm text-gray-400 mb-0.5">Category</dt>
                    <dd className="text-sm font-medium text-gray-900">{app.category}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-400 mb-0.5">Platforms</dt>
                    <dd className="text-sm font-medium text-gray-900">{formatPlatform(app.platform)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-400 mb-0.5">Pricing</dt>
                    <dd className="text-sm font-medium text-gray-900">{getPricingDisplay(app.isPaid, app.price)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-400 mb-0.5">Developer</dt>
                    <dd className="text-sm font-medium text-gray-900">{app.developer}</dd>
                  </div>
                </dl>
              </div>
            </section>

            {/* Related Apps */}
            {relatedApps.length > 0 && (
              <section className="mt-10 pb-8">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Related Apps</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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