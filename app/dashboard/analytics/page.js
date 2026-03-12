import AnalyticsSection from "@/components/dashboard/AnalyticsSection";
import ImpactHeatmap from "@/components/dashboard/ImpactHeatmap";

export const metadata = { title: "Impact Analytics | Becho" };

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Impact Analytics
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track your environmental impact and material reuse metrics over time
          </p>
        </div>
        <AnalyticsSection />
      </div>

      <ImpactHeatmap />
    </div>
  );
}
