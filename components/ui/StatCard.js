'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

const colorMap = {
  green:   { bg: 'bg-green-50',   icon: 'text-green-600' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600' },
  teal:    { bg: 'bg-teal-50',    icon: 'text-teal-600' },
  blue:    { bg: 'bg-blue-50',    icon: 'text-blue-600' },
  amber:   { bg: 'bg-amber-50',   icon: 'text-amber-600' },
};

export default function StatCard({ label, value, unit, change, trend, icon: Icon, color = 'green', className = '' }) {
  const c = colorMap[color] || colorMap.green;

  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.bg}`}>
          {Icon && <Icon size={20} className={c.icon} />}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <span className="text-3xl font-bold text-slate-900">{value}</span>
          {unit && <span className="text-sm text-slate-400 ml-1">{unit}</span>}
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trend === 'up' ? 'text-green-700 bg-green-50' : 'text-red-600 bg-red-50'}`}>
            {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {change}
          </div>
        )}
      </div>
    </div>
  );
}
