import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";

// ── POST /api/logistics ────────────────────────────────────
// Create logistics entry for an accepted transaction
export async function POST(req) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      transaction_id,
      pickup_location,
      delivery_location,
      transport_cost,
      scheduled_at,
      notes,
    } = body;

    // ── Validate required fields ───────────────────────────
    if (!transaction_id || !pickup_location || !delivery_location) {
      return NextResponse.json(
        {
          error:
            "transaction_id, pickup_location and delivery_location are required",
        },
        { status: 400 },
      );
    }

    // ── Fetch transaction ──────────────────────────────────
    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .select("id, buyer_id, seller_id, status")
      .eq("id", transaction_id)
      .single();

    if (txError || !transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    // ── Only buyer or seller can create logistics ──────────
    if (transaction.buyer_id !== user.id && transaction.seller_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ── Transaction must be accepted first ─────────────────
    if (transaction.status !== "accepted") {
      return NextResponse.json(
        { error: "Logistics can only be created for accepted transactions" },
        { status: 400 },
      );
    }

    // ── Check logistics doesn't already exist ──────────────
    const { data: existing } = await supabase
      .from("logistics")
      .select("id")
      .eq("transaction_id", transaction_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Logistics already exists for this transaction" },
        { status: 409 },
      );
    }

    // ── Create logistics ───────────────────────────────────
    const { data: logistics, error } = await supabase
      .from("logistics")
      .insert({
        transaction_id,
        pickup_location,
        delivery_location,
        transport_cost: transport_cost || 0,
        scheduled_at: scheduled_at || null,
        notes: notes || null,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        message: "Logistics created successfully",
        logistics,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
