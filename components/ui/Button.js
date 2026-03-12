'use client';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  className = '', 
  type = 'button',
  disabled = false,
  fullWidth = false,
  ...props 
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95';

  const variants = {
    primary: 'bg-[#e6bf49] text-[#2f261c] hover:bg-[#ddb43f] focus:ring-[#d6b75b] shadow-sm hover:shadow-md',
    secondary: 'bg-[#edf4eb] text-[#5f6f43] hover:bg-[#e2eddf] focus:ring-[#c7d9be] border border-[#d4e1cf]',
    outline: 'bg-transparent text-[#6a7d4a] border-2 border-[#7f925b] hover:bg-[#edf4eb] focus:ring-[#c7d9be]',
    ghost: 'bg-transparent text-[#6f655a] hover:bg-[#efe4d4] focus:ring-[#dccfb9]',
    danger: 'bg-[#f7e9df] text-[#a85d3d] hover:bg-[#f2dece] border border-[#e5c4b1] focus:ring-[#e3bca2]',
    dark: 'bg-[#5f4f40] text-white hover:bg-[#4f4135] shadow-sm focus:ring-[#8b7967]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
