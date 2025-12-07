// app/actions/getEventById.ts
"use server";

import { prisma } from "@/lib/db";

export async function getEventById(eventId: string) {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    include: {
      organizer: {
        select: { name: true, email: true },
      },
      ticketVariants: true, // We need this to show the price and stock
    },
  });

  return event;
}
