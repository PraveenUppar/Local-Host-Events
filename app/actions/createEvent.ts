// app/actions/createEvent.ts
"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export async function createEvent(formData: FormData) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  // 1. Sync User (Your existing logic)
  const dbUser = await prisma.user.upsert({
    where: { email: user.emailAddresses[0].emailAddress },
    update: {},
    create: {
      id: userId,
      email: user.emailAddresses[0].emailAddress,
      name:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Organizer",
      role: "ADMIN",
    },
  });

  // 2. Extract Event Fields
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const location = formData.get("location") as string;
  const dateStr = formData.get("date") as string;

  // 3. Extract and Parse Ticket Variants
  const ticketVariantsJson = formData.get("ticketVariants") as string;

  interface VariantInput {
    name: string;
    price: number;
    stock: number;
  }

  let variants: VariantInput[] = [];
  try {
    variants = JSON.parse(ticketVariantsJson);
  } catch (e) {
    throw new Error("Invalid ticket variants data");
  }

  // 4. Create Event WITH Multiple Ticket Variants
  await prisma.event.create({
    data: {
      title,
      description,
      location,
      date: new Date(dateStr),
      organizerId: dbUser.id,

      // Prisma Nested Write: Create all variants in one go!
      ticketVariants: {
        create: variants.map((v) => ({
          name: v.name,
          price: v.price,
          totalStock: v.stock,
        })),
      },
    },
  });

  redirect("/");
}
