// app/events/create/page.tsx
"use client";

import { createEvent } from "../../actions/createEvent";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react"; // Make sure to install lucide-react if not present

interface TicketVariant {
  id: string; // Temp ID for React keys
  name: string;
  price: number;
  stock: number;
}

export default function CreateEventPage() {
  // 1. Manage Ticket State
  const [tickets, setTickets] = useState<TicketVariant[]>([
    { id: "1", name: "General Admission", price: 0, stock: 100 },
  ]);

  // Add a new empty ticket row
  const addTicket = () => {
    setTickets([
      ...tickets,
      {
        id: Math.random().toString(), // Temp ID
        name: "VIP",
        price: 50,
        stock: 20,
      },
    ]);
  };

  // Remove a row
  const removeTicket = (id: string) => {
    if (tickets.length === 1) return; // Prevent deleting the last one
    setTickets(tickets.filter((t) => t.id !== id));
  };

  // Update a specific field in a specific row
  const updateTicket = (id: string, field: keyof TicketVariant, value: any) => {
    setTickets(
      tickets.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>

      <form action={createEvent} className="space-y-6">
        {/* --- Standard Event Fields --- */}
        <div className="space-y-4 bg-white p-6 rounded-xl border">
          <h2 className="text-lg font-semibold">Event Details</h2>
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
        </div>

        {/* --- Dynamic Ticket Variants --- */}
        <div className="bg-white p-6 rounded-xl border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Ticket Types</h2>
            <button
              type="button"
              onClick={addTicket}
              className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Ticket
            </button>
          </div>

          {/* CRITICAL: Pass the JSON string to the server */}
          <input
            type="hidden"
            name="ticketVariants"
            value={JSON.stringify(tickets)}
          />

          <div className="space-y-4">
            {tickets.map((ticket, index) => (
              <div
                key={ticket.id}
                className="grid grid-cols-7 gap-3 items-end border-b pb-4 last:border-0"
              >
                {/* Name */}
                <div className="col-span-3">
                  <label className="block text-xs text-gray-500 mb-1">
                    Ticket Name
                  </label>
                  <input
                    type="text"
                    value={ticket.name}
                    onChange={(e) =>
                      updateTicket(ticket.id, "name", e.target.value)
                    }
                    className="w-full border p-2 rounded text-sm"
                    required
                  />
                </div>

                {/* Price */}
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={ticket.price}
                    onChange={(e) =>
                      updateTicket(
                        ticket.id,
                        "price",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full border p-2 rounded text-sm"
                    required
                  />
                </div>

                {/* Stock */}
                <div className="col-span-1">
                  <label className="block text-xs text-gray-500 mb-1">
                    Qty
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={ticket.stock}
                    onChange={(e) =>
                      updateTicket(ticket.id, "stock", parseInt(e.target.value))
                    }
                    className="w-full border p-2 rounded text-sm"
                    required
                  />
                </div>

                {/* Delete Button */}
                <div className="col-span-1 flex justify-center pb-2">
                  <button
                    type="button"
                    onClick={() => removeTicket(ticket.id)}
                    className="text-red-500 hover:text-red-700 disabled:opacity-30"
                    disabled={tickets.length === 1}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 w-full"
        >
          Publish Event
        </button>
      </form>
    </div>
  );
}
