// src/tabs/HomeTab.tsx
import React from 'react';
import type { OrganizationYearData, OrgEvent, Member } from '@/types/index';
import { ArrowRight, Sparkles, Users, Calendar, Wallet } from 'lucide-react';
import { getRobotAvatar } from '@/utils/avatar';

interface HomeTabProps {
  data?: OrganizationYearData;
  onOpenEvent: (event: OrgEvent) => void;
  onNavigateTab: (tab: 'members' | 'events' | 'finance') => void;
  onSelectMember?: (member: Member) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ data, onOpenEvent, onNavigateTab, onSelectMember }) => {
  const stats = data?.stats ?? { membersCount: 0, eventsCount: 0, fundRaised: 'Rp 0' };
  const members = data?.members ?? [];
  const events = data?.events ?? [];

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Overview Banner Glassmorphism */}
      <div className="bg-gradient-to-br from-[#243d31] via-[#1d3328] to-[#162920] rounded-3xl p-5 shadow-2xl border border-[#385948] relative overflow-hidden">
        <div className="flex justify-between items-center mb-2">
          <span className="bg-[#86cfa7]/15 border border-[#86cfa7]/30 text-[#86cfa7] text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Overview Organisasi
          </span>
        </div>
        <h2 className="text-lg font-extrabold text-white mt-1 mb-1 tracking-tight">
          {data?.tagline ?? 'Daya Cipta & Keberlanjutan'}
        </h2>
        <p className="text-xs text-[#a8c4b5] mb-5 leading-relaxed">
          {data?.about ?? 'Satu wadah kolaborasi antar-angkatan dengan transparansi dan struktur terarah.'}
        </p>

        {/* 3 Metric Box */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div
            onClick={() => onNavigateTab('members')}
            className="bg-[#121c17]/70 backdrop-blur-md p-3 rounded-2xl border border-[#2d473a] hover:border-[#86cfa7] transition cursor-pointer"
          >
            <p className="font-extrabold text-[#86cfa7] text-base">{stats.membersCount}</p>
            <p className="text-[10px] text-[#8da698] font-medium flex items-center justify-center gap-1 mt-0.5">
              <Users className="w-2.5 h-2.5" /> Anggota
            </p>
          </div>
          <div
            onClick={() => onNavigateTab('events')}
            className="bg-[#121c17]/70 backdrop-blur-md p-3 rounded-2xl border border-[#2d473a] hover:border-[#86cfa7] transition cursor-pointer"
          >
            <p className="font-extrabold text-[#86cfa7] text-base">{stats.eventsCount}</p>
            <p className="text-[10px] text-[#8da698] font-medium flex items-center justify-center gap-1 mt-0.5">
              <Calendar className="w-2.5 h-2.5" /> Kegiatan
            </p>
          </div>
          <div
            onClick={() => onNavigateTab('finance')}
            className="bg-[#121c17]/70 backdrop-blur-md p-3 rounded-2xl border border-[#2d473a] hover:border-[#86cfa7] transition cursor-pointer"
          >
            <p className="font-extrabold text-[#86cfa7] text-sm truncate">{stats.fundRaised}</p>
            <p className="text-[10px] text-[#8da698] font-medium flex items-center justify-center gap-1 mt-0.5">
              <Wallet className="w-2.5 h-2.5" /> Kas Aktif
            </p>
          </div>
        </div>
      </div>

      {/* CAROUSEL 1: Pengurus & Jajaran */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Jajaran Pengurus</h3>
            <p className="text-[10px] text-[#8da698]">Struktur pimpinan & perwakilan divisi</p>
          </div>
          <button
            onClick={() => onNavigateTab('members')}
            className="text-[10px] text-[#86cfa7] hover:underline flex items-center space-x-1 font-semibold"
          >
            <span>Semua</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex overflow-x-auto space-x-3.5 no-scrollbar py-1 -mx-1 px-1">
          {members.length === 0 ? (
            <p className="text-[11px] text-[#8da698] p-2">Belum ada pengurus terdaftar.</p>
          ) : (
            members.slice(0, 8).map((m) => {
              const avatar = m.img || getRobotAvatar(m.name);
              return (
                <div
                  key={m.id}
                  onClick={() => onSelectMember && onSelectMember(m)}
                  className="min-w-[140px] max-w-[140px] bg-[#1d2e26] rounded-2xl p-3 border border-[#2d473a] hover:border-[#86cfa7] transition cursor-pointer flex flex-col justify-between shadow-lg group"
                >
                  <div>
                    <div className="h-28 rounded-xl overflow-hidden mb-2 bg-[#121c17] border border-[#2d473a]">
                      <img
                        src={avatar}
                        alt={m.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getRobotAvatar(m.name);
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="font-bold text-white text-xs truncate">{m.name}</h4>
                    <p className="text-[10px] text-[#86cfa7] truncate font-medium">{m.role}</p>
                  </div>
                  <div className="mt-2 text-[9px] bg-[#2a4336] text-[#8da698] py-1 rounded-lg text-center font-medium">
                    Profil
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* CAROUSEL 2: Kegiatan Mendatang */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Program & Kegiatan</h3>
            <p className="text-[10px] text-[#8da698]">Agenda aktif periode ini</p>
          </div>
          <button
            onClick={() => onNavigateTab('events')}
            className="text-[10px] text-[#86cfa7] hover:underline flex items-center space-x-1 font-semibold"
          >
            <span>Semua</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="flex overflow-x-auto space-x-3.5 no-scrollbar py-1 -mx-1 px-1">
          {events.length === 0 ? (
            <p className="text-[11px] text-[#8da698] p-2">Belum ada agenda kegiatan.</p>
          ) : (
            events.map((e) => (
              <div
                key={e.id}
                onClick={() => onOpenEvent(e)}
                className="min-w-[200px] max-w-[200px] bg-[#1d2e26] p-3.5 rounded-2xl border border-[#2d473a] cursor-pointer hover:border-[#86cfa7] transition flex flex-col justify-between shadow-lg"
              >
                <div>
                  <span className="text-[9px] bg-[#2a4336] text-[#86cfa7] px-2.5 py-0.5 rounded-full font-bold">
                    {e.category}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-2 line-clamp-1">{e.title}</h4>
                  <p className="text-[10px] text-[#8da698] mt-1 line-clamp-2">{e.desc}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#2d473a] text-[10px] text-[#86cfa7] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{e.date}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
