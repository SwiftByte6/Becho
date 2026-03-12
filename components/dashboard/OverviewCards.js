'use client';

import { useEffect, useState } from 'react';
import { Package, Recycle, Leaf, Bell } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';

const iconMap = { Package, Recycle, Leaf, Bell };

const defaultStats = [
  { id: 1, label: 'My Listings', value: '0', unit: '', icon: 'Package', color: 'green' },
  { id: 2, label: 'Active Deals', value: '0', unit: '', icon: 'Bell', color: 'blue' },
  { id: 3, label: 'Waste Diverted', value: '0', unit: 'kg', icon: 'Recycle', color: 'emerald' },
  { id: 4, label: 'CO2 Saved', value: '0', unit: 'kg', icon: 'Leaf', color: 'teal' },
];

export default function OverviewCards() {
  const [stats, setStats] = useState(defaultStats);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('/api/dashboard', { credentials: 'include' });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Unable to load dashboard stats.');
        }

        setStats([
          {
            id: 1,
            label: 'My Listings',
            value: String(data.stats.listings || 0),
            unit: '',
            icon: 'Package',
            color: 'green',
          },
          {
            id: 2,
            label: 'Active Deals',
            value: String(data.stats.active_deals || 0),
            unit: '',
            icon: 'Bell',
            color: 'blue',
          },
          {
            id: 3,
            label: 'Waste Diverted',
            value: String(data.stats.waste_diverted || 0),
            unit: 'kg',
            icon: 'Recycle',
            color: 'emerald',
          },
          {
            id: 4,
            label: 'CO2 Saved',
            value: String(data.stats.co2_saved || 0),
            unit: 'kg',
            icon: 'Leaf',
            color: 'teal',
          },
        ]);
      } catch {
        setStats(defaultStats);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {stats.map(({ id, label, value, unit, change, trend, icon, color }) => {
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
