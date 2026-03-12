"use client";

const variantClasses = {
  Active: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Matched: "bg-blue-100 text-blue-700",
  Unavailable: "bg-red-100 text-red-700",
  Success: "bg-green-100 text-green-700",
  Warning: "bg-yellow-100 text-yellow-700",
  Info: "bg-blue-100 text-blue-700",
  outline: "border border-slate-200 text-slate-600 bg-transparent",
  secondary: "bg-slate-100 text-slate-800",
};

const dotClasses = {
  Active: "bg-green-500",
  Pending: "bg-yellow-500",
  Matched: "bg-blue-500",
  Unavailable: "bg-red-500",
  Success: "bg-green-500",
  Warning: "bg-yellow-500",
  Info: "bg-blue-500",
};

export default function Badge({ label, children, variant, className = "" }) {
  const key = variant || label || "Info";
  const badgeClass =
    variantClasses[key] ||
    variantClasses[variant] ||
    "bg-slate-100 text-slate-600";
  const dotClass = dotClasses[key];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${badgeClass} ${className}`}
    >
      {dotClass && <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />}
      {children || label || variant}
    </span>
  );
}
