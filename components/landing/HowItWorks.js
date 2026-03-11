'use client';

import { Upload, Sparkles, Handshake } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload Waste Materials',
    desc: 'Companies upload details about their surplus materials — type, quantity, location, and availability — to the platform in minutes.',
    iconClass: 'text-green-600',
    iconBg: 'bg-green-100',
    cardBg: 'bg-green-50',
    border: 'border-green-200',
    numColor: 'text-green-100',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'AI Recommendation Engine',
    desc: 'Our intelligent engine analyzes your material data and suggests best-fit industries and businesses that can effectively reuse them.',
    iconClass: 'text-cyan-600',
    iconBg: 'bg-cyan-100',
    cardBg: 'bg-cyan-50',
    border: 'border-cyan-200',
    numColor: 'text-cyan-100',
  },
  {
    number: '03',
    icon: Handshake,
    title: 'Reuse & Reduce Waste',
    desc: 'Businesses acquire reusable materials directly, reducing procurement costs and environmental impact simultaneously.',
    iconClass: 'text-violet-600',
    iconBg: 'bg-violet-100',
    cardBg: 'bg-violet-50',
    border: 'border-violet-200',
    numColor: 'text-violet-100',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-28 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold border border-green-200 mb-4">
            Simple Process
          </span>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            How It <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            Three simple steps to transform your surplus materials into sustainable resources.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {steps.map(({ number, icon: Icon, title, desc, iconClass, iconBg, cardBg, border, numColor }) => (
            <div
              key={number}
              className={`relative overflow-hidden rounded-2xl border ${border} ${cardBg} p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
            >
              {/* Watermark number */}
              <span className={`absolute -top-2 right-4 text-8xl font-black leading-none pointer-events-none select-none ${numColor}`}>
                {number}
              </span>
              <div className={`w-13 h-13 w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center mb-5`}>
                <Icon size={24} className={iconClass} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
