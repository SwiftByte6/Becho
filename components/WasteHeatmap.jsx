"use client";
import { useEffect, useRef, useState } from "react";

export default function WasteHeatmap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");

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

    await loadHeatmapData(category);
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
      {/* ── Header ───────────────────────────────────────── */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            🗺️ City Waste Heatmap
          </h2>
          <p className="text-sm text-gray-500">
            Red zones = high waste concentration
          </p>
        </div>

        {/* ── Category Filter ───────────────────────────── */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat === "all" ? "" : cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
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
    </div>
  );
}
