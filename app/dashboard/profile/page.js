'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { User, Building2, Mail, MapPin, Phone, Globe, Save } from 'lucide-react';

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#5f4f40] tracking-tight">Company Profile</h1>
        <p className="text-[#7a7065] text-sm mt-1">Manage your company information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Profile card */}
        <div className="bg-[#fcf8f1] rounded-2xl border border-[#dccfb9] shadow-[0_10px_30px_rgba(95,79,64,0.08)] p-6 flex flex-col items-center text-center gap-4 h-fit">
          <div className="w-20 h-20 rounded-2xl bg-[#7f925b] flex items-center justify-center text-white font-extrabold text-2xl shadow-lg">
            ET
          </div>
          <div>
            <p className="font-bold text-[#4e4033]">EcoTech Solutions</p>
            <p className="text-[#9a8f82] text-xs mt-0.5">Manufacturing</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#edf4eb] text-[#5f6f43] text-xs font-semibold border border-[#d4e1cf]">
            ✓ Verified Company
          </span>
          <div className="w-full pt-2 border-t border-[#ece1cf]">
            {[
              { label: 'Member Since', value: 'Jan 2026' },
              { label: 'Listings', value: '6' },
              { label: 'CO₂ Saved', value: '4.2 tons' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2">
                <span className="text-xs text-[#7a7065]">{label}</span>
                <span className="text-xs font-semibold text-[#4e4033]">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="bg-[#fcf8f1] rounded-2xl border border-[#dccfb9] shadow-[0_10px_30px_rgba(95,79,64,0.08)] p-6">
          <h2 className="text-base font-bold text-[#5f4f40] mb-5">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Company Name', icon: Building2, placeholder: 'EcoTech Solutions', type: 'text' },
              { label: 'Contact Name', icon: User, placeholder: 'John Doe', type: 'text' },
              { label: 'Email Address', icon: Mail, placeholder: 'contact@ecotech.com', type: 'email' },
              { label: 'Phone Number', icon: Phone, placeholder: '+91 98765 43210', type: 'tel' },
              { label: 'Location', icon: MapPin, placeholder: 'Mumbai, Maharashtra', type: 'text' },
              { label: 'Website', icon: Globe, placeholder: 'https://ecotech.com', type: 'url' },
            ].map(({ label, icon: Icon, placeholder, type }) => (
              <div key={label}>
                <label className="block text-xs font-semibold text-[#6f655a] mb-1.5">{label}</label>
                <div className="relative">
                  <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a8f82]" />
                  <input
                    type={type}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#dccfb9] rounded-xl text-sm bg-[#fffdf9] text-[#4e4033] placeholder-[#a09486] outline-none focus:border-[#7f925b] focus:ring-2 focus:ring-[#d6e4c0] transition-all"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-[#6f655a] mb-1.5">About Your Company</label>
            <textarea
              rows={3}
              placeholder="Describe your company and the types of materials you typically generate..."
              className="w-full px-4 py-3 border border-[#dccfb9] rounded-xl text-sm bg-[#fffdf9] text-[#4e4033] placeholder-[#a09486] outline-none focus:border-[#7f925b] focus:ring-2 focus:ring-[#d6e4c0] transition-all resize-none"
            />
          </div>

          <div className="flex items-center gap-3 mt-5">
            <Button type="submit" variant="primary" size="md">
              <Save size={14} /> {saved ? 'Saved!' : 'Save Changes'}
            </Button>
            {saved && <span className="text-[#6f8250] text-xs font-semibold">✓ Profile updated successfully</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
