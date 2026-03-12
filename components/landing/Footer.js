'use client';

import Link from 'next/link';
import { Leaf, Twitter, Linkedin, Github, Mail } from 'lucide-react';

const navLinks = {
  Platform: ['Dashboard', 'Marketplace', 'Recommendations', 'Analytics'],
  Company: ['About', 'Blog', 'Careers', 'Press'],
  Support: ['Help Center', 'Privacy Policy', 'Terms', 'Contact'],
};

const socials = [
  { Icon: Twitter, href: '#', label: 'Twitter' },
  { Icon: Linkedin, href: '#', label: 'LinkedIn' },
  { Icon: Github, href: '#', label: 'GitHub' },
  { Icon: Mail, href: '#', label: 'Email' },
];

function EcoDivider() {
  return (
    <div className="w-full overflow-hidden leading-[0]">
      <svg
        viewBox="0 0 1440 130"
        xmlns="http://www.w3.org/2000/svg"
        className="block h-auto w-full"
        preserveAspectRatio="none"
      >
        {/* Wave fill — matches footer gradient start */}
        <path
          d="M0,55 C200,115 400,10 720,58 C1020,106 1240,8 1440,55 L1440,130 L0,130 Z"
          fill="#dce8c4"
        />

        {/* Tree left */}
        <g transform="translate(88,22)">
          <rect x="6" y="28" width="8" height="16" rx="2" fill="#7f925b" opacity="0.75" />
          <polygon points="10,0 24,28 -4,28" fill="#7f925b" opacity="0.82" />
          <polygon points="10,11 22,34 -2,34" fill="#a8bc78" opacity="0.6" />
        </g>

        {/* Floating leaf 1 */}
        <g transform="translate(280,16)">
          <path d="M0,22 C0,22 -17,-4 0,-16 C17,-4 0,22 0,22 Z" fill="#7f925b" opacity="0.68" />
          <line x1="0" y1="-16" x2="0" y2="22" stroke="#5a6e3f" strokeWidth="1.2" opacity="0.45" />
        </g>

        {/* Recycling arrow cluster */}
        <g transform="translate(500,10) scale(0.9)">
          <path d="M14,4 L9,9 L11,9 C11,17 15.4,21.2 22,22 L22,20 C16.5,19.2 13,15 13,10 L15,10 Z" fill="#7f925b" opacity="0.72" />
          <path d="M24,2 L29,7 L27,7 C27,15 22.6,19.2 16,20 L16,18 C21.5,17.2 25,13 25,8 L23,8 Z" fill="#a8bc78" opacity="0.72" />
        </g>

        {/* Solar panel */}
        <g transform="translate(770,18)">
          <rect x="0" y="0" width="32" height="20" rx="3" fill="#7f925b" opacity="0.52" />
          <line x1="10.6" y1="0" x2="10.6" y2="20" stroke="#dce8c4" strokeWidth="1" opacity="0.7" />
          <line x1="21.3" y1="0" x2="21.3" y2="20" stroke="#dce8c4" strokeWidth="1" opacity="0.7" />
          <line x1="0" y1="6.6" x2="32" y2="6.6" stroke="#dce8c4" strokeWidth="1" opacity="0.7" />
          <line x1="0" y1="13.3" x2="32" y2="13.3" stroke="#dce8c4" strokeWidth="1" opacity="0.7" />
          <rect x="13" y="20" width="6" height="7" fill="#7f925b" opacity="0.5" />
        </g>

        {/* Small earth */}
        <g transform="translate(1030,8)">
          <circle cx="18" cy="19" r="19" fill="#5a8f61" opacity="0.48" />
          <path d="M7,14 C10,11 15,9 19,11 C23,13 25,17 23,22 C21,27 14,27 9,24 C4,21 4,17 7,14 Z" fill="#7fb874" opacity="0.55" />
          <path d="M20,5 C22.5,8 25,13 23,18" stroke="white" strokeWidth="1.5" fill="none" opacity="0.38" />
          <circle cx="18" cy="19" r="19" fill="none" stroke="#a8c8aa" strokeWidth="1.2" opacity="0.4" />
        </g>

        {/* Floating leaf 2 */}
        <g transform="translate(1240,28)">
          <path d="M0,18 C0,18 -12,-3 0,-12 C12,-3 0,18 0,18 Z" fill="#a8bc78" opacity="0.7" />
          <line x1="0" y1="-12" x2="0" y2="18" stroke="#5a6e3f" strokeWidth="1" opacity="0.4" />
        </g>

        {/* Tree right */}
        <g transform="translate(1340,30)">
          <rect x="5" y="24" width="7" height="12" rx="2" fill="#7f925b" opacity="0.65" />
          <polygon points="8.5,2 20,24 -3,24" fill="#a8bc78" opacity="0.72" />
          <polygon points="8.5,11 18,30 -1,30" fill="#7f925b" opacity="0.55" />
        </g>

        {/* Accent dots */}
        <circle cx="185" cy="50" r="3.5" fill="#a8bc78" opacity="0.48" />
        <circle cx="420" cy="58" r="2.5" fill="#7f925b" opacity="0.4" />
        <circle cx="650" cy="52" r="3" fill="#a8bc78" opacity="0.42" />
        <circle cx="920" cy="56" r="2.5" fill="#7f925b" opacity="0.38" />
        <circle cx="1160" cy="46" r="3" fill="#a8bc78" opacity="0.44" />
      </svg>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative">
      {/* <EcoDivider /> */}

      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(155deg, #dce8c4 0%, #e4eece 35%, #ede8d8 70%, #f3ead8 100%)',
        }}
      >
        {/* Subtle circular dot texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(127,146,91,0.10) 1.2px, transparent 1.2px)',
            backgroundSize: '26px 26px',
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            {/* Col 1 — Brand */}
            <div>
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#7f925b] shadow-[0_4px_14px_rgba(127,146,91,0.40)]">
                  <Leaf size={17} className="text-white" />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-[#3d4f28]">Becho</span>
              </div>
              <p className="mb-6 max-w-[210px] text-sm leading-relaxed text-[#5e6b48]">
                The circular economy marketplace connecting surplus materials with businesses that can reuse them.
              </p>
              <div className="flex gap-2.5">
                {socials.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#c0cd9c] bg-white/55 text-[#7f925b] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#7f925b] hover:text-white hover:shadow-[0_6px_16px_rgba(127,146,91,0.30)]"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Cols 2-4 — Link groups */}
            {Object.entries(navLinks).map(([section, items]) => (
              <div key={section}>
                <h4 className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#7f925b]">
                  {section}
                </h4>
                <ul className="flex flex-col gap-3">
                  {items.map((item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="group flex items-center gap-2 text-sm text-[#4f5e38] no-underline transition-colors duration-150 hover:text-[#3d4f28]"
                      >
                        <span className="h-1 w-1 rounded-full bg-[#a8bc78] opacity-0 transition-all group-hover:opacity-100" />
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#b8c898]/60 pt-7 sm:flex-row">
            <p className="text-xs text-[#7a8c5c]">
              © 2026 Becho. All rights reserved. Building a circular future.
            </p>
            <div className="flex items-center gap-2 rounded-full border border-[#c0cd9c] bg-white/55 px-3.5 py-1.5 text-xs text-[#7a8c5c] shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              All systems operational
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
