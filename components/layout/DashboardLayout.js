'use client';

import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout({ children, title }) {
  return (
    <div className="relative flex min-h-screen bg-[#f7efe2]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top_left,_rgba(202,179,122,0.12),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(127,146,91,0.12),_transparent_36%)]" />
      </div>
      <Sidebar />
      {/* Offset main area for 240px sidebar */}
      <div className="relative z-10 ml-60 flex flex-col flex-1 min-h-screen transition-all duration-300">
        <Topbar title={title} />
        <main className="flex-1 p-6 max-w-[1400px] w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
