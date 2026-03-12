'use client';

import Link from 'next/link';
import { Leaf } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#dccfb9] bg-[#f7efe2]/90 backdrop-blur-md">
      <div className="mx-auto flex h-17 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7f925b]">
            <Leaf size={18} className="text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#5f4f40]">Becho</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How It Works', 'Impact', 'Pricing'].map(item => (
            <a key={item} href="#" className="text-sm font-medium text-[#6f655a] transition-colors hover:text-[#33291f] no-underline">{item}</a>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Link href="/auth" className="text-sm font-medium text-[#6f655a] transition-colors hover:text-[#33291f] no-underline">
            Login
          </Link>
          <Link href="/auth" className="rounded-full bg-[#e6bf49] px-5 py-2 text-sm font-semibold text-[#2f261c] transition-colors hover:bg-[#ddb43f] no-underline">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
