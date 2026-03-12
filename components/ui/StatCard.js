'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

const colorMap = {
  green:   { bg: 'bg-[#edf4eb]', icon: 'text-[#6f8250]' },
  emerald: { bg: 'bg-[#e6efe2]', icon: 'text-[#5f7a45]' },
  teal:    { bg: 'bg-[#e9f0f4]', icon: 'text-[#587484]' },
  blue:    { bg: 'bg-[#ece9f6]', icon: 'text-[#72639a]' },
  amber:   { bg: 'bg-[#f8f0dc]', icon: 'text-[#a97f2f]' },
};

export default function StatCard({ label, value, unit, change, trend, icon: Icon, color = 'green', className = '' }) {
  const c = colorMap[color] || colorMap.green;

  return (
    <div className={`bg-[#fcf8f1] rounded-2xl border border-[#dccfb9] shadow-[0_10px_30px_rgba(95,79,64,0.08)] p-6 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(95,79,64,0.12)] ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#7a7065]">{label}</span>
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.bg}`}>
          {Icon && <Icon size={20} className={c.icon} />}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <span className="text-3xl font-bold text-[#4e4033]">{value}</span>
          {unit && <span className="text-sm text-[#9a8f82] ml-1">{unit}</span>}
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trend === 'up' ? 'text-[#5f7a45] bg-[#edf4eb]' : 'text-[#a85d3d] bg-[#f7e9df]'}`}>
            {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {change}
          </div>
        )}
      </div>
    </div>
  );
}
