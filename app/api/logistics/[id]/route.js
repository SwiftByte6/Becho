import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";

// ── GET /api/logistics/:id ─────────────────────────────────
export async function GET(req, { params }) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { data, error } = await supabase
      .from("logistics")
      .select(
        `
        *,
        transactions (
          id,
          status,
          quantity,
          price,
          buyer_id,
          seller_id,
          waste_listings (
            id,
            material_name,
            category,
            image_url
          ),
          buyer:users!transactions_buyer_id_fkey (
            id,
            name,
            company_name
          ),
          seller:users!transactions_seller_id_fkey (
            id,
            name,
            company_name
          )
        )
      `,
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Logistics not found" },
        { status: 404 },
      );
    }

    // ── Only buyer or seller can view ──────────────────────
    const tx = data.transactions;
    if (tx.buyer_id !== user.id && tx.seller_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ logistics: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ── PUT /api/logistics/:id ─────────────────────────────────
// Update pickup schedule, status, notes
export async function PUT(req, { params }) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const {
      pickup_location,
      delivery_location,
      transport_cost,
      scheduled_at,
      notes,
      status,
    } = body;

    // ── Fetch logistics with transaction ───────────────────
    const { data: logistics, error: fetchError } = await supabase
      .from("logistics")
      .select(
        `
        *,
        transactions (
          buyer_id,
          seller_id
        )
      `,
      )
      .eq("id", id)
      .single();

    if (fetchError || !logistics) {
      return NextResponse.json(
        { error: "Logistics not found" },
        { status: 404 },
      );
    }

    // ── Only buyer or seller can update ────────────────────
    const tx = logistics.transactions;
    if (tx.buyer_id !== user.id && tx.seller_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ── Validate status if provided ────────────────────────
    const validStatuses = ["pending", "scheduled", "in_transit", "delivered"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Status must be pending, scheduled, in_transit or delivered" },
        { status: 400 },
      );
    }

    // ── Build update object ────────────────────────────────
    const updateData = {};
    if (pickup_location) updateData.pickup_location = pickup_location;
    if (delivery_location) updateData.delivery_location = delivery_location;
    if (transport_cost) updateData.transport_cost = transport_cost;
    if (scheduled_at) updateData.scheduled_at = scheduled_at;
    if (notes) updateData.notes = notes;
    if (status) updateData.status = status;

    // ── Update ─────────────────────────────────────────────
    const { data: updated, error } = await supabase
      .from("logistics")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        message: "Logistics updated successfully",
        logistics: updated,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
