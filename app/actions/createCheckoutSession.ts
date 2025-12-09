// app/actions/createCheckoutSession.ts
"use server";

import { Stripe } from "stripe";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

// ADD: Accept couponCode as a second argument
export async function createCheckoutSession(
  ticketVariantId: string,
  couponCode?: string
) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) redirect("/sign-in");

  const ticketVariant = await prisma.ticketVariant.findUnique({
    where: { id: ticketVariantId },
    include: { event: true },
  });

  if (!ticketVariant) throw new Error("Ticket not found");

  // --- DISCOUNT LOGIC START ---
  let finalPrice = Number(ticketVariant.price);
  let couponId = null;

  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode },
    });

    // Validations
    if (coupon) {
      if (coupon.usageLimit > coupon.usedCount) {
        // Check if coupon belongs to this event (or is global)
        if (!coupon.eventId || coupon.eventId === ticketVariant.eventId) {
          const discountAmount = (finalPrice * coupon.discountPercentage) / 100;
          finalPrice = finalPrice - discountAmount;
          couponId = coupon.id; // Save ID to track usage later
        }
      }
    }
  }

  // Safety: Ensure price never goes below 0.50 (Stripe minimum)
  if (finalPrice < 0.5) finalPrice = 0.5;
  // --- DISCOUNT LOGIC END ---

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: user.emailAddresses[0].emailAddress,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            // Show the original name + coupon note
            name: `${ticketVariant.event.title} - ${ticketVariant.name} ${
              couponCode ? `(Code: ${couponCode})` : ""
            }`,
          },
          unit_amount: Math.round(finalPrice * 100), // Use the Calculated Price
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/events/${ticketVariant.event.id}`,
    metadata: {
      userId,
      ticketVariantId: ticketVariant.id,
      eventId: ticketVariant.event.id,
      couponId: couponId, // Pass this so we can update usage count in verifyPurchase
    },
  });

  redirect(session.url!);
}
