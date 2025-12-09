// app/page.tsx
import { getEvents } from "./actions/getEvents";
import Link from "next/link";
import Search from "@/components/Search";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Receive search params from the URL (Search Query + Page Number)
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params?.query || "";
  const page = Number(params?.page) || 1;

  // Pass query AND page to the backend
  // Note: getEvents now returns an object { events, totalCount }
  const { events, totalCount } = await getEvents(query, page);

  // Calculate total pages (assuming 6 items per page as set in getEvents)
  const totalPages = Math.ceil(totalCount / 6);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Upcoming Tech Events
          </h1>
          {/* Optional: Add Create Event button if you want it visible here */}
        </div>

        {/* Search Bar */}
        <Search />

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const lowestPrice =
              event.ticketVariants.length > 0
                ? Math.min(...event.ticketVariants.map((t) => Number(t.price)))
                : "N/A";

            return (
              <Link
                href={`/events/${event.id}`}
                key={event.id}
                className="block group"
              >
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="h-48 bg-gray-200 w-full object-cover relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      Image
                    </div>
                  </div>
                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                      {event.title}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(event.date).toLocaleDateString()} •{" "}
                      {event.location}
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        By {event.organizer.name}
                      </span>
                      <span className="font-bold text-lg text-green-700">
                        {lowestPrice === "N/A" ? "Free" : `$${lowestPrice}`}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {events.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No events found matching "{query}".
          </div>
        )}

        {/* PAGINATION CONTROLS (Only show if we have events) */}
        {totalCount > 0 && (
          <div className="mt-12 flex justify-center gap-4 items-center">
            {/* Previous Button */}
            {page > 1 ? (
              <Link
                href={`/?query=${query}&page=${page - 1}`}
                className="flex items-center gap-1 px-4 py-2 border bg-white rounded hover:bg-gray-50 text-sm font-medium"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Link>
            ) : (
              <button
                disabled
                className="px-4 py-2 border bg-gray-100 text-gray-400 rounded cursor-not-allowed flex items-center gap-1 text-sm font-medium"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
            )}

            <span className="text-sm text-gray-600 font-medium">
              Page {page} of {totalPages || 1}
            </span>

            {/* Next Button */}
            {page < totalPages ? (
              <Link
                href={`/?query=${query}&page=${page + 1}`}
                className="flex items-center gap-1 px-4 py-2 border bg-white rounded hover:bg-gray-50 text-sm font-medium"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                disabled
                className="px-4 py-2 border bg-gray-100 text-gray-400 rounded cursor-not-allowed flex items-center gap-1 text-sm font-medium"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
