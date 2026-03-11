'use client';

import Link from 'next/link';
import { Leaf } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-green-950/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-[68px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <Leaf size={18} className="text-white" />
          </div>
          <span className="text-white font-extrabold text-xl tracking-tight">Becho</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How It Works', 'Impact', 'Pricing'].map(item => (
            <a key={item} href="#" className="text-white/70 hover:text-green-300 text-sm font-medium transition-colors no-underline">{item}</a>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Link href="/auth" className="text-white/80 hover:text-white text-sm font-medium no-underline transition-colors">
            Login
          </Link>
          <Link href="/auth" className="px-5 py-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold shadow-lg shadow-green-900/40 hover:shadow-green-800/50 hover:from-green-400 hover:to-green-500 transition-all no-underline">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
