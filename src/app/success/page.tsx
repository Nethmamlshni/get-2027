"use client";

import { CheckCircle, Download, Home as HomeIcon, MapPin, User, Hash, Plane } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { toPng } from "html-to-image";

export default function SuccessPage() {
  const router = useRouter();
  const ticketRef = useRef<HTMLDivElement>(null);

  const [ticket, setTicket] = useState<any>(null);
  const [qrCode, setQrCode] = useState("");

  // ✅ Load session data
  useEffect(() => {
    const data = sessionStorage.getItem("ticketData");

    if (!data) {
      router.push("/");
      return;
    }

    setTicket(JSON.parse(data));
  }, []);

  // ✅ Generate QR
  useEffect(() => {
    if (!ticket) return;

    const generateQR = async () => {
      const data = {
        ticketId: ticket.enrollmentNumber,
        name: ticket.name,
        transport: ticket.transport,
        stay: ticket.stay,
      };

      const qr = await QRCode.toDataURL(JSON.stringify(data));
      setQrCode(qr);
    };

    generateQR();
  }, [ticket]);

  // ✅ Download ticket
  const handleDownload = async () => {
    if (!ticketRef.current) return;

    const dataUrl = await toPng(ticketRef.current, {
      cacheBust: true,
      backgroundColor: "transparent",
    });

    const link = document.createElement("a");
    link.download = `Ticket-${ticket?.name || "user"}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#002878] flex flex-col items-center justify-center p-4 font-sans">

      {/* SUCCESS HEADER */}
      <div className="text-center mb-8 text-white">
        <CheckCircle size={64} className="text-green-400 mx-auto mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
        <p className="opacity-80">See you at the Get-Together 2027</p>
      </div>

      {/* MAIN TICKET (YOUR OLD DESIGN) */}
      <div className="relative w-full max-w-md bg-[#f4f1ea] rounded-[30px] shadow-2xl overflow-hidden border-t-8 border-[#bda06d]">

        <div className="p-6">

          {/* HEADER */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Event</p>
              <h2 className="text-xl font-bold text-[#002878]">ICT GET-TOGETHER</h2>
            </div>

            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Ticket ID</p>
              <p className="font-mono text-sm font-bold">
                #{ticket?.enrollmentNumber?.split("/")?.pop() || "000"}
              </p>
            </div>
          </div>

          {/* DETAILS BOX */}
          <div className="space-y-4 border-2 border-dashed border-gray-300 rounded-2xl p-4 bg-white/50">

            <div className="flex items-center gap-3">
              <User size={18} className="text-[#bda06d]" />
              <div>
                <p className="text-[9px] uppercase text-gray-400 font-bold">Attendee Name</p>
                <p className="text-sm font-bold text-[#002878] uppercase">
                  {ticket?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Hash size={18} className="text-[#bda06d]" />
              <div>
                <p className="text-[9px] uppercase text-gray-400 font-bold">Enrollment No.</p>
                <p className="text-sm font-bold text-[#002878]">
                  {ticket?.enrollmentNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Plane size={18} className="text-[#bda06d]" />
              <div>
                <p className="text-[9px] uppercase text-gray-400 font-bold">Transport</p>
                <p className="text-sm font-bold text-[#002878]">
                  {ticket?.transport}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-[#bda06d]" />
              <div>
                <p className="text-[9px] uppercase text-gray-400 font-bold">Stay</p>
                <p className="text-sm font-bold text-[#002878]">
                  {ticket?.stay}
                </p>
              </div>
            </div>

            {/* QR */}
            {qrCode && (
              <div className="mt-4 flex justify-center">
                <img src={qrCode} className="w-24 h-24" />
              </div>
            )}

          </div>

          {/* BUTTONS */}
          <div className="p-6 bg-white/80 flex gap-2 mt-6 rounded-2xl">

            <button
              onClick={handleDownload}
              className="flex-1 cursor-pointer bg-[#002878] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm hover:opacity-90"
            >
              <Download size={18} /> Save Ticket
            </button>

            <button
              onClick={() => router.push("/")}
              className="flex-1 cursor-pointer border-2 border-[#002878] text-[#002878] py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm hover:bg-gray-100"
            >
              <HomeIcon size={18} /> Home
            </button>

          </div>
        </div>
      </div>

      {/* ================= HIDDEN PRINT DESIGN (YOUR OLD STYLE RESTORED) ================= */}
      <div className="absolute left-[-9999px]">
        <div
          ref={ticketRef}
          className="w-[500px] h-[220px] bg-white rounded-[25px] flex overflow-hidden font-sans relative text-[#3b4b94]"
        >

          {/* MAIN INFO */}
          <div className="flex-[1.5] p-8 flex flex-col justify-between">
            <h2 className="text-2xl font-bold">ICT Get-Together</h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-[#90e1c5] p-2 rounded-xl text-[#3b4b94]">
                  <Plane size={20} />
                </div>
                <div>
                  <p className="font-bold text-lg leading-none uppercase">
                    {ticket?.name}
                  </p>
                  <p className="text-[#a1a1c2] text-sm">
                    {ticket?.enrollmentNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-[#90e1c5] p-2 rounded-xl text-[#3b4b94]">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="font-bold text-lg leading-none">
                    Golden Hotel, Badulla
                  </p>
                  <p className="text-[#a1a1c2] text-sm">
                    Event Date: 2027/04/05
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CUT LINE */}
          <div className="relative border-l-2 border-dashed border-gray-100 h-full flex items-center">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#002878] rounded-full"></div>
            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-[#002878] rounded-full"></div>
          </div>

          {/* SIDE INFO */}
          <div className="flex-1 p-6 flex flex-col items-center justify-center bg-white">
            <p className="text-2xl font-bold mb-4">5:00 AM</p>

            {qrCode && (
              <img src={qrCode} className="w-24 h-24" />
            )}

            <p className="text-[#a1a1c2] text-sm italic">
              Price: <span className="text-[#f15a24] font-bold">LKR 2500</span>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}