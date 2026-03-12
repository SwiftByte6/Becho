import { geminiChat } from "@/lib/gemini/chat-client";
import { supabase } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/getUser";
import { NextResponse } from "next/server";

// ── POST /api/ai/chat ──────────────────────────────────────
export async function POST(req) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, history = [] } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // ══════════════════════════════════════════════════════
    // CONTEXT LAYER 1 — User Profile + Impact
    // ══════════════════════════════════════════════════════
    const { data: userProfile } = await supabase
      .from("users")
      .select("name, company_name, industry_type, location")
      .eq("id", user.id)
      .single();

    const { data: userImpact } = await supabase
      .from("impact_metrics")
      .select("waste_reused, co2_saved, transactions_count")
      .eq("user_id", user.id)
      .single();

    // ══════════════════════════════════════════════════════
    // CONTEXT LAYER 2 — User's Own Listings
    // ══════════════════════════════════════════════════════
    const { data: myListings } = await supabase
      .from("waste_listings")
      .select(
        "material_name, category, quantity, unit, price, status, location, created_at",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    // ══════════════════════════════════════════════════════
    // CONTEXT LAYER 3 — User's Transactions
    // ══════════════════════════════════════════════════════
    const { data: myTransactions } = await supabase
      .from("transactions")
      .select(
        `
        id,
        quantity,
        price,
        status,
        created_at,
        waste_listings ( material_name, category ),
        buyer:users!transactions_buyer_id_fkey ( name, company_name ),
        seller:users!transactions_seller_id_fkey ( name, company_name )
      `,
      )
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .limit(6);

    // ══════════════════════════════════════════════════════
    // CONTEXT LAYER 4 — Platform Market Data
    // ══════════════════════════════════════════════════════
    const { data: marketListings } = await supabase
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
        status,
        users ( company_name, industry_type )
      `,
      )
      .eq("status", "available")
      .order("created_at", { ascending: false })
      .limit(15);

    // ══════════════════════════════════════════════════════
    // CONTEXT LAYER 5 — Platform Wide Stats
    // ══════════════════════════════════════════════════════
    const { data: allMetrics } = await supabase
      .from("impact_metrics")
      .select("waste_reused, co2_saved, transactions_count");

    const { data: allUsers } = await supabase.from("users").select("id");

    const { data: allListings } = await supabase
      .from("waste_listings")
      .select("category, status");

    const { data: allTransactions } = await supabase
      .from("transactions")
      .select("status");

    // ══════════════════════════════════════════════════════
    // CONTEXT LAYER 6 — Waste Mapping Knowledge
    // ══════════════════════════════════════════════════════
    const { data: wasteMappings } = await supabase
      .from("waste_mapping")
      .select("waste_type, recommended_industries");

    // ══════════════════════════════════════════════════════
    // CONTEXT LAYER 7 — User's Logistics
    // ══════════════════════════════════════════════════════
    const { data: myLogistics } = await supabase
      .from("logistics")
      .select(
        `
        pickup_location,
        delivery_location,
        transport_cost,
        status,
        scheduled_at,
        notes,
        transactions (
          status,
          waste_listings ( material_name )
        )
      `,
      )
      .in("transaction_id", myTransactions?.map((t) => t.id) || [])
      .limit(5);

    // ══════════════════════════════════════════════════════
    // AGGREGATE PLATFORM STATS
    // ══════════════════════════════════════════════════════
    const platformStats = {
      total_users: allUsers?.length || 0,
      total_listings: allListings?.length || 0,
      active_listings:
        allListings?.filter((l) => l.status === "available").length || 0,
      total_transactions: allTransactions?.length || 0,
      completed_transactions:
        allTransactions?.filter((t) => t.status === "completed").length || 0,
      total_waste_reused:
        allMetrics?.reduce((s, m) => s + (m.waste_reused || 0), 0) || 0,
      total_co2_saved:
        allMetrics?.reduce((s, m) => s + (m.co2_saved || 0), 0) || 0,
    };

    // Category breakdown
    const categoryBreakdown = allListings?.reduce((acc, l) => {
      acc[l.category] = (acc[l.category] || 0) + 1;
      return acc;
    }, {});

    // ══════════════════════════════════════════════════════
    // BUILD SYSTEM PROMPT
    // ══════════════════════════════════════════════════════
    const systemPrompt = `
You are Becho AI — the intelligent sustainability assistant 
for Becho, India's leading Circular Economy Marketplace 
Platform. You help businesses and individuals exchange, 
reuse, and redistribute surplus materials to reduce waste 
and promote sustainable practices.

Your personality:
→ Professional yet approachable
→ Data-driven — always refer to actual numbers
→ India-focused — use ₹ for prices, reference Indian cities
→ Sustainability-oriented — encourage circular economy
→ Concise — give clear, actionable answers

════════════════════════════════════════
ABOUT BECHO PLATFORM
════════════════════════════════════════
Becho is a circular economy marketplace where businesses 
list surplus/waste materials for others to buy and reuse, 
reducing landfill waste and CO2 emissions across India.

Categories available:
plastic, wood, metal, electronics, furniture,
construction materials, packaging materials, industrial surplus

How it works:
1. Sellers list surplus materials with price and location
2. Buyers browse and request to purchase
3. Transaction goes: pending → accepted → completed
4. Logistics coordinates pickup and delivery
5. Impact metrics track CO2 saved and waste reused

════════════════════════════════════════
PLATFORM STATISTICS (LIVE DATA)
════════════════════════════════════════
Total Users:              ${platformStats.total_users}
Total Listings:           ${platformStats.total_listings}
Active Listings:          ${platformStats.active_listings}
Total Transactions:       ${platformStats.total_transactions}
Completed Transactions:   ${platformStats.completed_transactions}
Total Waste Reused:       ${platformStats.total_waste_reused} kg
Total CO2 Saved:          ${platformStats.total_co2_saved} kg
Trees Equivalent:         ${Math.round(platformStats.total_co2_saved / 21)} trees

Category Breakdown:
${Object.entries(categoryBreakdown || {})
  .map(([cat, count]) => `  ${cat}: ${count} listings`)
  .join("\n")}

════════════════════════════════════════
CURRENT USER PROFILE
════════════════════════════════════════
Name:          ${userProfile?.name || "N/A"}
Company:       ${userProfile?.company_name || "N/A"}
Industry:      ${userProfile?.industry_type || "N/A"}
Location:      ${userProfile?.location || "N/A"}

Personal Impact:
  Waste Reused:        ${userImpact?.waste_reused || 0} kg
  CO2 Saved:           ${userImpact?.co2_saved || 0} kg
  Trees Equivalent:    ${Math.round((userImpact?.co2_saved || 0) / 21)} trees
  Transactions Done:   ${userImpact?.transactions_count || 0}

════════════════════════════════════════
USER'S ACTIVE LISTINGS (${myListings?.length || 0} total)
════════════════════════════════════════
${
  myListings && myListings.length > 0
    ? myListings
        .map(
          (l) =>
            `→ ${l.material_name} | ${l.category} | ` +
            `${l.quantity} ${l.unit} | ` +
            `₹${l.price} | ${l.status} | ${l.location}`,
        )
        .join("\n")
    : "→ No listings yet"
}

════════════════════════════════════════
USER'S RECENT TRANSACTIONS (last 6)
════════════════════════════════════════
${
  myTransactions && myTransactions.length > 0
    ? myTransactions
        .map(
          (t) =>
            `→ ${t.waste_listings?.material_name} | ` +
            `Qty: ${t.quantity} | ₹${t.price} | ` +
            `Status: ${t.status} | ` +
            `Buyer: ${t.buyer?.company_name} | ` +
            `Seller: ${t.seller?.company_name}`,
        )
        .join("\n")
    : "→ No transactions yet"
}

════════════════════════════════════════
USER'S LOGISTICS
════════════════════════════════════════
${
  myLogistics && myLogistics.length > 0
    ? myLogistics
        .map(
          (l) =>
            `→ ${l.transactions?.waste_listings?.material_name} | ` +
            `${l.status} | ` +
            `Pickup: ${l.pickup_location} | ` +
            `Delivery: ${l.delivery_location} | ` +
            `Cost: ₹${l.transport_cost} | ` +
            `Scheduled: ${l.scheduled_at || "Not scheduled"}`,
        )
        .join("\n")
    : "→ No logistics yet"
}

════════════════════════════════════════
LIVE MARKETPLACE (available listings)
════════════════════════════════════════
${
  marketListings && marketListings.length > 0
    ? marketListings
        .map(
          (l) =>
            `→ [ID: ${l.id}] ${l.material_name} | ${l.category} | ` +
            `${l.quantity} ${l.unit} | ₹${l.price} | ` +
            `${l.location} | by ${l.users?.company_name}`,
        )
        .join("\n")
    : "→ No listings available"
}

════════════════════════════════════════
WASTE REUSE KNOWLEDGE BASE
════════════════════════════════════════
${
  wasteMappings && wasteMappings.length > 0
    ? wasteMappings
        .map((m) => `→ ${m.waste_type}: best for ${m.recommended_industries}`)
        .join("\n")
    : ""
}

════════════════════════════════════════
SUSTAINABILITY FORMULAS USED BY BECHO
════════════════════════════════════════
CO2 Saved  = quantity_reused × 2.5 kg per kg of waste
Trees      = co2_saved ÷ 21 kg per tree per year
Impact     = waste diverted from landfill in kg

════════════════════════════════════════
RESPONSE GUIDELINES
════════════════════════════════════════
→ Always use LIVE DATA from context above
→ Use ₹ symbol for all prices
→ Reference actual company names and locations
→ If asked about something not in context, say so honestly
→ Keep responses clear, structured, and actionable
→ Use **bold text** for key numbers, company names, and important categories
→ Use bulleted lists (starting with - ) for comparing multiple items or steps
→ **DEEP LINKING RULES**:
  1. If suggesting OTHER users' listings: Use \`[Listing Name](/dashboard/marketplace?id=LISTING_ID)\`
  2. If the user asks about THEIR OWN listings: Point them to \`/dashboard/listings\`
  3. NEVER give a link without a valid ID from the context.
→ Encourage circular economy practices
→ Never make up data that isn't in the context above
`;

    // ══════════════════════════════════════════════════════
    // BUILD CONVERSATION HISTORY (last 6 messages)
    // ══════════════════════════════════════════════════════
    const recentHistory = history.slice(-6);

    const conversationHistory = recentHistory
      .map(
        (msg) => `${msg.role === "user" ? "User" : "Becho AI"}: ${msg.content}`,
      )
      .join("\n\n");

    // ══════════════════════════════════════════════════════
    // FINAL PROMPT
    // ══════════════════════════════════════════════════════
    const finalPrompt = `
${systemPrompt}

════════════════════════════════════════
CONVERSATION HISTORY
════════════════════════════════════════
${conversationHistory || "This is the start of the conversation."}

════════════════════════════════════════
CURRENT USER MESSAGE
════════════════════════════════════════
${message}

Respond as Becho AI — professional, data-driven, helpful.
Use the live data provided above to give accurate answers.`;

    // ══════════════════════════════════════════════════════
    // CALL GEMINI
    // ══════════════════════════════════════════════════════
    const result = await geminiChat.generateContent(finalPrompt);
    const response = result.response.text();

    return NextResponse.json(
      {
        message: response,
        role: "assistant",
      },
      { status: 200 },
    );
  } catch (error) {
    if (error.message?.includes("429") || error.status === 429) {
      return NextResponse.json(
        {
          error:
            "AI is currently busy due to free tier limits. Please wait 60 seconds and try again.",
        },
        { status: 429 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
