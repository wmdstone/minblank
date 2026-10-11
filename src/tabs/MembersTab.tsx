import React, { useState } from 'react';
import type { Member } from '../types';
import { LayoutGrid, List, Grid3X3, ChevronRight } from 'lucide-react';

interface MembersTabProps {
  members: {
    atas: Member[];
    menengah: Member[];
    bawah: Member[];
    anggota?: Member[];
  };
  onOpenMember: (member: Member) => void;
  searchFilter: string;
}

type ViewMode = 'card' | 'carousel' | 'compact';

export const MembersTab: React.FC<MembersTabProps> = ({ members, onOpenMember, searchFilter }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('carousel');
  const [tier, setTier] = useState<'all' | 'atas' | 'menengah' | 'bawah'>('all');

  const filterList = (list: Member[] = []) => {
    return list.filter(m =>
      m.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.role.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.dept.toLowerCase().includes(searchFilter.toLowerCase())
    );
  };

  const renderSection = (title: string, list: Member[] = [], dotColor: string) => {
    const filtered = filterList(list);
    if (filtered.length === 0) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${dotColor}`} />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            {title} ({filtered.length})
          </h4>
        </div>

        {/* Mode 1: Carousel Horizontal */}
        {viewMode === 'carousel' && (
          <div className="flex overflow-x-auto space-x-3 no-scrollbar py-1">
            {filtered.map(item => (
              <div
                key={item.id}
                onClick={() => onOpenMember(item)}
                className="min-w-[140px] max-w-[140px] bg-[#2a4336] rounded-2xl p-3 shadow-lg border border-[#385948] cursor-pointer hover:border-[#86cfa7] transition flex flex-col justify-between"
              >
                <div>
                  <div className="h-28 rounded-xl overflow-hidden mb-2 bg-[#1d2e26]">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-white text-xs truncate">{item.name}</h3>
                  <p className="text-[10px] text-[#86cfa7] truncate font-medium">{item.role}</p>
                </div>
                <div className="mt-2 text-[9px] bg-[#1d2e26] text-[#8da698] px-2 py-1 rounded-md flex justify-between items-center">
                  <span>Profil</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mode 2: Card List Vertikal */}
        {viewMode === 'card' && (
          <div className="space-y-2">
            {filtered.map(item => (
              <div
                key={item.id}
                onClick={() => onOpenMember(item)}
                className="bg-[#2a4336] p-3 rounded-2xl flex items-center justify-between border border-[#385948] cursor-pointer hover:bg-[#325041] transition"
              >
                <div className="flex items-center space-x-3">
                  <img src={item.img} alt={item.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h5 className="font-bold text-white text-xs">{item.name}</h5>
                    <p className="text-[10px] text-[#86cfa7]">{item.role} • {item.dept}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8da698]" />
              </div>
            ))}
          </div>
        )}

        {/* Mode 3: Compact Grid Instagram-style 3-kolom */}
        {viewMode === 'compact' && (
          <div className="grid grid-cols-3 gap-2">
            {filtered.map(item => (
              <div
                key={item.id}
                onClick={() => onOpenMember(item)}
                className="group relative bg-[#2a4336] rounded-xl overflow-hidden aspect-square border border-[#385948] cursor-pointer shadow-md"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent p-1.5 flex flex-col justify-end">
                  <p className="text-[10px] font-bold text-white leading-tight truncate">{item.name}</p>
                  <p className="text-[8px] text-[#86cfa7] truncate">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Kontrol filter tingkatan & tombol ganti view */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-1 bg-[#2a4336] p-1 rounded-xl text-[10px]">
          {(['all', 'atas', 'menengah', 'bawah'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={`px-2.5 py-1 rounded-lg capitalize transition ${
                tier === t ? 'bg-[#385948] text-white font-bold' : 'text-[#8da698]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex space-x-1 bg-[#2a4336] p-1 rounded-xl">
          <button
            onClick={() => setViewMode('carousel')}
            className={`p-1.5 rounded-lg transition ${viewMode === 'carousel' ? 'bg-[#385948] text-[#86cfa7]' : 'text-[#8da698]'}`}
            title="Carousel View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`p-1.5 rounded-lg transition ${viewMode === 'card' ? 'bg-[#385948] text-[#86cfa7]' : 'text-[#8da698]'}`}
            title="List Card View"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('compact')}
            className={`p-1.5 rounded-lg transition ${viewMode === 'compact' ? 'bg-[#385948] text-[#86cfa7]' : 'text-[#8da698]'}`}
            title="Compact 3x3 Grid"
          >
            <Grid3X3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {(tier === 'all' || tier === 'atas') && renderSection('Struktur Atas (BPH)', members.atas, 'bg-emerald-400')}
      {(tier === 'all' || tier === 'menengah') && renderSection('Struktur Menengah (Koordinator)', members.menengah, 'bg-blue-400')}
      {(tier === 'all' || tier === 'bawah') && renderSection('Struktur Bawah (Staff)', members.bawah, 'bg-purple-400')}
    </div>
  );
};