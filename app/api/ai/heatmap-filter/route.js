import { gemini } from "@/lib/gemini/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const prompt = `
You are an intelligent waste marketplace assistant for Becho,
a circular economy platform operating across India.

Your job is to understand a user's natural language query about 
waste materials and convert it into structured filter parameters 
for a live waste heatmap.

User Query: "${query}"

────────────────────────────────────────
AVAILABLE WASTE CATEGORIES:
────────────────────────────────────────
- plastic
- wood
- metal
- electronics
- furniture
- construction materials
- packaging materials
- industrial surplus

────────────────────────────────────────
AVAILABLE LOCATIONS — MAHARASHTRA:
────────────────────────────────────────
Mumbai Areas:
Dharavi, Andheri, Kurla, Bandra, Worli, Dadar, Goregaon,
Malad, Borivali, Powai, Chembur, Colaba, Vasai, Mulund,
Ghatkopar, Vikhroli, Jogeshwari, Kandivali, Santacruz,
Juhu, Versova, Matunga, Sion, Wadala, Prabhadevi,
Lower Parel, Parel, Tardeo, Marine Lines, Fort, Nariman Point

Mumbai Metropolitan Region:
Thane, Navi Mumbai, Bhiwandi, Kalyan, Dombivli,
Ulhasnagar, Ambernath, Badlapur, Panvel, Kharghar,
Belapur, Vashi, Nerul, Airoli, Ghansoli, Koparkhairane,
Mira Road, Bhayandar, Virar, Nalasopara

Rest of Maharashtra:
Pune, Pimpri-Chinchwad, Nashik, Aurangabad, Nagpur,
Solapur, Kolhapur, Sangli, Satara, Ahmednagar,
Jalgaon, Akola, Amravati, Nanded, Latur

────────────────────────────────────────
INDUSTRY TYPES (for context understanding):
────────────────────────────────────────
Recycling Plant, Packaging Manufacturer, Scrap Dealer,
Furniture Maker, Construction Company, E-Waste Recycler,
NGO, Logistics Firm, Biomass Energy, Manufacturing,
Automotive, Textile, Pharmaceutical, Food Processing

────────────────────────────────────────
INSTRUCTIONS:
────────────────────────────────────────
1. Understand the user's intent — they may ask by:
   - Material: "show plastic", "find metal scrap"
   - Location:  "in Dharavi", "near Pune", "around Thane"
   - Industry:  "for recyclers", "furniture makers need wood"
   - Combined:  "plastic waste in Dharavi for recyclers"

2. Map industry mentions to relevant categories:
   - recycler / recycling plant → plastic, metal, electronics
   - furniture maker            → wood, furniture
   - construction company       → construction materials, metal
   - packaging manufacturer     → plastic, packaging materials
   - NGO / school               → furniture, electronics
   - biomass / energy           → wood, industrial surplus

3. If a neighbourhood is mentioned, also infer the city:
   - "Dharavi" → zoom_to: "Dharavi, Mumbai"
   - "Pimpri"  → zoom_to: "Pimpri-Chinchwad, Pune"

4. Return ONLY a raw JSON object.
   No markdown, no backticks, no explanation outside JSON.

────────────────────────────────────────
OUTPUT FORMAT (return exactly this):
────────────────────────────────────────
{
  "category": "plastic" or null,
  "location": "Mumbai" or null,
  "zoom_to": "Dharavi, Mumbai" or null,
  "explanation": "Showing plastic waste listings concentrated in Dharavi, Mumbai"
}

────────────────────────────────────────
EXAMPLES:
────────────────────────────────────────
Query: "show me plastic in dharavi"
Output: { "category": "plastic", "location": "Mumbai", "zoom_to": "Dharavi, Mumbai", "explanation": "Showing plastic waste in Dharavi, Mumbai" }

Query: "metal scrap near pune"
Output: { "category": "metal", "location": "Pune", "zoom_to": "Pune, Maharashtra", "explanation": "Showing metal scrap listings near Pune" }

Query: "what can furniture makers find in thane"
Output: { "category": "wood", "location": "Thane", "zoom_to": "Thane, Maharashtra", "explanation": "Showing wood listings in Thane suitable for furniture makers" }

Query: "all electronics waste in mumbai"
Output: { "category": "electronics", "location": "Mumbai", "zoom_to": "Mumbai, Maharashtra", "explanation": "Showing all electronics waste listings across Mumbai" }

Query: "show everything"
Output: { "category": null, "location": null, "zoom_to": null, "explanation": "Showing all available waste listings across all locations" }
`;

    const result = await gemini.generateContent(prompt);
    const text = result.response.text();

    // Robust JSON extraction
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const clean = jsonMatch
      ? jsonMatch[0]
      : text.replace(/```json|```/g, "").trim();

    const filter = JSON.parse(clean);

    return NextResponse.json(
      {
        filter,
        original_query: query,
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
