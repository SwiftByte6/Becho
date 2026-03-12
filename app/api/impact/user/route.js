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

    const { data: listings, error: listingsError } = await supabase
      .from("waste_listings")
      .select("category, quantity, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (listingsError) throw listingsError;

    const { data: completedTransactions, error: transactionsError } = await supabase
      .from("transactions")
      .select("quantity, created_at")
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .eq("status", "completed")
      .order("created_at", { ascending: true });

    if (transactionsError) throw transactionsError;

    const monthKeys = Array.from({ length: 6 }, (_, index) => {
      const current = new Date();
      current.setMonth(current.getMonth() - (5 - index));
      const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`;
      return {
        key,
        month: current.toLocaleDateString("en-US", { month: "short" }),
      };
    });

    const listedByMonth = Object.fromEntries(
      monthKeys.map(({ key }) => [key, 0]),
    );
    const reusedByMonth = Object.fromEntries(
      monthKeys.map(({ key }) => [key, 0]),
    );

    for (const listing of listings || []) {
      const date = new Date(listing.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (key in listedByMonth) {
        listedByMonth[key] += Number(listing.quantity || 0);
      }
    }

    for (const transaction of completedTransactions || []) {
      const date = new Date(transaction.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (key in reusedByMonth) {
        reusedByMonth[key] += Number(transaction.quantity || 0);
      }
    }

    const wasteByCategoryMap = new Map();
    for (const listing of listings || []) {
      const current = wasteByCategoryMap.get(listing.category) || 0;
      wasteByCategoryMap.set(
        listing.category,
        current + Number(listing.quantity || 0),
      );
    }

    const palette = ["#7f925b", "#a8b985", "#d97c52", "#e6bf49", "#8f80b5", "#6f8896"];
    const wasteByCategory = Array.from(wasteByCategoryMap.entries()).map(
      ([name, value], index) => ({
        name,
        value,
        fill: palette[index % palette.length],
      }),
    );

    const reuseOverTime = monthKeys.map(({ key, month }) => ({
      month,
      listed: listedByMonth[key],
      reused: reusedByMonth[key],
    }));

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
          analytics: {
            wasteByCategory,
            reuseOverTime,
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
          analytics: {
            wasteByCategory,
            reuseOverTime,
          },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
