"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface Website {
  name: string;
  description: string;
  url: string;
  slug: string;
}

const websites: Website[] = [
    { name: "Tame OS", description: "A space to grow ideas.", url: "https://www.tame.ooo/", slug: "tame" },
    { name: "Google Antigravity", description: "Next-generation IDE.", url: "https://antigravity.g.com/", slug: "antigravity" },
    { name: "Hill", description: "Buy & sell shares in pre-IPO companies.", url: "https://hill.cm/", slug: "hill"},
    { name: "Aave App", description: "Earn interest every second with industry-leading rates and balance protection up to $1M.", url: "https://app.aave.com/", slug: "aave-app"},
    { name: "COLLINS", description: "Rewrite your worth.", url: "https://wearecollins.com/", slug: "collins"},
    { name: "Bonside", description: "Defining the brick and mortar economy.", url: "https://bonside.com/", slug: "bonside"},
    { name: "GTE", description: "The fastest decentralized trading venue.", url: "https://gte.exchange/", slug: "gte"},
    { name: "Lightfield", description: "CRM that self-assembles and takes action for you.", url: "https://www.lightfield.ag/", slug: "lightfield"},
    { name: "Waabi", description: "Pioneering Physical AI, starting with autonomous trucks.", url: "https://waabi.ai/", slug: "waabi"},
    { name: "Ando", description: "Work messaging reimagined.", url: "https://www.ando.so/", slug: "ando"},
    { name: "Physical Intelligence", description: "Bringing general-purpose AI into the physical world.", url: "https://pi.ml/", slug: "physical-intelligence"},
    { name: "Lorenzo Dossi", description: "Personal site of independent design engineer and motion designer Lorenzo Dossi.", url: "https://lorenzodossi.com/", slug: "lorenzo-dossi"},
    { name: "Flask", description: "Video collaboration for creative teams.", url: "https://flask.io/", slug: "flask"},
    { name: "fomo", description: "The social-first crypto trading platform.", url: "https://fomo.lol/", slug: "fomo"},
];

export default function SearchModal() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (url: string) => {
    router.push(url);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-gray-600/10 px-3 py-[6px] w-full flex flex-row items-center rounded-[1000px]"
      >
        <Search className="h-4 w-4 text-gray-400" />
        <p className="text-sm text-gray-400 text-left ml-3 w-full break-normal whitespace-nowrap">
          Search for websites, fonts, categories...
        </p>
        <kbd className="text-[10px] text-gray-400 px-[5px] py-[2px] rounded-[4px] ml-auto select-none font-sans hidden lg:block">
          ⌘&nbsp;K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for websites, fonts, categories..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Websites">
            {websites.map((website) => (
              <CommandItem
                key={website.slug}
                value={`${website.name} ${website.description}`}
                onSelect={() => handleSelect(`/websites/${website.slug}`)}
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={`https://www.google.com/s2/favicons?domain=${website.url}&sz=32`}
                    alt={`${website.name} favicon`}
                    width={20}
                    height={20}
                    className="rounded-sm flex-shrink-0"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-1000">{website.name}</span>
                    <span className="text-sm text-gray-400 line-clamp-1">{website.description}</span>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}