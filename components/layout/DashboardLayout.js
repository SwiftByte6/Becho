'use client';

import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout({ children, title }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      {/* Offset main area for 240px sidebar */}
      <div className="ml-60 flex flex-col flex-1 min-h-screen transition-all duration-300">
        <Topbar title={title} />
        <main className="flex-1 p-6 max-w-[1400px] w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
