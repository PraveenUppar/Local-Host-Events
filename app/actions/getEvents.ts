"use server";

import { prisma } from "@/lib/db";

export async function getEvents() {
  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
    include: {
      ticketVariants: true,
      organizer: { select: { name: true } },
    },
  });
  return events;
}
