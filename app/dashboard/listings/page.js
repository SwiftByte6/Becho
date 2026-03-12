import WasteListings from '@/components/dashboard/WasteListings';

export const metadata = { title: 'My Waste Listings | Becho' };

export default function ListingsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Waste Listings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage all your uploaded surplus material listings</p>
      </div>
      <WasteListings />
    </div>
  );
}
