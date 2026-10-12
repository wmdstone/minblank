import React, { useState, useMemo } from 'react';
import type { Member } from '@/types/index';
import {
  Users,
  Hash,
  LayoutGrid,
  SlidersHorizontal,
  Check,
  Sparkles
} from 'lucide-react';
import { getRobotAvatar } from '@/utils/avatar';

interface Props {
  members: Member[];
  onSelectMember?: (member: Member) => void;
}

export const MembersTab: React.FC<Props> = ({ members, onSelectMember }) => {
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  // Carousel diset sebagai default
  const [viewMode, setViewMode] = useState<'card' | 'compact' | 'carousel'>('carousel');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const departments = useMemo(() => {
    const set = new Set<string>();
    members.forEach(m => {
      if (m.dept) set.add(m.dept);
    });
    return Array.from(set).sort();
  }, [members]);

  const handleToggleDept = (dept: string) => {
    if (selectedDepts.includes(dept)) {
      setSelectedDepts(prev => prev.filter(d => d !== dept));
    } else {
      setSelectedDepts(prev => [...prev, dept]);
    }
  };

  const isAllSelected = selectedDepts.length === 0;

  const filteredMembers = useMemo(() => {
    return members
      .filter(m => {
        const matchesDept = isAllSelected || selectedDepts.includes(m.dept);
        const matchesSearch =
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.dept.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesDept && matchesSearch;
      })
      .sort((a, b) => (a.order_index ?? 99) - (b.order_index ?? 99));
  }, [members, selectedDepts, isAllSelected, searchQuery]);

  const groupedMembers = useMemo(() => {
    const groups: Record<string, Member[]> = {};
    filteredMembers.forEach(m => {
      const d = m.dept || 'Lainnya';
      if (!groups[d]) groups[d] = [];
      groups[d].push(m);
    });
    return groups;
  }, [filteredMembers]);

  return (
    <div className="space-y-6 pb-24">

      {/* FILTER & VIEW MODE BAR */}
      <div className="flex items-center gap-2 bg-[#15221b]/95 backdrop-blur-2xl p-2.5 rounded-3xl border border-[#2d473a]/70 shadow-2xl shadow-black/40">
        <div className="relative flex-1 min-w-0">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1">
            <button
              onClick={() => setSelectedDepts([])}
              className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${isAllSelected
                ? 'bg-gradient-to-r from-[#86cfa7] to-[#68b68c] text-[#0d1612] shadow-[#86cfa7]/25 scale-105'
                : 'bg-[#1d2e26] text-[#8da698] border border-[#2d473a] hover:text-white hover:border-[#86cfa7]/40'
                }`}
            >
              {isAllSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              <span>Semua ({members.length})</span>
            </button>

            {departments.map((dept) => {
              const isSelected = selectedDepts.includes(dept);
              const count = members.filter(m => m.dept === dept).length;
              return (
                <button
                  key={dept}
                  onClick={() => handleToggleDept(dept)}
                  className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2 shadow-md ${isSelected
                    ? 'bg-gradient-to-r from-[#86cfa7] to-[#68b68c] text-[#0d1612] font-bold shadow-[#86cfa7]/25 scale-105'
                    : 'bg-[#1d2e26] text-[#8da698] border border-[#2d473a] hover:text-white hover:border-[#86cfa7]/40'
                    }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  <span>{dept}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${isSelected ? 'bg-[#0d1612]/20 text-[#0d1612]' : 'bg-[#2a4336] text-[#86cfa7]'
                    }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* View Mode Toggle Switcher */}
        <div className="flex items-center bg-[#1d2e26] border border-[#2d473a] p-1.5 rounded-2xl flex-shrink-0 shadow-inner">
          <button
            onClick={() => setViewMode('carousel')}
            className={`p-2 rounded-xl transition-all ${viewMode === 'carousel' ? 'bg-[#86cfa7] text-[#0d1612] shadow-md shadow-[#86cfa7]/30' : 'text-[#8da698] hover:text-white'
              }`}
            title="Tampilan Geser Carousel"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('compact')}
            className={`p-2 rounded-xl transition-all ${viewMode === 'compact' ? 'bg-[#86cfa7] text-[#0d1612] shadow-md shadow-[#86cfa7]/30' : 'text-[#8da698] hover:text-white'
              }`}
            title="Tampilan Kompak Grid"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KONTEN PENGURUS TERKATEGORI */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-16 bg-[#1d2e26]/30 backdrop-blur-md border border-[#2d473a]/60 rounded-3xl p-6 shadow-xl">
          <Users className="w-12 h-12 text-[#8da698] mx-auto mb-3 opacity-40 animate-pulse" />
          <p className="text-xs text-[#8da698] font-medium">Tidak ada pengurus yang sesuai dengan filter.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.keys(groupedMembers).map((dept) => {
            const deptMemberList = groupedMembers[dept];

            return (
              <div key={dept} className="space-y-4">
                {/* Header Departemen */}
                <div className="pt-2 border-b border-[#2d473a]/50 pb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-white tracking-wide flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#86cfa7] shadow-md shadow-[#86cfa7]" />
                      <span>{dept}</span>
                    </h3>
                    <span className="text-[11px] font-bold text-[#86cfa7] bg-[#1d2e26] border border-[#2d473a] px-3.5 py-1 rounded-full shadow-sm">
                      {deptMemberList.length} Anggota
                    </span>
                  </div>
                </div>
                {/* ================= 1. COMPACT VIEW (Clean Grid Tiles) ================= */}
                {viewMode === 'compact' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {deptMemberList.map((member) => (
                      <div
                        key={member.id}
                        onClick={() => onSelectMember && onSelectMember(member)}
                        className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer border border-[#2d473a] shadow-md group bg-[#0e1713]"
                      >
                        {/* Foto Full Card */}
                        <img
                          src={member.img || getRobotAvatar(member.name)}
                          alt={member.name}
                          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getRobotAvatar(member.name);
                          }}
                        />

                        {/* Gradient Overlay & Text di Bagian Bawah */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1713] via-[#0e1713]/40 to-transparent flex flex-col justify-end p-3">
                          <h4 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-1 drop-shadow-md">
                            {member.name}
                          </h4>
                          <p className="text-[10px] sm:text-xs font-semibold text-[#86cfa7] truncate drop-shadow-md">
                            {member.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ================= 2. CAROUSEL VIEW (Default - Premium Portfolio Cards) ================= */}
                {viewMode === 'carousel' && (
                  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 pt-1 snap-x">
                    {deptMemberList.map((member) => (
                      <div
                        key={member.id}
                        className="min-w-[210px] max-w-[210px] bg-gradient-to-b from-[#1f3228] via-[#17261f] to-[#121e18] border border-[#2d473a] rounded-[24px] p-3.5 flex-shrink-0 cursor-pointer shadow-xl snap-start flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          {/* Embedded Photo Frame dengan Badge Mengambang */}
                          <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-[#0e1713] border border-[#2d473a]/80 shadow-md">
                            <img
                              src={member.img || getRobotAvatar(member.name)}
                              alt={member.name}
                              className="w-full h-full object-cover object-top"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = getRobotAvatar(member.name);
                              }}
                            />
                            {/* Badge Mengambang di Pojok Kanan Atas Foto */}
                            <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-[#0d1612]/85 backdrop-blur-md rounded-xl text-[10px] font-bold text-[#86cfa7] border border-[#86cfa7]/30 flex items-center gap-1 shadow-md">
                              <Sparkles className="w-3 h-3" />
                              <span>#{member.order_index ?? '-'}</span>
                            </div>
                          </div>

                          {/* Member Info */}
                          <div className="space-y-1 text-center px-0.5">
                            <h4 className="text-xs font-bold text-white leading-snug line-clamp-2 break-words">
                              {member.name}
                            </h4>
                            <p className="text-[11px] font-semibold text-[#86cfa7] truncate">
                              {member.role}
                            </p>
                            {member.bio && (
                              <p className="text-[10px] text-[#8da698] italic line-clamp-1 pt-0.5">
                                "{member.bio}"
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Bottom Action Trigger */}
                        <div className="mt-2 text-[12px] bg-[#2a4336] text-white py-2 rounded-lg text-center font-medium"
                          onClick={() => onSelectMember && onSelectMember(member)}>
                          Profil
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};