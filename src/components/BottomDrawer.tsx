import React from 'react';
import { X, Mail, Phone, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { Member, OrgEvent } from '../types';

interface BottomDrawerProps {
  isOpen: boolean;
  type: string;
  payload: any;
  onClose: () => void;
}

export const BottomDrawer: React.FC<BottomDrawerProps> = ({ isOpen, type, payload, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm transition-opacity">
      <div 
        className="w-full max-w-md bg-[#1d2e26] border-t border-[#385948] rounded-t-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-2 border-b border-[#2d473a]">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {type === 'member' && 'Profil Pengurus'}
            {type === 'event' && 'Detail Kegiatan'}
            {type === 'notification' && 'Notifikasi'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full bg-[#2a4336] text-[#8da698] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {type === 'member' && payload && (
          <div className="space-y-4 text-center">
            <img src={payload.img} alt={payload.name} className="w-24 h-24 mx-auto rounded-2xl object-cover border-2 border-[#86cfa7]" />
            <div>
              <h2 className="text-lg font-extrabold text-white">{payload.name}</h2>
              <p className="text-xs text-[#86cfa7] font-semibold">{payload.role} • {payload.dept}</p>
            </div>
            {payload.bio && <p className="text-xs text-[#b0c8bb] bg-[#2a4336] p-3 rounded-xl">{payload.bio}</p>}
            <div className="space-y-2 text-left text-xs text-[#8da698]">
              {payload.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-[#86cfa7]" />
                  <span>{payload.email}</span>
                </div>
              )}
              {payload.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-[#86cfa7]" />
                  <span>{payload.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {type === 'event' && payload && (
          <div className="space-y-3">
            <img src={payload.img} alt={payload.title} className="w-full h-36 rounded-xl object-cover" />
            <span className="text-[10px] bg-[#2a4336] text-[#86cfa7] px-2 py-0.5 rounded font-bold">
              {payload.cat}
            </span>
            <h2 className="text-base font-bold text-white">{payload.title}</h2>
            <div className="text-xs text-[#8da698] space-y-1">
              <div className="flex items-center space-x-2"><Calendar className="w-3.5 h-3.5 text-[#86cfa7]" /> <span>{payload.date} ({payload.time})</span></div>
              <div className="flex items-center space-x-2"><MapPin className="w-3.5 h-3.5 text-[#86cfa7]" /> <span>{payload.location}</span></div>
            </div>
            <p className="text-xs text-[#b0c8bb] leading-relaxed pt-2 border-t border-[#2d473a]">{payload.desc}</p>
          </div>
        )}

        {type === 'notification' && (
          <div className="space-y-2">
            <div className="p-3 bg-[#2a4336] rounded-xl flex items-start space-x-3">
              <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">Laporan Kas Q3 Diterbitkan</p>
                <p className="text-[10px] text-[#8da698]">Bendahara umum telah mengunggah transparansi mutasi kas.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};