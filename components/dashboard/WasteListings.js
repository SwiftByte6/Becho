'use client';

import { useState } from 'react';
import { wasteListings } from '@/data/mockData';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Pencil, Trash2, Sparkles, Plus, Calendar, Tag, Package } from 'lucide-react';

export default function WasteListings({ limit }) {
  const [listings, setListings] = useState(wasteListings);
  const displayed = limit ? listings.slice(0, limit) : listings;

  const handleDelete = (id) => setListings(prev => prev.filter(l => l.id !== id));

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-slate-900">Your Waste Listings</h2>
        <Button variant="primary" size="sm" className="gap-1.5">
          <Plus size={14} /> Add Listing
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {displayed.map(({ id, name, quantity, category, status, date, description }) => (
          <div key={id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                  <Package size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm leading-none">{name}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{quantity}</p>
                </div>
              </div>
              <Badge label={status} variant={status} />
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs">
                <Tag size={11} /> {category}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs">
                <Calendar size={11} /> {date}
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed border-t border-slate-50 pt-2">{description}</p>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button variant="ghost" size="sm" className="flex-1 text-slate-500">
                <Pencil size={13} /> Edit
              </Button>
              <Button variant="danger" size="sm" className="flex-1" onClick={() => handleDelete(id)}>
                <Trash2 size={13} /> Delete
              </Button>
              <Button variant="secondary" size="sm" className="flex-1 text-green-700">
                <Sparkles size={13} /> AI Match
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
