'use client';

import { analyticsData } from '@/data/mockData';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from 'recharts';
import { Zap, Leaf, Trash2, Droplets } from 'lucide-react';

const impactMetrics = [
  { label: 'Energy Saved',   value: '76',   unit: 'MWh',  icon: Zap,    color: 'text-[#a97f2f]', bg: 'bg-[#f8f0dc]' },
  { label: 'CO₂ Reduced',    value: '4,200', unit: 'kg',  icon: Leaf,   color: 'text-[#6f8250]', bg: 'bg-[#edf4eb]' },
  { label: 'Waste Diverted', value: '2,840', unit: 'kg',  icon: Trash2, color: 'text-[#72639a]', bg: 'bg-[#ece9f6]' },
  { label: 'Water Saved',    value: '1,200', unit: 'L',   icon: Droplets,color: 'text-[#5c7a89]', bg: 'bg-[#e9f0f4]' },
];

export default function AnalyticsSection() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-bold text-[#5f4f40]">Impact Analytics</h2>

      {/* Impact metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {impactMetrics.map(({ label, value, unit, icon: Icon, color, bg }) => (
          <div key={label} className="bg-[#fcf8f1] rounded-2xl border border-[#dccfb9] shadow-[0_10px_30px_rgba(95,79,64,0.08)] p-4 flex flex-col gap-2 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(95,79,64,0.12)] transition-all duration-200">
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon size={17} className={color} />
            </div>
            <p className="text-2xl font-extrabold text-[#4e4033]">{value} <span className="text-sm font-semibold text-[#9a8f82]">{unit}</span></p>
            <p className="text-xs text-[#7a7065] font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Waste by category bar chart */}
        <div className="bg-[#fcf8f1] rounded-2xl border border-[#dccfb9] shadow-[0_10px_30px_rgba(95,79,64,0.08)] p-5">
          <p className="text-sm font-semibold text-[#6f655a] mb-4">Waste by Category (kg)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analyticsData.wasteByCategory} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eadfce" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9a8f82' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9a8f82' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#fcf8f1', border: '1px solid #dccfb9', borderRadius: '10px', fontSize: '12px' }}
                cursor={{ fill: '#f3e8d5' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {analyticsData.wasteByCategory.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Materials reused over time */}
        <div className="bg-[#fcf8f1] rounded-2xl border border-[#dccfb9] shadow-[0_10px_30px_rgba(95,79,64,0.08)] p-5">
          <p className="text-sm font-semibold text-[#6f655a] mb-4">Reuse vs Listed Trend</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={analyticsData.reuseOverTime}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eadfce" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9a8f82' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9a8f82' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#fcf8f1', border: '1px solid #dccfb9', borderRadius: '10px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Line type="monotone" dataKey="listed" stroke="#a39688" strokeWidth={2} dot={false} name="Listed" />
              <Line type="monotone" dataKey="reused" stroke="#7f925b" strokeWidth={2.5} dot={{ fill: '#7f925b', r: 4 }} name="Reused" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie chart */}
      <div className="bg-[#fcf8f1] rounded-2xl border border-[#dccfb9] shadow-[0_10px_30px_rgba(95,79,64,0.08)] p-5">
        <p className="text-sm font-semibold text-[#6f655a] mb-4">Material Category Distribution</p>
        <div className="flex items-center gap-8 flex-wrap">
          <ResponsiveContainer width={220} height={180}>
            <PieChart>
              <Pie data={analyticsData.wasteByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {analyticsData.wasteByCategory.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#fcf8f1', border: '1px solid #dccfb9', borderRadius: '10px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2">
            {analyticsData.wasteByCategory.map(({ name, value, fill }) => (
              <div key={name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: fill }} />
                <span className="text-xs text-[#7a7065]">{name}</span>
                <span className="text-xs font-semibold text-[#4e4033] ml-auto pl-4">{value} kg</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
