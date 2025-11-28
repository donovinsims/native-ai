"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import React from "react";

interface CategoryButtonProps extends React.ComponentPropsWithoutRef<typeof Link> {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

const CategoryButton = React.forwardRef<
  HTMLAnchorElement,
  CategoryButtonProps
>(({ href, icon, label, isActive = false, className, ...props }, ref) => {
  return (
    <Link
      ref={ref}
      href={href}
      className={cn(
        "group relative z-0 flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-black transition-colors",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "z-10 flex-shrink-0 transition-colors group-hover:text-black",
          "h-[20px] w-[20px] sm:h-[14px] sm:w-[14px]",
          // The scraped HTML sizes both the container and inner SVG explicitly. We replicate that here for accuracy.
          "[&>svg]:h-[20px] [&>svg]:w-[20px] sm:[&>svg]:h-[14px] sm:[&>svg]:w-[14px]",
          isActive ? "text-black" : "text-gray-300",
        )}
      >
        {icon}
      </div>
      <span className="z-10 select-none text-base text-black sm:text-sm">
        {label}
      </span>
      {isActive && (
        <div className="absolute inset-0 z-0 rounded-lg bg-gray-100" />
      )}
    </Link>
  );
});

CategoryButton.displayName = "CategoryButton";

export default CategoryButton;