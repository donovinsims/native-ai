"use client";

import { Menu } from "lucide-react";

interface MobileNavTriggerProps {
  onClick: () => void;
  className?: string;
}

export function MobileNavTrigger({ onClick, className = "" }: MobileNavTriggerProps) {
  return (
    <button
      onClick={onClick}
      className={`md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
      aria-label="Open navigation menu"
      aria-expanded="false"
    >
      <Menu className="w-6 h-6 text-gray-900" />
    </button>
  );
}
