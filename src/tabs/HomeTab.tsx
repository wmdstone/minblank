import React from 'react';
import type { OrganizationYearData, OrgEvent } from '../types';
import { ArrowRight, Calendar, Users, ShieldCheck } from 'lucide-react';

interface HomeTabProps {
  data: OrganizationYearData;
  onOpenEvent: (event: OrgEvent) => void;
  onNavigateTab: (tab: 'members' | 'events' | 'finance') => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ data, onOpenEvent, onNavigateTab }) => {
  return (
    <div className="space-y-5">
      {/* Hero Overview */}
      <div className="bg-gradient-to-br from-[#2a4336] to-[#365746] rounded-3xl p-5 shadow-xl border border-[#426b56] relative overflow-hidden">
        <span className="bg-[#121c17]/60 text-[#86cfa7] text-[10px] font-bold px-3 py-1 rounded-full">
          Ikhtisar 2026
        </span>
        <h2 className="text-lg font-bold text-white mt-2 mb-1">{data.tagline}</h2>
        <p className="text-xs text-[#b0c8bb] mb-4">Satu wadah kolaborasi antar-angkatan dengan transparansi dan struktur terarah.</p>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#1d2e26]/80 p-2.5 rounded-xl border border-[#385948]">
            <p className="font-extrabold text-[#86cfa7] text-sm">{data.overview.membersCount}+</p>
            <p className="text-[10px] text-[#8da698]">Anggota</p>
          </div>
          <div className="bg-[#1d2e26]/80 p-2.5 rounded-xl border border-[#385948]">
            <p className="font-extrabold text-[#86cfa7] text-sm">{data.overview.eventsCount}</p>
            <p className="text-[10px] text-[#8da698]">Kegiatan</p>
          </div>
          <div className="bg-[#1d2e26]/80 p-2.5 rounded-xl border border-[#385948]">
            <p className="font-extrabold text-[#86cfa7] text-sm">{data.overview.transparency}</p>
            <p className="text-[10px] text-[#8da698]">Transparan</p>
          </div>
        </div>
      </div>

      {/* Program Kegiatan Unggulan Carousel */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Kegiatan Mendatang</h3>
          <button onClick={() => onNavigateTab('events')} className="text-[10px] text-[#86cfa7] flex items-center space-x-1">
            <span>Lihat Semua</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex overflow-x-auto space-x-3 no-scrollbar py-1">
          {data.events.map((e) => (
            <div
              key={e.id}
              onClick={() => onOpenEvent(e)}
              className="min-w-[200px] max-w-[200px] bg-[#2a4336] p-3 rounded-2xl border border-[#385948] cursor-pointer hover:border-[#86cfa7] transition"
            >
              <img src={e.img} alt={e.title} className="w-full h-24 object-cover rounded-xl mb-2" />
              <span className="text-[9px] bg-[#1d2e26] text-[#86cfa7] px-2 py-0.5 rounded font-bold">{e.cat}</span>
              <h4 className="text-xs font-bold text-white mt-1 line-clamp-1">{e.title}</h4>
              <p className="text-[10px] text-[#8da698] mt-1">{e.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};