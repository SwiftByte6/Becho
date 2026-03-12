"use client";

import { useEffect, useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  Pencil,
  Trash2,
  Sparkles,
  Plus,
  Calendar,
  Tag,
  Package,
} from "lucide-react";
import Link from "next/link";

export default function WasteListings({ limit }) {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const displayed = limit ? listings.slice(0, limit) : listings;

  useEffect(() => {
    const loadListings = async () => {
      try {
        setError("");
        const response = await fetch("/api/listings?mine=true&status=all", {
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load listings.");
        }

        setListings(data.listings || []);
      } catch (loadError) {
        setError(loadError.message || "Unable to load listings.");
      } finally {
        setIsLoading(false);
      }
    };

    loadListings();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete listing.");
      }

      setListings((prev) => prev.filter((listing) => listing.id !== id));
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete listing.");
    }
  };

  const statusConfig = {
    available: { label: "Available", variant: "Active" },
    reserved: { label: "Reserved", variant: "Pending" },
    sold: { label: "Sold", variant: "Matched" },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-[#5f4f40]">Your Waste Listings</h2>
        <Link href="/dashboard/listings/new">
        <Button variant="primary" size="sm" className="gap-1.5">
          <Plus size={14} /> Add Listing
        </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading && (
          <div className="col-span-full rounded-2xl border border-[#dccfb9] bg-[#fcf8f1] px-4 py-6 text-sm text-[#7a7065]">
            Loading listings...
          </div>
        )}

        {!isLoading && error && (
          <div className="col-span-full rounded-2xl border border-[#e5c4b1] bg-[#f7e9df] px-4 py-6 text-sm text-[#a85d3d]">
            {error}
          </div>
        )}

        {!isLoading && !error && displayed.length === 0 && (
          <div className="col-span-full rounded-2xl border border-[#dccfb9] bg-[#fcf8f1] px-4 py-6 text-sm text-[#7a7065]">
            No listings found yet. Create your first listing to publish it to the marketplace.
          </div>
        )}

        {displayed.map(({ id, material_name, quantity, unit, category, status, created_at, description }) => {
          const statusMeta = statusConfig[status] || { label: status, variant: "Info" };
          return (
          <div
            key={id}
            className="bg-[#fcf8f1] rounded-2xl border border-[#dccfb9] shadow-[0_10px_30px_rgba(95,79,64,0.08)] p-5 flex flex-col gap-3 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(95,79,64,0.12)] transition-all duration-200"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#edf4eb] flex items-center justify-center shrink-0">
                  <Package size={16} className="text-[#6f8250]" />
                </div>
                <div>
                  <p className="font-semibold text-[#4e4033] text-sm leading-none">{material_name}</p>
                  <p className="text-[#9a8f82] text-xs mt-0.5">{quantity} {unit}</p>
                </div>
              </div>
              <Badge label={statusMeta.label} variant={statusMeta.variant} />
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#efe4d4] text-[#7a7065] text-xs">
                <Tag size={11} /> {category}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#efe4d4] text-[#7a7065] text-xs">
                <Calendar size={11} /> {new Date(created_at).toLocaleDateString()}
              </span>
            </div>

            <p className="text-[#8e8172] text-xs leading-relaxed border-t border-[#ece1cf] pt-2">{description || 'No description provided.'}</p>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button variant="ghost" size="sm" className="flex-1 text-[#7a7065]">
                <Pencil size={13} /> Edit
              </Button>
              <Button variant="danger" size="sm" className="flex-1" onClick={() => handleDelete(id)}>
                <Trash2 size={13} /> Delete
              </Button>
              <Button variant="secondary" size="sm" className="flex-1 text-[#5f6f43]">
                <Sparkles size={13} /> AI Match
              </Button>
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
}
