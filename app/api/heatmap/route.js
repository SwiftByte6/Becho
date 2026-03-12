import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// ── GET /api/heatmap ───────────────────────────────────────
// Returns coordinates + intensity for all waste listings
// Public route — no auth needed for map visibility
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category"); // optional filter

    let query = supabase
      .from("waste_listings")
      .select("latitude, longitude, quantity, category, material_name")
      .eq("status", "available")
      .not("latitude", "is", null)
      .not("longitude", "is", null);

    if (category) query = query.eq("category", category);

    const { data, error } = await query;
    if (error) throw error;

    // ── Calculate max quantity for normalization ────────────
    const maxQuantity =
      data.length > 0 ? Math.max(...data.map((d) => d.quantity), 1) : 1;

    // ── Format for Leaflet.heat ────────────────────────────
    // Leaflet.heat expects: [lat, lng, intensity]
    const heatPoints = data.map((listing) => ({
      lat: listing.latitude,
      lng: listing.longitude,
      intensity: Math.min(listing.quantity / maxQuantity, 1.0), // normalized
      category: listing.category,
      material: listing.material_name,
      quantity: listing.quantity,
    }));

    // ── Also return category breakdown for legend ──────────
    const categoryBreakdown = data.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.quantity;
      return acc;
    }, {});

    return NextResponse.json(
      {
        heat_points: heatPoints,
        total_listings: data.length,
        category_breakdown: categoryBreakdown,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
