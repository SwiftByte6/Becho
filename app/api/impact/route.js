import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("impact_metrics")
      .select("waste_reused, co2_saved");

    if (error) throw error;

    const totals = data.reduce(
      (acc, curr) => ({
        waste_reused: acc.waste_reused + (curr.waste_reused || 0),
        co2_saved: acc.co2_saved + (curr.co2_saved || 0),
      }),
      { waste_reused: 0, co2_saved: 0 },
    );

    return NextResponse.json(
      {
        totals: {
          ...totals,
          trees_equivalent: Math.round(totals.co2_saved / 21),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
