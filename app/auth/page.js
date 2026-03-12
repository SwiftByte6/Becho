'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, Eye, EyeOff, Building2, Mail, Lock, MapPin, ChevronDown, ArrowRight, Recycle } from 'lucide-react';

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
    <div className="relative min-h-screen overflow-hidden bg-[#f7efe2] pt-8 lg:pt-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top_left,_rgba(202,179,122,0.17),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(127,146,91,0.16),_transparent_38%)]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-[#dccfb9] bg-[#f8f1e6] shadow-[0_24px_70px_rgba(95,79,64,0.14)] lg:min-h-[84vh] lg:flex-row">
      {/* Left: Illustration panel */}
      <div className="hidden lg:flex w-[44%] flex-col justify-between border-r border-[#d9ccb6] bg-[#efe4d4] p-12 relative overflow-hidden">
        {/* BG glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-16 w-72 h-72 rounded-full bg-[#e6bf49]/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-[#7f925b]/20 blur-3xl" />
        </div>

        {/* Logo */}
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-[#7f925b] flex items-center justify-center">
            <Leaf size={18} className="text-white" />
          </div>
          <span className="text-[#5f4f40] font-extrabold text-xl tracking-tight">Becho</span>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-[#f8edd6] border border-[#dccfb9] flex items-center justify-center mb-8">
            <Recycle size={40} className="text-[#7f925b]" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#5f4f40] leading-tight mb-4 tracking-tight">
            Join the Circular <br />Economy Revolution
          </h2>
          <p className="text-[#6f655a] text-base leading-relaxed">
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
              <div key={l} className="bg-[#f8f1e6] border border-[#dccfb9] rounded-xl p-3">
                <div className="text-[#7f925b] font-extrabold text-xl">{v}</div>
                <div className="text-[#7a7065] text-xs">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[#85796b] text-xs relative z-10">Only verified companies can host materials.</p>
      </div>

      {/* Right: Auth form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-10">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-[#7f925b] flex items-center justify-center">
              <Leaf size={15} className="text-white" />
            </div>
            <span className="font-extrabold text-lg text-[#5f4f40] tracking-tight">Becho</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#5f4f40] tracking-tight mb-1 leading-tight">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-[#6f655a] text-sm">
              {isLogin ? 'Sign in to your Becho dashboard' : 'Join the circular economy marketplace'}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex bg-[#efe4d4] rounded-xl p-1 mb-8 border border-[#dccfb9]">
            {['Sign Up', 'Login'].map((tab, i) => (
              <button
                key={tab}
                onClick={() => setIsLogin(i === 1)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer border-none ${(isLogin ? i === 1 : i === 0) ? 'bg-[#f8f1e6] text-[#33291f] shadow-sm' : 'bg-transparent text-[#7a7065] hover:text-[#5f4f40]'}`}
              >{tab}</button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-[#6f655a] mb-1.5">Company Name</label>
                <div className="relative">
                  <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a8f82]" />
                  <input
                    type="text"
                    required
                    placeholder="EcoTech Solutions Ltd."
                    className="w-full pl-10 pr-4 py-2.5 border border-[#dccfb9] rounded-xl text-sm bg-[#fcf8f1] text-[#4e4033] placeholder-[#a09486] outline-none focus:border-[#7f925b] focus:ring-2 focus:ring-[#d6e4c0] transition-all"
                  />
                </div>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-[#6f655a] mb-1.5">Industry Type</label>
                <div className="relative">
                  <select
                    required
                    className="w-full pl-4 pr-10 py-2.5 border border-[#dccfb9] rounded-xl text-sm bg-[#fcf8f1] text-[#4e4033] outline-none focus:border-[#7f925b] focus:ring-2 focus:ring-[#d6e4c0] transition-all appearance-none"
                  >
                    <option value="">Select your industry</option>
                    {industries.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9a8f82] pointer-events-none" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#6f655a] mb-1.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a8f82]" />
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-[#dccfb9] rounded-xl text-sm bg-[#fcf8f1] text-[#4e4033] placeholder-[#a09486] outline-none focus:border-[#7f925b] focus:ring-2 focus:ring-[#d6e4c0] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6f655a] mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a8f82]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Min 8 characters"
                  className="w-full pl-10 pr-10 py-2.5 border border-[#dccfb9] rounded-xl text-sm bg-[#fcf8f1] text-[#4e4033] placeholder-[#a09486] outline-none focus:border-[#7f925b] focus:ring-2 focus:ring-[#d6e4c0] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9a8f82] hover:text-[#5f4f40] bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-[#6f655a] mb-1.5">Location</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a8f82]" />
                  <input
                    type="text"
                    placeholder="City, State"
                    className="w-full pl-10 pr-4 py-2.5 border border-[#dccfb9] rounded-xl text-sm bg-[#fcf8f1] text-[#4e4033] placeholder-[#a09486] outline-none focus:border-[#7f925b] focus:ring-2 focus:ring-[#d6e4c0] transition-all"
                  />
                </div>
              </div>
            )}

            {!isLogin && (
              <p className="text-xs text-[#7f6f55] bg-[#f5ecd9] border border-[#ddccad] rounded-xl px-3 py-2.5">
                Only verified companies can host materials on the platform.
              </p>
            )}

            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#e6bf49] px-6 py-3 text-sm font-semibold text-[#2f261c] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ddb43f]"
            >
              {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={16} />
            </button>
          </form>

          <p className="text-center text-xs text-[#7a7065] mt-6">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setIsLogin(!isLogin)} className="text-[#7f925b] font-semibold bg-transparent border-none cursor-pointer hover:underline">
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
