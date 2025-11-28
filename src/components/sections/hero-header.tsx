"use client";

import React from 'react';

interface HeroHeaderProps {
  onSubscribeClick?: () => void;
}

const HeroHeader = ({ onSubscribeClick }: HeroHeaderProps) => {
  return (
    <section className="py-3 md:py-8">
      <h1 className="md:text-4xl md:leading-10 text-black !font-(family-name:--font-manrope) !font-bold !tracking-[-2px] !leading-none !text-[41px]">
        The best web design inspiration
      </h1>
      <h3 className="mt-2 text-base md:text-xl font-normal leading-6 md:leading-8 text-gray-500">
        Browse the best of the internet. Hand-picked and updated daily.
      </h3>
      <div className="mt-6 flex items-baseline">
        <button
          onClick={onSubscribeClick}
          className="min-h-[40px] flex items-center justify-center px-6 py-2 rounded-xl font-medium border border-[#d1d1d1] hover:bg-gray-50 transition-colors text-sm !bg-neutral-950 !text-white">

          Subscribe for free
        </button>
        <span className="ml-3 text-sm text-gray-400">97 joined today</span>
      </div>
    </section>);

};

export default HeroHeader;