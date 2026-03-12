'use client';

import { recommendations } from '@/data/mockData';
import Button from '@/components/ui/Button';
import { Sparkles, Building2, Leaf, MessageSquare } from 'lucide-react';

export default function RecommendedMaterials({ limit }) {
  const items = limit ? recommendations.slice(0, limit) : recommendations;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-[#c99632]" />
          <h2 className="text-lg font-bold text-[#5f4f40]">AI Recommendations</h2>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-[#f8f0dc] text-[#8f6d28] text-xs font-semibold border border-[#ead9af]">
          {items.length} matches
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map(({ id, material, industry, score, benefit, co2, company }) => (
          <div key={id} className="bg-[#fcf8f1] rounded-2xl border border-[#dccfb9] shadow-[0_10px_30px_rgba(95,79,64,0.08)] p-5 flex flex-col gap-4 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(95,79,64,0.12)] transition-all duration-200">
            {/* Score badge */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#7a7065] bg-[#efe4d4] px-2.5 py-1 rounded-full border border-[#dccfb9]">
                <Building2 size={11} /> {industry}
              </span>
              <div className="flex items-center gap-1">
                <span className={`text-sm font-bold ${score >= 90 ? 'text-[#6f8250]' : score >= 80 ? 'text-[#a97f2f]' : 'text-[#7a7065]'}`}>{score}%</span>
              </div>
            </div>

            {/* Material name */}
            <div>
              <p className="font-semibold text-[#4e4033] text-sm mb-0.5">{material}</p>
              <p className="text-[#9a8f82] text-xs">{company}</p>
            </div>

            {/* Compatibility score bar */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-[#7a7065] font-medium">Compatibility Score</span>
                <span className="text-xs font-bold text-[#6f8250]">{score}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#eadfce] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#7f925b] to-[#a8b985] rounded-full transition-all duration-500"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>

            {/* Benefits */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-start gap-1.5">
                <Leaf size={12} className="text-[#7f925b] shrink-0 mt-0.5" />
                <p className="text-xs text-[#7a7065] leading-snug">{benefit}</p>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-[10px] text-[#5f6f43] font-semibold bg-[#edf4eb] px-1.5 py-0.5 rounded shrink-0">{co2}</span>
              </div>
            </div>

            <Button variant="primary" size="sm" fullWidth>
              <MessageSquare size={13} /> Contact / Request
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
