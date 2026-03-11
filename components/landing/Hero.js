'use client';

import Link from 'next/link';
import { ArrowRight, Play, Leaf, Recycle, Globe } from 'lucide-react';

const floatingCards = [
  { icon: Leaf,    label: 'Aluminium Offcuts', value: '500 kg',    badge: 'Available', badgeClass: 'bg-green-400/20 text-green-400' },
  { icon: Recycle, label: 'Cardboard Surplus', value: '1,200 kg',  badge: 'Matched',   badgeClass: 'bg-blue-400/20 text-blue-400' },
  { icon: Globe,   label: 'Plastic Pellets',   value: '300 kg',    badge: 'AI Matched',badgeClass: 'bg-cyan-400/20 text-cyan-400' },
];

const miniStats = [
  { value: '94%', label: 'Match Rate' },
  { value: '2.4x', label: 'Faster' },
  { value: '4.9★', label: 'Rating' },
];

export default function Hero() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-800 flex items-center relative overflow-hidden pt-[68px]">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-[600px] h-[600px] rounded-full bg-emerald-500/8 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        {/* Left */}
        <div className="animate-fadeInUp">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-400/15 border border-green-400/30 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            <span className="text-green-300 text-xs font-semibold">Sustainable Commerce Platform</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
            Circular Economy{' '}
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Marketplace
            </span>
          </h1>

          <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-lg">
            Connect surplus materials with businesses that can reuse them and reduce environmental waste. Transform your company's waste into another's resource.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-14">
            <Link href="/auth" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-sm shadow-xl shadow-green-900/40 hover:shadow-green-800/50 hover:from-green-400 hover:to-green-500 transition-all no-underline">
              Get Started <ArrowRight size={16} />
            </Link>
            <a href="#how-it-works" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 border border-white/15 text-white font-semibold text-sm hover:bg-white/15 transition-all no-underline">
              <Play size={14} /> Learn More
            </a>
          </div>

          {/* Trust numbers */}
          <div className="flex gap-8">
            {[
              { value: '142+', label: 'Companies' },
              { value: '12.4t', label: 'Waste Diverted' },
              { value: '28.6t', label: 'CO₂ Saved' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-green-400 font-extrabold text-2xl">{value}</div>
                <div className="text-white/50 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Glassmorphism panel */}
        <div className="animate-fadeInUp delay-200">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
            <div className="flex flex-col gap-3 mb-5">
              {floatingCards.map(({ icon: Icon, label, value, badge, badgeClass }, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/8 rounded-2xl p-4 border border-white/8 hover:-translate-y-0.5 transition-transform duration-200">
                  <div className="w-10 h-10 rounded-xl bg-green-400/15 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm leading-none mb-0.5">{label}</p>
                    <p className="text-white/50 text-xs">{value}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${badgeClass}`}>{badge}</span>
                </div>
              ))}
            </div>

            {/* Mini stats row */}
            <div className="flex justify-between items-center bg-green-400/10 border border-green-400/20 rounded-2xl p-4">
              {miniStats.map(({ value, label }, i) => (
                <div key={i} className={`text-center ${i !== 2 ? 'border-r border-white/10 pr-4 mr-4' : ''} flex-1`}>
                  <div className="text-green-400 font-extrabold text-xl">{value}</div>
                  <div className="text-white/50 text-[11px]">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
