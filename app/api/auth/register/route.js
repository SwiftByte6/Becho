import { supabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, company_name, industry_type, location } =
      body;

    // ── Validate required fields ───────────────────────────
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 },
      );
    }

    // ── Check if email already exists ─────────────────────
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    // ── Hash password ──────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 10);

    // ── Insert new user ────────────────────────────────────
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        name,
        email,
        password: hashedPassword,
        company_name,
        industry_type,
        location,
      })
      .select(
        "id, name, email, company_name, industry_type, location, created_at",
      )
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: newUser,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
