'use client';

import { overviewStats } from '@/data/mockData';
import { Package, Recycle, Leaf, Bell } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';

const iconMap = { Package, Recycle, Leaf, Bell };

export default function OverviewCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {overviewStats.map(({ id, label, value, unit, change, trend, icon, color }) => {
        const Icon = iconMap[icon];
        return (
          <StatCard
            key={id}
            label={label}
            value={value}
            unit={unit}
            change={change}
            trend={trend}
            icon={Icon}
            color={color}
          />
        );
      })}
    </div>
  );
}
