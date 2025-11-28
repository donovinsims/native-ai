import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getAppBySlug, getRelatedApps } from "@/lib/db/queries";
import { AppDetailContent } from "./AppDetailContent";

interface AppPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: AppPageProps): Promise<Metadata> {
  const { slug } = await params;
  const app = await getAppBySlug(slug);

  if (!app) {
    return {
      title: "App Not Found - Native AI",
    };
  }

  return {
    title: `${app.name} - ${app.developer} | Native AI`,
    description: app.description,
    openGraph: {
      title: app.name,
      description: app.description,
      images: [app.iconUrl],
    },
  };
}

export default async function AppPage({ params }: AppPageProps) {
  const { slug } = await params;
  const app = await getAppBySlug(slug);

  if (!app) {
    notFound();
  }

  const relatedApps = await getRelatedApps(app.id, 4);

  return <AppDetailContent app={app} relatedApps={relatedApps} />;
}