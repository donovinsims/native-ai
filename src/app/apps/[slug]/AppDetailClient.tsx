"use client";

import { AppHero, AppInfo, AppActions, RelatedApps } from "@/components/app-detail";
import { AppData } from "@/lib/data/app-schema";
import HeaderNavigation from "@/components/sections/header-navigation";
import { SubscribeModal } from "@/components/modals/SubscribeModal";
import { SubmitAppModal } from "@/components/modals/SubmitAppModal";
import { useModal } from "@/hooks/useModal";

interface AppDetailClientProps {
  app: AppData;
  relatedApps: AppData[];
}

export function AppDetailClient({ app, relatedApps }: AppDetailClientProps) {
  const subscribeModal = useModal();
  const submitModal = useModal();

  return (
    <div className="relative min-h-screen bg-white">
      <HeaderNavigation 
        onSubscribeClick={subscribeModal.open}
        onSubmitClick={submitModal.open}
      />

      <main className="pt-[67px]">
        <div className="container mx-auto px-4 md:px-8 py-6 md:py-8 max-w-4xl">
          {/* Hero Section */}
          <AppHero app={app} />

          {/* Main Content */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Actions (Mobile: top, Desktop: sidebar) */}
            <div className="lg:col-span-1 lg:order-2">
              <div className="sticky top-[83px]">
                <AppActions app={app} />
              </div>
            </div>

            {/* Right Column - Info */}
            <div className="lg:col-span-2 lg:order-1">
              <AppInfo app={app} />
            </div>
          </div>

          {/* Related Apps */}
          <RelatedApps apps={relatedApps} currentAppId={app.id} />
        </div>
      </main>

      {/* Modals */}
      <SubscribeModal isOpen={subscribeModal.isOpen} onClose={subscribeModal.close} />
      <SubmitAppModal isOpen={submitModal.isOpen} onClose={submitModal.close} />
    </div>
  );
}
