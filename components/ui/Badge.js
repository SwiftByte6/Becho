'use client';

const variantClasses = {
  Active:      'bg-[#edf4eb] text-[#5f6f43] border border-[#d4e1cf]',
  Pending:     'bg-[#f8f0dc] text-[#8f6d28] border border-[#ead9af]',
  Matched:     'bg-[#ece9f6] text-[#64568a] border border-[#d8d0e9]',
  Unavailable: 'bg-[#f7e9df] text-[#a85d3d] border border-[#e5c4b1]',
  Success:     'bg-[#edf4eb] text-[#5f6f43] border border-[#d4e1cf]',
  Warning:     'bg-[#f8f0dc] text-[#8f6d28] border border-[#ead9af]',
  Info:        'bg-[#e9f0f4] text-[#4f6b7a] border border-[#d2dee6]',
};

const dotClasses = {
  Active:      'bg-[#7f925b]',
  Pending:     'bg-[#d1a23e]',
  Matched:     'bg-[#8f80b5]',
  Unavailable: 'bg-[#cf7d59]',
  Success:     'bg-[#7f925b]',
  Warning:     'bg-[#d1a23e]',
  Info:        'bg-[#6f8896]',
};

export default function Badge({ label, variant, className = '' }) {
  const key = variant || label || 'Info';
  const badgeClass = variantClasses[key] || 'bg-[#efe4d4] text-[#6f655a] border border-[#dccfb9]';
  const dotClass = dotClasses[key] || 'bg-[#9b8d7f]';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${badgeClass} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      {label || variant}
    </span>
  );
}
