'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Leaf, Eye, EyeOff, Building2, Mail, Lock, MapPin, ChevronDown, ArrowRight, Recycle } from 'lucide-react';
import Button from '@/components/ui/Button';

const industries = [
  'Manufacturing', 'Automotive', 'Construction', 'Food & Beverage',
  'Packaging & Logistics', 'Textiles', 'Electronics', 'Chemical Industry', 'Other',
];

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left: Illustration panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-green-950 via-green-900 to-green-800 p-12 relative overflow-hidden">
        {/* BG glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-green-400/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>

        {/* Logo */}
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <Leaf size={18} className="text-white" />
          </div>
          <span className="text-white font-extrabold text-xl tracking-tight">Becho</span>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-green-400/20 border border-green-400/30 flex items-center justify-center mb-8">
            <Recycle size={40} className="text-green-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white leading-tight mb-4 tracking-tight">
            Join the Circular <br />Economy Revolution
          </h2>
          <p className="text-white/60 text-base leading-relaxed">
            Connect your surplus materials with businesses that can reuse them. Reduce waste, lower costs, and build a sustainable future together.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-10">
            {[
              { v: '142+', l: 'Companies' },
              { v: '12.4t', l: 'Waste Diverted' },
              { v: '94%', l: 'Match Rate' },
              { v: '28.6t', l: 'CO₂ Saved' },
            ].map(({ v, l }) => (
              <div key={l} className="bg-white/8 border border-white/10 rounded-xl p-3">
                <div className="text-green-400 font-extrabold text-xl">{v}</div>
                <div className="text-white/50 text-xs">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/30 text-xs relative z-10">Only verified companies can host materials.</p>
      </div>

      {/* Right: Auth form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Leaf size={15} className="text-white" />
            </div>
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">Becho</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-slate-500 text-sm">
              {isLogin ? 'Sign in to your Becho dashboard' : 'Join the circular economy marketplace'}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-8">
            {['Sign Up', 'Login'].map((tab, i) => (
              <button
                key={tab}
                onClick={() => setIsLogin(i === 1)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer border-none ${(isLogin ? i === 1 : i === 0) ? 'bg-white text-green-700 shadow-sm' : 'bg-transparent text-slate-500 hover:text-slate-700'}`}
              >{tab}</button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Company Name</label>
                <div className="relative">
                  <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="EcoTech Solutions Ltd."
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-800 placeholder-slate-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                  />
                </div>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Industry Type</label>
                <div className="relative">
                  <select
                    required
                    className="w-full pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all appearance-none"
                  >
                    <option value="">Select your industry</option>
                    {industries.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-800 placeholder-slate-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Min 8 characters"
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-800 placeholder-slate-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Location</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="City, State"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-800 placeholder-slate-400 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                  />
                </div>
              </div>
            )}

            {!isLogin && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                ⚠️ Only verified companies can host materials on the platform.
              </p>
            )}

            <Button type="submit" variant="primary" fullWidth size="lg" className="mt-2">
              {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={16} />
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setIsLogin(!isLogin)} className="text-green-600 font-semibold bg-transparent border-none cursor-pointer hover:underline">
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
