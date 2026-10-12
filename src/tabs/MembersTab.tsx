import React, { useState, useMemo } from 'react';
import type { Member } from '../types';
import { Users, Filter, Hash, FileText } from 'lucide-react';

interface Props {
  members: Member[];
  onSelectMember?: (member: Member) => void;
}

export const MembersTab: React.FC<Props> = ({ members, onSelectMember }) => {
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Ambil daftar unik departemen dari anggota yang ada
  const departments = useMemo(() => {
    const set = new Set<string>();
    members.forEach(m => {
      if (m.dept) set.add(m.dept);
    });
    return Array.from(set).sort();
  }, [members]);

  // Filter dan sorting berdasarkan order_index
  const filteredMembers = useMemo(() => {
    return members
      .filter(m => {
        const matchesDept = selectedDept === 'all' || m.dept.toLowerCase() === selectedDept.toLowerCase();
        const matchesSearch = 
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.dept.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesDept && matchesSearch;
      })
      .sort((a, b) => (a.order_index ?? 99) - (b.order_index ?? 99));
  }, [members, selectedDept, searchQuery]);

  return (
    <div className="space-y-4 pb-24">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Cari nama pengurus, jabatan, atau divisi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1d2e26] border border-[#2d473a] rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#8da698] focus:outline-none focus:border-[#86cfa7]"
        />
      </div>

      {/* Filter Pill Berdasarkan Departemen (Scrollbar Thin Opacity) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5">
        <button
          onClick={() => setSelectedDept('all')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedDept === 'all'
              ? 'bg-[#86cfa7] text-[#0d1612]'
              : 'bg-[#1d2e26] text-[#8da698] border border-[#2d473a] hover:text-white'
          }`}
        >
          Semua Departemen ({members.length})
        </button>

        {departments.map((dept) => {
          const count = members.filter(m => m.dept === dept).length;
          return (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedDept === dept
                  ? 'bg-[#86cfa7] text-[#0d1612]'
                  : 'bg-[#1d2e26] text-[#8da698] border border-[#2d473a] hover:text-white'
              }`}
            >
              {dept} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid Member Sesuai Nomor Urut */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-12 bg-[#1d2e26]/50 border border-[#2d473a] rounded-2xl p-6">
          <Users className="w-10 h-10 text-[#8da698] mx-auto mb-2 opacity-50" />
          <p className="text-xs text-[#8da698]">Tidak ada pengurus ditemukan di departemen ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => onSelectMember && onSelectMember(member)}
              className="p-3.5 bg-[#1d2e26] border border-[#2d473a] rounded-xl hover:border-[#86cfa7]/50 transition-all cursor-pointer flex gap-3 items-start relative group"
            >
              {/* Badge Nomor Urut Hierarki */}
              <div 
                className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-[#2a4336] rounded-md text-[10px] font-bold text-[#86cfa7] border border-[#86cfa7]/20 flex items-center gap-0.5"
                title={`Urutan struktur ke-${member.order_index ?? '-'}`}
              >
                <Hash className="w-2.5 h-2.5" />
                <span>{member.order_index ?? '-'}</span>
              </div>

              {/* Avatar Foto */}
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#15231c] flex-shrink-0 border border-[#2d473a]">
                <img
                  src={member.img || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
                  }}
                />
              </div>

              {/* Info Pengurus */}
              <div className="flex-1 min-w-0 pr-6">
                <h4 className="text-xs font-bold text-white truncate">{member.name}</h4>
                <div className="text-[11px] font-medium text-[#86cfa7] mt-0.5">{member.role}</div>
                <div className="text-[10px] text-[#8da698] inline-block bg-[#15231c] px-2 py-0.5 rounded-md mt-1 border border-[#2d473a]/60">
                  {member.dept}
                </div>

                {/* Deskripsi Peran & Tugas Opsional */}
                {member.role_description && (
                  <p className="text-[11px] text-[#8da698]/90 mt-2 line-clamp-2 leading-relaxed bg-[#15231c]/50 p-2 rounded-lg border border-[#2d473a]/40">
                    {member.role_description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};