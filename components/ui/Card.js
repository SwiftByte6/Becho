'use client';

export default function Card({ children, className = '', hover = false, padding = true, ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${padding ? 'p-6' : ''} ${hover ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
