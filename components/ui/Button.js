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
    primary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow-md',
    secondary: 'bg-green-50 text-green-700 hover:bg-green-100 focus:ring-green-400',
    outline: 'bg-transparent text-green-700 border-2 border-green-600 hover:bg-green-50 focus:ring-green-400',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-300',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 focus:ring-red-400',
    dark: 'bg-slate-800 text-white hover:bg-slate-900 shadow-sm focus:ring-slate-500',
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
