"use client";

import Link from "next/link";
import {
  X,
  Sparkle,
  Building2,
  BrainCircuit,
  Bitcoin,
  Paintbrush,
  Figma,
  CodeXml,
  ShoppingCart,
  LineChart,
  HardDrive,
  Megaphone,
  Folder,
  Clock,
  Users2,
  ArrowUpRight,
} from "lucide-react";
import { type SVGProps } from "react";

const MagicSparkIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 11 17" fill="currentColor" {...props}>
    <path d="M4.23.429a.63.63 0 0 1 .862-.12L7 1.43V.63a.63.63 0 0 1 1.26 0v2.52a.63.63 0 0 1-1.09.44l-1.908-1.124-.954.545a.63.63 0 0 1-.741-.954L4.23.43Z" />
  </svg>
);

const TwitterIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 16" fill="currentColor" {...props}>
    <path d="M14.258 2.378L9.043 8.4l5.633 6.54h-1.42L8.51 9.382l-4.13 5.558H3.016l5.51-7.39L2.98 2.378h1.42l4.36 5.098 3.82-5.098h1.678z" />
  </svg>
);

const categoryItems = [
  { name: "All", href: "/", icon: Sparkle },
  { name: "Agency", href: "/category/agency", icon: Building2 },
  { name: "AI", href: "/category/ai", icon: BrainCircuit },
  { name: "Crypto", href: "/category/crypto", icon: Bitcoin },
  { name: "Design", href: "/category/design", icon: Paintbrush },
  { name: "Design Tools", href: "/category/design-tools", icon: Figma },
  { name: "Developer Tools", href: "/category/developer-tools", icon: CodeXml },
  { name: "E-Commerce", href: "/category/e-commerce", icon: ShoppingCart },
  { name: "Fintech", href: "/category/fintech", icon: LineChart },
  { name: "Hardware", href: "/category/hardware", icon: HardDrive },
  { name: "Marketing", href: "/category/marketing", icon: Megaphone },
  { name: "Portfolios", href: "/category/portfolios", icon: Folder },
  { name: "Productivity", href: "/category/productivity", icon: Clock },
  { name: "Social", href: "/category/social", icon: Users2 },
];

export default function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) {
  return (
    <div className={`sm:hidden fixed inset-0 z-50 transition-all duration-300 ${isOpen ? "visible" : "invisible"}`} aria-hidden={!isOpen}>
      <div 
        onClick={onClose} 
        className={`absolute inset-0 bg-black/25 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`} 
      />
      
      <div className={`absolute top-0 right-0 h-full w-[280px] bg-white transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 h-[67px]">
              <Link href="/" onClick={onClose} className="flex items-center gap-[6px] cursor-pointer">
                <span className="uppercase font-black text-lg">see</span>
                <MagicSparkIcon className="w-[10px] h-[16px] text-black" />
                <span className="uppercase font-black text-lg">saw</span>
              </Link>
              <button onClick={onClose} className="p-1 text-gray-600 hover:text-black">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4">
              <nav className="flex flex-col gap-1">
                {categoryItems.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-4 px-4 py-3 rounded-lg text-base font-normal ${
                      index === 0 // 'All' is active on the homepage
                        ? "bg-gray-100 text-black"
                        : "text-black hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="w-5 h-5 text-gray-500" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="p-4 border-t border-gray-100 flex flex-col gap-2 shrink-0">
              <a href="https://tally.so/r/wd90Pd" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full px-3 h-11 rounded-lg bg-white text-black text-sm border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">Submit</a>
              <button className="flex items-center justify-center w-full px-3 h-11 rounded-lg bg-gray-900 text-white text-sm border border-black hover:bg-almostBlack transition-colors">Subscribe</button>
              
              <div className="w-full flex items-center gap-2 mt-2">
                <a href="https://tally.so/r/wLP5VG" target="_blank" rel="noopener noreferrer" className="h-10 w-full py-[10px] px-4 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center justify-between text-sm transition-colors">
                  <span>Sponsor us</span>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </a>
                <a href="https://x.com/seesawsite" target="_blank" rel="noopener noreferrer" aria-label="Follow us on X" className="h-10 w-10 p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center justify-center shrink-0 transition-colors">
                  <TwitterIcon className="w-4 h-4 text-gray-600" />
                </a>
              </div>
              
              <a href="mailto:hi@seesaw.website" className="h-10 w-full py-[10px] px-4 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center justify-center text-sm transition-colors">
                hi@seesaw.website
              </a>
              
              <p className="text-xs text-gray-400 text-center mt-2">
                © 2025 SEESAW Studios
              </p>
            </div>
        </div>
      </div>
    </div>
  );
}