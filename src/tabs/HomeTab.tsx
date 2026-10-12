import React from 'react';
import type { OrganizationYearData, OrgEvent } from '../types';
import { ArrowRight } from 'lucide-react';

interface HomeTabProps {
  data?: OrganizationYearData;
  onOpenEvent: (event: OrgEvent) => void;
  onNavigateTab: (tab: 'members' | 'events' | 'finance') => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ data, onOpenEvent, onNavigateTab }) => {
  const stats = data?.stats ?? { membersCount: 0, eventsCount: 0, fundRaised: 'Rp 0' };
  const events = data?.events ?? [];

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-[#2a4336] to-[#365746] rounded-3xl p-5 shadow-xl border border-[#426b56] relative overflow-hidden">
        <span className="bg-[#121c17]/60 text-[#86cfa7] text-[10px] font-bold px-3 py-1 rounded-full">
          Ikhtisar
        </span>
        <h2 className="text-lg font-bold text-white mt-2 mb-1">{data?.tagline ?? 'Memuat...'}</h2>
        <p className="text-xs text-[#b0c8bb] mb-4">
          {data?.about ?? 'Satu wadah kolaborasi antar-angkatan dengan transparansi dan struktur terarah.'}
        </p>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#1d2e26]/80 p-2.5 rounded-xl border border-[#385948]">
            <p className="font-extrabold text-[#86cfa7] text-sm">{stats.membersCount}</p>
            <p className="text-[10px] text-[#8da698]">Anggota</p>
          </div>
          <div className="bg-[#1d2e26]/80 p-2.5 rounded-xl border border-[#385948]">
            <p className="font-extrabold text-[#86cfa7] text-sm">{stats.eventsCount}</p>
            <p className="text-[10px] text-[#8da698]">Kegiatan</p>
          </div>
          <div className="bg-[#1d2e26]/80 p-2.5 rounded-xl border border-[#385948]">
            <p className="font-extrabold text-[#86cfa7] text-sm">{stats.fundRaised}</p>
            <p className="text-[10px] text-[#8da698]">Kas</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Kegiatan Mendatang</h3>
          <button onClick={() => onNavigateTab('events')} className="text-[10px] text-[#86cfa7] flex items-center space-x-1">
            <span>Lihat Semua</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex overflow-x-auto space-x-3 no-scrollbar py-1">
          {events.length === 0 && <p className="text-[11px] text-[#8da698]">Belum ada kegiatan.</p>}
          {events.map((e) => (
            <div
              key={e.id}
              onClick={() => onOpenEvent(e)}
              className="min-w-[200px] max-w-[200px] bg-[#2a4336] p-3 rounded-2xl border border-[#385948] cursor-pointer hover:border-[#86cfa7] transition"
            >
              <span className="text-[9px] bg-[#1d2e26] text-[#86cfa7] px-2 py-0.5 rounded font-bold">{e.category}</span>
              <h4 className="text-xs font-bold text-white mt-1 line-clamp-1">{e.title}</h4>
              <p className="text-[10px] text-[#8da698] mt-1">{e.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
