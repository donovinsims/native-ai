"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, Loader2, Trash2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { sampleApps, AppData } from "@/lib/data/app-schema";
import HeaderNavigation from "@/components/sections/header-navigation";
import { useModals } from "@/hooks/useModal";
import { SubscribeModal, SubmitAppModal } from "@/components/modals";
import { toast } from "sonner";

interface BookmarkItem {
  id: number;
  userId: string;
  appId: string;
  createdAt: string;
}

export function BookmarksPageClient() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { subscribeModal, submitAppModal } = useModals();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/bookmarks");
    }
  }, [session, isPending, router]);

  // Fetch bookmarks
  useEffect(() => {
    if (session?.user) {
      fetchBookmarks();
    }
  }, [session]);

  const fetchBookmarks = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/bookmarks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookmarks(data);
      }
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBookmark = async (appId: string) => {
    setRemovingId(appId);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/bookmarks/${appId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setBookmarks((prev) => prev.filter((b) => b.appId !== appId));
        toast.success("Bookmark removed");
      } else {
        toast.error("Failed to remove bookmark");
      }
    } catch (error) {
      toast.error("Failed to remove bookmark");
    } finally {
      setRemovingId(null);
    }
  };

  // Get app data for bookmarked apps
  const getAppData = (appId: string): AppData | undefined => {
    return sampleApps.find((app) => app.id === appId || app.slug === appId);
  };

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-white">
      <HeaderNavigation
        onSubscribeClick={subscribeModal.open}
        onSubmitClick={submitAppModal.open}
      />

      <main className="pt-[67px]">
        <div className="container mx-auto px-4 md:px-8 py-8 max-w-5xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <Bookmark className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">My Bookmarks</h1>
              <p className="text-gray-500">
                {bookmarks.length} saved app{bookmarks.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Bookmarks Grid */}
          {bookmarks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Bookmark className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                No bookmarks yet
              </h2>
              <p className="text-gray-500 mb-6">
                Browse our directory and bookmark your favorite apps
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
              >
                Explore Apps
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarks.map((bookmark) => {
                const app = getAppData(bookmark.appId);
                if (!app) return null;

                return (
                  <div
                    key={bookmark.id}
                    className="group relative bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                  >
                    <Link href={`/apps/${app.slug}`} className="block">
                      {/* App Preview */}
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-white border border-gray-200 mb-3">
                        {app.media.video ? (
                          <video
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                            poster={app.media.heroImage}
                            onMouseEnter={(e) => e.currentTarget.play()}
                            onMouseLeave={(e) => {
                              e.currentTarget.pause();
                              e.currentTarget.currentTime = 0;
                            }}
                          >
                            <source src={app.media.video.webm} type="video/webm" />
                            <source src={app.media.video.mp4} type="video/mp4" />
                          </video>
                        ) : (
                          <Image
                            src={app.media.heroImage}
                            alt={app.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>

                      {/* App Info */}
                      <div className="flex items-start gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                          <Image
                            src={app.media.icon}
                            alt={`${app.name} icon`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {app.name}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {app.tagline}
                          </p>
                        </div>
                      </div>
                    </Link>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveBookmark(bookmark.appId)}
                      disabled={removingId === bookmark.appId}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all border border-gray-200"
                      aria-label="Remove bookmark"
                    >
                      {removingId === bookmark.appId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <SubscribeModal isOpen={subscribeModal.isOpen} onClose={subscribeModal.close} />
      <SubmitAppModal isOpen={submitAppModal.isOpen} onClose={submitAppModal.close} />
    </div>
  );
}
