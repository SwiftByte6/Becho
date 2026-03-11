import { marketplaceItems } from '@/data/mockData';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { MapPin, Tag, Calendar, ShoppingCart } from 'lucide-react';

export const metadata = { title: 'Material Marketplace | Becho' };

export default function MarketplacePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Material Marketplace</h1>
        <p className="text-slate-500 text-sm mt-1">Browse available surplus materials from verified companies</p>
      </div>

      {/* Search/Filter bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search materials..."
          className="flex-1 min-w-52 px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
        />
        <select className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-600 outline-none focus:border-green-500 transition-all">
          <option>All Categories</option>
          <option>Metals</option>
          <option>Plastics</option>
          <option>Wood</option>
          <option>Rubber</option>
          <option>Energy</option>
        </select>
        <Button variant="primary" size="md">Search</Button>
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {marketplaceItems.map(({ id, name, quantity, category, company, location, price, date }) => (
          <div key={id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-900">{name}</p>
                <p className="text-slate-400 text-xs mt-0.5">{company}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${price === 'Free' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                {price}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs">
                <Tag size={11} /> {category}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs">
                <MapPin size={11} /> {location}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs">
                <Calendar size={11} /> {date}
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-700">{quantity} available</p>

            <Button variant="primary" size="sm" fullWidth>
              <ShoppingCart size={13} /> Request Material
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
