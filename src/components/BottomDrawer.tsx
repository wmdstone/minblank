import React, { useEffect, useState } from 'react';
import { X, Mail, Phone, MapPin, Calendar, CheckCircle } from 'lucide-react';
import type { Member, OrgEvent } from '../types';

interface BottomDrawerProps {
  isOpen: boolean;
  type: string;
  payload: any;
  onClose: () => void;
}

export const BottomDrawer: React.FC<BottomDrawerProps> = ({ isOpen, type, payload, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
    } else {
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!mounted && !isOpen) return null;

  const fallbackImage = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300';

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md bg-[#1d2e26] border-t border-[#385948] rounded-t-[32px] p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag handle pill */}
        <div className="w-12 h-1.5 bg-[#385948] rounded-full mx-auto -mt-2 mb-3" />

        <div className="flex justify-between items-center pb-2 border-b border-[#2d473a]">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            {type === 'member' && 'Profil Pengurus'}
            {type === 'event' && 'Detail Kegiatan'}
            {type === 'notification' && 'Pusat Notifikasi'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#2a4336] text-[#8da698] hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Konten Member */}
        {type === 'member' && payload && (
          <div className="space-y-4 text-center">
            <img
              src={payload.img}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallbackImage; }}
              alt={payload.name}
              className="w-24 h-24 mx-auto rounded-2xl object-cover border-2 border-[#86cfa7] shadow-lg"
            />
            <div>
              <h2 className="text-lg font-extrabold text-white">{payload.name}</h2>
              <p className="text-xs text-[#86cfa7] font-semibold">{payload.role} • {payload.dept}</p>
            </div>
            {payload.bio && (
              <p className="text-xs text-[#b0c8bb] bg-[#2a4336] p-3 rounded-xl text-left leading-relaxed">
                {payload.bio}
              </p>
            )}
            <div className="space-y-2 text-left text-xs text-[#8da698]">
              {payload.email && (
                <div className="flex items-center space-x-2 bg-[#23372e] p-2.5 rounded-xl">
                  <Mail className="w-4 h-4 text-[#86cfa7]" />
                  <span className="text-white">{payload.email}</span>
                </div>
              )}
              {payload.phone && (
                <div className="flex items-center space-x-2 bg-[#23372e] p-2.5 rounded-xl">
                  <Phone className="w-4 h-4 text-[#86cfa7]" />
                  <span className="text-white">{payload.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Konten Event */}
        {type === 'event' && payload && (
          <div className="space-y-3">
            <div className="h-40 rounded-2xl overflow-hidden relative">
              <img
                src={payload.img}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallbackImage; }}
                alt={payload.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2.5 left-2.5 bg-[#121c17]/80 backdrop-blur-md text-[#86cfa7] text-[10px] font-bold px-2.5 py-1 rounded-md">
                {payload.cat}
              </span>
            </div>
            <h2 className="text-base font-bold text-white mt-2">{payload.title}</h2>
            <div className="text-xs text-[#8da698] space-y-1.5 bg-[#2a4336] p-3 rounded-xl">
              <div className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-[#86cfa7]" />
                <span>{payload.date} ({payload.time})</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#86cfa7]" />
                <span>{payload.location}</span>
              </div>
            </div>
            <p className="text-xs text-[#b0c8bb] leading-relaxed pt-2 border-t border-[#2d473a]">
              {payload.desc}
            </p>
          </div>
        )}

        {/* Konten Notifikasi */}
        {type === 'notification' && (
          <div className="space-y-2.5">
            <div className="p-3 bg-[#2a4336] rounded-xl flex items-start space-x-3">
              <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">Laporan Kas Q3 Diterbitkan</p>
                <p className="text-[10px] text-[#8da698]">Bendahara umum telah memperbarui rekonsiliasi kas kegiatan.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};