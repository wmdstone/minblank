import React, { useState } from 'react';
import { Member } from '../types';
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react';

interface MembersTabProps {
  members: { atas: Member[]; menengah: Member[]; bawah: Member[] };
  onOpenMember: (member: Member) => void;
  searchFilter: string;
}

export const MembersTab: React.FC<MembersTabProps> = ({ members, onOpenMember, searchFilter }) => {
  const [viewMode, setViewMode] = useState<'card' | 'grid'>('card');
  const [tier, setTier] = useState<'all' | 'atas' | 'menengah' | 'bawah'>('all');

  const filterList = (list: Member[]) => {
    return list.filter(m => 
      m.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.role.toLowerCase().includes(searchFilter.toLowerCase())
    );
  };

  const renderSection = (title: string, list: Member[], dotColor: string) => {
    const filtered = filterList(list);
    if (filtered.length === 0) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${dotColor}`} />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">{title} ({filtered.length})</h4>
        </div>

        {viewMode === 'card' ? (
          <div className="space-y-2">
            {filtered.map(item => (
              <div
                key={item.id}
                onClick={() => onOpenMember(item)}
                className="bg-[#2a4336] p-3 rounded-2xl flex items-center justify-between border border-[#385948] cursor-pointer hover:border-[#86cfa7] transition"
              >
                <div className="flex items-center space-x-3">
                  <img src={item.img} alt={item.name} className="w-11 h-11 rounded-xl object-cover" />
                  <div>
                    <h5 className="font-bold text-white text-xs">{item.name}</h5>
                    <p className="text-[10px] text-[#86cfa7]">{item.role} • {item.dept}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {filtered.map(item => (
              <div
                key={item.id}
                onClick={() => onOpenMember(item)}
                className="bg-[#2a4336] p-2.5 rounded-xl border border-[#385948] cursor-pointer text-center"
              >
                <img src={item.img} alt={item.name} className="w-14 h-14 mx-auto rounded-xl object-cover mb-1.5" />
                <h5 className="font-bold text-white text-xs truncate">{item.name}</h5>
                <p className="text-[9px] text-[#86cfa7] truncate">{item.role}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Switcher & Filter Pills */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-1 bg-[#2a4336] p-1 rounded-xl text-[10px]">
          {(['all', 'atas', 'menengah', 'bawah'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTier(t)}
              className={`px-2.5 py-1 rounded-lg capitalize ${tier === t ? 'bg-[#385948] text-white font-bold' : 'text-[#8da698]'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          onClick={() => setViewMode(viewMode === 'card' ? 'grid' : 'card')}
          className="p-1.5 bg-[#2a4336] rounded-xl text-[#8da698] hover:text-white"
        >
          {viewMode === 'card' ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
        </button>
      </div>

      {(tier === 'all' || tier === 'atas') && renderSection('Struktur Atas (BPH)', members.atas, 'bg-emerald-400')}
      {(tier === 'all' || tier === 'menengah') && renderSection('Struktur Menengah (Koordinator)', members.menengah, 'bg-blue-400')}
      {(tier === 'all' || tier === 'bawah') && renderSection('Struktur Bawah (Staff)', members.bawah, 'bg-purple-400')}
    </div>
  );
};