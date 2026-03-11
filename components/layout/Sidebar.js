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
    <aside className={`fixed top-0 left-0 bottom-0 z-40 flex flex-col bg-gradient-to-b from-green-950 via-green-900 to-green-800 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-60'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/10 min-h-16 px-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shrink-0">
          <Leaf size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-extrabold text-lg leading-none tracking-tight">Becho</p>
            <p className="text-green-300 text-[10px] font-medium mt-0.5">Circular Economy</p>
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
                  ? 'bg-green-400/20 text-green-300 border-green-400'
                  : 'text-white/60 hover:text-white/90 hover:bg-white/8 border-transparent'
                }`}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-white/10 flex flex-col gap-1">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white/60 hover:text-white/90 hover:bg-white/8 text-sm font-medium transition-all duration-150 cursor-pointer bg-transparent border-none"
        >
          {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span>Collapse</span></>}
        </button>
        <Link
          href="/auth"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:text-white/80 hover:bg-white/8 text-sm transition-all duration-150 no-underline whitespace-nowrap overflow-hidden"
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Link>
      </div>
    </aside>
  );
}
