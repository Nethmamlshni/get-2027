import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import Ticket from "../../../../../models/TicketsModels";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Define params as a Promise
) {
  try {
    await connectDB();

    // --- THE FIX: Unwrapping the params promise ---
    const { id } = await params; 

    const deletedTicket = await Ticket.findByIdAndDelete(id);

    if (!deletedTicket) {
      return NextResponse.json(
        { success: false, message: "Ticket not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Ticket deleted" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Do the same for GET if you have it
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params; // Unwrap here too
    
    const ticket = await Ticket.findById(id);
    if (!ticket) return NextResponse.json({ success: false }, { status: 404 });
    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}