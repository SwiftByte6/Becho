import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";

// ── GET /api/listings ──────────────────────────────────────
// Public — anyone can browse listings
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const location = searchParams.get("location");
    const search = searchParams.get("search");
    const status = searchParams.get("status") || "available";

    let query = supabase
      .from("waste_listings")
      .select(
        `
        id,
        material_name,
        category,
        quantity,
        unit,
        price,
        location,
        image_url,
        description,
        status,
        created_at,
        user_id,
        users (
          id,
          name,
          company_name,
          industry_type
        )
      `,
      )
      .eq("status", status)
      .order("created_at", { ascending: false });

    // ── Optional filters ───────────────────────────────────
    if (category) query = query.eq("category", category);
    if (location) query = query.ilike("location", `%${location}%`);
    if (search) query = query.ilike("material_name", `%${search}%`);

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ listings: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ── POST /api/listings ─────────────────────────────────────
// Protected — only logged in users can post
export async function POST(req) {
  try {
    // ── Auth check ─────────────────────────────────────────
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const material_name = formData.get("material_name");
    const category = formData.get("category");
    const quantity = formData.get("quantity");
    const unit = formData.get("unit");
    const price = formData.get("price");
    const location = formData.get("location");
    const description = formData.get("description");
    const imageFile = formData.get("image"); // actual file

    // ── Validate required fields ───────────────────────────
    if (!material_name || !category || !quantity || !unit) {
      return NextResponse.json(
        { error: "material_name, category, quantity and unit are required" },
        { status: 400 },
      );
    }

    // ── Upload image to Supabase Storage ───────────────────
    let image_url = null;

    if (imageFile && imageFile.size > 0) {
      const fileBuffer = await imageFile.arrayBuffer();
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("listings")
        .upload(fileName, fileBuffer, {
          contentType: imageFile.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // ── Get public URL ─────────────────────────────────
      const { data: urlData } = supabase.storage
        .from("listings")
        .getPublicUrl(uploadData.path);

      image_url = urlData.publicUrl;
    }

    // ── Insert listing into DB ─────────────────────────────
    const { data: newListing, error } = await supabase
      .from("waste_listings")
      .insert({
        user_id: user.id,
        material_name,
        category,
        quantity: parseFloat(quantity),
        unit,
        price: price ? parseFloat(price) : 0,
        location,
        description,
        image_url,
        status: "available",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        message: "Listing created successfully",
        listing: newListing,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
