'use client';

import { recentActivity } from '@/data/mockData';
import Button from '@/components/ui/Button';
import { Upload, Sparkles, CheckCircle, ShoppingBag, BarChart3, Clock } from 'lucide-react';
import Link from 'next/link';

const iconMap = { Upload, Sparkles, CheckCircle };

const typeStyles = {
  upload:    { bg: 'bg-green-50',  icon: 'text-green-600' },
  recommend: { bg: 'bg-amber-50',  icon: 'text-amber-600' },
  request:   { bg: 'bg-blue-50',   icon: 'text-blue-600' },
};

export default function QuickActions() {
  return (
    <div className="flex flex-col gap-5">
      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Quick Actions</h3>
        <div className="flex flex-col gap-2.5">
          <Button variant="primary" fullWidth size="md">
            <Upload size={15} /> Upload Waste Material
          </Button>
          <Link href="/dashboard/marketplace">
            <Button variant="outline" fullWidth size="md">
              <ShoppingBag size={15} /> View Marketplace
            </Button>
          </Link>
          <Link href="/dashboard/recommendations">
            <Button variant="secondary" fullWidth size="md">
              <Sparkles size={15} /> Generate Recommendation
            </Button>
          </Link>
          <Link href="/dashboard/analytics">
            <Button variant="ghost" fullWidth size="md" className="text-slate-600">
              <BarChart3 size={15} /> View Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
          <Clock size={14} className="text-slate-400" />
        </div>
        <div className="flex flex-col gap-3">
          {recentActivity.map(({ id, type, message, time, icon }) => {
            const Icon = iconMap[icon] || Upload;
            const style = typeStyles[type] || typeStyles.upload;
            return (
              <div key={id} className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-lg ${style.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon size={13} className={style.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 leading-snug">{message}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
