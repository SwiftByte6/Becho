"use client";
import { useState } from "react";

export default function LocationPicker({ onChange }) {
  const [manualAddress, setManualAddress] = useState("");
  const [confirmed, setConfirmed] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Option 1: Current Location ─────────────────────────
  async function handleCurrentLocation() {
    setError("");
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "User-Agent": "Becho-CircularEconomy/1.0" } },
          );
          const data = await res.json();

          const location = data.display_name || "Current Location";
          setConfirmed(
            `📍 ${location} (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
          );
          onChange({ location, latitude, longitude });
        } catch {
          setError("Could not fetch address. Try manual input.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("Location permission denied. Please enter manually.");
        setLoading(false);
      },
    );
  }

  // ── Option 2: Manual Address ───────────────────────────
  async function handleManualGeocode() {
    if (!manualAddress.trim()) return;
    setError("");
    setLoading(true);

    try {
      const encoded = encodeURIComponent(manualAddress);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`,
        { headers: { "User-Agent": "Becho-CircularEconomy/1.0" } },
      );
      const data = await res.json();

      if (!data || data.length === 0) {
        setError("Address not found. Try being more specific.");
        return;
      }

      const latitude = parseFloat(data[0].lat);
      const longitude = parseFloat(data[0].lon);
      const location = manualAddress;

      setConfirmed(
        `📍 ${location} (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
      );
      onChange({ location, latitude, longitude });
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Location
      </label>

      {/* ── Option 1: Current Location Button ───────────── */}
      <button
        type="button"
        onClick={handleCurrentLocation}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 
                   border-2 border-dashed border-green-400 rounded-lg 
                   py-2 text-sm text-green-600 hover:bg-green-50 
                   transition disabled:opacity-50"
      >
        {loading ? "⏳ Fetching..." : "📍 Use Current Location"}
      </button>

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <div className="flex-1 h-px bg-gray-200" />
        OR
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* ── Option 2: Manual Address ─────────────────────── */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="e.g. Andheri, Mumbai"
          value={manualAddress}
          onChange={(e) => setManualAddress(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleManualGeocode();
            }
          }}
          className="flex-1 border rounded-lg px-3 py-2 text-sm 
                     focus:outline-none focus:ring-2 focus:ring-green-400 text-slate-700"
        />
        <button
          type="button"
          onClick={handleManualGeocode}
          disabled={loading || !manualAddress.trim()}
          className="px-4 py-2 bg-green-500 text-white text-sm 
                     rounded-lg hover:bg-green-600 
                     disabled:opacity-50 transition"
        >
          Find
        </button>
      </div>

      {/* ── Confirmation ─────────────────────────────────── */}
      {confirmed && !error && (
        <p
          className="text-xs text-green-600 bg-green-50 
                      rounded-lg px-3 py-2"
        >
          {confirmed}
        </p>
      )}

      {/* ── Error ────────────────────────────────────────── */}
      {error && (
        <p
          className="text-xs text-red-500 bg-red-50 
                      rounded-lg px-3 py-2"
        >
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
