"use client";

import { useEffect, useState } from "react";
import { Trash2, MessageSquare, CheckCircle, Bus, Home as HomeIcon, Users } from "lucide-react";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
 const [activeBtn, setActiveBtn] = useState<Record<string, string | null>>(() => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("activeBtn") || "{}");
  }
  return {};
});

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/ticket");
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // --- Statistics Logic ---
  const stats = {
    total: tickets.length,
    transport: tickets.filter(t => t.transport === "Yes").length,
    noTransport: tickets.filter(t => t.transport === "No").length,
    hostel: tickets.filter(t => t.stay === "Hostel").length,
    boarding: tickets.filter(t => t.stay === "Boarding").length,
    // Year-wise count
    y1: tickets.filter(t => t.year === "1").length,
    y2: tickets.filter(t => t.year === "2").length,
    y3: tickets.filter(t => t.year === "3").length,
    y4: tickets.filter(t => t.year === "4").length,

    paymentStatus: {
      paid: tickets.filter(t => t.paymentStatus === "paid").length,
      notPaid: tickets.filter(t => t.paymentStatus === "notpaid").length,
    }
  };

  const deleteTicket = async (id: string) => {
  if (!confirm("Are you sure you want to delete this ticket?")) return;
  
  try {
    // FIX: Changed from /api/ticket?id=${id} to /api/ticket/${id}
    const res = await fetch(`/api/ticket/${id}`, { 
      method: "DELETE" 
    });
    
    const data = await res.json();
    
    if (data.success) {
      setTickets(tickets.filter((t) => t._id !== id));
    } else {
      alert(data.message || "Delete failed");
    }
  } catch (error) {
    console.error("Delete failed:", error);
    alert("An error occurred while deleting.");
  }
};

  const handleWhatsAppClick = (
  ticketId: string,
  type: string,
  whatsapp: string,
  message: string
) => {
  const updated = {
    ...activeBtn,
    [ticketId]: type,
  };

  setActiveBtn(updated);
  localStorage.setItem("activeBtn", JSON.stringify(updated));

  let number = whatsapp.replace(/\D/g, "");
  if (number.startsWith("0")) number = "94" + number.substring(1);

  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
};

  const togglePaymentStatus = async (id: string, currentStatus: string) => {
  const newStatus = currentStatus === "paid" ? "notpaid" : "paid";

  try {
    const res = await fetch(`/api/ticket/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentStatus: newStatus }),
    });

    const data = await res.json();

    if (data.success) {
      setTickets((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, paymentStatus: newStatus } : t
        )
      );
    } else {
      alert(data.message || "Update failed");
    }
  } catch (error) {
    console.error("Update failed:", error);
    alert("Error updating payment status");
  }
};
const resetButtons = () => {
  setActiveBtn({});
  localStorage.removeItem("activeBtn");
};

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-slate-800">
      <h1 className="text-3xl font-black text-[#002878] mb-8 flex items-center gap-2">
        <Users /> Admin Dashboard
      </h1>

      {/* --- Statistics Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-blue-500">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Tickets</p>
          <p className="text-2xl font-black text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-orange-500">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Transport (Yes/No)</p>
          <p className="text-2xl font-black text-orange-600">{stats.transport} / {stats.noTransport}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-green-500">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Stay (Hostel/Boarding)</p>
          <p className="text-2xl font-black text-green-600">{stats.hostel} / {stats.boarding}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-purple-500">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Year Wise (1,2,3,4)</p>
          <p className="text-xl font-black text-purple-600">
            {stats.y1}, {stats.y2}, {stats.y3}, {stats.y4}
          </p>
        </div>
      <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-red-500">
  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
    Payment Status (Paid / Not Paid)
  </p>

  <p className="text-2xl font-black text-red-600">
    {stats.paymentStatus.paid} / {stats.paymentStatus.notPaid}
  </p>
</div>
      </div>

      {/* --- Tickets Table --- */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#002878] text-white text-sm">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Enrollment</th>
                <th className="p-4 text-center">Year</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Paid</th>
                <th className="p-4">Stay</th>
                <th className="p-4 text-center">Bus</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-gray-400">No tickets found in database.</td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-sm">{ticket.name}</td>
                    <td className="p-4 font-mono text-xs text-blue-600">{ticket.enrollmentNumber}</td>
                    <td className="p-4 text-center"><span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold">Y{ticket.year}</span></td>
                    <td className="p-4">
                      <p className="text-xs text-gray-500">{ticket.email}</p>
                      <p className="text-xs font-bold">{ticket.phone}</p>
                    </td>
                    <td className="p-4">
  <div className="flex items-center justify-center gap-2">

    <span
      className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
        ticket.paymentStatus === "paid"
          ? "bg-indigo-100 text-indigo-600"
          : "bg-pink-100 text-pink-600"
      }`}
    >
      {ticket.paymentStatus}
    </span>

    <button
      onClick={() => togglePaymentStatus(ticket._id, ticket.paymentStatus)}
      className="text-[10px] px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 font-bold"
    >
      Payment
    </button>

  </div>
</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${ticket.stay === 'Hostel' ? 'bg-indigo-100 text-indigo-600' : 'bg-pink-100 text-pink-600'}`}>
                        {ticket.stay}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {ticket.transport === "Yes" ? <Bus className="mx-auto text-orange-500" size={18} /> : <span className="text-gray-300 text-xs">-</span>}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                 <button
  onClick={() =>
    handleWhatsAppClick(ticket._id, "msg", ticket.whatsapp, "Hiii!")
  }
  className={`p-2 rounded-lg transition-all ${
    activeBtn[ticket._id] === "msg"
      ? "bg-black text-white"
      : "bg-green-100 text-green-600 hover:bg-green-600 hover:text-white"
  }`}
  title="Send Message"
>
  <MessageSquare size={16} />
</button>
                        <button
  onClick={() =>
    handleWhatsAppClick(
      ticket._id,
      "success",
      ticket.whatsapp,
      "Your ticket booking is successful!"
    )
  }
  className={`p-2 rounded-lg transition-all ${
    activeBtn[ticket._id] === "success"
      ? "bg-black text-white"
      : "bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white"
  }`}
  title="Send Success"
>
  <CheckCircle size={16} />
</button>
                        <button
                          onClick={() => deleteTicket(ticket._id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                          title="Delete Ticket"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}