export interface AppData {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  category: string;
  categorySlug: string;
  platforms: Platform[];
  pricing: PricingInfo;
  distribution: DistributionMethod;
  developer: DeveloperInfo;
  metadata: AppMetadata;
  media: AppMedia;
  externalUrl: string;
}

export type Platform = "ios" | "macos" | "windows" | "linux" | "web" | "android";

export interface PricingInfo {
  type: "free" | "freemium" | "paid" | "subscription";
  price?: string;
  currency?: string;
  billingCycle?: "monthly" | "yearly" | "one-time";
}

export interface DeveloperInfo {
  name: string;
  website?: string;
}

export interface AppMetadata {
  lastUpdated: string;
  version?: string;
  fileSize?: string;
  systemRequirements?: string;
}

export type DistributionMethod = "app-store" | "play-store" | "github" | "direct-download" | "website" | "mac-app-store";

export interface AppMedia {
  icon: string;
  heroImage: string;
  screenshots?: string[];
  video?: {
    webm: string;
    mp4: string;
  };
}

// Sample app data for demo
export const sampleApps: AppData[] = [
  {
    id: "tame",
    slug: "tame",
    name: "Tame OS",
    tagline: "A space to grow ideas.",
    description: "Tame OS is a revolutionary operating system designed for creative professionals. It provides a distraction-free environment where your ideas can flourish and grow organically.",
    features: [
      "Minimalist, distraction-free interface",
      "Built-in note-taking and idea management",
      "Seamless cloud synchronization",
      "Cross-platform availability",
      "Dark mode support"
    ],
    category: "Productivity",
    categorySlug: "productivity",
    platforms: ["macos", "windows", "web"],
    pricing: {
      type: "freemium",
      price: "$9.99",
      currency: "USD",
      billingCycle: "monthly"
    },
    distribution: "website",
    developer: {
      name: "Tame Labs",
      website: "https://tame.io"
    },
    metadata: {
      lastUpdated: "2024-11-15",
      version: "2.1.0",
      fileSize: "85 MB"
    },
    media: {
      icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1afdc242-c723-4eb2-85bd-3bd7b1f2b1be-seesaw-website/assets/images/images_1.png",
      heroImage: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1afdc242-c723-4eb2-85bd-3bd7b1f2b1be-seesaw-website/assets/images/images_1.png",
      video: {
        webm: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/tame_sml_ewunci.webm",
        mp4: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/tame_sml_ewunci.mp4"
      }
    },
    externalUrl: "https://tame.io"
  },
  {
    id: "antigravity",
    slug: "antigravity",
    name: "Google Antigravity",
    tagline: "Next-generation IDE.",
    description: "Experience the future of development with Google Antigravity, a next-generation IDE that defies conventional coding paradigms. Built for speed, intelligence, and seamless collaboration.",
    features: [
      "AI-powered code completion",
      "Real-time collaboration",
      "Built-in version control",
      "Extensible plugin system",
      "Cross-language support"
    ],
    category: "Development",
    categorySlug: "development",
    platforms: ["macos", "windows", "linux", "web"],
    pricing: {
      type: "free"
    },
    distribution: "website",
    developer: {
      name: "Google",
      website: "https://google.com"
    },
    metadata: {
      lastUpdated: "2024-11-10",
      version: "1.5.2",
      fileSize: "250 MB"
    },
    media: {
      icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1afdc242-c723-4eb2-85bd-3bd7b1f2b1be-seesaw-website/assets/images/images_2.png",
      heroImage: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1afdc242-c723-4eb2-85bd-3bd7b1f2b1be-seesaw-website/assets/images/images_2.png",
      video: {
        webm: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/antigravity_sml_y5qhb4.webm",
        mp4: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/antigravity_sml_y5qhb4.mp4"
      }
    },
    externalUrl: "https://google.com/antigravity"
  },
  {
    id: "hill",
    slug: "hill",
    name: "Hill",
    tagline: "Buy & sell shares in pre-IPO companies.",
    description: "Hill is the premier platform for trading shares in private, pre-IPO companies. Access exclusive investment opportunities that were previously only available to institutional investors.",
    features: [
      "Access to pre-IPO companies",
      "Real-time market data",
      "Secure transactions",
      "Portfolio management tools",
      "Expert research and analysis"
    ],
    category: "Fintech",
    categorySlug: "fintech",
    platforms: ["ios", "android", "web"],
    pricing: {
      type: "free"
    },
    distribution: "app-store",
    developer: {
      name: "Hill Financial",
      website: "https://hill.io"
    },
    metadata: {
      lastUpdated: "2024-11-20",
      version: "3.2.1",
      fileSize: "45 MB"
    },
    media: {
      icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1afdc242-c723-4eb2-85bd-3bd7b1f2b1be-seesaw-website/assets/images/images_3.png",
      heroImage: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1afdc242-c723-4eb2-85bd-3bd7b1f2b1be-seesaw-website/assets/images/images_3.png",
      video: {
        webm: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/hill_sml_jgchbq.webm",
        mp4: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/hill_sml_jgchbq.mp4"
      }
    },
    externalUrl: "https://hill.io"
  },
  {
    id: "aave-app",
    slug: "aave-app",
    name: "Aave App",
    tagline: "Earn interest every second with industry-leading rates.",
    description: "Aave is a decentralized lending protocol that allows you to earn interest on your crypto assets or borrow against them. With industry-leading rates and balance protection up to $1M.",
    features: [
      "Earn interest on crypto deposits",
      "Borrow against your assets",
      "Balance protection up to $1M",
      "Multiple supported blockchains",
      "Non-custodial security"
    ],
    category: "Crypto",
    categorySlug: "crypto",
    platforms: ["web", "ios", "android"],
    pricing: {
      type: "free"
    },
    distribution: "website",
    developer: {
      name: "Aave Labs",
      website: "https://aave.com"
    },
    metadata: {
      lastUpdated: "2024-11-18",
      version: "2.0.0"
    },
    media: {
      icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1afdc242-c723-4eb2-85bd-3bd7b1f2b1be-seesaw-website/assets/images/images_4.png",
      heroImage: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1afdc242-c723-4eb2-85bd-3bd7b1f2b1be-seesaw-website/assets/images/images_4.png",
      video: {
        webm: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/aaveapp_sml_y4x5vd.webm",
        mp4: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/aaveapp_sml_y4x5vd.mp4"
      }
    },
    externalUrl: "https://aave.com"
  },
  {
    id: "collins",
    slug: "collins",
    name: "COLLINS",
    tagline: "Rewrite your worth.",
    description: "COLLINS is a transformational brand strategy and design agency. Their work helps organizations redefine their purpose and reimagine their impact on the world.",
    features: [
      "Brand strategy consulting",
      "Visual identity design",
      "Digital experience design",
      "Marketing campaigns",
      "Culture transformation"
    ],
    category: "Agency",
    categorySlug: "agency",
    platforms: ["web"],
    pricing: {
      type: "paid"
    },
    distribution: "website",
    developer: {
      name: "COLLINS",
      website: "https://wearecollins.com"
    },
    metadata: {
      lastUpdated: "2024-10-25"
    },
    media: {
      icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1afdc242-c723-4eb2-85bd-3bd7b1f2b1be-seesaw-website/assets/images/images_5.png",
      heroImage: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1afdc242-c723-4eb2-85bd-3bd7b1f2b1be-seesaw-website/assets/images/images_5.png",
      video: {
        webm: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/collins_sml_idacug.webm",
        mp4: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/collins_sml_idacug.mp4"
      }
    },
    externalUrl: "https://wearecollins.com"
  },
  {
    id: "bonside",
    slug: "bonside",
    name: "Bonside",
    tagline: "Defining the brick and mortar economy.",
    description: "Bonside provides innovative financing solutions for brick and mortar businesses. They help local businesses grow and thrive with flexible funding options tailored to physical retail.",
    features: [
      "Flexible business financing",
      "Quick approval process",
      "No collateral required",
      "Revenue-based repayment",
      "Dedicated support team"
    ],
    category: "Fintech",
    categorySlug: "fintech",
    platforms: ["web"],
    pricing: {
      type: "free"
    },
    distribution: "website",
    developer: {
      name: "Bonside Inc.",
      website: "https://bonside.com"
    },
    metadata: {
      lastUpdated: "2024-11-12"
    },
    media: {
      icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1afdc242-c723-4eb2-85bd-3bd7b1f2b1be-seesaw-website/assets/images/images_6.png",
      heroImage: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/1afdc242-c723-4eb2-85bd-3bd7b1f2b1be-seesaw-website/assets/images/images_6.png",
      video: {
        webm: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/bonside_sml_fu2dho.webm",
        mp4: "https://res.cloudinary.com/seesawsite/video/upload/w_640,du_5/q_50/bonside_sml_fu2dho.mp4"
      }
    },
    externalUrl: "https://bonside.com"
  }
];

// Helper functions
export function getAppBySlug(slug: string): AppData | undefined {
  return sampleApps.find((app) => app.slug === slug);
}

export function getRelatedApps(app: AppData, limit = 4): AppData[] {
  return sampleApps
    .filter((a) => a.id !== app.id && (a.categorySlug === app.categorySlug || a.platforms.some((p) => app.platforms.includes(p))))
    .slice(0, limit);
}

export function getPlatformLabel(platform: Platform): string {
  const labels: Record<Platform, string> = {
    ios: "iOS",
    macos: "macOS",
    windows: "Windows",
    linux: "Linux",
    web: "Web",
    android: "Android"
  };
  return labels[platform];
}

export function getDistributionLabel(distribution: DistributionMethod): string {
  const labels: Record<DistributionMethod, string> = {
    "app-store": "App Store",
    "play-store": "Play Store",
    "github": "GitHub",
    "direct-download": "Direct Download",
    "website": "Website",
    "mac-app-store": "Mac App Store"
  };
  return labels[distribution];
}

export function getPricingLabel(pricing: PricingInfo): string {
  if (pricing.type === "free") return "Free";
  if (pricing.type === "freemium") return `Freemium (${pricing.price}/${pricing.billingCycle})`;
  if (pricing.type === "subscription") return `${pricing.price}/${pricing.billingCycle}`;
  return pricing.price || "Paid";
}
