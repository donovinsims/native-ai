"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Search, ArrowUpRight, Mail, User, Bookmark, LogOut, Loader2 } from "lucide-react";
import { CategoryList } from "./CategoryList";
import { useSession, authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface MobileNavOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribeClick?: () => void;
  onSubmitClick?: () => void;
}

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

export function MobileNavOverlay({
  isOpen,
  onClose,
  onSubscribeClick,
  onSubmitClick,
}: MobileNavOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();

  // Focus trap and initial focus
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const handleSubmitClick = () => {
    onSubmitClick?.();
    onClose();
  };

  const handleSubscribeClick = () => {
    onSubscribeClick?.();
    onClose();
  };

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
      toast.success("Signed out successfully");
    }
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Full-screen panel (centered content) */}
      <div
        className={`absolute inset-0 h-full w-full bg-white transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex flex-col h-full max-w-[640px] mx-auto">
          {/* Header with logo and close button */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 min-h-[67px]">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-[6px] rounded-full border border-gray-200 bg-white px-[10px] py-2 text-xl leading-5 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
            >
              <span className="font-black uppercase">see</span>
              <MagicIcon className="w-[10px]" />
              <span className="font-black uppercase">saw</span>
            </Link>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="inline-flex items-center justify-center w-11 h-11 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close navigation menu"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {/* Search bar */}
            <div className="mb-4">
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-full">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search for apps, categories..."
                  className="flex-1 bg-transparent text-base text-gray-900 placeholder:text-gray-400 outline-none"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 mb-4">
              {!isPending && !session?.user && (
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex items-center justify-center w-full min-h-[44px] px-4 py-3 rounded-lg border border-gray-300 text-base font-medium text-gray-900 bg-white hover:bg-gray-50 transition-colors"
                >
                  Sign in
                </Link>
              )}
            </div>

            {/* Auth Section */}
            <div className="mb-4 pb-4 border-b border-gray-100 space-y-3">
              <button
                onClick={handleSubscribeClick}
                className="w-full min-h-[44px] px-4 py-3 rounded-lg text-base font-medium text-white bg-[#ff6719] hover:bg-[#e55a15] transition-colors"
              >
                Subscribe
              </button>

              {isPending ? (
                <div className="flex items-center justify-center py-3">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                </div>
              ) : session?.user ? (
                <div className="space-y-2">
                  <Link
                    href="/bookmarks"
                    onClick={onClose}
                    className="flex items-center gap-3 min-h-[44px] px-4 py-3 rounded-lg text-base font-medium text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <Bookmark className="w-5 h-5" />
                    <span>My Bookmarks</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 min-h-[44px] px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-100 transition-colors w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign out</span>
                  </button>
                  <p className="text-sm text-gray-500 px-4 truncate">
                    {session.user.email}
                  </p>
                </div>
              ) : null}
            </div>

            {/* Category list */}
            <CategoryList onClose={onClose} />
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-100">
            {/* Sponsor us link */}
            <a
              href="https://tally.so/r/wLP5VG"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between min-h-[44px] px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors mb-2"
            >
              <span className="text-base text-gray-900">Sponsor us</span>
              <ArrowUpRight className="w-5 h-5 text-gray-400" />
            </a>

            {/* Submit button moved below Sponsor us - match desktop sidebar style */}
            <button
              onClick={handleSubmitClick}
              className="w-full min-h-[40px] flex items-center justify-center px-6 py-2 bg-[#fafafa] text-black rounded-xl font-medium border border-[#d1d1d1] hover:bg-gray-50 transition-colors text-sm mb-2"
            >
              Submit
            </button>

            {/* Contact email */}
            <a
              href="mailto:hi@seesaw.website"
              className="flex items-center justify-between min-h-[44px] px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors mb-4"
            >
              <span className="text-base text-gray-900">hi@seesaw.website</span>
              <Mail className="w-5 h-5 text-gray-400" />
            </a>

            {/* Copyright */}
            <p className="text-sm text-gray-400 text-center">
              © {new Date().getFullYear()} SEESAW Studios
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}