"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession, authClient } from "@/lib/auth-client";
import { sampleApps, AppData, getPlatformLabel } from "@/lib/data/app-schema";
import { Loader2, Bookmark, LogOut, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";

const MagicIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    role="img"
    viewBox="0 0 10.67 10.67"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Magic Icon</title>
    <path d="M5.33333 0L6.41334 4.28L10.6667 5.33333L6.41334 6.38667L5.33333 10.6667L4.25333 6.38667L0 5.33333L4.25333 4.28L5.33333 0Z" />
  </svg>
);

interface BookmarkItem {
  id: number;
  userId: string;
  appId: string;
  createdAt: string;
}

export default function BookmarksPage() {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [isLoadingBookmarks, setIsLoadingBookmarks] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login?redirect=/bookmarks");
    }
  }, [session, isPending, router]);

  // Fetch bookmarks
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!session?.user) return;
      
      try {
        const token = localStorage.getItem("bearer_token");
        const response = await fetch("/api/bookmarks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBookmarks(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
      } finally {
        setIsLoadingBookmarks(false);
      }
    };

    if (session?.user) {
      fetchBookmarks();
    }
  }, [session]);

  const handleSignOut = async () => {
    const token = localStorage.getItem("bearer_token");
    const { error } = await authClient.signOut({
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    if (error?.code) {
      toast.error("Failed to sign out");
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      router.push("/");
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
    } catch {
      toast.error("Failed to remove bookmark");
    } finally {
      setRemovingId(null);
    }
  };

  // Get app data for bookmarked apps
  const getAppData = (appId: string): AppData | undefined => {
    return sampleApps.find((app) => app.id === appId || app.slug === appId);
  };

  if (isPending) {
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-20 h-[67px] flex items-center justify-between px-4 md:px-6 border-b border-gray-100 bg-white/90 backdrop-blur-lg">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-[6px] rounded-full border border-gray-200 bg-white px-[10px] py-2 text-xl leading-5 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
          >
            <span className="font-black uppercase">see</span>
            <MagicIcon className="w-[10px]" />
            <span className="font-black uppercase">saw</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-sm text-gray-600">
            {session.user.email}
          </div>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-[67px]">
        <div className="container mx-auto px-4 md:px-8 py-6 md:py-8 max-w-4xl">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to directory
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <Bookmark className="w-6 h-6 text-gray-900" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                My Bookmarks
              </h1>
              <p className="text-gray-500">
                {bookmarks.length} saved app{bookmarks.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {isLoadingBookmarks ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bookmark className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No bookmarks yet
              </h2>
              <p className="text-gray-500 mb-6">
                Start exploring and bookmark apps you love
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Browse apps
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bookmarks.map((bookmark) => {
                const app = getAppData(bookmark.appId);
                if (!app) return null;

                return (
                  <div
                    key={bookmark.id}
                    className="group relative p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <Link href={`/apps/${app.slug}`} className="block">
                      {/* Video/Image Preview */}
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200 mb-3">
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
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                          <Image
                            src={app.media.icon}
                            alt={`${app.name} icon`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {app.name}
                          </h3>
                          <p className="text-xs text-gray-500 truncate">{app.tagline}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {app.platforms.slice(0, 3).map((platform) => (
                              <span
                                key={platform}
                                className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded"
                              >
                                {getPlatformLabel(platform)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Remove button */}
                    <button
                      onClick={() => handleRemoveBookmark(bookmark.appId)}
                      disabled={removingId === bookmark.appId}
                      className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all disabled:opacity-50"
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
    </div>
  );
}