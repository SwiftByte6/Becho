import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("impact_metrics")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    // Return zeros if no metrics yet — first time user
    if (error || !data) {
      return NextResponse.json(
        {
          impact: {
            waste_reused: 0,
            co2_saved: 0,
            transactions_count: 0,
            trees_equivalent: 0,
          },
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        impact: {
          waste_reused: data.waste_reused,
          co2_saved: data.co2_saved,
          transactions_count: data.transactions_count,
          trees_equivalent: Math.round(data.co2_saved / 21),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
