import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";

// ── GET /api/transactions ──────────────────────────────────
// Get all transactions for logged in user (as buyer OR seller)
export async function GET(req) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role"); // 'buyer' or 'seller'
    const status = searchParams.get("status"); // 'pending', 'accepted' etc

    let query = supabase
      .from("transactions")
      .select(
        `
        id,
        quantity,
        price,
        status,
        created_at,
        buyer_id,
        seller_id,
        listing_id,
        waste_listings (
          id,
          material_name,
          category,
          unit,
          image_url,
          location
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
      `,
      )
      .order("created_at", { ascending: false });

    // ── Filter by role ─────────────────────────────────────
    if (role === "buyer") {
      query = query.eq("buyer_id", user.id);
    } else if (role === "seller") {
      query = query.eq("seller_id", user.id);
    } else {
      // Default — show all transactions where user is buyer OR seller
      query = query.or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`);
    }

    // ── Filter by status ───────────────────────────────────
    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ transactions: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ── POST /api/transactions ─────────────────────────────────
// Buyer initiates a transaction on a listing
export async function POST(req) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { listing_id, quantity } = body;

    // ── Validate ───────────────────────────────────────────
    if (!listing_id || !quantity) {
      return NextResponse.json(
        { error: "listing_id and quantity are required" },
        { status: 400 },
      );
    }

    // ── Fetch listing ──────────────────────────────────────
    const { data: listing, error: listingError } = await supabase
      .from("waste_listings")
      .select("id, user_id, price, quantity, status, material_name")
      .eq("id", listing_id)
      .single();

    if (listingError || !listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // ── Checks ─────────────────────────────────────────────

    // Can't buy your own listing
    if (listing.user_id === user.id) {
      return NextResponse.json(
        { error: "You cannot buy your own listing" },
        { status: 400 },
      );
    }

    // Listing must be available
    if (listing.status !== "available") {
      return NextResponse.json(
        { error: "This listing is no longer available" },
        { status: 400 },
      );
    }

    // Requested quantity must not exceed listed quantity
    if (quantity > listing.quantity) {
      return NextResponse.json(
        { error: `Only ${listing.quantity} units available` },
        { status: 400 },
      );
    }

    // ── Calculate total price ──────────────────────────────
    const totalPrice = listing.price * quantity;

    // ── Create transaction ─────────────────────────────────
    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .insert({
        buyer_id: user.id,
        seller_id: listing.user_id,
        listing_id: listing.id,
        quantity,
        price: totalPrice,
        status: "pending",
      })
      .select()
      .single();

    if (txError) throw txError;

    // ── Mark listing as reserved ───────────────────────────
    await supabase
      .from("waste_listings")
      .update({ status: "reserved" })
      .eq("id", listing_id);

    return NextResponse.json(
      {
        message: "Transaction created successfully",
        transaction,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
