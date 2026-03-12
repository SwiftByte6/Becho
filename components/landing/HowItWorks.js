'use client';

import Image from 'next/image';
import { Upload, Sparkles, Handshake } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload Waste Materials',
    desc: 'Companies upload details about their surplus materials — type, quantity, location, and availability — to the platform in minutes.',
    iconClass: 'text-green-600',
    iconBg: 'bg-[#d6e7cf]',
    cardBg: 'bg-[#edf4eb]',
    border: 'border-[#cdddc6]',
    imageSrc: '/LandingPage/work1.png',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'AI Recommendation Engine',
    desc: 'Our intelligent engine analyzes your material data and suggests best-fit industries and businesses that can effectively reuse them.',
    iconClass: 'text-cyan-600',
    iconBg: 'bg-[#d7ece8]',
    cardBg: 'bg-[#edf5f3]',
    border: 'border-[#cee0dc]',
    imageSrc: '/LandingPage/work2.png',
  },
  {
    number: '03',
    icon: Handshake,
    title: 'Reuse & Reduce Waste',
    desc: 'Businesses acquire reusable materials directly, reducing procurement costs and environmental impact simultaneously.',
    iconClass: 'text-violet-600',
    iconBg: 'bg-[#e3ddef]',
    cardBg: 'bg-[#f2edf7]',
    border: 'border-[#ddd3ea]',
    imageSrc: '/LandingPage/work3.png',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-transparent px-6 py-28">
      <div className="mx-auto max-w-6xl px-2 sm:px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold border border-green-200 mb-4">
            Simple Process
          </span>
          <h2 className="text-4xl font-extrabold text-heading tracking-tight mb-4">
            How It <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            Three simple steps to transform your surplus materials into sustainable resources.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map(({ number, icon: Icon, title, desc, iconClass, iconBg, cardBg, border, imageSrc }) => (
            <div
              key={number}
              className={`relative flex min-h-[360px] h-full w-full flex-col overflow-hidden rounded-[24px] border ${border} ${cardBg} p-5 shadow-[0_10px_30px_rgba(95,79,64,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(95,79,64,0.12)] sm:p-6 lg:min-h-[390px]`}
            >
              <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
                <Icon size={24} className={iconClass} />
              </div>

              <div className="max-w-[14rem] pr-4">
                <h3 className="mb-2 text-[1.7rem] font-extrabold leading-[1.05] tracking-tight text-slate-800">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {desc}
                </p>
              </div>

              <div className="relative mt-auto flex min-h-[148px] items-end justify-end pt-6">
                <div className="absolute inset-x-0 bottom-0 h-px bg-[#d7ddd0]" />
                <Image
                  src={imageSrc}
                  alt={title}
                  width={320}
                  height={350}
                  className="relative z-10 h-auto w-[270px] max-w-full object-contain sm:w-[388px] lg:w-[228px]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
