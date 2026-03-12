"use client";

import dynamic from "next/dynamic";

const WasteHeatmap = dynamic(() => import("@/components/WasteHeatmap"), {
  ssr: false,
});

export default function ImpactHeatmap() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <WasteHeatmap />
    </div>
  );
}
