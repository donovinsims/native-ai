"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNavOverlay, MobileNavTrigger } from "@/components/mobile-nav";
import { useMobileNav } from "@/hooks/useMobileNav";
import { useSession } from "@/lib/auth-client";
import { UserMenu } from "@/components/auth/UserMenu";
import { SearchFilterModal, type FilterState } from "@/components/shared/SearchFilterModal";
import { useFilterState } from "@/hooks/useFilterState";

const MagicIcon = (props: React.SVGProps<SVGSVGElement>) =>
<svg
  role="img"
  viewBox="0 0 10.67 10.67"
  fill="currentColor"
  xmlns="http://www.w3.org/2000/svg"
  {...props}>

    <title>Magic Icon</title>
    <path d="M5.33333 0L6.41334 4.28L10.6667 5.33333L6.41334 6.38667L5.33333 10.6667L4.25333 6.38667L0 5.33333L4.25333 4.28L5.33333 0Z" />
  </svg>;


const SearchIcon = (props: React.SVGProps<SVGSVGElement>) =>
<svg
  width="16"
  height="17"
  viewBox="0 0 16 17"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  {...props}>

    <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M11.6364 10.9669C12.4432 9.94052 12.875 8.66579 12.875 7.3125C12.875 4.09313 10.2819 1.5 7.0625 1.5C3.84313 1.5 1.25 4.09313 1.25 7.3125C1.25 10.5319 3.84313 13.125 7.0625 13.125C8.42851 13.125 9.6953 12.671 10.7118 11.8415L14.2929 15.4226C14.6834 15.8131 15.3166 15.8131 15.7071 15.4226C16.0976 15.0321 16.0976 14.3989 15.7071 14.0084L11.6364 10.9669ZM2.75 7.3125C2.75 4.92296 4.67296 3 7.0625 3C9.45204 3 11.375 4.92296 11.375 7.3125C11.375 9.70204 9.45204 11.625 7.0625 11.625C4.67296 11.625 2.75 9.70204 2.75 7.3125Z"
    fill="#A3A3A3" />

  </svg>;


interface HeaderNavigationProps {
  onSubscribeClick?: () => void;
  onSubmitClick?: () => void;
}

const HeaderNavigation = ({ onSubscribeClick, onSubmitClick }: HeaderNavigationProps) => {
  const mobileNav = useMobileNav();
  const { data: session, isPending } = useSession();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const { updateFilters, currentFilters } = useFilterState();

  // Determine content type based on current route
  const getContentType = (): "apps" | "workflows" | "shortcuts" | "mcps" | "creators" => {
    if (pathname.startsWith("/apps")) return "apps";
    if (pathname.startsWith("/workflows")) return "workflows";
    if (pathname.startsWith("/shortcuts")) return "shortcuts";
    if (pathname.startsWith("/mcps")) return "mcps";
    if (pathname.startsWith("/creators")) return "creators";
    return "apps"; // default
  };

  const handleApplyFilters = (filters: FilterState) => {
    updateFilters(filters as Record<string, string | undefined>);
  };

  // Handle keyboard shortcut ⌘K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <nav className="fixed top-0 z-20 h-full w-full max-h-[67px]">
        <div className="absolute top-0 left-0 flex h-[67px] w-full items-center justify-between border-b border-gray-100 bg-white/[.90] px-4 md:px-6 backdrop-blur-lg">
          <a
            className="flex w-max cursor-pointer gap-[6px] rounded-full border border-gray-200 bg-white px-[10px] py-2 text-xl md:text-2xl leading-6 transition-all duration-200 ease-in-out hover:-rotate-3 hover:border-gray-300 hover:bg-gray-50"
            href="/">

            <span className="font-black uppercase">see</span>
            <MagicIcon className="w-[10.67px]" />
            <span className="font-black uppercase">saw</span>
          </a>
          <div className="hidden w-full lg:block">
            <div className="relative mr-auto w-full group lg:absolute lg:top-1/2 lg:left-1/2 lg:ml-6 lg:max-w-[480px] lg:-translate-x-1/2 lg:-translate-y-1/2 z-50">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex w-full flex-row items-center rounded-full bg-gray-100 px-3 py-[6px] hover:bg-gray-200 transition-colors">

                <SearchIcon />
                <p className="ml-3 w-full-break-normal whitespace-nowrap text-left text-sm text-gray-400">
                  {currentFilters.search 
                    ? `Searching "${currentFilters.search}"`
                    : "Search for apps, workflows, shortcuts..."}
                </p>
                <p className="ml-auto rounded-sm px-[5px] py-[2px] text-[10px] text-gray-400">
                  ⌘{` `}K
                </p>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isPending && !session?.user &&
            <Link
              href="/login"
              className="hidden md:flex items-center justify-center select-none rounded-lg border border-[#d1d1d1] bg-[#fafafa] px-3 py-[6px] text-black transition-all duration-200 hover:scale-101 hover:bg-gray-50 active:scale-99 w-[97px] text-sm">

                Sign In
              </Link>
            }
            
            {!isPending && session?.user &&
            <UserMenu />
            }
            
            <button
              onClick={onSubscribeClick}
              className="hidden md:block select-none rounded-lg border border-black bg-gray-1000 px-3 py-[6px] text-white transition-all duration-200 hover:scale-101 hover:bg-almostBlack active:scale-99 w-[97px] text-sm">

              Subscribe
            </button>
            
            <MobileNavTrigger onClick={mobileNav.open} />
          </div>
        </div>
      </nav>

      <MobileNavOverlay
        isOpen={mobileNav.isOpen}
        onClose={mobileNav.close}
        onSubscribeClick={onSubscribeClick}
        onSubmitClick={onSubmitClick} />

      {/* Search/Filter Modal */}
      <SearchFilterModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        contentType={getContentType()}
        currentFilters={currentFilters}
        onApplyFilters={handleApplyFilters}
      />
    </>);

};

export default HeaderNavigation;