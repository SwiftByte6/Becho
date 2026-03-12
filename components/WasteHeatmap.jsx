"use client";
import { useEffect, useRef, useState } from "react";
import {
  Search,
  Sparkles,
  Brain,
  Info,
  Loader2,
  ArrowRight,
} from "lucide-react";
import Badge from "@/components/ui/Badge";

export default function WasteHeatmap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");

  // ── AI States ──────────────────────────────────────────
  const [aiQuery, setAiQuery] = useState("");
  const [isAiFiltering, setIsAiFiltering] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");
  const [aiInsight, setAiInsight] = useState(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const clickTimeout = useRef(null);

  const categories = [
    "all",
    "plastic",
    "wood",
    "metal",
    "electronics",
    "furniture",
    "construction materials",
    "packaging materials",
  ];

  useEffect(() => {
    initMap();
    return () => {
      // Cleanup map on unmount
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstance.current) {
      loadHeatmapData(category);
    }
  }, [category]);

  async function initMap() {
    // Dynamically import Leaflet (client side only)
    const L = (await import("leaflet")).default;
    await import("leaflet/dist/leaflet.css");

    if (mapInstance.current || !mapRef.current) return;

    // ── Init map centered on Mumbai ─────────────────────────
    const map = L.map(mapRef.current).setView([19.076, 72.8777], 11);
    mapInstance.current = map;

    // ── OpenStreetMap tiles ────────────────────────────────
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Initial size correction after a short delay
    setTimeout(() => {
      map.invalidateSize();
    }, 400);

    // ── Map Click Listener for AI Insights ───────────────
    map.on("click", (e) => {
      if (clickTimeout.current) clearTimeout(clickTimeout.current);
      clickTimeout.current = setTimeout(() => {
        handleMapClick(e.latlng.lat, e.latlng.lng);
      }, 800);
    });

    await loadHeatmapData(category);
  }

  // ── AI Feature 1: Natural Language Filter ───────────────
  async function handleAiSearch(e) {
    if (e) e.preventDefault();
    if (!aiQuery.trim()) return;

    try {
      setIsAiFiltering(true);
      setAiExplanation("");

      const res = await fetch("/api/ai/heatmap-filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: aiQuery }),
      });
      const data = await res.json();

      if (data.filter) {
        const { category: newCat, zoom_to, explanation } = data.filter;

        setAiExplanation(explanation);
        if (newCat) setCategory(newCat);

        // Zoom to location using Nominatim
        if (zoom_to && mapInstance.current) {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(zoom_to)}&format=json&limit=1`,
            { headers: { "User-Agent": "Becho-CircularEconomy/1.0" } },
          );
          const geoData = await geoRes.json();
          if (geoData && geoData[0]) {
            mapInstance.current.setView([geoData[0].lat, geoData[0].lon], 13);
          }
        }
      }
    } catch (err) {
      console.error("AI Search Error:", err);
    } finally {
      setIsAiFiltering(false);
    }
  }

  // ── AI Feature 2: Hotspot Insights ──────────────────────
  async function handleMapClick(lat, lng) {
    try {
      setIsAiAnalyzing(true);
      setAiInsight(null);

      const res = await fetch("/api/ai/hotspot-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: lat, longitude: lng }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to fetch heatmap insights");
      setAiInsight(data);
    } catch (err) {
      console.error("Hotspot Insight Error:", err);
      // Show error in the UI
      setAiInsight({
        insight: `Error: ${err.message}`,
        listings: [],
        total_listings: 0,
        total_quantity: 0,
        categories: ["error"],
      });
    } finally {
      setIsAiAnalyzing(false);
    }
  }

  async function loadHeatmapData(cat) {
    try {
      setLoading(true);
      const L = (await import("leaflet")).default;

      const url =
        cat && cat !== "all" ? `/api/heatmap?category=${cat}` : "/api/heatmap";
      const res = await fetch(url);
      const data = await res.json();

      setStats({
        total: data.total_listings,
        breakdown: data.category_breakdown,
      });

      if (!mapInstance.current) return;
      const map = mapInstance.current;

      // ── Clear existing custom layers ──────────────────
      map.eachLayer((layer) => {
        if (layer._isBechoLayer) {
          map.removeLayer(layer);
        }
      });

      if (!data.heat_points || data.heat_points.length === 0) {
        setLoading(false);
        return;
      }

      // ── Load Heat Plugin ───────────────────────────────
      await loadLeafletHeat();

      // Ensure heatLayer is available on the L we are using
      if (
        typeof L.heatLayer !== "function" &&
        window.L &&
        typeof window.L.heatLayer === "function"
      ) {
        L.heatLayer = window.L.heatLayer;
      }

      if (typeof L.heatLayer === "function") {
        const points = data.heat_points.map((p) => [
          p.lat,
          p.lng,
          Math.max(p.intensity, 0.7), // Higher base intensity
        ]);

        const heat = L.heatLayer(points, {
          radius: 35,
          blur: 15,
          maxZoom: 12,
          max: 1.0,
          gradient: {
            0.4: "blue",
            0.6: "cyan",
            0.7: "lime",
            0.8: "yellow",
            1.0: "red",
          },
        }).addTo(map);

        heat._isBechoLayer = true;
      }

      // Redraw heatmap on interactions
      map.on("moveend zoomend", () => {
        map.eachLayer((layer) => {
          if (layer._isBechoLayer && typeof layer.redraw === "function") {
            layer.redraw();
          }
        });
      });

      map.invalidateSize();
    } catch (err) {
      console.error("Heatmap error:", err);
    } finally {
      setLoading(false);
    }
  }

  // ── Load Leaflet.heat CDN script ─────────────────────────
  function loadLeafletHeat() {
    return new Promise((resolve) => {
      // Check if already on global L
      if (window.L && window.L.heatLayer) {
        resolve(true);
        return;
      }

      // Check if script is already loading
      const existingScript = document.getElementById("leaflet-heat");
      if (existingScript) {
        let attempts = 0;
        const check = setInterval(() => {
          if (window.L && window.L.heatLayer) {
            clearInterval(check);
            resolve(true);
          }
          if (attempts++ > 20) {
            clearInterval(check);
            resolve(false);
          }
        }, 100);
        return;
      }

      const script = document.createElement("script");
      script.id = "leaflet-heat";
      script.src =
        "https://cdn.jsdelivr.net/npm/leaflet.heat@0.2.0/dist/leaflet-heat.js";
      script.async = true;
      script.onload = () => {
        let attempts = 0;
        const check = setInterval(() => {
          if (window.L && window.L.heatLayer) {
            clearInterval(check);
            resolve(true);
          }
          if (attempts++ > 10) {
            clearInterval(check);
            resolve(false);
          }
        }, 100);
      };
      document.head.appendChild(script);
    });
  }

  function getCategoryColor(category) {
    const colors = {
      plastic: "#3b82f6",
      wood: "#92400e",
      metal: "#6b7280",
      electronics: "#8b5cf6",
      furniture: "#f59e0b",
      "construction materials": "#ef4444",
      "packaging materials": "#10b981",
    };
    return colors[category] || "#6b7280";
  }

  return (
    <div className="w-full">
      {/* ── AI Feature 1: Search Bar ──────────────────────── */}
      <div className="mb-6 space-y-3">
        <form onSubmit={handleAiSearch} className="relative flex gap-2">
          <div className="relative flex-1 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder='Try: "Show plastic waste in Dharavi" or "Metal scrap near Dadar"'
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:border-green-500 focus:ring-4 focus:ring-green-50/50 outline-none transition-all shadow-sm"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isAiFiltering || !aiQuery.trim()}
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg active:scale-95"
          >
            {isAiFiltering ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Sparkles size={18} className="text-yellow-400" />
            )}
            Ask AI
          </button>
        </form>

        {aiExplanation && (
          <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-100 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0">
              <Brain size={16} className="text-white" />
            </div>
            <p className="text-sm font-medium text-green-800 leading-relaxed">
              {aiExplanation}
            </p>
          </div>
        )}
      </div>

      {/* ── Header ───────────────────────────────────────── */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            🗺️ City Waste Heatmap
            <Badge
              variant="outline"
              className="text-[10px] uppercase tracking-wider font-bold border-green-200 text-green-600 bg-green-50 px-1.5 py-0"
            >
              Live
            </Badge>
          </h2>
          <p className="text-sm text-gray-500">
            Red zones = high waste concentration
          </p>
        </div>

        {/* ── Category Filter ───────────────────────────── */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Filter:
          </span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-slate-200 bg-white rounded-xl px-4 py-2 text-sm font-medium text-slate-700 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-50 shadow-sm transition-all cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat === "all" ? "" : cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Map ──────────────────────────────────────────── */}
      <div className="relative rounded-xl overflow-hidden border border-gray-200">
        {loading && (
          <div
            className="absolute inset-0 z-10 flex items-center 
                          justify-center bg-white/80"
          >
            <p className="text-gray-500 animate-pulse">Loading heatmap...</p>
          </div>
        )}
        <div ref={mapRef} style={{ height: "480px", width: "100%" }} />

        {/* Map Click Hint overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[400] pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-2xl flex items-center gap-2">
            <Info size={14} className="text-blue-400" />
            <span className="text-xs font-bold text-white tracking-wide">
              💡 Click anywhere for AI Hotspot Insights
            </span>
          </div>
        </div>
      </div>

      {/* ── Stats Below Map ───────────────────────────────── */}
      {stats && (
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-lg bg-red-50 p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.total}</p>
            <p className="text-xs text-gray-500">Active Listings</p>
          </div>

          {Object.entries(stats.breakdown)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([cat, qty]) => (
              <div key={cat} className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-2xl font-bold text-gray-700">{qty}</p>
                <p className="text-xs text-gray-500 capitalize">{cat}</p>
              </div>
            ))}
        </div>
      )}

      {/* ── Legend ───────────────────────────────────────── */}
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
        <span className="font-medium">Intensity:</span>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-blue-400" />
          <span>Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <span>High</span>
        </div>
      </div>
      {/* ── AI Feature 2: Insight Panel ────────────────────── */}
      <div className="mt-8">
        {!aiInsight && !isAiAnalyzing ? (
          <div className="p-8 border-2 border-dashed border-slate-100 rounded-3xl text-center bg-slate-50/50">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-3">
              <Sparkles className="text-slate-300" size={24} />
            </div>
            <p className="text-sm font-medium text-slate-400">
              Click a hotspot area on the map to generate AI waste insights
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-100">
                  <Brain size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    AI Hotspot Insight
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Derived from real-time marketplace data
                  </p>
                </div>
              </div>
              {isAiAnalyzing && (
                <Loader2 className="animate-spin text-orange-500" size={20} />
              )}
            </div>

            {isAiAnalyzing ? (
              <div className="space-y-4 py-4">
                <div className="h-4 bg-slate-100 rounded-full w-3/4 animate-pulse" />
                <div className="h-4 bg-slate-100 rounded-full w-1/2 animate-pulse" />
                <div className="h-4 bg-slate-100 rounded-full w-5/6 animate-pulse" />
              </div>
            ) : (
              <>
                <div className="prose prose-slate prose-sm max-w-none">
                  <p className="text-slate-700 leading-relaxed font-medium bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                    {aiInsight.insight}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {aiInsight.categories?.map((cat) => (
                    <Badge
                      key={cat}
                      variant="secondary"
                      className="bg-green-50 text-green-700 border-green-100 capitalize font-bold px-3 py-1"
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Total Items
                    </p>
                    <p className="text-xl font-black text-slate-900">
                      {aiInsight.total_listings}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Total Volume
                    </p>
                    <p className="text-xl font-black text-slate-900">
                      {aiInsight.total_quantity.toLocaleString()} units
                    </p>
                  </div>
                </div>

                {aiInsight.listings?.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <ArrowRight size={12} /> Key Listings in this Hotspot
                    </p>
                    <div className="grid gap-2">
                      {aiInsight.listings.slice(0, 3).map((l, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-2xl hover:border-green-200 hover:bg-green-50/30 transition-all"
                        >
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {l.material_name}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium">
                              by {l.users?.company_name || "Anonymous"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-green-600">
                              {l.quantity} {l.unit}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">
                              {l.category}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
