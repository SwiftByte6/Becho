import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";

// ── GET /api/transactions/:id ──────────────────────────────
export async function GET(req, { params }) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
        *,
        waste_listings (
          id,
          material_name,
          category,
          quantity,
          unit,
          image_url,
          location,
          description
        ),
        buyer:users!transactions_buyer_id_fkey (
          id,
          name,
          company_name,
          location
        ),
        seller:users!transactions_seller_id_fkey (
          id,
          name,
          company_name,
          location
        ),
        logistics (
          id,
          pickup_location,
          delivery_location,
          transport_cost,
          status,
          scheduled_at,
          notes
        )
      `,
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    // ── Only buyer or seller can view ──────────────────────
    if (data.buyer_id !== user.id && data.seller_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ transaction: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ── PUT /api/transactions/:id ──────────────────────────────
// Update transaction status
export async function PUT(req, { params }) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    // ── Validate status value ──────────────────────────────
    const validStatuses = ["accepted", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Status must be accepted, completed or cancelled" },
        { status: 400 },
      );
    }

    // ── Fetch transaction ──────────────────────────────────
    const { data: transaction, error: fetchError } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    // ── Role based permission checks ───────────────────────

    // Only seller can accept or cancel
    if (status === "accepted" && transaction.seller_id !== user.id) {
      return NextResponse.json(
        { error: "Only seller can accept a transaction" },
        { status: 403 },
      );
    }

    // Only buyer can mark completed
    if (status === "completed" && transaction.buyer_id !== user.id) {
      return NextResponse.json(
        { error: "Only buyer can mark transaction as completed" },
        { status: 403 },
      );
    }

    // Both buyer and seller can cancel
    if (
      status === "cancelled" &&
      transaction.buyer_id !== user.id &&
      transaction.seller_id !== user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ── Update transaction status ──────────────────────────
    const { data: updated, error: updateError } = await supabase
      .from("transactions")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    // ── Update listing status based on transaction status ──
    if (status === "completed") {
      // Mark listing as sold
      await supabase
        .from("waste_listings")
        .update({ status: "sold" })
        .eq("id", transaction.listing_id);

      // ── Update impact metrics ──────────────────────────
      await updateImpactMetrics(transaction);
    }

    if (status === "cancelled") {
      // Put listing back to available
      await supabase
        .from("waste_listings")
        .update({ status: "available" })
        .eq("id", transaction.listing_id);
    }

    return NextResponse.json(
      {
        message: `Transaction ${status} successfully`,
        transaction: updated,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ── Helper: Update impact metrics on completion ────────────
async function updateImpactMetrics(transaction) {
  // Fetch listing to get quantity and material
  const { data: listing } = await supabase
    .from("waste_listings")
    .select("quantity, category")
    .eq("id", transaction.listing_id)
    .single();

  if (!listing) return;

  const wasteReused = transaction.quantity;
  // Simple co2 estimate: 1kg of waste reused = 2.5kg co2 saved
  const co2Saved = transaction.quantity * 2.5;

  // ── Update seller metrics ──────────────────────────────
  const { data: sellerMetrics } = await supabase
    .from("impact_metrics")
    .select("*")
    .eq("user_id", transaction.seller_id)
    .single();

  if (sellerMetrics) {
    await supabase
      .from("impact_metrics")
      .update({
        waste_reused: sellerMetrics.waste_reused + wasteReused,
        co2_saved: sellerMetrics.co2_saved + co2Saved,
        transactions_count: sellerMetrics.transactions_count + 1,
      })
      .eq("user_id", transaction.seller_id);
  } else {
    await supabase.from("impact_metrics").insert({
      user_id: transaction.seller_id,
      waste_reused: wasteReused,
      co2_saved: co2Saved,
      transactions_count: 1,
    });
  }

  // ── Update buyer metrics ───────────────────────────────
  const { data: buyerMetrics } = await supabase
    .from("impact_metrics")
    .select("*")
    .eq("user_id", transaction.buyer_id)
    .single();

  if (buyerMetrics) {
    await supabase
      .from("impact_metrics")
      .update({
        waste_reused: buyerMetrics.waste_reused + wasteReused,
        co2_saved: buyerMetrics.co2_saved + co2Saved,
        transactions_count: buyerMetrics.transactions_count + 1,
      })
      .eq("user_id", transaction.buyer_id);
  } else {
    await supabase.from("impact_metrics").insert({
      user_id: transaction.buyer_id,
      waste_reused: wasteReused,
      co2_saved: co2Saved,
      transactions_count: 1,
    });
  }
}
