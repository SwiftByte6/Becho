'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { User, Building2, Mail, MapPin, Save } from 'lucide-react';

const industries = [
  'Manufacturing',
  'Automotive',
  'Construction',
  'Food & Beverage',
  'Packaging & Logistics',
  'Textiles',
  'Electronics',
  'Chemical Industry',
  'Other',
];

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    company_name: '',
    industry_type: '',
    location: '',
    created_at: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setError('');

        const response = await fetch('/api/users/profile', {
          credentials: 'include',
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Unable to load profile.');
        }

        setProfile({
          name: data.profile.name || '',
          email: data.profile.email || '',
          company_name: data.profile.company_name || '',
          industry_type: data.profile.industry_type || '',
          location: data.profile.location || '',
          created_at: data.profile.created_at || '',
        });
      } catch (loadError) {
        setError(loadError.message || 'Unable to load profile.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (field) => (e) => {
    setSaved(false);
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      setError('');
      setSaved(false);

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: profile.name,
          company_name: profile.company_name,
          industry_type: profile.industry_type,
          location: profile.location,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to save profile.');
      }

      setProfile((prev) => ({
        ...prev,
        name: data.profile.name || prev.name,
        company_name: data.profile.company_name || prev.company_name,
        industry_type: data.profile.industry_type || prev.industry_type,
        location: data.profile.location || prev.location,
      }));
      setSaved(true);
    } catch (saveError) {
      setError(saveError.message || 'Unable to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const initials = (profile.company_name || profile.name || 'BE')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : 'Unavailable';

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
            {initials || 'BE'}
          </div>
          <div>
            <p className="font-bold text-[#4e4033]">{profile.company_name || 'Company not set'}</p>
            <p className="text-[#9a8f82] text-xs mt-0.5">{profile.industry_type || 'Industry not set'}</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#edf4eb] text-[#5f6f43] text-xs font-semibold border border-[#d4e1cf]">
            Registered Account
          </span>
          <div className="w-full pt-2 border-t border-[#ece1cf]">
            {[
              { label: 'Member Since', value: memberSince },
              { label: 'Email', value: profile.email || 'Unavailable' },
              { label: 'Location', value: profile.location || 'Not set' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2">
                <span className="text-xs text-[#7a7065]">{label}</span>
                <span className="text-xs font-semibold text-[#4e4033] max-w-[140px] truncate">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="bg-[#fcf8f1] rounded-2xl border border-[#dccfb9] shadow-[0_10px_30px_rgba(95,79,64,0.08)] p-6">
          <h2 className="text-base font-bold text-[#5f4f40] mb-5">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#6f655a] mb-1.5">Company Name</label>
              <div className="relative">
                <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a8f82]" />
                <input
                  type="text"
                  value={profile.company_name}
                  onChange={handleChange('company_name')}
                  placeholder="EcoTech Solutions"
                  disabled={isLoading || isSaving}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#dccfb9] rounded-xl text-sm bg-[#fffdf9] text-[#4e4033] placeholder-[#a09486] outline-none focus:border-[#7f925b] focus:ring-2 focus:ring-[#d6e4c0] transition-all disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6f655a] mb-1.5">Contact Name</label>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a8f82]" />
                <input
                  type="text"
                  value={profile.name}
                  onChange={handleChange('name')}
                  placeholder="John Doe"
                  disabled={isLoading || isSaving}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#dccfb9] rounded-xl text-sm bg-[#fffdf9] text-[#4e4033] placeholder-[#a09486] outline-none focus:border-[#7f925b] focus:ring-2 focus:ring-[#d6e4c0] transition-all disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6f655a] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a8f82]" />
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  className="w-full pl-10 pr-4 py-2.5 border border-[#dccfb9] rounded-xl text-sm bg-[#f6f0e6] text-[#7a7065] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6f655a] mb-1.5">Industry Type</label>
              <div className="relative">
                <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a8f82]" />
                <select
                  value={profile.industry_type}
                  onChange={handleChange('industry_type')}
                  disabled={isLoading || isSaving}
                  className="w-full appearance-none pl-10 pr-4 py-2.5 border border-[#dccfb9] rounded-xl text-sm bg-[#fffdf9] text-[#4e4033] outline-none focus:border-[#7f925b] focus:ring-2 focus:ring-[#d6e4c0] transition-all disabled:opacity-60"
                >
                  <option value="">Select your industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#6f655a] mb-1.5">Location</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a8f82]" />
                <input
                  type="text"
                  value={profile.location}
                  onChange={handleChange('location')}
                  placeholder="City, State"
                  disabled={isLoading || isSaving}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#dccfb9] rounded-xl text-sm bg-[#fffdf9] text-[#4e4033] placeholder-[#a09486] outline-none focus:border-[#7f925b] focus:ring-2 focus:ring-[#d6e4c0] transition-all disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-[#dccfb9] bg-[#f6f0e6] px-4 py-3 text-sm text-[#7a7065]">
            This profile is connected to the current Supabase schema. Editable fields are company name, contact name, industry type, and location.
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-[#e5c4b1] bg-[#f7e9df] px-4 py-3 text-sm text-[#a85d3d]">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 mt-5">
            <Button type="submit" variant="primary" size="md" disabled={isLoading || isSaving}>
              <Save size={14} /> {isSaving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
            </Button>
            {isLoading && <span className="text-[#7a7065] text-xs font-semibold">Loading profile...</span>}
            {saved && !isSaving && <span className="text-[#6f8250] text-xs font-semibold">Profile updated successfully</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
