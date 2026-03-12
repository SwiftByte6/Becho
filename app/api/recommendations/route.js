import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function parseIndustries(raw) {
  return String(raw || "")
    .split(/[,\n;|]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: listings, error: listingsError } = await supabase
      .from("waste_listings")
      .select("id, material_name, category, quantity, unit, price, location, users(company_name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(8);

    if (listingsError) throw listingsError;

    const { data: mappings, error: mappingsError } = await supabase
      .from("waste_mapping")
      .select("waste_type, recommended_industries");

    if (mappingsError) throw mappingsError;

    const recommendations = (listings || [])
      .flatMap((listing, listingIndex) => {
        const category = normalize(listing.category);
        const materialName = normalize(listing.material_name);

        const matchedMapping = (mappings || []).find((mapping) => {
          const wasteType = normalize(mapping.waste_type);
          return (
            wasteType === category ||
            wasteType === materialName ||
            category.includes(wasteType) ||
            materialName.includes(wasteType) ||
            wasteType.includes(category)
          );
        });

        const industries = parseIndustries(
          matchedMapping?.recommended_industries,
        );

        const candidates = industries.length
          ? industries
          : ["Circular Manufacturing", "Material Recovery", "Industrial Reuse"];

        return candidates.slice(0, 3).map((industry, industryIndex) => {
          const score = Math.max(72, 95 - listingIndex * 4 - industryIndex * 3);
          const co2Saved = Math.max(1, Math.round(Number(listing.quantity || 0) * 2.5));

          return {
            id: `${listing.id}-${industryIndex}`,
            material: listing.material_name,
            industry,
            score,
            benefit: `${listing.quantity} ${listing.unit} of ${listing.category.toLowerCase()} can be redirected into ${industry.toLowerCase()} reuse streams.`,
            co2: `${co2Saved} kg CO2 potential`,
            company:
              listing.users?.company_name || "Based on your active listing",
          };
        });
      })
      .slice(0, 6);

    return NextResponse.json({ recommendations }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}