"use server";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg"; 

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

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
