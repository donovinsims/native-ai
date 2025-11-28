import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getAppBySlug, sampleApps, getRelatedApps } from "@/lib/data/app-schema";
import { AppDetailClient } from "./AppDetailClient";

interface AppPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return sampleApps.map((app) => ({
    slug: app.slug,
  }));
}

export async function generateMetadata({ params }: AppPageProps): Promise<Metadata> {
  const { slug } = await params;
  const app = getAppBySlug(slug);

  if (!app) {
    return {
      title: "App Not Found",
    };
  }

  return {
    title: `${app.name} - ${app.tagline}`,
    description: app.description,
    openGraph: {
      title: app.name,
      description: app.tagline,
      images: [app.media.heroImage],
    },
  };
}

export default async function AppPage({ params }: AppPageProps) {
  const { slug } = await params;
  const app = getAppBySlug(slug);

  if (!app) {
    notFound();
  }

  const relatedApps = getRelatedApps(app);

  return <AppDetailClient app={app} relatedApps={relatedApps} />;
}
