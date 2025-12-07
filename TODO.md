Phase 1: The Core (Deadline: 2 Weeks)
Goal: An admin can create an event, and a user can see it on the homepage.

Setup & Infrastructure
Initialize Next.js project with TypeScript.
Setup PostgreSQL database (Supabase).
Configure Prisma/Drizzle and connect it to the DB.

Authentication
Setup Clerk/NextAuth.
Create User database model.

Event Management (Admin)
Create Event model (title, date, price, total_tickets, description).
Build a simple form to "Create Event".
Build a page to "List My Events".

Public View

Build the Homepage (list all upcoming events).
Build the Single Event Page (show details + "Buy" button—disabled for now).

Phase 2: The Booking Engine (Deadline: 2 Weeks)
Goal: A user can buy a ticket and see it in their dashboard.

Booking Logic

Create Order and Ticket models.
Implement the "Buy" button logic (Database transaction to reserve ticket).

Payments

Integrate Stripe Checkout.
Handle Stripe Webhooks (critical step).

User Dashboard
"My Tickets" page showing QR codes (or just ticket IDs).

Phase 3: Polish & Search (Deadline: 1 Week)

Add search/filter (by category: Tech, AI, Web).
Add email confirmation (using Resend or SendGrid).
