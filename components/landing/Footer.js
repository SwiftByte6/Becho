'use client';

import Link from 'next/link';
import { Leaf, Twitter, Linkedin, Github, Mail } from 'lucide-react';

const links = {
  Platform: ['Dashboard', 'Marketplace', 'Recommendations', 'Analytics'],
  Company: ['About Us', 'Blog', 'Careers', 'Press'],
  Support: ['Help Center', 'Privacy Policy', 'Terms of Service', 'Contact'],
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <Leaf size={15} className="text-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight">Becho</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              The circular economy marketplace connecting surplus materials with businesses that can reuse them.
            </p>
            <div className="flex gap-3">
              {[Twitter, Linkedin, Github, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-green-600 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="font-semibold text-sm mb-4 text-white">{section}</h4>
              <ul className="flex flex-col gap-2.5">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-green-400 text-sm transition-colors no-underline">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">© 2026 Becho. All rights reserved. Building a circular future.</p>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
