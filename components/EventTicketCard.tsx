// components/EventTicketCard.tsx
"use client";

import { useState } from "react";
import { createCheckoutSession } from "@/app/actions/createCheckoutSession";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Check, Ticket } from "lucide-react";

interface TicketVariant {
  id: string;
  name: string;
  price: number; // or Decimal, but treated as number in JS
  totalStock: number;
}

interface EventTicketCardProps {
  ticketVariants: any[]; // Using any[] to bypass Prisma Decimal strict typing for UI, or map it before passing
}

export default function EventTicketCard({
  ticketVariants,
}: EventTicketCardProps) {
  // Default to the first ticket, or null if none exist
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    ticketVariants.length > 0 ? ticketVariants[0].id : null
  );

  // Find the full object of the selected ticket
  const selectedTicket = ticketVariants.find((t) => t.id === selectedTicketId);

  // Helper to handle the buy action
  const handleBuy = async () => {
    if (!selectedTicketId) return;
    await createCheckoutSession(selectedTicketId);
  };

  const isSoldOut = selectedTicket && selectedTicket.totalStock <= 0;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg sticky top-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Get your ticket</h3>

      {/* TICKET OPTIONS LIST */}
      <div className="space-y-3 mb-6">
        {ticketVariants.map((variant) => {
          const isSelected = selectedTicketId === variant.id;
          const isVariantSoldOut = variant.totalStock <= 0;

          return (
            <div
              key={variant.id}
              onClick={() =>
                !isVariantSoldOut && setSelectedTicketId(variant.id)
              }
              className={`
                relative p-4 rounded-lg border cursor-pointer transition-all
                ${
                  isVariantSoldOut
                    ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
                    : isSelected
                    ? "border-black bg-gray-50 ring-1 ring-black"
                    : "border-gray-200 hover:border-gray-400"
                }
              `}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {/* Radio Circle */}
                  <div
                    className={`
                    w-5 h-5 rounded-full border flex items-center justify-center
                    ${isSelected ? "border-black bg-black" : "border-gray-300"}
                  `}
                  >
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>

                  <div>
                    <span className="font-medium block text-sm sm:text-base text-gray-900">
                      {variant.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {isVariantSoldOut
                        ? "SOLD OUT"
                        : `${variant.totalStock} seats left`}
                    </span>
                  </div>
                </div>

                <span className="font-bold text-lg">
                  ${Number(variant.price)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* BUY BUTTON SECTION */}
      <div className="mt-6">
        <SignedIn>
          <form action={handleBuy}>
            <button
              type="submit"
              disabled={!selectedTicket || isSoldOut}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black"
            >
              {isSoldOut ? (
                "Sold Out"
              ) : (
                <>
                  Buy Ticket{" "}
                  {selectedTicket &&
                    Number(selectedTicket.price) === 0 &&
                    "(Free)"}
                </>
              )}
            </button>
          </form>
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <button className="w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors border border-gray-200">
              Sign in to Buy Ticket
            </button>
          </SignInButton>
        </SignedOut>
      </div>

      <p className="text-xs text-center text-gray-400 mt-4">
        Powered by Stripe • Secure Checkout
      </p>
    </div>
  );
}
