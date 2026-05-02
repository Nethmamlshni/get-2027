"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import { Bus, Home as HomeIcon, Mail, Phone, MessageSquare, ChevronRight } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    enrollmentNumber: "",
    year: "",
    email: "",
    phone: "",
    whatsapp: "",
    transport: "",
    stay: "",
    paymentStatus: "notpaid", // Default value
  });

  const [errors, setErrors] = useState<any>({});

  // --- Countdown Logic ---
  const [timeLeft, setTimeLeft] = useState({
    days: 100,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 100);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "enrollmentNumber") {
      let formattedValue = value.toUpperCase();
      if (!formattedValue.startsWith("UWU/ICT/")) {
        formattedValue = "UWU/ICT/" + formattedValue.replace("UWU/ICT/", "");
      }
      setForm({ ...form, [name]: formattedValue });
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    if (!emailRegex.test(form.email)) newErrors.email = "Enter valid Gmail address";
    
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(form.phone)) newErrors.phone = "Invalid Phone";
    if (!phoneRegex.test(form.whatsapp)) newErrors.whatsapp = "Invalid WhatsApp";
    
    const yearPrefixMap: any = { "1": "25", "2": "24", "3": "23", "4": "22", "5": "21" };
    const selectedYearPrefix = yearPrefixMap[form.year];
    const enrollmentRegex = new RegExp(`^UWU\\/ICT\\/${selectedYearPrefix || "\\d{2}"}\\/\\d{3}$`);
    
    if (!form.year) newErrors.year = "Select year";
    if (!enrollmentRegex.test(form.enrollmentNumber)) {
      newErrors.enrollmentNumber = `Format: UWU/ICT/${selectedYearPrefix || 'YY'}/001`;
    }
    
    if (!form.transport) newErrors.transport = "Select transport";
    if (!form.stay) newErrors.stay = "Select stay";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

// Inside Home component's handleSubmit
const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    const res = await fetch("/api/ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      // Generate QR data
      const qrPayload = {
        name: form.name,
        enrollmentNumber: form.enrollmentNumber,
        year: form.year,
        email: form.email,
        phone: form.phone,
        whatsapp: form.whatsapp,
         transport: form.transport,
        stay: form.stay,
        paymentStatus: form.paymentStatus,
        ticketId: data.ticketId || Date.now(),
      };

      // Convert to QR image
      const qrCode = await QRCode.toDataURL(JSON.stringify(qrPayload));

      // Save data + QR in session storage
      sessionStorage.setItem(
        "ticketData",
        JSON.stringify({
          ...form,
          qrCode,
        })
      );

      router.push("/success");
    } else {
       alert(data.message || "Failed to book ticket.");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("An error occurred. Please try again.");
  }
};
  return (
    <div className="min-h-screen bg-[#002878] flex flex-col items-center p-4 font-sans text-slate-800">
      
      {/* Top Section */}
      <div className="w-full max-w-md flex flex-col items-center mb-6 text-white pt-4">
        <div className="flex justify-between w-full items-start px-2">
           <div className="w-50 h-30 flex items-center justify-center">
             <img 
               src="/extraordinary-artistic-group-hugging-and-smiling-together-cutout-professional-png.webp" 
               alt="Logo"
               
             />
           </div>
           
           <div className="bg-[#bda06d]/20 border border-[#bda06d] p-2 rounded text-center min-w-[110px]">
              <p className="uppercase text-[7px] font-bold tracking-tighter text-[#bda06d]">Event Countdown</p>
              <p className="font-mono font-bold text-xs flex justify-center gap-1">
                <span>{String(timeLeft.days).padStart(2, '0')} days</span>
              </p>
           </div>
        </div>
        
        <h2 className="text-2xl font-light tracking-widest mt-4">GET-TOGETHER</h2>
        <h1 className="text-4xl font-bold text-[#bda06d]">2027</h1>
      </div>

      {/* Ticket Container */}
      <div className="relative w-full max-w-md bg-[#f4f1ea] rounded-[40px] shadow-2xl overflow-hidden pb-8">
        
        <div className="absolute top-20 -left-4 w-8 h-8 bg-[#002878] rounded-full"></div>
        <div className="absolute top-20 -right-4 w-8 h-8 bg-[#002878] rounded-full"></div>
        
        <div className="p-8">
          <h3 className="text-center text-xl font-bold mb-6">Book Your Ticket</h3>
          
          <div className="space-y-4 border-[3px] border-[#d4af37] rounded-3xl p-4 relative">
            <div>
              <input
                name="name"
                placeholder="Name"
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 ring-[#002878]"
              />
              {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
            </div>

            <div className="relative">
              <input
                name="enrollmentNumber"
                value={form.enrollmentNumber}
                placeholder="UWU/ICT/22/065"
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-lg p-3 outline-none"
              />
              <span className="absolute right-3 top-3 text-green-500">✔</span>
              {errors.enrollmentNumber && <p className="text-red-500 text-[10px] mt-1">{errors.enrollmentNumber}</p>}
            </div>

            <select name="year" onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg p-3 outline-none">
                <option value="">Select University Year</option>
                <option value="1">Year 1</option>
                <option value="2">Year 2</option>
                <option value="3">Year 3</option>
                <option value="4">Year 4</option>
                <option value="5">Year 5</option>
            </select>

            <div className="bg-gray-200/50 rounded-xl p-3 border border-gray-300">
              <p className="text-[10px] uppercase font-bold text-gray-500 mb-2 tracking-tighter">Personal Details</p>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3">
                  <Mail size={16} className="text-gray-400 mr-2" />
                  <input name="email" placeholder="example@gmail.com" onChange={handleChange} className="w-full p-2 outline-none text-sm bg-transparent" />
                </div>
                {errors.email && <p className="text-red-500 text-[10px]">{errors.email}</p>}

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3">
                      <Phone size={14} className="text-gray-400 mr-1" />
                      <input name="phone" placeholder="071..." onChange={handleChange} className="w-full p-2 outline-none text-xs bg-transparent" />
                    </div>
                    {errors.phone && <p className="text-red-500 text-[10px]">{errors.phone}</p>}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3">
                      <MessageSquare size={14} className="text-gray-400 mr-1" />
                      <input name="whatsapp" placeholder="077..." onChange={handleChange} className="w-full p-2 outline-none text-xs bg-transparent" />
                    </div>
                    {errors.whatsapp && <p className="text-red-500 text-[10px]">{errors.whatsapp}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#002878] text-white rounded-xl p-3 flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-2">
                <Bus size={20} className="text-[#bda06d]" />
                <span className="text-sm">Need Transport?</span>
              </div>
              <select name="transport" onChange={handleChange} className="bg-transparent text-xs outline-none border-none">
                <option className="text-black" value="">Select</option>
                <option className="text-black" value="Yes">Yes</option>
                <option className="text-black" value="No">No</option>
              </select>
            </div>
               {errors.transport && <p className="text-red-500 text-[10px] mt-1">{errors.transport}</p>}
            <div className="bg-[#002878] text-white rounded-xl p-3 flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-2">
                <HomeIcon size={20} className="text-[#bda06d]" />
                <span className="text-sm">Stay Type</span>
              </div>
              <select name="stay" onChange={handleChange} className="bg-transparent text-xs outline-none border-none">
                <option className="text-black" value="">Select</option>
                <option className="text-black" value="Hostel">Hostel</option>
                <option className="text-black" value="Boarding">Boarding</option>
              </select>
            </div>
            {errors.stay && <p className="text-red-500 text-[10px] mt-1">{errors.stay}</p>}
            <div className="pt-4 border-t-2 border-dashed border-gray-400 mt-4 flex flex-col items-center">
               <p className="text-gray-500 font-bold text-xs uppercase">Total</p>
               <p className="text-2xl font-black">LKR 2,500.00</p>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full cursor-pointer bg-[#002878] text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-all mt-4"
            >
              Book Your Ticket <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}