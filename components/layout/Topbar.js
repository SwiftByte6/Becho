'use client';

import { Bell, Search, ChevronDown } from 'lucide-react';

export default function Topbar({ title = 'Dashboard' }) {
  return (
    <header className="h-16 bg-[#f8f1e6]/95 backdrop-blur-md border-b border-[#dccfb9] flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left: Page title */}
      <div>
        <h1 className="text-lg font-bold text-[#5f4f40] leading-none">{title}</h1>
        <p className="text-xs text-[#8e8172] mt-0.5 font-normal">Welcome back, EcoTech Solutions</p>
      </div>

      {/* Right: Search + actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex items-center">
          <Search size={15} className="absolute left-3 text-[#9a8f82]" />
          <input
            type="text"
            placeholder="Search materials..."
            className="pl-9 pr-3 py-2 text-sm border border-[#dccfb9] rounded-xl bg-[#fcf8f1] text-[#5f4f40] w-52 outline-none focus:border-[#7f925b] focus:bg-[#fffdf9] transition-all"
          />
        </div>

        {/* Notification Bell */}
        <button className="relative w-10 h-10 rounded-xl border border-[#dccfb9] bg-[#fcf8f1] flex items-center justify-center text-[#7a7065] hover:border-[#7f925b] hover:text-[#5f4f40] transition-all cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#e6bf49] rounded-full border-2 border-[#fcf8f1]" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#dccfb9] cursor-pointer hover:border-[#7f925b] transition-all bg-[#fcf8f1]">
          <div className="w-7 h-7 rounded-lg bg-[#7f925b] flex items-center justify-center text-white font-bold text-xs">
            ET
          </div>
          <ChevronDown size={14} className="text-[#9a8f82]" />
        </div>
      </div>
    </header>
  );
}
