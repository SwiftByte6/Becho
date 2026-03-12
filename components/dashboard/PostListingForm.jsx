"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import LocationPicker from "@/components/LocationPicker";
import {
  Package,
  Tag,
  Scale,
  Coins,
  FileText,
  ImageIcon,
  Loader2,
} from "lucide-react";

export default function PostListingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    material_name: "",
    category: "",
    quantity: "",
    unit: "kg",
    price: "",
    location: "",
    description: "",
    image: null,
    latitude: null,
    longitude: null,
  });

  const categories = [
    "Plastic",
    "Metal",
    "Wood",
    "Electronics",
    "Furniture",
    "Construction materials",
    "Packaging materials",
    "Other",
  ];

  const units = ["kg", "ton", "units", "meters"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ── Validation ──────────────────────────────────────────
    if (!formData.latitude || !formData.longitude) {
      alert("Please set a location before submitting");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          data.append(key, value);
        }
      });

      const res = await fetch("/api/listings", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      router.push("/dashboard/listings");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Material Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Package size={16} className="text-green-600" /> Material Name
          </label>
          <input
            required
            type="text"
            placeholder="e.g. Scraped HDPE Pipes"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-slate-700"
            value={formData.material_name}
            onChange={(e) =>
              setFormData({ ...formData, material_name: e.target.value })
            }
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Tag size={16} className="text-green-600" /> Category
          </label>
          <select
            required
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-green-500 outline-none transition-all text-slate-700"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity and Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Scale size={16} className="text-green-600" /> Quantity
            </label>
            <input
              required
              type="number"
              placeholder="0"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-green-500 outline-none transition-all text-slate-700"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Unit</label>
            <select
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-green-500 outline-none transition-all text-slate-700"
              value={formData.unit}
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value })
              }
            >
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Coins size={16} className="text-green-600" /> Price (per unit)
          </label>
          <input
            type="number"
            placeholder="0.00"
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-green-500 outline-none transition-all text-slate-700"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <FileText size={16} className="text-green-600" /> Description
        </label>
        <textarea
          rows={3}
          placeholder="Tell buyers about the material quality, origin, etc."
          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-green-500 outline-none transition-all text-slate-700"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      {/* Location Picker */}
      <LocationPicker
        onChange={({ location, latitude, longitude }) => {
          setFormData((prev) => ({ ...prev, location, latitude, longitude }));
        }}
      />

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <ImageIcon size={16} className="text-green-600" /> Material Image
        </label>
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-green-500 transition-colors cursor-pointer group">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="image-upload"
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.files?.[0] || null })
            }
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3 group-hover:bg-green-50 transition-colors">
              <ImageIcon className="text-slate-400 group-hover:text-green-600" />
            </div>
            <p className="text-sm font-medium text-slate-700">
              {formData.image ? formData.image.name : "Click to upload image"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports JPG, PNG, WEBP (Max 5MB)
            </p>
          </label>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs text-center">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <Button
        variant="primary"
        fullWidth
        size="lg"
        disabled={loading}
        className="h-12 text-base font-bold shadow-green-200 shadow-lg"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="animate-spin" size={20} /> Posting Listing...
          </span>
        ) : (
          "Create Listing"
        )}
      </Button>
    </form>
  );
}
