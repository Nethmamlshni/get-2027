"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle, Download, Home as HomeIcon, MapPin, User, Hash, Plane } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { toPng } from "html-to-image";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const ticketRef = useRef<HTMLDivElement>(null);

  // Extract user details from URL
  const name = searchParams.get("name") || "Guest";
  const enrollmentNumber = searchParams.get("enrollmentNumber") || "N/A";
  const transport = searchParams.get("transport") || "Not Selected";
  const stay = searchParams.get("stay") || "Not Selected";

  const handleDownload = async () => {
    if (ticketRef.current === null) return;

    try {
      // Capture the hidden print-ready ticket
      const dataUrl = await toPng(ticketRef.current, { 
        cacheBust: true,
        backgroundColor: "transparent",
      });
      
      const link = document.createElement("a");
      link.download = `Ticket-${name.replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed", err);
      alert("Could not generate ticket image.");
    }
  };

  return (
    <div className="min-h-screen bg-[#002878] flex flex-col items-center justify-center p-4 font-sans">
      
      {/* Visual Success Card */}
      <div className="text-center mb-8 text-white">
        <CheckCircle size={64} className="text-green-400 mx-auto mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
        <p className="opacity-80">See you at the Get-Together 2027</p>
      </div>

      <div className="relative w-full max-w-md bg-[#f4f1ea] rounded-[30px] shadow-2xl overflow-hidden border-t-8 border-[#bda06d]">
        {/* Ticket UI (What the user sees) */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Event</p>
              <h2 className="text-xl font-bold text-[#002878]">ICT GET-TOGETHER</h2>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Ticket ID</p>
              <p className="font-mono text-sm font-bold">#{enrollmentNumber.split('/').pop() || '000'}</p>
            </div>
          </div>

          <div className="space-y-4 border-2 border-dashed border-gray-300 rounded-2xl p-4 bg-white/50">
            <div className="flex items-center gap-3">
              <User size={18} className="text-[#bda06d]" />
              <div>
                <p className="text-[9px] uppercase text-gray-400 font-bold">Attendee Name</p>
                <p className="text-sm font-bold text-[#002878] uppercase">{name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Hash size={18} className="text-[#bda06d]" />
              <div>
                <p className="text-[9px] uppercase text-gray-400 font-bold">Enrollment No.</p>
                <p className="text-sm font-bold text-[#002878]">{enrollmentNumber}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white/80 flex gap-2 mt-6 rounded-2xl">
            <button 
              onClick={handleDownload}
              className="flex-1 cursor-pointer bg-[#002878] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm hover:opacity-90"
            >
              <Download size={18} /> Save Ticket
            </button>
            <Link href="/" className="flex-1 cursor-pointer border-2 border-[#002878] text-[#002878] py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm hover:bg-gray-100">
              <HomeIcon size={18} /> Home
            </Link>
          </div>
        </div>
      </div>

      {/* --- HIDDEN PRINT TEMPLATE (Styled like Screenshot 2026-04-26 at 19.33.36.png) --- */}
      <div className="absolute left-[-9999px]">
        <div 
          ref={ticketRef}
          className="w-[500px] h-[220px] bg-white rounded-[25px] flex overflow-hidden font-sans relative text-[#3b4b94]"
        >
          {/* Main Info */}
          <div className="flex-[1.5] p-8 flex flex-col justify-between">
            <h2 className="text-2xl font-bold">ICT Get-Together</h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-[#90e1c5] p-2 rounded-xl text-[#3b4b94]"><Plane size={20} /></div>
                <div>
                  <p className="font-bold text-lg leading-none uppercase">{name}</p>
                  <p className="text-[#a1a1c2] text-sm">{enrollmentNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#90e1c5] p-2 rounded-xl text-[#3b4b94]"><MapPin size={20} /></div>
                <div>
                  <p className="font-bold text-lg leading-none">Golden hotel,Badulla</p>
                  <p className="text-[#a1a1c2] text-sm">Event Date: 2027/04/05</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dotted Line and Notches */}
          <div className="relative border-l-2 border-dashed border-gray-100 h-full flex items-center">
             <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#002878] rounded-full"></div>
             <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-[#002878] rounded-full"></div>
          </div>

          {/* Side Info */}
          <div className="flex-1 p-6 flex flex-col items-center justify-center bg-white">
            <p className="text-2xl font-bold mb-4">5:00 AM</p>
            {/* QR code image */}
            
            <p className="text-[#a1a1c2] text-sm italic">Price: <span className="text-[#f15a24] font-bold">LKR 2500</span></p>
          </div>
        </div>
      </div>

    </div>
  );
}