'use client';

export default function Card({ children, className = '', hover = false, padding = true, ...props }) {
  return (
    <div
      className={`bg-[#fcf8f1] rounded-2xl border border-[#dccfb9] shadow-[0_10px_30px_rgba(95,79,64,0.08)] ${padding ? 'p-6' : ''} ${hover ? 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(95,79,64,0.12)]' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
