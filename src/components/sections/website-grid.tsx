"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface Website {
  slug: string;
  name: string;
  description: string;
  video_webm: string;
  video_mp4: string;
  icon_url: string;
}

const websitesData: Website[] = [
  {
    slug: "tame",
    name: "Tame OS",
    description: "A space to grow ideas.",
    video_webm: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/tame_sml_ewunci.webm",
    video_mp4: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/tame_sml_ewunci.mp4",
    icon_url: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1afdc242-c723-4eb2-85bd-3bd7b1f2b1be-seesaw-website/assets/images/images_1.png",
  },
  {
    slug: "antigravity",
    name: "Google Antigravity",
    description: "Next-generation IDE.",
    video_webm: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/antigravity_sml_y5qhb4.webm",
    video_mp4: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/antigravity_sml_y5qhb4.mp4",
    icon_url: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1afdc242-c723-4eb2-85bd-3bd7b1f2b1be-seesaw-website/assets/images/images_2.png",
  },
  {
    slug: "hill",
    name: "Hill",
    description: "Buy & sell shares in pre-IPO companies.",
    video_webm: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/hill_sml_jgchbq.webm",
    video_mp4: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/hill_sml_jgchbq.mp4",
    icon_url: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1afdc242-c723-4eb2-85bd-3bd7b1f2b1be-seesaw-website/assets/images/images_3.png",
  },
  {
    slug: "aave-app",
    name: "Aave App",
    description: "Earn interest every second with industry-leading rates and balance protection up to $1M.",
    video_webm: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/aaveapp_sml_y4x5vd.webm",
    video_mp4: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/aaveapp_sml_y4x5vd.mp4",
    icon_url: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1afdc242-c723-4eb2-85bd-3bd7b1f2b1be-seesaw-website/assets/images/images_4.png",
  },
  {
    slug: "collins",
    name: "COLLINS",
    description: "Rewrite your worth.",
    video_webm: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/collins_sml_idacug.webm",
    video_mp4: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/collins_sml_idacug.mp4",
    icon_url: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1afdc242-c723-4eb2-85bd-3bd7b1f2b1be-seesaw-website/assets/images/images_5.png",
  },
  {
    slug: "bonside",
    name: "Bonside",
    description: "Defining the brick and mortar economy.",
    video_webm: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/bonside_sml_fu2dho.webm",
    video_mp4: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/bonside_sml_fu2dho.mp4",
    icon_url: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1afdc242-c723-4eb2-85bd-3bd7b1f2b1be-seesaw-website/assets/images/images_6.png",
  },
];

const WebsiteCard = ({ website }: { website: Website }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (isHovered && !isLoading) {
        videoElement.play().catch(console.error);
      } else {
        videoElement.pause();
        videoElement.currentTime = 0;
      }
    }
  }, [isHovered, isLoading]);

  return (
    <a
      href={`/websites/${website.slug}`}
      className="group p-3 transition-all rounded-lg cursor-pointer hover:bg-gray-100 hover:scale-101 active:scale-99 ease-in-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-md border border-gray-100 select-none aspect-video bg-gray-50">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
          </div>
        )}
        <div
          role="overlay"
          className="absolute inset-0 z-10 bg-black opacity-0 group-hover:opacity-25 transition-opacity ease-in-out"
        />
        <video
          ref={videoRef}
          width="640"
          height="400"
          muted
          loop
          playsInline
          onCanPlay={() => setIsLoading(false)}
          className={`block w-full h-full object-cover transition-opacity duration-300 relative ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        >
          <source src={website.video_webm} type="video/webm" />
          <source src={website.video_mp4} type="video/mp4" />
        </video>
      </div>
      <div className="mt-2 flex items-center w-full">
        <div className="flex items-start h-full w-full gap-2">
          <Image
            src={website.icon_url}
            alt={`${website.name} favicon`}
            width={20}
            height={20}
            className="rounded-sm select-none"
          />
          <div className="w-full">
            <p className="text-sm text-gray-1000 leading-5">{website.name}</p>
            <p className="text-sm text-gray-400 leading-5">{website.description}</p>
          </div>
        </div>
      </div>
    </a>
  );
};

export default function WebsiteGrid() {
  return (
    <div className="w-full grid gap-x-4 gap-y-6 md:grid-cols-2 lg:grid-cols-3 mt-12 animate-fade-up">
      {websitesData.map((website) => (
        <WebsiteCard key={website.slug} website={website} />
      ))}
    </div>
  );
}