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
          <Sparkles size={18} className="text-amber-500" />
          <h2 className="text-lg font-bold text-slate-900">AI Recommendations</h2>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold border border-amber-200">
          {items.length} matches
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map(({ id, material, industry, score, benefit, co2, company }) => (
          <div key={id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            {/* Score badge */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                <Building2 size={11} /> {industry}
              </span>
              <div className="flex items-center gap-1">
                <span className={`text-sm font-bold ${score >= 90 ? 'text-green-600' : score >= 80 ? 'text-amber-600' : 'text-slate-500'}`}>{score}%</span>
              </div>
            </div>

            {/* Material name */}
            <div>
              <p className="font-semibold text-slate-900 text-sm mb-0.5">{material}</p>
              <p className="text-slate-400 text-xs">{company}</p>
            </div>

            {/* Compatibility score bar */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-slate-500 font-medium">Compatibility Score</span>
                <span className="text-xs font-bold text-green-600">{score}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>

            {/* Benefits */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-start gap-1.5">
                <Leaf size={12} className="text-green-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 leading-snug">{benefit}</p>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-[10px] text-green-600 font-semibold bg-green-50 px-1.5 py-0.5 rounded shrink-0">{co2}</span>
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
