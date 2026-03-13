"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { MapPin, Tag, Calendar, ShoppingCart } from "lucide-react";

export default function MarketplaceClient() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();

  const loadListings = async (nextSearch = search, nextCategory = category) => {
    try {
      setError("");
      setIsLoading(true);

      const params = new URLSearchParams();
      if (nextSearch) params.set("search", nextSearch);
      if (nextCategory) params.set("category", nextCategory);

      const response = await fetch(
        `/api/listings${params.toString() ? `?${params.toString()}` : ""}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load marketplace listings.");
      }

      setItems(data.listings || []);
    } catch (loadError) {
      setError(loadError.message || "Unable to load marketplace listings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadListings("", "");
  }, []);

  // Handle deep linking to specific listing
  useEffect(() => {
    const targetId = searchParams.get("id");
    if (targetId && items.length > 0) {
      // Find listing in current items
      const exists = items.find(
        (it) => String(it.id).trim() === String(targetId).trim(),
      );

      if (!exists) {
        // If it's not found, maybe it's filtered out? Clear filters.
        if (search || category) {
          setSearch("");
          setCategory("");
          loadListings("", "");
        }
        return;
      }

      // Small delay to ensure DOM is ready
      const scrollTimer = setTimeout(() => {
        const el = document.getElementById(`listing-${targetId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add(
            "ring-8",
            "ring-green-500/40",
            "ring-offset-4",
            "ring-offset-[#f7efe2]",
          );

          // Clear highligh after 4s
          setTimeout(() => {
            el.classList.remove(
              "ring-8",
              "ring-green-500/40",
              "ring-offset-4",
              "ring-offset-[#f7efe2]",
            );
          }, 4000);
        }
      }, 100);

      return () => clearTimeout(scrollTimer);
    }
  }, [items, searchParams, search, category]);

  const handleRequestMaterial = async (listing) => {
    const requestedQuantity = window.prompt(
      `Enter quantity to request for ${listing.material_name} (max ${listing.quantity} ${listing.unit})`,
      String(listing.quantity),
    );

    if (!requestedQuantity) return;

    try {
      const numericQuantity = Number(requestedQuantity);

      if (
        !numericQuantity ||
        numericQuantity <= 0 ||
        numericQuantity > Number(listing.quantity)
      ) {
        throw new Error("Enter a valid quantity within the available amount.");
      }

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          listing_id: listing.id,
          quantity: numericQuantity,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to create transaction.");
      }

      await loadListings();
    } catch (requestError) {
      setError(requestError.message || "Unable to create transaction.");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#5f4f40] tracking-tight">
          Material Marketplace
        </h1>
        <p className="text-[#7a7065] text-sm mt-1">
          Browse available surplus materials from verified companies
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search materials..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-52 px-4 py-2.5 border border-[#dccfb9] rounded-xl text-sm bg-[#fcf8f1] text-[#5f4f40] outline-none focus:border-[#7f925b] focus:ring-2 focus:ring-[#d6e4c0] transition-all"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2.5 border border-[#dccfb9] rounded-xl text-sm bg-[#fcf8f1] text-[#6f655a] outline-none focus:border-[#7f925b] transition-all"
        >
          <option value="">All Categories</option>
          <option value="Metals">Metals</option>
          <option value="Plastics">Plastics</option>
          <option value="Wood">Wood</option>
          <option value="Rubber">Rubber</option>
          <option value="Energy">Energy</option>
          <option value="Paper">Paper</option>
          <option value="Glass">Glass</option>
        </select>
        <Button
          variant="primary"
          size="md"
          onClick={() => loadListings(search, category)}
        >
          Search
        </Button>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-[#e5c4b1] bg-[#f7e9df] px-4 py-3 text-sm text-[#a85d3d]">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading && (
          <div className="col-span-full rounded-2xl border border-[#dccfb9] bg-[#fcf8f1] px-4 py-6 text-sm text-[#7a7065]">
            Loading marketplace listings...
          </div>
        )}

        {!isLoading && !error && items.length === 0 && (
          <div className="col-span-full rounded-2xl border border-[#dccfb9] bg-[#fcf8f1] px-4 py-6 text-sm text-[#7a7065]">
            No available listings matched your filters.
          </div>
        )}

        {items.map((listing) => (
          <div
            key={listing.id}
            id={`listing-${listing.id}`}
            className="bg-[#fcf8f1] rounded-2xl border border-[#dccfb9] shadow-[0_10px_30px_rgba(95,79,64,0.08)] p-5 flex flex-col gap-3 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(95,79,64,0.12)] transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-[#4e4033]">
                  {listing.material_name}
                </p>
                <p className="text-[#9a8f82] text-xs mt-0.5">
                  {listing.users?.company_name || "Unknown company"}
                </p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold ${Number(listing.price) === 0 ? "bg-[#edf4eb] text-[#5f6f43]" : "bg-[#ece9f6] text-[#64568a]"}`}
              >
                {Number(listing.price) === 0
                  ? "Free"
                  : `₹${listing.price}/${listing.unit}`}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#efe4d4] text-[#7a7065] text-xs">
                <Tag size={11} /> {listing.category}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#efe4d4] text-[#7a7065] text-xs">
                <MapPin size={11} /> {listing.location || "Location not set"}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#efe4d4] text-[#7a7065] text-xs">
                <Calendar size={11} />{" "}
                {new Date(listing.created_at).toLocaleDateString()}
              </span>
            </div>

            <p className="text-sm font-semibold text-[#6f655a]">
              {listing.quantity} {listing.unit} available
            </p>

            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={() => handleRequestMaterial(listing)}
            >
              <ShoppingCart size={13} /> Request Material
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
