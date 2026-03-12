'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Recycle } from 'lucide-react';

const stats = [
  { value: '142 +', label: 'company', cardClass: 'bg-[#7f925b] text-white' },
  { value: '142 +', label: 'company', cardClass: 'bg-[#e6bf49] text-[#2f261c]' },
  { value: '142 +', label: 'company', cardClass: 'bg-[#d97c52] text-white' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f7efe2] pt-28 pb-16 lg:pt-36 lg:pb-24">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top_left,_rgba(202,179,122,0.16),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(127,146,91,0.18),_transparent_36%)]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-8">
        <div className="animate-fadeInUp">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d8ccb7] bg-white/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7f925b]">
            <Recycle size={14} />
            Circular economy marketplace
          </div>

          <h1 className="max-w-xl text-4xl font-extrabold leading-[1.05] text-[#5f4f40] sm:text-5xl lg:text-6xl">
            Transform Waste into
            <span className="block text-[#33291f]">Opportunity</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-[#6f655a] sm:text-lg">
            A circular economy marketplace that connects businesses, organizations, and communities to reuse surplus materials instead of discarding them.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-full bg-[#e6bf49] px-6 py-3 text-sm font-semibold text-[#2f261c] transition-transform duration-200 hover:-translate-y-0.5 no-underline"
            >
              Get Started <ArrowRight size={16} />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center rounded-full border border-[#d8ccb7] bg-[#efe4d4] px-6 py-3 text-sm font-semibold text-[#5f4f40] transition-colors duration-200 hover:bg-[#eadcc9] no-underline"
            >
              How It Work
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            {stats.map(({ value, label, cardClass }) => (
              <div key={cardClass} className={`min-w-[108px] rounded-sm px-8 py-5 shadow-[0_18px_40px_rgba(95,79,64,0.08)] ${cardClass}`}>
                <div className="text-3xl font-extrabold leading-none">{value}</div>
                <div className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] opacity-80">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fadeInUp delay-200">
          <div className="relative mx-auto w-full max-w-[620px]">
          
            <div className="relative overflow-hidden rounded-[28px]  md:scale-155 p-3 ">
              <Image
                src="/LandingPage/Hero.png"
                alt="Illustration of circular economy material reuse"
                width={1110}
                height={580}
                priority
                className="h-auto w-full rounded-[22px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
