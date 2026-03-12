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

    const { data: recentListings } = await supabase
      .from("waste_listings")
      .select("id, material_name, quantity, unit, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3);

    const { data: recentTransactions } = await supabase
      .from("transactions")
      .select(
        `
        id,
        status,
        quantity,
        created_at,
        waste_listings ( material_name )
      `,
      )
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .limit(3);

    const recentActivity = [
      ...(recentListings || []).map((listing) => ({
        id: `listing-${listing.id}`,
        type: "upload",
        icon: "Upload",
        message: `${listing.material_name} (${listing.quantity} ${listing.unit}) uploaded`,
        time: listing.created_at,
      })),
      ...(recentTransactions || []).map((transaction) => ({
        id: `transaction-${transaction.id}`,
        type:
          transaction.status === "completed" ? "request" : "recommend",
        icon:
          transaction.status === "completed" ? "CheckCircle" : "Sparkles",
        message: `${transaction.waste_listings?.material_name || "Material"} transaction ${transaction.status}`,
        time: transaction.created_at,
      })),
    ]
      .sort((left, right) => new Date(right.time) - new Date(left.time))
      .slice(0, 5);

    return NextResponse.json(
      {
        stats: {
          listings: listingsCount || 0,
          active_deals: activeTransactions || 0,
          waste_diverted: impact?.waste_reused || 0,
          co2_saved: impact?.co2_saved || 0,
        },
        recent_activity: recentActivity,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
