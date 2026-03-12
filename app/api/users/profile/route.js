import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth/getUser";

// ── GET /api/users/profile ─────────────────────────────────
export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("users")
      .select(
        "id, name, email, company_name, industry_type, location, created_at",
      )
      .eq("id", user.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ profile: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ── PUT /api/users/profile ─────────────────────────────────
export async function PUT(req) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, company_name, industry_type, location } = body;

    const updateData = {};
    if (name) updateData.name = name;
    if (company_name) updateData.company_name = company_name;
    if (industry_type) updateData.industry_type = industry_type;
    if (location) updateData.location = location;

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", user.id)
      .select("id, name, email, company_name, industry_type, location")
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        profile: data,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
