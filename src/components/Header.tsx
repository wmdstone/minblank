import React from 'react';
import { Bell, Search } from 'lucide-react';

interface HeaderProps {
  angkatan: string;
  onAngkatanChange: (val: string) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  angkatan,
  onAngkatanChange,
  searchQuery,
  onSearchChange,
  onOpenNotifications
}) => {
  return (
    <div className="px-5 pt-3 pb-3 space-y-3 z-10 bg-[#1d2e26] border-b border-[#2d473a]/50">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[10px] tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-[#2a4336] text-[#86cfa7] font-bold">
            Portal SPA
          </span>
          <h1 className="text-xl font-extrabold text-white tracking-tight mt-1">
            GreenGen Org
          </h1>
        </div>
        <button
          onClick={onOpenNotifications}
          className="relative w-10 h-10 rounded-2xl bg-[#2a4336] flex items-center justify-center text-white shadow-md hover:bg-[#385948] transition"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 bg-[#e76f51] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            3
          </span>
        </button>
      </div>

      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-[#779986] w-3.5 h-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari anggota / kegiatan..."
            className="w-full bg-[#2a4336] text-white placeholder-[#779986] text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#86cfa7] transition"
          />
        </div>
        <select
          value={angkatan}
          onChange={(e) => onAngkatanChange(e.target.value)}
          className="bg-[#2a4336] text-emerald-300 text-xs font-semibold rounded-xl px-3 py-2.5 outline-none border border-[#385948] cursor-pointer"
        >
          <option value="2026">Angkatan 2026</option>
          <option value="2025">Angkatan 2025</option>
        </select>
      </div>
    </div>
  );
};