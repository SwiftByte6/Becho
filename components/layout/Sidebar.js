'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingBag, Sparkles, BarChart3,
  User, LogOut, Leaf, ChevronLeft, ChevronRight
} from 'lucide-react';

const navItems = [
  { href: '/dashboard',                 label: 'Dashboard',            icon: LayoutDashboard },
  { href: '/dashboard/listings',        label: 'My Waste Listings',    icon: Package },
  { href: '/dashboard/marketplace',     label: 'Material Marketplace', icon: ShoppingBag },
  { href: '/dashboard/recommendations', label: 'Recommendations',      icon: Sparkles },
  { href: '/dashboard/analytics',       label: 'Impact Analytics',     icon: BarChart3 },
  { href: '/dashboard/profile',         label: 'Profile',              icon: User },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside className={`fixed top-0 left-0 bottom-0 z-40 flex flex-col bg-[#efe4d4] border-r border-[#d9ccb6] transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-60'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-[#d9ccb6] min-h-16 px-4">
        <div className="w-9 h-9 rounded-xl bg-[#7f925b] flex items-center justify-center shrink-0">
          <Leaf size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-[#5f4f40] font-extrabold text-lg leading-none tracking-tight">Becho</p>
            <p className="text-[#7f925b] text-[10px] font-semibold mt-0.5">Circular Economy</p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-4 flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 no-underline overflow-hidden whitespace-nowrap border-l-[3px]
                ${active
                  ? 'bg-[#f8f1e6] text-[#33291f] border-[#7f925b]'
                  : 'text-[#7a7065] hover:text-[#5f4f40] hover:bg-[#f6ecdc] border-transparent'
                }`}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-[#d9ccb6] flex flex-col gap-1">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[#7a7065] hover:text-[#5f4f40] hover:bg-[#f6ecdc] text-sm font-medium transition-all duration-150 cursor-pointer bg-transparent border-none"
        >
          {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span>Collapse</span></>}
        </button>
        <Link
          href="/auth"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#8e8172] hover:text-[#5f4f40] hover:bg-[#f6ecdc] text-sm transition-all duration-150 no-underline whitespace-nowrap overflow-hidden"
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Link>
      </div>
    </aside>
  );
}
