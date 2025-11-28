"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Bookmark, Loader2 } from "lucide-react";
import { AppData } from "@/lib/data/app-schema";
import { useSession } from "@/lib/auth-client";
import { SignInModal } from "@/components/auth/SignInModal";
import { toast } from "sonner";

interface AppActionsProps {
  app: AppData;
}

export function AppActions({ app }: AppActionsProps) {
  const { data: session, isPending } = useSession();
  const [bookmarked, setBookmarked] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  // Check bookmark status on mount
  useEffect(() => {
    if (session?.user) {
      checkBookmarkStatus();
    }
  }, [session, app.id]);

  const checkBookmarkStatus = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/bookmarks/check/${app.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookmarked(data.isBookmarked);
      }
    } catch (error) {
      console.error("Failed to check bookmark status:", error);
    }
  };

  const handleVisitWebsite = () => {
    // Handle iframe context
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      window.parent.postMessage(
        { type: "OPEN_EXTERNAL_URL", data: { url: app.externalUrl } },
        "*"
      );
    } else {
      window.open(app.externalUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleBookmark = async () => {
    // Check if user is logged in
    if (!session?.user) {
      setShowSignInModal(true);
      return;
    }

    setIsBookmarkLoading(true);
    try {
      const token = localStorage.getItem("bearer_token");

      if (bookmarked) {
        // Remove bookmark
        const response = await fetch(`/api/bookmarks/${app.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setBookmarked(false);
          toast.success("Bookmark removed");
        } else {
          toast.error("Failed to remove bookmark");
        }
      } else {
        // Add bookmark
        const response = await fetch("/api/bookmarks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ appId: app.id }),
        });

        if (response.ok) {
          setBookmarked(true);
          toast.success("App bookmarked!");
        } else {
          const data = await response.json();
          if (data.code === "DUPLICATE_BOOKMARK") {
            setBookmarked(true);
          } else {
            toast.error("Failed to bookmark app");
          }
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const handleSignInSuccess = () => {
    // After successful sign in, add the bookmark
    handleBookmark();
  };

  return (
    <>
      <div className="flex flex-col gap-3 w-full">
        {/* Visit Website Button - White background with grey border */}
        <button
          onClick={handleVisitWebsite}
          className="w-full min-h-[52px] flex items-center justify-center gap-2 px-6 py-3 bg-[#fafafa] text-black rounded-xl font-medium border border-[#d1d1d1] hover:bg-gray-50 transition-colors"
        >
          <span>Visit Website</span>
          <ExternalLink className="w-4 h-4" />
        </button>

        {/* Bookmark Button - Orange background, full width */}
        <button
          onClick={handleBookmark}
          disabled={isBookmarkLoading || isPending}
          className="w-full min-h-[52px] flex items-center justify-center gap-2 px-6 py-3 bg-[#ff6719] text-white rounded-xl font-medium hover:bg-[#e55a15] transition-colors disabled:opacity-50"
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark app"}
        >
          {isBookmarkLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Bookmark
              className={`w-5 h-5 ${bookmarked ? "fill-current" : ""}`}
            />
          )}
          <span>{bookmarked ? "Bookmarked" : "Bookmark"}</span>
        </button>
      </div>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSuccess={handleSignInSuccess}
      />
    </>
  );
}