// Centralized mock data for Circular Economy Marketplace

export const overviewStats = [
  { id: 1, label: "Total Waste Listed", value: "2,840", unit: "kg", change: "+12%", trend: "up", icon: "Package", color: "green" },
  { id: 2, label: "Reused Materials", value: "1,623", unit: "kg", change: "+8%", trend: "up", icon: "Recycle", color: "emerald" },
  { id: 3, label: "CO₂ Saved", value: "4.2", unit: "tons", change: "+18%", trend: "up", icon: "Leaf", color: "teal" },
  { id: 4, label: "Active Requests", value: "34", unit: "", change: "+5%", trend: "up", icon: "Bell", color: "blue" },
];

export const wasteListings = [
  { id: 1, name: "Aluminium Offcuts", quantity: "500 kg", category: "Metals", status: "Active", date: "2026-03-10", description: "High-grade aluminium offcuts from manufacturing process." },
  { id: 2, name: "Cardboard Surplus", quantity: "1,200 kg", category: "Paper", status: "Pending", date: "2026-03-08", description: "Clean corrugated cardboard from packaging operations." },
  { id: 3, name: "Plastic Pellets", quantity: "300 kg", category: "Plastics", status: "Active", date: "2026-03-07", description: "HDPE plastic pellets, food-grade certified." },
  { id: 4, name: "Timber Offcuts", quantity: "800 kg", category: "Wood", status: "Matched", date: "2026-03-05", description: "Kiln-dried pine timber offcuts, various lengths." },
  { id: 5, name: "Glass Cullet", quantity: "650 kg", category: "Glass", status: "Active", date: "2026-03-03", description: "Clear glass cullet ready for recycling or reuse." },
  { id: 6, name: "Textile Remnants", quantity: "120 kg", category: "Textiles", status: "Pending", date: "2026-03-01", description: "Mixed cotton-polyester fabric remnants." },
];

export const recommendations = [
  { id: 1, material: "Aluminium Offcuts", industry: "Automotive Parts Manufacturing", score: 94, benefit: "Reduces virgin aluminium use by ~60%", co2: "1.2 tons CO₂ saved", company: "MetaForge Industries" },
  { id: 2, material: "Cardboard Surplus", industry: "Packaging & Logistics", score: 89, benefit: "Replaces newly sourced cardboard, saving trees", co2: "0.8 tons CO₂ saved", company: "GreenPack Solutions" },
  { id: 3, material: "Plastic Pellets", industry: "Consumer Goods Manufacturing", score: 78, benefit: "Reduces plastic production emissions by 45%", co2: "0.6 tons CO₂ saved", company: "EcoPlas Ltd" },
  { id: 4, material: "Timber Offcuts", industry: "Furniture & Interiors", score: 85, benefit: "Sustainably sources timber for small-batch furniture", co2: "0.4 tons CO₂ saved", company: "NatureWood Co." },
  { id: 5, material: "Glass Cullet", industry: "Glass & Ceramics", score: 91, benefit: "Reduces energy use in melting by 30%", co2: "0.9 tons CO₂ saved", company: "ClearGlass Works" },
];

export const marketplaceItems = [
  { id: 1, name: "Steel Shavings", quantity: "750 kg", category: "Metals", company: "SteelPro Ltd", location: "Mumbai", price: "Free", date: "2026-03-11" },
  { id: 2, name: "PET Flakes", quantity: "400 kg", category: "Plastics", company: "PolyRec Inc.", location: "Delhi", price: "₹2/kg", date: "2026-03-10" },
  { id: 3, name: "Rubber Crumb", quantity: "600 kg", category: "Rubber", company: "TireWorks", location: "Pune", price: "₹5/kg", date: "2026-03-09" },
  { id: 4, name: "Waste Heat (BTU)", quantity: "Industrial", category: "Energy", company: "HeatShare Corp", location: "Chennai", price: "Negotiable", date: "2026-03-08" },
  { id: 5, name: "Sawdust",  quantity: "900 kg", category: "Wood", company: "TimberTech", location: "Bangalore", price: "₹1/kg", date: "2026-03-07" },
  { id: 6, name: "Copper Wire Scrap", quantity: "50 kg", category: "Metals", company: "ElecRecycle", location: "Hyderabad", price: "₹80/kg", date: "2026-03-06" },
];

export const analyticsData = {
  wasteByCategory: [
    { name: "Metals", value: 1200, fill: "#16a34a" },
    { name: "Paper", value: 1200, fill: "#10b981" },
    { name: "Plastics", value: 300, fill: "#06b6d4" },
    { name: "Wood", value: 800, fill: "#84cc16" },
    { name: "Glass", value: 650, fill: "#22d3ee" },
    { name: "Textiles", value: 120, fill: "#a3e635" },
  ],
  reuseOverTime: [
    { month: "Oct", reused: 320, listed: 500 },
    { month: "Nov", reused: 410, listed: 620 },
    { month: "Dec", reused: 380, listed: 590 },
    { month: "Jan", reused: 520, listed: 740 },
    { month: "Feb", reused: 610, listed: 850 },
    { month: "Mar", reused: 680, listed: 920 },
  ],
  impactMetrics: [
    { name: "Energy Saved", value: 76, unit: "MWh", fill: "#16a34a" },
    { name: "CO₂ Reduced", value: 4200, unit: "kg", fill: "#10b981" },
    { name: "Waste Diverted", value: 2840, unit: "kg", fill: "#06b6d4" },
    { name: "Water Saved", value: 1200, unit: "L", fill: "#22d3ee" },
  ],
};

export const recentActivity = [
  { id: 1, type: "upload", message: "Aluminium Offcuts (500 kg) uploaded", time: "2 hours ago", icon: "Upload" },
  { id: 2, type: "recommend", message: "AI matched Cardboard to GreenPack Solutions", time: "4 hours ago", icon: "Sparkles" },
  { id: 3, type: "request", message: "Request accepted from MetaForge Industries", time: "Yesterday", icon: "CheckCircle" },
  { id: 4, type: "upload", message: "Timber Offcuts (800 kg) uploaded", time: "2 days ago", icon: "Upload" },
  { id: 5, type: "recommend", message: "Recommendation generated for Glass Cullet", time: "3 days ago", icon: "Sparkles" },
];

export const impactStats = [
  { label: "Waste Diverted", value: "12,400", unit: "kg", icon: "Trash2" },
  { label: "CO₂ Saved", value: "28.6", unit: "tons", icon: "Leaf" },
  { label: "Materials Reused", value: "7,830", unit: "kg", icon: "Recycle" },
  { label: "Active Companies", value: "142", unit: "", icon: "Building2" },
];
