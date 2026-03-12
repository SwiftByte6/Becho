'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { Upload, Sparkles, CheckCircle, ShoppingBag, BarChart3, Clock } from 'lucide-react';
import Link from 'next/link';

const iconMap = { Upload, Sparkles, CheckCircle };

const typeStyles = {
  upload:    { bg: 'bg-[#edf4eb]', icon: 'text-[#6f8250]' },
  recommend: { bg: 'bg-[#f8f0dc]', icon: 'text-[#a97f2f]' },
  request:   { bg: 'bg-[#ece9f6]', icon: 'text-[#72639a]' },
};

export default function QuickActions() {
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const loadActivity = async () => {
      try {
        const response = await fetch('/api/dashboard', { credentials: 'include' });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Unable to load dashboard activity.');
        }

        setRecentActivity(data.recent_activity || []);
      } catch {
        setRecentActivity([]);
      }
    };

    loadActivity();
  }, []);

  const formatRelativeTime = (value) => {
    if (!value) return 'Recently';

    const date = new Date(value);
    const diff = Date.now() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    return `${days} day${days === 1 ? '' : 's'} ago`;
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Quick Actions */}
      <div className="bg-[#fcf8f1] rounded-2xl border border-[#dccfb9] shadow-[0_10px_30px_rgba(95,79,64,0.08)] p-5">
        <h3 className="text-sm font-bold text-[#5f4f40] mb-4">Quick Actions</h3>
        <div className="flex flex-col gap-2.5">
          <Link href="/dashboard/listings/new">
            <Button variant="primary" fullWidth size="md">
              <Upload size={15} /> Upload Waste Material
            </Button>
          </Link>
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
            <Button variant="ghost" fullWidth size="md" className="text-[#7a7065]">
              <BarChart3 size={15} /> View Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#fcf8f1] rounded-2xl border border-[#dccfb9] shadow-[0_10px_30px_rgba(95,79,64,0.08)] p-5 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#5f4f40]">Recent Activity</h3>
          <Clock size={14} className="text-[#9a8f82]" />
        </div>
        <div className="flex flex-col gap-3">
          {recentActivity.length === 0 && (
            <p className="text-xs text-[#9a8f82]">Your recent activity will appear here once you start listing or transacting materials.</p>
          )}
          {recentActivity.map(({ id, type, message, time, icon }) => {
            const Icon = iconMap[icon] || Upload;
            const style = typeStyles[type] || typeStyles.upload;
            return (
              <div key={id} className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-lg ${style.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon size={13} className={style.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[#6f655a] leading-snug">{message}</p>
                  <p className="text-[11px] text-[#9a8f82] mt-0.5">{formatRelativeTime(time)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
