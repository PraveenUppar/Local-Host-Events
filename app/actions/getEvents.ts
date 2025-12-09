// app/actions/getEvents.ts
"use server";

import { prisma } from "@/lib/db";

export async function getEvents(query?: string, page: number = 1) {
  const pageSize = 6;
  const skip = (page - 1) * pageSize;
  const events = await prisma.event.findMany({
    where: {
      OR: [
        // Case insensitive search in Title OR Location
        { title: { contains: query || "", mode: "insensitive" } },
        { location: { contains: query || "", mode: "insensitive" } },
        { description: { contains: query || "", mode: "insensitive" } },
      ],
    },
    orderBy: {
      date: "asc",
    },
    take: pageSize, // Fetch only 6
    skip: skip,
    include: {
      ticketVariants: true,
      organizer: {
        select: { name: true },
      },
    },
  });

  const totalEvents = await prisma.event.count({
    where: {
      OR: [
        { title: { contains: query || "", mode: "insensitive" } },
        { location: { contains: query || "", mode: "insensitive" } },
      ],
    },
  });

  return { events, totalCount: totalEvents };
}
