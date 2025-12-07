// app/events/create/page.tsx
"use client";

import { createEvent } from "../../actions/createEvent";

export default function CreateEventPage() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>

      {/* Passing the Server Action directly to the form */}
      <form action={createEvent} className="space-y-4">
        {/* Event Details */}
        <div>
          <label className="block text-sm font-medium">Event Title</label>
          <input
            name="title"
            type="text"
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            required
            className="w-full border p-2 rounded h-24"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              name="date"
              type="datetime-local"
              required
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Location</label>
            <input
              name="location"
              type="text"
              required
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div className="border-t pt-4 mt-6">
          <h2 className="text-lg font-semibold mb-2">Ticket Details</h2>
          <p className="text-sm text-gray-500 mb-4">
            Let's create one standard ticket type for now.
          </p>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">Ticket Name</label>
              <input
                name="ticketName"
                type="text"
                defaultValue="General Admission"
                required
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Price ($)</label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                required
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Capacity</label>
              <input
                name="stock"
                type="number"
                min="1"
                required
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 w-full mt-6"
        >
          Publish Event
        </button>
      </form>
    </div>
  );
}
