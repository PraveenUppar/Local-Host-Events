// app/events/[id]/page.tsx
import { getEventById } from "@/app/actions/getEventById";
import { notFound } from "next/navigation";
import { Calendar, MapPin, User } from "lucide-react";
import EventTicketCard from "@/components/EventTicketCard"; // <--- IMPORT THIS

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: PageProps) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Event Details (Kept same as before) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="aspect-video bg-gray-200 rounded-xl w-full flex items-center justify-center text-gray-400">
              [Event Image Placeholder]
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {event.title}
              </h1>
              <p className="mt-4 text-lg text-gray-600">{event.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="font-semibold">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="font-semibold">{event.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <User className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Organizer</p>
                  <p className="font-semibold">{event.organizer.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Interactive Ticket Card */}
          <div className="lg:col-span-1">
            {/* Pass the array of variants to the Client Component */}
            <EventTicketCard
              ticketVariants={event.ticketVariants.map((variant) => ({
                ...variant,
                price: Number(variant.price),
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
