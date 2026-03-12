import MarketplaceClient from "@/components/dashboard/MarketplaceClient";
import { Suspense } from "react";

export const metadata = { title: "Material Marketplace | Becho" };

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div>Loading marketplace...</div>}>
      <MarketplaceClient />
    </Suspense>
  );
}
