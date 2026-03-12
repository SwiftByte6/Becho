'use client';

import { Bell, Search, ChevronDown } from 'lucide-react';

export default function Topbar({ title = 'Dashboard' }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left: Page title */}
      <div>
        <h1 className="text-lg font-bold text-slate-900 leading-none">{title}</h1>
        <p className="text-xs text-slate-400 mt-0.5 font-normal">Welcome back, EcoTech Solutions</p>
      </div>

      {/* Right: Search + actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex items-center">
          <Search size={15} className="absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search materials..."
            className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 w-52 outline-none focus:border-green-500 focus:bg-white transition-all"
          />
        </div>

        {/* Notification Bell */}
        <button className="relative w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:border-green-400 hover:text-green-600 transition-all cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full border-2 border-white" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 cursor-pointer hover:border-green-400 transition-all">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xs">
            ET
          </div>
          <ChevronDown size={14} className="text-slate-400" />
        </div>
      </div>
    </header>
  );
}
