// app/actions/getDashboardStats.ts
"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function getDashboardStats() {
  const { userId } = await auth();
  if (!userId) return null;

  // 1. Fetch all events organized by this user
  const events = await prisma.event.findMany({
    where: { organizerId: userId },
    include: {
      ticketVariants: true, // To get prices
      _count: {
        select: { tickets: true },
      },
    },
  });

  // 2. Calculate Stats
  const totalEvents = events.length;
  let totalTicketsSold = 0;
  let totalRevenue = 0;

  events.forEach((event: any) => {
    const ticketsSold = event._count.tickets;
    totalTicketsSold += ticketsSold;

    // Revenue logic (simplified: assuming first variant price for estimation,
    // or you could do a complex order query. For MVP, this is fast.)
    // A more accurate way is to sum the Order totals directly.
    const price = Number(event.ticketVariants[0]?.price || 0);
    totalRevenue += ticketsSold * price;
  });

  // 3. Fetch Recent Sales (Orders)
  const recentSales = await prisma.order.findMany({
    where: {
      tickets: {
        some: {
          event: { organizerId: userId },
        },
      },
    },
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  return {
    totalEvents,
    totalTicketsSold,
    totalRevenue,
    recentSales,
  };
}
// 4. Return the compiled stats
