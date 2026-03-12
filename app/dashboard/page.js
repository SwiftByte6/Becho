import OverviewCards from '@/components/dashboard/OverviewCards';
import WasteListings from '@/components/dashboard/WasteListings';
import RecommendedMaterials from '@/components/dashboard/RecommendedMaterials';
import QuickActions from '@/components/dashboard/QuickActions';

export const metadata = { title: 'Dashboard Overview | Becho' };

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-7">
      {/* Overview cards */}
      <OverviewCards />

      {/* Main grid: content + sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6">
        <div className="flex flex-col gap-6">
          {/* Recent Listings */}
          <WasteListings limit={3} />
          {/* Recent Recommendations */}
          <RecommendedMaterials limit={3} />
        </div>
        {/* Quick Actions panel */}
        <QuickActions />
      </div>
    </div>
  );
}
