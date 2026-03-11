'use client';

import { Trash2, Leaf, Recycle, Building2 } from 'lucide-react';

const iconMap = { Trash2, Leaf, Recycle, Building2 };

const stats = [
  { label: 'Waste Diverted from Landfill', value: '12,400', unit: 'kg', icon: 'Trash2', suffix: '+' },
  { label: 'CO₂ Saved', value: '28.6', unit: 'tons', icon: 'Leaf', suffix: '' },
  { label: 'Materials Reused', value: '7,830', unit: 'kg', icon: 'Recycle', suffix: '+' },
  { label: 'Active Companies', value: '142', unit: '', icon: 'Building2', suffix: '+' },
];

export default function ImpactStats() {
  return (
    <section className="bg-gradient-to-b from-green-950 to-green-900 py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-400/15 border border-green-400/30 text-green-300 text-xs font-semibold mb-4">
            Real Impact
          </span>
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-3">
            Environmental <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">Impact</span>
          </h2>
          <p className="text-white/60 text-lg max-w-lg mx-auto">
            Every material reused on Becho contributes to a healthier planet.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map(({ label, value, unit, icon, suffix }) => {
            const Icon = iconMap[icon];
            return (
              <div key={label} className="bg-white/8 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/12 transition-all duration-200 hover:-translate-y-0.5 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-green-400/15 flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-green-400" />
                </div>
                <div className="text-3xl font-extrabold text-white mb-1">
                  {value}<span className="text-green-400">{suffix}</span>
                  {unit && <span className="text-base font-semibold text-white/60 ml-1">{unit}</span>}
                </div>
                <p className="text-white/50 text-xs leading-snug">{label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
