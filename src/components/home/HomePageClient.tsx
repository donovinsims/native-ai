"use client";

import { useModals } from "@/hooks/useModal";
import HeaderNavigation from "@/components/sections/header-navigation";
import SidebarNavigation from "@/components/sections/sidebar-navigation";
import HeroHeader from "@/components/sections/hero-header";
import InfiniteScrollLoader from "@/components/sections/infinite-scroll-loader";
import { SubscribeModal, SubmitAppModal } from "@/components/modals";

interface Website {
  id: string;
  title: string;
  description: string;
  href: string;
  faviconUrl: string;
  video: {
    webm: string;
    mp4: string;
  };
}

interface HomePageClientProps {
  initialItems: Website[];
}

export function HomePageClient({ initialItems }: HomePageClientProps) {
  const { subscribeModal, submitAppModal } = useModals();

  return (
    <div className="relative min-h-screen bg-white">
      <HeaderNavigation
        onSubscribeClick={subscribeModal.open}
        onSubmitClick={submitAppModal.open}
      />

      <div className="flex pt-[67px]">
        <SidebarNavigation />

        <main className="flex-1 sm:ml-[250px]">
          <div className="container mx-auto px-3 sm:px-8 py-8 max-w-[1400px]">
            <HeroHeader onSubscribeClick={subscribeModal.open} />

            <InfiniteScrollLoader initialItems={initialItems} />
          </div>
        </main>
      </div>

      {/* Modals */}
      <SubscribeModal
        isOpen={subscribeModal.isOpen}
        onClose={subscribeModal.close}
      />
      <SubmitAppModal
        isOpen={submitAppModal.isOpen}
        onClose={submitAppModal.close}
      />
    </div>
  );
}
