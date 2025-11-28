"use client";

import { useModal } from "@/hooks/useModal";
import HeaderNavigation from "@/components/sections/header-navigation";
import SidebarNavigation from "@/components/sections/sidebar-navigation";
import HeroHeader from "@/components/sections/hero-header";
import InfiniteScrollLoader from "@/components/sections/infinite-scroll-loader";
import { SubscribeModal } from "@/components/modals/SubscribeModal";
import { SubmitAppModal } from "@/components/modals/SubmitAppModal";

const websitesData = [
  {
    id: "tame",
    title: "Tame OS",
    description: "A space to grow ideas.",
    href: "/apps/tame",
    faviconUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1afdc242-c723-4eb2-85bd-3bd7b1f2b1be-seesaw-website/assets/images/images_1.png",
    video: {
      webm: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/tame_sml_ewunci.webm",
      mp4: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/tame_sml_ewunci.mp4"
    }
  },
  {
    id: "antigravity",
    title: "Google Antigravity",
    description: "Next-generation IDE.",
    href: "/apps/antigravity",
    faviconUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1afdc242-c723-4eb2-85bd-3bd7b1f2b1be-seesaw-website/assets/images/images_2.png",
    video: {
      webm: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/antigravity_sml_y5qhb4.webm",
      mp4: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/antigravity_sml_y5qhb4.mp4"
    }
  },
  {
    id: "hill",
    title: "Hill",
    description: "Buy & sell shares in pre-IPO companies.",
    href: "/apps/hill",
    faviconUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1afdc242-c723-4eb2-85bd-3bd7b1f2b1be-seesaw-website/assets/images/images_3.png",
    video: {
      webm: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/hill_sml_jgchbq.webm",
      mp4: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/hill_sml_jgchbq.mp4"
    }
  },
  {
    id: "aave-app",
    title: "Aave App",
    description: "Earn interest every second with industry-leading rates and balance protection up to $1M.",
    href: "/apps/aave-app",
    faviconUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1afdc242-c723-4eb2-85bd-3bd7b1f2b1be-seesaw-website/assets/images/images_4.png",
    video: {
      webm: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/aaveapp_sml_y4x5vd.webm",
      mp4: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/aaveapp_sml_y4x5vd.mp4"
    }
  },
  {
    id: "collins",
    title: "COLLINS",
    description: "Rewrite your worth.",
    href: "/apps/collins",
    faviconUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1afdc242-c723-4eb2-85bd-3bd7b1f2b1be-seesaw-website/assets/images/images_5.png",
    video: {
      webm: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/collins_sml_idacug.webm",
      mp4: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/collins_sml_idacug.mp4"
    }
  },
  {
    id: "bonside",
    title: "Bonside",
    description: "Defining the brick and mortar economy.",
    href: "/apps/bonside",
    faviconUrl: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1afdc242-c723-4eb2-85bd-3bd7b1f2b1be-seesaw-website/assets/images/images_6.png",
    video: {
      webm: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/bonside_sml_fu2dho.webm",
      mp4: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/bonside_sml_fu2dho.mp4"
    }
  }
];

export default function HomePage() {
  const subscribeModal = useModal();
  const submitModal = useModal();

  return (
    <div className="relative min-h-screen bg-white">
      <HeaderNavigation 
        onSubscribeClick={subscribeModal.open}
        onSubmitClick={submitModal.open}
      />
      
      <div className="flex pt-[67px]">
        <SidebarNavigation onSubmitClick={submitModal.open} />
        
        <main className="flex-1 sm:ml-[250px]">
          <div className="mx-auto px-3 sm:px-5 py-4 sm:py-8">
            <HeroHeader onSubscribeClick={subscribeModal.open} />
            
            <InfiniteScrollLoader initialItems={websitesData} />
          </div>
        </main>
      </div>

      {/* Modals */}
      <SubscribeModal isOpen={subscribeModal.isOpen} onClose={subscribeModal.close} />
      <SubmitAppModal isOpen={submitModal.isOpen} onClose={submitModal.close} />
    </div>
  );
}