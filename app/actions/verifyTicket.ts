"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function verifyTicket(qrCodeToken: string) {
  const { userId } = await auth();

  // 1. Auth Check (Admins Only)
  // In a real app, check if 'userId' has the 'ADMIN' role in DB
  if (!userId) return { success: false, message: "Unauthorized" };

  // 2. Find Ticket
  const ticket = await prisma.ticket.findUnique({
    where: { qrCodeToken },
    include: {
      event: true,
      ticketVariant: true,
      order: {
        include: { user: true }, // We need the user's name
      },
    },
  });

  // 3. Validation Logic
  if (!ticket) {
    return {
      success: false,
      message: "❌ Invalid Ticket: Not found in database.",
    };
  }

  if (ticket.status === "USED") {
    return {
      success: false,
      message: `⚠️ ALREADY USED on ${ticket.updatedAt.toLocaleDateString()} at ${ticket.updatedAt.toLocaleTimeString()}`,
      attendee: ticket.order.user.name,
    };
  }

  if (ticket.status === "CANCELLED") {
    return { success: false, message: "❌ Ticket is CANCELLED." };
  }

  // 4. Mark as USED (The Check-in)
  await prisma.ticket.update({
    where: { id: ticket.id },
    data: { status: "USED" },
  });

  revalidatePath("/admin/scan");

  return {
    success: true,
    message: "✅ VALID TICKET - Check-in Successful!",
    attendee: {
      name: ticket.order.user.name,
      email: ticket.order.user.email,
      ticketType: ticket.ticketVariant.name,
      event: ticket.event.title,
    },
  };
}
