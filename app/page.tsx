'use client';

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import {
  ExternalLink,
  Clock,
  Trophy,
  CheckCircle2,
  Phone,
  BookOpen,
  CreditCard,
  Award,
  Medal,
  Calendar,
  Instagram,
} from "lucide-react";

// --- KONFIGURASI ---
const FORM_URL = "https://s.id/ngembalansor001";
// Deadline Gelombang 2 (15 Juni)
const DEADLINE_DATE = "2026-06-15T23:59:59";

// Data pendaftar untuk Popup FOMO (Disesuaikan dengan area Jatim/Pasuruan)
const REGISTRANT_DATA = [
  { Nama: "Ahmad Maulana", Asal: "Tutur, Pasuruan" },
  { Nama: "Fatimah Az Zahra", Asal: "Nongkojajar, Pasuruan" },
  { Nama: "Muhammad Rizky", Asal: "Purwosari, Pasuruan" },
  { Nama: "Siti Aisyah", Asal: "Karangploso, Malang" },
  { Nama: "Zaid bin Tsabit", Asal: "Lawang, Malang" },
  { Nama: "Nisa Salsabila", Asal: "Singosari, Malang" },
  { Nama: "Bahrudin Ali", Asal: "Bangil, Pasuruan" },
  { Nama: "Ilham Ramadhan", Asal: "Pandaan, Pasuruan" },
  { Nama: "Dewi Masyithoh", Asal: "Ngembal, Pasuruan" },
];

const SubtleParticles = () => {
  useEffect(() => {
    const canvas = document.getElementById("particle-canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particlesArray: Array<{x: number, y: number, size: number, speedX: number, speedY: number, opacity: number}> = [];
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    for (let i = 0; i < 40; i++) {
        particlesArray.push({
            x: Math.random() * w,
            y: Math.random() * h,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: Math.random() * 0.5 + 0.2, // move upwards slowly
            opacity: Math.random() * 0.5 + 0.1,
        });
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particlesArray.length; i++) {
        let p = particlesArray[i];
        // Gold particles
        ctx.fillStyle = `rgba(192, 153, 77, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.speedX;
        p.y -= p.speedY; 

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
      }
    };

    let animationId: number;
    const animate = () => {
      drawParticles();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    }
  }, []);

  return <canvas id="particle-canvas" className="absolute inset-0 w-full h-full opacity-60" />;
};

export default function LombaRegistrationPage() {
  const { scrollY } = useScroll();
  const backgroundY1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const backgroundY2 = useTransform(scrollY, [0, 1000], [0, -150]);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // State untuk Notifikasi Popup (Toast)
  const [activeToast, setActiveToast] = useState<{nama: string, asal: string} | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);

  // Logika memunculkan Popup pendaftar
  useEffect(() => {
    let showTimeout: NodeJS.Timeout;
    let hideTimeout: NodeJS.Timeout;

    const triggerRandomToast = () => {
      const randomUser =
        REGISTRANT_DATA[Math.floor(Math.random() * REGISTRANT_DATA.length)];

      setActiveToast({
        nama: randomUser.Nama,
        asal: randomUser.Asal,
      });
      setIsToastVisible(true);

      // Sembunyikan popup setelah 7 detik
      hideTimeout = setTimeout(() => {
        setIsToastVisible(false);
        // Munculkan lagi popup baru dalam rentang 3 - 6 detik setelah hilang
        const nextTime = Math.floor(Math.random() * 3000) + 3000;
        showTimeout = setTimeout(triggerRandomToast, nextTime);
      }, 7000);
    };

    // Munculkan popup pertama setelah 1.5 detik halaman dimuat
    showTimeout = setTimeout(triggerRandomToast, 1500);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, []);

  // Logika Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const targetDate = new Date(DEADLINE_DATE).getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRegisterClick = () => {
    window.open(FORM_URL, "_blank");
  };

  // Reusable Card Component for consistent pamphlet styling
  const PamphletCard = ({ title, icon: Icon, children, className = "" }: { title: string, icon: any, children: React.ReactNode, className?: string }) => (
    <div
      className={`rounded-[24px] overflow-hidden shadow-[0_10px_40px_rgba(4,47,33,0.3)] border-[3px] border-[#c0994d] flex flex-col ${className}`}
    >
      <div className="bg-gradient-to-b from-white to-[#f4f1e5] p-3.5 flex items-center justify-center border-b-[3px] border-[#c0994d]">
        <Icon className="text-[#c0994d] mr-3 drop-shadow-sm shrink-0" size={26} />
        <h3 className="font-extrabold text-[#022c22] text-sm md:text-base tracking-[0.2em] uppercase">{title}</h3>
      </div>
      <div className="bg-gradient-to-br from-[#064e3b] via-[#022c22] to-[#042f2e] p-5 md:p-6 text-white flex-grow relative shadow-inner">
        <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );

  // --- KOMPONEN ---

  // Popup Notifikasi yang rapi, ringkas dan presisi
  const SmoothPopup = () => (
    <div className="fixed bottom-6 left-0 right-0 z-[60] flex justify-center px-4 pointer-events-none">
      {isToastVisible && activeToast && (
        <div
          className="bg-[#022c22]/95 backdrop-blur-md border border-[#c0994d]/50 shadow-[0_15px_50px_-10px_rgba(0,0,0,0.8)] rounded-full py-3 px-6 flex items-center gap-4 w-max max-w-full pointer-events-auto"
        >
          {/* Indikator Titik Emas Terang */}
          <div className="w-2.5 h-2.5 bg-[#facc15] rounded-full shadow-[0_0_12px_rgba(250,204,21,0.9)] flex-shrink-0"></div>

          <div className="flex flex-row items-center flex-wrap gap-x-2 gap-y-0.5 pr-2 leading-none">
            <span className="text-[13px] md:text-[15px] font-bold text-white whitespace-nowrap drop-shadow-sm">
              {activeToast.nama}
            </span>
            <span className="text-[13px] md:text-[15px] text-[#fde047] whitespace-nowrap">
              {activeToast.asal}. mendaftar
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdfcf6] font-sans text-gray-900 relative flex flex-col overflow-x-hidden selection:bg-[#064e3b] selection:text-[#fde047]">
      {/* Premium Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[#fdfcf6]"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23064e3b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
        <motion.div 
          style={{ y: backgroundY1 }}
          className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] lg:w-[600px] lg:h-[600px] bg-[#c0994d] rounded-full blur-[100px] opacity-[0.15]" />
        <motion.div 
          style={{ y: backgroundY2 }}
          className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] lg:w-[500px] lg:h-[500px] bg-[#064e3b] rounded-full blur-[120px] opacity-[0.12]" />
        
        {/* Subtle Canvas Particles Effect */}
        <SubtleParticles />
      </div>
      
      {/* Popup Pendaftar FOMO */}
      <SmoothPopup />

      {/* STICKY NAVBAR - LUXURY THEME */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#022c22] via-[#064e3b] to-[#022c22] border-b-[4px] border-[#c0994d] shadow-[0_4px_30px_rgba(0,0,0,0.3)] transition-all h-20 flex items-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4">
              <span className="font-serif font-extrabold text-2xl md:text-3xl tracking-[0.1em] text-white drop-shadow-md uppercase">
                Ansor Ngembal
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Landing Page Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 pb-20 pt-32 md:pt-40 flex-grow w-full">
        
        {/* HERO SECTION - REFINED SERIF TYPOGRAPHY AND CENTERED */}
        <div
           className="flex flex-col items-center justify-center text-center mb-16 md:mb-24"
        >
          <div className="inline-block px-5 py-2 bg-[#064e3b] text-[#fde047] rounded-full text-[10px] md:text-xs font-bold mb-6 shadow-md tracking-[0.2em] uppercase border border-[#c0994d]">
            Special Harlah Ansor
          </div>
          <h1 className="font-serif text-[4rem] sm:text-[5rem] md:text-8xl font-black text-[#022c22] mb-0 drop-shadow-sm leading-none tracking-tight">
            LOMBA
          </h1>
          <h2 className="font-serif text-[2.5rem] sm:text-[3.5rem] md:text-7xl font-bold text-[#c0994d] italic drop-shadow-sm mt-[-5px] md:mt-[-15px]">
            KITAB FIQIH
          </h2>
          
          <button
            onClick={handleRegisterClick}
            className="mt-10 md:mt-12 active:scale-95 text-white font-bold py-4 px-8 md:px-10 rounded-full transition-transform bg-gradient-to-b from-[#064e3b] to-[#022c22] border-[3px] border-[#c0994d] shadow-[0_10px_30px_rgba(6,78,59,0.4)] flex justify-center items-center group cursor-pointer text-base md:text-lg tracking-widest uppercase mb-10 md:mb-12"
          >
            Daftar Sekarang!
          </button>

          {/* COUNTDOWN TIMER */}
          <div className="w-full max-w-2xl mx-auto rounded-[24px] overflow-hidden shadow-[0_10px_40px_rgba(4,47,33,0.3)] border-[3px] border-[#c0994d] flex flex-col">
            <div className="bg-gradient-to-b from-white to-[#f4f1e5] p-3 flex items-center justify-center border-b-[3px] border-[#c0994d]">
              <Clock className="text-[#c0994d] mr-3 drop-shadow-sm shrink-0" size={22} />
              <h3 className="font-extrabold text-[#022c22] text-sm md:text-base tracking-[0.2em] uppercase">Pendaftaran Ditutup</h3>
            </div>
            <div className="bg-gradient-to-br from-[#064e3b] via-[#022c22] to-[#042f2e] p-6 md:p-8 text-white relative shadow-inner">
              <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
              
              <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-5 relative z-10 w-full">
                <div className="bg-black/20 backdrop-blur-sm border border-[#c0994d]/40 rounded-xl py-3 sm:py-4 md:py-6 px-1 md:px-2 flex flex-col items-center justify-center shadow-inner">
                  <span className="text-2xl sm:text-3xl md:text-5xl font-black text-white drop-shadow-md">{timeLeft.days}</span>
                  <span className="text-[9px] sm:text-[10px] md:text-xs text-[#c0994d] mt-1 sm:mt-2 uppercase tracking-[0.2em] font-bold">Hari</span>
                </div>
                <div className="bg-black/20 backdrop-blur-sm border border-[#c0994d]/40 rounded-xl py-3 sm:py-4 md:py-6 px-1 md:px-2 flex flex-col items-center justify-center shadow-inner">
                  <span className="text-2xl sm:text-3xl md:text-5xl font-black text-white drop-shadow-md">{timeLeft.hours.toString().padStart(2, "0")}</span>
                  <span className="text-[9px] sm:text-[10px] md:text-xs text-[#c0994d] mt-1 sm:mt-2 uppercase tracking-[0.2em] font-bold">Jam</span>
                </div>
                <div className="bg-black/20 backdrop-blur-sm border border-[#c0994d]/40 rounded-xl py-3 sm:py-4 md:py-6 px-1 md:px-2 flex flex-col items-center justify-center shadow-inner">
                  <span className="text-2xl sm:text-3xl md:text-5xl font-black text-white drop-shadow-md">{timeLeft.minutes.toString().padStart(2, "0")}</span>
                  <span className="text-[9px] sm:text-[10px] md:text-xs text-[#c0994d] mt-1 sm:mt-2 uppercase tracking-[0.2em] font-bold">Menit</span>
                </div>
                <div className="bg-black/20 backdrop-blur-sm border-t border-[#fde047]/60 border-x border-[#c0994d]/40 border-b border-[#c0994d]/40 rounded-xl py-3 sm:py-4 md:py-6 px-1 md:px-2 flex flex-col items-center justify-center shadow-[inset_0_2px_10px_rgba(253,224,71,0.1)]">
                  <span className="text-2xl sm:text-3xl md:text-5xl font-black text-[#fde047] drop-shadow-[0_0_8px_rgba(253,224,71,0.5)] animate-pulse">{timeLeft.seconds.toString().padStart(2, "0")}</span>
                  <span className="text-[9px] sm:text-[10px] md:text-xs text-[#fde047] mt-1 sm:mt-2 uppercase tracking-[0.2em] font-bold">Detik</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MASONRY/GRID LAYOUT FOR CARDS */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 md:gap-8 mb-16 flex-grow">
          
          {/* WAKTU PENDAFTARAN */}
          <PamphletCard title="Waktu Pendaftaran" icon={Calendar}>
             <div className="relative">
                <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-[#c0994d]/40"></div>
                <ul className="space-y-6 relative z-10 w-full">
                  <li className="flex items-start">
                    <div className="bg-[#c0994d] text-[#022c22] rounded-full mr-5 border-2 border-white shadow-md w-10 h-10 flex items-center justify-center shrink-0">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="font-extrabold text-[#fde047] text-base md:text-lg drop-shadow-sm">Pendaftaran Gel. 1</p>
                      <p className="text-sm text-gray-200 mt-1">22 Mei - 07 Juni</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-[#c0994d] text-[#022c22] rounded-full mr-5 border-2 border-white shadow-md w-10 h-10 flex items-center justify-center shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="font-extrabold text-[#fde047] text-base md:text-lg drop-shadow-sm">Pendaftaran Gel. 2</p>
                      <p className="text-sm text-gray-200 mt-1">08 Juni - 15 Juni</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-[#c0994d] text-[#022c22] rounded-full mr-5 border-2 border-white shadow-md w-10 h-10 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="font-extrabold text-[#fde047] text-base md:text-lg drop-shadow-sm">Pelaksanaan</p>
                      <p className="text-sm text-gray-200 mt-1">Minggu, 21 Juni</p>
                      <p className="text-xs font-bold text-white bg-white/20 inline-block px-2.5 py-1 rounded mt-1.5 border border-white/30 backdrop-blur-sm">20:00 - 21:00 WIB</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-[#c0994d] text-[#022c22] rounded-full mr-5 border-2 border-white shadow-md w-10 h-10 flex items-center justify-center shrink-0">
                      <Award size={20} />
                    </div>
                    <div>
                      <p className="font-extrabold text-[#fde047] text-base md:text-lg drop-shadow-sm">Pengumuman</p>
                      <p className="text-sm text-gray-200 mt-1">Selasa, 23 Juni</p>
                    </div>
                  </li>
                </ul>
             </div>
          </PamphletCard>

          {/* HADIAH UTAMA */}
          <PamphletCard title="Hadiah Utama" icon={Trophy} className="lg:row-span-2">
            <div className="flex flex-col gap-4 h-full pt-2">
              <div className="flex items-center gap-4 bg-gradient-to-r from-[#022c22] to-transparent p-4 rounded-xl border-l-[4px] border-[#fde047]">
                <div className="text-4xl filter drop-shadow-lg">🏆</div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-[#fde047] text-xl tracking-wider">JUARA 1</span>
                  <span className="font-black text-white text-2xl drop-shadow">Rp. 1.000.000</span>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-gradient-to-r from-[#022c22] to-transparent p-4 rounded-xl border-l-[4px] border-slate-300">
                <div className="text-4xl filter drop-shadow-lg grayscale">🏆</div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-slate-300 text-xl tracking-wider">JUARA 2</span>
                  <span className="font-black text-white text-2xl drop-shadow">Rp. 750.000</span>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-gradient-to-r from-[#022c22] to-transparent p-4 rounded-xl border-l-[4px] border-amber-600">
                <div className="text-4xl filter drop-shadow-lg sepia">🏆</div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-amber-500 text-xl tracking-wider">JUARA 3</span>
                  <span className="font-black text-white text-2xl drop-shadow">Rp. 500.000</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                <div className="flex justify-between items-center px-2">
                   <div className="flex items-center gap-3">
                     <Medal size={24} className="text-red-400" />
                     <span className="font-bold text-gray-200 uppercase tracking-widest text-sm">JUARA 4-10</span>
                   </div>
                   <span className="font-bold text-white tracking-wider">Rp. 100.000</span>
                </div>
                <div className="flex justify-between items-center px-2">
                   <div className="flex items-center gap-3">
                     <Award size={24} className="text-yellow-500" />
                     <span className="font-bold text-gray-200 uppercase tracking-widest text-sm">JUARA 11-20</span>
                   </div>
                   <span className="font-bold text-white tracking-wider">Rp. 50.000</span>
                </div>
              </div>
            </div>
          </PamphletCard>

          {/* KONTAK KAMI */}
          <PamphletCard title="Kontak Kami" icon={Phone}>
             <div className="flex flex-col gap-5 justify-center mt-2">
               <a href="https://wa.me/6285649481664" target="_blank" rel="noreferrer" className="flex items-center text-white active:scale-95 transition-transform group bg-white/5 p-3 rounded-xl border border-white/10">
                 <div className="bg-[#c0994d] p-2.5 rounded-full mr-4 shadow-md">
                   <Phone size={20} className="text-[#022c22]" />
                 </div>
                 <span className="font-bold text-base md:text-lg tracking-wider">085649481664</span>
               </a>
               <a href="https://instagram.com/gp_ansor_ngembal" target="_blank" rel="noreferrer" className="flex items-center text-white active:scale-95 transition-transform group bg-white/5 p-3 rounded-xl border border-white/10">
                 <div className="bg-[#c0994d] p-2.5 rounded-full mr-4 shadow-md">
                   <Instagram size={20} className="text-[#022c22]" />
                 </div>
                 <span className="font-bold text-base md:text-lg tracking-wider">@gp_ansor_ngembal</span>
               </a>
             </div>
          </PamphletCard>

          {/* BIAYA PENDAFTARAN */}
          <PamphletCard title="Biaya Pendaftaran" icon={CreditCard}>
             <div className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/10 p-4 rounded-xl border border-white/20 shadow-inner gap-2 sm:gap-0">
                  <p className="text-base text-gray-200 font-bold flex items-center">
                    <span className="bg-[#c0994d] p-1.5 rounded-md mr-3 text-[#022c22]"><Award size={18}/></span>
                    Gelombang 1
                  </p>
                  <p className="text-xl font-black text-[#fde047] drop-shadow">Rp. 25.000</p>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#c0994d]/20 p-4 rounded-xl border border-[#c0994d]/40 shadow-inner gap-2 sm:gap-0">
                  <p className="text-base text-gray-100 font-bold flex items-center">
                    <span className="bg-[#c0994d] p-1.5 rounded-md mr-3 text-[#022c22]"><Award size={18}/></span>
                    Gelombang 2
                  </p>
                  <p className="text-xl font-black text-[#fde047] drop-shadow">Rp. 35.000</p>
                </div>
             </div>
          </PamphletCard>

          {/* KETENTUAN LOMBA */}
          <PamphletCard title="Ketentuan Lomba" icon={BookOpen} className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="text-[#fde047] mr-3 mt-0.5 shrink-0"><CheckCircle2 size={18} /></div>
                  <span className="text-gray-200 leading-loose text-sm md:text-base">Lomba bersifat <strong className="text-white">individu</strong>.</span>
                </li>
                <li className="flex items-start">
                  <div className="text-[#fde047] mr-3 mt-0.5 shrink-0"><CheckCircle2 size={18} /></div>
                  <span className="text-gray-200 leading-loose text-sm md:text-base">Lomba dilaksanakan secara <strong className="text-white">online</strong>.</span>
                </li>
                <li className="flex items-start">
                  <div className="text-[#fde047] mr-3 mt-0.5 shrink-0"><CheckCircle2 size={18} /></div>
                  <span className="text-gray-200 leading-loose text-sm md:text-base">Pertanyaan diambil dari <strong className="text-white italic">kitab fiqih (matan sullamut taufiq)</strong>.</span>
                </li>
                <li className="flex items-start">
                  <div className="text-[#fde047] mr-3 mt-0.5 shrink-0"><CheckCircle2 size={18} /></div>
                  <span className="text-gray-200 leading-loose text-sm md:text-base">Soal berupa <strong className="text-white">pilihan ganda sejumlah 50</strong>.</span>
                </li>
              </ul>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="text-[#fde047] mr-3 mt-0.5 shrink-0"><CheckCircle2 size={18} /></div>
                  <span className="text-gray-200 leading-loose text-sm md:text-base">Pemenang diambil berdasarkan peserta dengan <strong className="text-white">nilai tertinggi</strong>. Apabila terdapat nilai yang sama maka akan diseleksi berdasarkan kecepatan dalam mengerjakan soal.</span>
                </li>
                <li className="flex items-start">
                  <div className="text-[#10b981] mr-3 mt-0.5 shrink-0 bg-white rounded-full p-0.5"><CheckCircle2 size={16} /></div>
                  <span className="text-[#fde047] font-bold leading-loose text-sm md:text-base tracking-wide">Semua peserta mendapatkan E-sertifikat dan E-Book materi.</span>
                </li>
              </ul>
            </div>
          </PamphletCard>

        </div>
        
        {/* FOOTER CALL TO ACTION */}

      </main>

      {/* Footer Banner */}
      <footer className="w-full bg-gradient-to-r from-[#b89552] via-[#e2c77d] to-[#b89552] py-5 mt-auto border-t-[3px] border-[#022c22]">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-[#022c22] font-black text-xs md:text-sm tracking-[0.2em] uppercase drop-shadow-sm">
            ANSOR NGEMBAL CABANG TUTUR, PASURUAN, JAWA TIMUR.
          </p>
        </div>
      </footer>
    </div>
  );
}
