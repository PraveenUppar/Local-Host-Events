"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  query: string;
}

export default function Pagination({
  page,
  totalPages,
  query,
}: PaginationProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (newPage: number) => {
    // This wrapper allows us to show the loader until the server responds
    startTransition(() => {
      router.push(`/?query=${query}&page=${newPage}`);
    });
  };

  return (
    <div className="mt-8 flex justify-center gap-6 items-center">
      {/* PREVIOUS BUTTON */}
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page <= 1 || isPending}
        className={`flex items-center gap-2 px-6 py-3 border rounded-lg text-sm font-medium transition-all
          ${
            page <= 1 || isPending
              ? "bg-slate-900/50 border-white/5 text-slate-600 cursor-not-allowed"
              : "bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:border-blue-500 hover:bg-slate-800"
          }
        `}
      >
        {isPending && page > 1 ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
        Previous
      </button>

      {/* PAGE INDICATOR */}
      <span className="font-mono text-sm text-slate-500">
        Page <span className="text-white font-bold">{page}</span> /{" "}
        {totalPages || 1}
      </span>

      {/* NEXT BUTTON */}
      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page >= totalPages || isPending}
        className={`flex items-center gap-2 px-6 py-3 border rounded-lg text-sm font-medium transition-all
          ${
            page >= totalPages || isPending
              ? "bg-slate-900/50 border-white/5 text-slate-600 cursor-not-allowed"
              : "bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:border-blue-500 hover:bg-slate-800"
          }
        `}
      >
        Next
        {isPending && page < totalPages ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
