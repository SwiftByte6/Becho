import PostListingForm from "@/components/dashboard/PostListingForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "Post New Listing | Becho" };

export default function NewListingPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/dashboard/listings"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-green-600 transition-colors mb-6 group"
      >
        <ChevronLeft
          size={16}
          className="group-hover:-translate-x-0.5 transition-transform"
        />
        Back to Listings
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Post New Listing
        </h1>
        <p className="text-slate-500 mt-1.5">
          Fill in the details below to list your surplus material on the
          marketplace
        </p>
      </div>

      <PostListingForm />
    </div>
  );
}
