// app/actions/createEvent.ts
"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export async function createEvent(formData: FormData) {
  // Get the current user from Clerk
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  // Use the Clerk ID as the Postgres ID for 1:1 mapping
  const dbUser = await prisma.user.upsert({
    where: { email: user.emailAddresses[0].emailAddress },
    update: {}, // If exists, do nothing
    create: {
      id: userId, // Match the database ID to Clerk ID
      email: user.emailAddresses[0].emailAddress,
      name:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Organizer",
      role: "ADMIN", // Auto-promote to admin for now
    },
  });

  // Extract data from form
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const dateStr = formData.get("date") as string;

  const ticketName = formData.get("ticketName") as string;
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));

  // Create the Event AND the TicketVariant in one transaction
  await prisma.event.create({
    data: {
      title,
      description,
      location,
      date: new Date(dateStr),
      organizerId: dbUser.id, // Link to the organizer

      // Create the ticket type automatically
      ticketVariants: {
        create: {
          name: ticketName,
          price: price,
          totalStock: stock,
        },
      },
    },
  });

  // 5. Redirect back to home to see the new event
  redirect("/");
}
