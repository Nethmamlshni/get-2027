// src/models/TicketsModels.ts
import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    enrollmentNumber: { 
      type: String, 
      required: true, 
      unique: true, // Forces uniqueness in MongoDB
      uppercase: true,
      trim: true 
    },
    year: { type: String, required: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, // Forces uniqueness in MongoDB
      lowercase: true,
      trim: true 
    },
    phone: String,
    whatsapp: String,
    transport: String,
    stay: String,
    paymentStatus: { type: String, default: "notpaid" }
  },
  { timestamps: true }
);

export default mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);