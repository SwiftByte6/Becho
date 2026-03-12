import { gemini } from "@/lib/gemini/client";
import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Simple in-memory cache
const cache = new Map();

export async function POST(req) {
  try {
    const { latitude, longitude, radius = 0.1 } = await req.json();

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: "latitude and longitude are required" },
        { status: 400 },
      );
    }

    // Round to 2 decimal places = same 5km zone for caching
    const cacheKey = `${latitude.toFixed(2)}_${longitude.toFixed(2)}`;
    if (cache.has(cacheKey)) {
      return NextResponse.json(cache.get(cacheKey));
    }

    // ── Fetch real listings near clicked point ─────────────
    const { data: nearbyListings, error } = await supabase
      .from("waste_listings")
      .select(
        `
        material_name,
        category,
        quantity,
        unit,
        price,
        location,
        users (
          company_name,
          industry_type
        )
      `,
      )
      .eq("status", "available")
      .gte("latitude", latitude - radius)
      .lte("latitude", latitude + radius)
      .gte("longitude", longitude - radius)
      .lte("longitude", longitude + radius);

    if (error) throw error;

    if (!nearbyListings || nearbyListings.length === 0) {
      const emptyResponse = {
        insight:
          "No waste listings found in this area. Try clicking a colored zone on the map.",
        listings: [],
        total_listings: 0,
        total_quantity: 0,
        categories: [],
      };
      return NextResponse.json(emptyResponse);
    }

    // ── Build context from real DB data ────────────────────
    const listingSummary = nearbyListings
      .map(
        (l) =>
          `- ${l.material_name} (${l.category}): 
         ${l.quantity} ${l.unit} at ₹${l.price} 
         by ${l.users?.company_name}`,
      )
      .join("\n");

    const totalQuantity = nearbyListings.reduce(
      (sum, l) => sum + l.quantity,
      0,
    );
    const categories = [...new Set(nearbyListings.map((l) => l.category))];

    // ── Send to Gemini ─────────────────────────────────────
    const prompt = `
You are a sustainability assistant for Becho, 
a circular economy platform in India.

A user clicked a hotspot on the waste heatmap.
Here are the actual waste listings in that area:

${listingSummary}

Total quantity: ${totalQuantity} units
Categories: ${categories.join(", ")}
Number of listings: ${nearbyListings.length}

Give a SHORT 2-3 sentence insight about:
1. What waste is concentrated here
2. Which type of industry could use or collect it
3. One actionable suggestion

Keep it concise, practical and India-focused.`;

    const result = await gemini.generateContent(prompt);
    const insight = result.response.text();

    const responseData = {
      insight,
      listings: nearbyListings,
      total_listings: nearbyListings.length,
      total_quantity: totalQuantity,
      categories,
    };

    // Cache for 10 minutes
    cache.set(cacheKey, responseData);
    setTimeout(() => cache.delete(cacheKey), 10 * 60 * 1000);

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    if (error.message?.includes("429") || error.status === 429) {
      return NextResponse.json(
        { error: "AI insight limit reached. Please wait 60 seconds." },
        { status: 429 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
