import React, { useEffect, useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CheckCircle,
  ExternalLink,
  Globe,
  MessageCircle,
  Hash,
  Briefcase
} from 'lucide-react';
import { getRobotAvatar } from '@/utils/avatar';

interface BottomDrawerProps {
  isOpen: boolean;
  type: string;
  payload: any;
  onClose: () => void;
}

export const BottomDrawer: React.FC<BottomDrawerProps> = ({ isOpen, type, payload, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setActivePhotoIdx(0);
    } else {
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!mounted && !isOpen) return null;

  // Format link URL agar selalu valid
  const formatUrl = (url?: string) => {
    if (!url) return '';
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  };

  const photosList: string[] = Array.isArray(payload?.photos) && payload.photos.length > 0
    ? payload.photos
    : payload?.img ? [payload.img] : [];

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md bg-[#1d2e26] border-t border-[#385948] rounded-t-[32px] p-5 shadow-2xl space-y-4 max-h-[88vh] overflow-y-auto transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag handle pill */}
        <div className="w-12 h-1 bg-[#385948] rounded-full mx-auto -mt-1 mb-2" />

        <div className="flex justify-between items-center pb-2 border-b border-[#2d473a]">
          <h3 className="text-xs font-bold text-[#86cfa7] uppercase tracking-wider">
            {type === 'member' && 'Profil Pengurus'}
            {type === 'event' && 'Agenda Kegiatan (Mini Blog)'}
            {type === 'notification' && 'Pusat Notifikasi'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#2a4336] text-[#8da698] hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. KONTEN MEMBER (LAYOUT ALA INSTAGRAM) */}
        {type === 'member' && payload && (
          <div className="space-y-4">
            {/* Header: Foto Kiri, Keterangan Kanan ala Instagram */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-[#86cfa7] via-[#2d473a] to-emerald-400 shrink-0 shadow-lg">
                <img
                  src={payload.img || getRobotAvatar(payload.name)}
                  alt={payload.name}
                  className="w-full h-full rounded-full object-cover bg-[#16241d]"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = getRobotAvatar(payload.name);
                  }}
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-extrabold text-white truncate">{payload.name}</h2>
                  <span className="text-[10px] bg-[#2a4336] text-[#86cfa7] px-2 py-0.5 rounded-md font-bold font-mono">
                    #{payload.order_index ?? '-'}
                  </span>
                </div>
                <p className="text-xs text-[#86cfa7] font-semibold">{payload.role}</p>
                <div className="inline-block bg-[#16241d] px-2.5 py-0.5 rounded-lg text-[10px] text-[#8da698] border border-[#2d473a]">
                  {payload.dept}
                </div>
              </div>
            </div>

            {/* Bio Kutipan / Profil Diri */}
            {payload.bio && (
              <div className="p-3 bg-[#16241d] border border-[#2d473a] rounded-xl text-xs text-[#b0c8bb] leading-relaxed">
                <p className="italic">"{payload.bio}"</p>
              </div>
            )}

            {/* BARIS TOMBOL SOSIAL MEDIA OPSIONAL (Instagram, Twitter, LinkedIn, WA, Website, dll) */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-[#8da698] uppercase tracking-wider block">
                Kontak & Jejaring Sosial:
              </span>
              <div className="flex flex-wrap gap-2">
                {payload.instagram && (
                  <a
                    href={formatUrl(payload.instagram.startsWith('@') ? `instagram.com/${payload.instagram.replace('@', '')}` : payload.instagram)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a4336] hover:bg-[#86cfa7] text-[#86cfa7] hover:text-[#0d1612] text-xs font-semibold transition border border-[#385948]"
                  >
                    <span>Instagram</span>
                  </a>
                )}

                {payload.twitter && (
                  <a
                    href={formatUrl(payload.twitter.startsWith('@') ? `twitter.com/${payload.twitter.replace('@', '')}` : payload.twitter)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a4336] hover:bg-[#86cfa7] text-[#86cfa7] hover:text-[#0d1612] text-xs font-semibold transition border border-[#385948]"
                  >
                    <span>Twitter / X</span>
                  </a>
                )}

                {payload.linkedin && (
                  <a
                    href={formatUrl(payload.linkedin)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a4336] hover:bg-[#86cfa7] text-[#86cfa7] hover:text-[#0d1612] text-xs font-semibold transition border border-[#385948]"
                  >
                    <span>LinkedIn</span>
                  </a>
                )}

                {payload.whatsapp && (
                  <a
                    href={formatUrl(payload.whatsapp.startsWith('http') ? payload.whatsapp : `wa.me/${payload.whatsapp.replace(/[^0-9]/g, '')}`)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a4336] hover:bg-emerald-400 text-emerald-300 hover:text-[#0d1612] text-xs font-semibold transition border border-[#385948]"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}

                {payload.website && (
                  <a
                    href={formatUrl(payload.website)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a4336] hover:bg-[#86cfa7] text-[#86cfa7] hover:text-[#0d1612] text-xs font-semibold transition border border-[#385948]"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Portofolio</span>
                  </a>
                )}

                {payload.email && (
                  <a
                    href={`mailto:${payload.email}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a4336] hover:bg-[#86cfa7] text-[#86cfa7] hover:text-[#0d1612] text-xs font-semibold transition border border-[#385948]"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{payload.email}</span>
                  </a>
                )}

                {payload.phone && (
                  <a
                    href={`tel:${payload.phone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a4336] hover:bg-[#86cfa7] text-[#86cfa7] hover:text-[#0d1612] text-xs font-semibold transition border border-[#385948]"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{payload.phone}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Rincian Tugas & Tanggung Jawab (Tupoksi) */}
            {payload.role_description && (
              <div className="p-3 bg-[#16241d] border border-[#2d473a] rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-[#86cfa7] flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  <span>Tugas & Wewenang Jabatan:</span>
                </span>
                <p className="text-xs text-[#8da698] leading-relaxed">
                  {payload.role_description}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 2. KONTEN EVENT MINI BLOG DENGAN PHOTO CAROUSEL */}
        {type === 'event' && payload && (
          <div className="space-y-4">
            {/* Photo Carousel Mini Blog */}
            {photosList.length > 0 ? (
              <div className="space-y-2">
                <div className="relative h-52 w-full rounded-2xl overflow-hidden border border-[#2d473a] bg-[#16241d]">
                  <img
                    src={photosList[activePhotoIdx]}
                    alt={`Foto ${activePhotoIdx + 1}`}
                    className="w-full h-full object-cover transition-all duration-300"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600';
                    }}
                  />
                  {/* Badge Counter & Kategori */}
                  <span className="absolute top-2.5 left-2.5 bg-[#121c17]/80 backdrop-blur-md text-[#86cfa7] text-[10px] font-bold px-2.5 py-1 rounded-md">
                    {payload.category || 'Kegiatan'}
                  </span>
                  {photosList.length > 1 && (
                    <span className="absolute bottom-2.5 right-2.5 bg-[#121c17]/80 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                      {activePhotoIdx + 1} / {photosList.length}
                    </span>
                  )}
                </div>

                {/* Thumbnails Carousel Geser jika foto > 1 */}
                {photosList.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                    {photosList.map((url, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePhotoIdx(idx)}
                        className={`w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition ${
                          activePhotoIdx === idx ? 'border-[#86cfa7] scale-105' : 'border-[#2d473a] opacity-60'
                        }`}
                      >
                        <img src={url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            <div>
              <h2 className="text-base font-extrabold text-white leading-snug">{payload.title}</h2>
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-[#8da698] bg-[#16241d] p-2.5 rounded-xl border border-[#2d473a]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#86cfa7]" />
                  <span>{payload.date}</span>
                </div>
                {payload.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#86cfa7]" />
                    <span>{payload.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Artikel Narasi Deskripsi Mini Blog */}
            <div className="space-y-2 pt-2 border-t border-[#2d473a]">
              <span className="text-[10px] font-bold text-[#86cfa7] uppercase tracking-wider block">
                Tentang Kegiatan:
              </span>
              <p className="text-xs text-[#b0c8bb] leading-relaxed whitespace-pre-line">
                {payload.desc || payload.description || 'Belum ada catatan narasi deskripsi untuk kegiatan ini.'}
              </p>
            </div>
          </div>
        )}

        {/* 3. KONTEN NOTIFIKASI */}
        {type === 'notification' && (
          <div className="space-y-2.5">
            <div className="p-3 bg-[#2a4336] rounded-xl flex items-start space-x-3">
              <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">Sistem Sinkronisasi Aktif</p>
                <p className="text-[10px] text-[#8da698]">Data kegiatan, pengurus, dan kas disinkronkan secara realtime.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};