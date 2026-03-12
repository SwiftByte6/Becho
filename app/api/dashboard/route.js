import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch user's listings count
    const { count: listingsCount } = await supabase
      .from("waste_listings")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    // 2. Fetch active transactions (pending or accepted)
    const { count: activeTransactions } = await supabase
      .from("transactions")
      .select("*", { count: "exact", head: true })
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .in("status", ["pending", "accepted"]);

    // 3. Fetch impact metrics
    const { data: impact } = await supabase
      .from("impact_metrics")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    return NextResponse.json(
      {
        stats: {
          listings: listingsCount || 0,
          active_deals: activeTransactions || 0,
          waste_diverted: impact?.waste_reused || 0,
          co2_saved: impact?.co2_saved || 0,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
