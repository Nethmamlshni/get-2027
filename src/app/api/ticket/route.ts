import { connectDB } from "../../../../lib/db";
import Ticket from "../../../../models/TicketsModels";

// src/app/api/ticket/route.ts
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const ticket = await Ticket.create(body);

    return Response.json({ success: true, ticket });
  } catch (error: any) {
    // Check for MongoDB Duplicate Key Error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return Response.json(
        { 
          success: false, 
          message: `${field === 'email' ? 'Email' : 'Enrollment Number'} already registered!` 
        }, 
        { status: 400 }
      );
    }

    return Response.json({ success: false, message: "Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    // Sort by newest first so you don't have to scroll to the bottom of your table
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    return Response.json({
      success: true,
      tickets,
    });
  } catch (error) {
    return Response.json({ success: false }, { status: 500 });
  }
}