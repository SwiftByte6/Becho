import RecommendedMaterials from '@/components/dashboard/RecommendedMaterials';

export const metadata = { title: 'AI Recommendations | Becho' };

export default function RecommendationsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#5f4f40] tracking-tight">AI Recommendations</h1>
        <p className="text-[#7a7065] text-sm mt-1">Intelligent matches between your materials and businesses that can reuse them</p>
      </div>
      <RecommendedMaterials />
    </div>
  );
}
