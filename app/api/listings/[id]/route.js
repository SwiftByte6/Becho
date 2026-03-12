import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";

// ── GET /api/listings/:id ──────────────────────────────────
export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("waste_listings")
      .select(
        `
        *,
        users (
          id,
          name,
          company_name,
          industry_type,
          location
        )
      `,
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json({ listing: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ── PUT /api/listings/:id ──────────────────────────────────
export async function PUT(req, { params }) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // ── Check listing exists and belongs to user ───────────
    const { data: existing, error: fetchError } = await supabase
      .from("waste_listings")
      .select("id, user_id, image_url")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (existing.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();

    const material_name = formData.get("material_name");
    const category = formData.get("category");
    const quantity = formData.get("quantity");
    const unit = formData.get("unit");
    const price = formData.get("price");
    const location = formData.get("location");
    const description = formData.get("description");
    const status = formData.get("status");
    const imageFile = formData.get("image");

    // ── Handle new image upload ────────────────────────────
    let image_url = existing.image_url;

    if (imageFile && imageFile.size > 0) {
      // Delete old image if exists
      if (existing.image_url) {
        const oldPath = existing.image_url.split("/listings/")[1];
        await supabase.storage.from("listings").remove([oldPath]);
      }

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

      const { data: urlData } = supabase.storage
        .from("listings")
        .getPublicUrl(uploadData.path);

      image_url = urlData.publicUrl;
    }

    // ── Update listing ─────────────────────────────────────
    const updateData = {};
    if (material_name) updateData.material_name = material_name;
    if (category) updateData.category = category;
    if (quantity) updateData.quantity = parseFloat(quantity);
    if (unit) updateData.unit = unit;
    if (price) updateData.price = parseFloat(price);
    if (location) updateData.location = location;
    if (description) updateData.description = description;
    if (status) updateData.status = status;
    if (image_url) updateData.image_url = image_url;

    const { data: updated, error } = await supabase
      .from("waste_listings")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        message: "Listing updated successfully",
        listing: updated,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ── DELETE /api/listings/:id ───────────────────────────────
export async function DELETE(req, { params }) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // ── Check ownership ────────────────────────────────────
    const { data: existing, error: fetchError } = await supabase
      .from("waste_listings")
      .select("id, user_id, image_url")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (existing.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ── Delete image from storage ──────────────────────────
    if (existing.image_url) {
      const oldPath = existing.image_url.split("/listings/")[1];
      await supabase.storage.from("listings").remove([oldPath]);
    }

    // ── Delete listing ─────────────────────────────────────
    const { error } = await supabase
      .from("waste_listings")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json(
      {
        message: "Listing deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
