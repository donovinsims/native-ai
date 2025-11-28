"use client";

import Link from "next/link";
import {
  Sparkles,
  Paintbrush,
  Code,
  ListChecks,
  ShieldCheck,
  Zap,
  MessageCircle,
  Wrench,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  href: string;
  icon: React.ElementType;
}

const categories: Category[] = [
  { id: "all", name: "All", href: "/", icon: Sparkles },
  { id: "design", name: "Design", href: "/category/design", icon: Paintbrush },
  { id: "development", name: "Development", href: "/category/development", icon: Code },
  { id: "productivity", name: "Productivity", href: "/category/productivity", icon: ListChecks },
  { id: "security", name: "Security", href: "/category/security", icon: ShieldCheck },
  { id: "automation", name: "Automation", href: "/category/automation", icon: Zap },
  { id: "communication", name: "Communication", href: "/category/communication", icon: MessageCircle },
  { id: "utilities", name: "Utilities", href: "/category/utilities", icon: Wrench },
];

interface CategoryListProps {
  selectedCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
  onClose?: () => void;
}

export function CategoryList({
  selectedCategory = "all",
  onCategorySelect,
  onClose,
}: CategoryListProps) {
  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect?.(categoryId);
    onClose?.();
  };

  return (
    <nav className="flex flex-col gap-1">
      {categories.map((category) => {
        const isSelected = selectedCategory === category.id;
        const Icon = category.icon;

        return (
          <Link
            key={category.id}
            href={category.href}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex items-center gap-3 min-h-[44px] px-4 py-3 rounded-lg text-base font-normal transition-colors ${
              isSelected
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Icon
              className={`w-5 h-5 flex-shrink-0 ${
                isSelected ? "text-white" : "text-gray-400"
              }`}
            />
            <span>{category.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export { categories };
