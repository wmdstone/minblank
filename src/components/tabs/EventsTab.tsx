import React, { useState, useMemo } from 'react';
import type { OrgEvent } from '@/types/index';
import {
  Calendar,
  MapPin,
  LayoutList,
  LayoutGrid,
  SlidersHorizontal,
  Check,
  Clock
} from 'lucide-react';

interface EventsTabProps {
  events: OrgEvent[];
  onOpenEvent: (event: OrgEvent) => void;
  searchFilter: string;
}

// Deskripsi penjelas kategori kegiatan
const CAT_DESCRIPTIONS: Record<string, string> = {
  'Lingkungan': 'Aksi nyata pelestarian alam, penanaman pohon, dan kampanye lingkungan hidup.',
  'Edukasi': 'Seminar, pelatihan wawasan, dan lokakarya untuk peningkatan kompetensi keilmuan.',
  'Konferensi': 'Pertemuan akbar, kongres kepengurusan, dan musyawarah tahunan organisasi.',
  'Sosial & Pengabdian': 'Bakti sosial, aksi relawan kemanusiaan, dan pemberdayaan masyarakat sekitar.',
  'Workshop': 'Pelatihan teknis intensif dan pembekalan keahlian praktis para anggota.',
  'Umum': 'Rangkaian agenda umum, kebersamaan internal, dan koordinasi berkala.'
};

export const EventsTab: React.FC<EventsTabProps> = ({ events, onOpenEvent, searchFilter }) => {
  // Multi-select kategori
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'card' | 'compact' | 'carousel'>('card');

  // Ambil daftar unik kategori dari events
  const categories = useMemo(() => {
    const set = new Set<string>();
    events.forEach(e => {
      if (e.category) set.add(e.category);
    });
    return Array.from(set).sort();
  }, [events]);

  const isAllSelected = selectedCats.length === 0;

  const handleToggleCat = (cat: string) => {
    if (selectedCats.includes(cat)) {
      setSelectedCats(prev => prev.filter(c => c !== cat));
    } else {
      setSelectedCats(prev => [...prev, cat]);
    }
  };

  // Filter events berdasarkan multi-select & pencarian
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchCat = isAllSelected || selectedCats.includes(e.category);
      const matchSearch =
        e.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (e.desc || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
        (e.category || '').toLowerCase().includes(searchFilter.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [events, selectedCats, isAllSelected, searchFilter]);

  // Kelompokkan kegiatan per kategori
  const groupedEvents = useMemo(() => {
    const groups: Record<string, OrgEvent[]> = {};
    filteredEvents.forEach(e => {
      const c = e.category || 'Umum';
      if (!groups[c]) groups[c] = [];
      groups[c].push(e);
    });
    return groups;
  }, [filteredEvents]);

  return (
    <div className="space-y-6 pb-24">
      {/* BAR FILTER MULTI-SELECT & CONTAINER MODE (Gaya Kapsul Modern) */}
      <div className="flex items-center gap-2 bg-[#15221b]/90 backdrop-blur-xl p-2 rounded-3xl border border-[#2d473a]/60 shadow-xl shadow-black/20">
        {/* Kolom Kiri: Multi-Select Filter Pills */}
        <div className="relative flex-1 min-w-0">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1">
            <button
              onClick={() => setSelectedCats([])}
              className={`flex-shrink-0 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${isAllSelected
                  ? 'bg-[#86cfa7] text-[#0d1612] shadow-[#86cfa7]/20 scale-105'
                  : 'bg-[#1d2e26]/80 text-[#8da698] border border-[#2d473a]/60 hover:text-white hover:border-[#86cfa7]/40'
                }`}
            >
              {isAllSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              <span>Semua ({events.length})</span>
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCats.includes(cat);
              const count = events.filter(e => e.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => handleToggleCat(cat)}
                  className={`flex-shrink-0 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all flex items-center gap-2 shadow-sm ${isSelected
                      ? 'bg-[#86cfa7] text-[#0d1612] font-bold shadow-[#86cfa7]/20 scale-105'
                      : 'bg-[#1d2e26]/80 text-[#8da698] border border-[#2d473a]/60 hover:text-white hover:border-[#86cfa7]/40'
                    }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isSelected ? 'bg-[#0d1612]/15 text-[#0d1612]' : 'bg-[#2a4336] text-[#86cfa7]'
                    }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Kolom Kanan: Container Toggle Mode Tampilan */}
        <div className="flex items-center bg-[#1d2e26] border border-[#2d473a] p-1.5 rounded-2xl flex-shrink-0 shadow-inner">
          <button
            onClick={() => setViewMode('card')}
            className={`p-2 rounded-xl transition-all ${viewMode === 'card' ? 'bg-[#86cfa7] text-[#0d1612] shadow-md shadow-[#86cfa7]/20' : 'text-[#8da698] hover:text-white'
              }`}
            title="Tampilan Kartu"
          >
            <LayoutList className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('compact')}
            className={`p-2 rounded-xl transition-all ${viewMode === 'compact' ? 'bg-[#86cfa7] text-[#0d1612] shadow-md shadow-[#86cfa7]/20' : 'text-[#8da698] hover:text-white'
              }`}
            title="Tampilan Kompak Grid"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('carousel')}
            className={`p-2 rounded-xl transition-all ${viewMode === 'carousel' ? 'bg-[#86cfa7] text-[#0d1612] shadow-md shadow-[#86cfa7]/20' : 'text-[#8da698] hover:text-white'
              }`}
            title="Tampilan Carousel Geser"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KONTEN KEGIATAN TERKATEGORI */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16 bg-[#1d2e26]/30 backdrop-blur-md border border-[#2d473a]/60 rounded-3xl p-6 shadow-xl">
          <Calendar className="w-12 h-12 text-[#8da698] mx-auto mb-3 opacity-40 animate-pulse" />
          <p className="text-xs text-[#8da698] font-medium">Tidak ada agenda kegiatan yang sesuai filter.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.keys(groupedEvents).map((cat) => {
            const catEvents = groupedEvents[cat];
            const catDesc = CAT_DESCRIPTIONS[cat] || `Kumpulan agenda kegiatan kategori ${cat}.`;

            return (
              <div key={cat} className="space-y-4">
                {/* Header Kategori */}
                <div className="pt-2 border-b border-[#2d473a]/40 pb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-white tracking-wide flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#86cfa7] shadow-sm shadow-[#86cfa7]" />
                      <span>{cat}</span>
                    </h3>
                    <span className="text-[11px] font-bold text-[#86cfa7] bg-[#1d2e26] border border-[#2d473a]/80 px-3 py-1 rounded-full shadow-sm">
                      {catEvents.length} Agenda
                    </span>
                  </div>
                  <p className="text-xs text-[#8da698] mt-1.5 leading-relaxed font-normal">
                    {catDesc}
                  </p>
                </div>

                {/* 1. MODE CARD (Gaya Embedded Foto & Mengambang) */}
                {viewMode === 'card' && (
                  <div className="space-y-4">
                    {catEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => onOpenEvent(event)}
                        className="group relative bg-gradient-to-b from-[#1f3228] to-[#18261f] rounded-[28px] overflow-hidden border border-[#2d473a]/80 p-5 cursor-pointer hover:border-[#86cfa7]/60 hover:shadow-2xl hover:shadow-[#86cfa7]/10 hover:-translate-y-1 transition-all duration-300 space-y-3.5"
                      >
                        {/* Simulai Embedded Photo Frame (Jika event punya gambar, tampilkan di sini, jika tidak buat bingkai estetis) */}
                        <div className="relative w-full h-32 bg-[#15221b] rounded-2xl overflow-hidden border border-[#2d473a]/50 flex items-center justify-center group-hover:border-[#86cfa7]/30 transition-colors">
                          {(event.photos?.[0] || (event as any).img) ? (
                            <img
                              src={event.photos?.[0] || (event as any).img}
                              alt={event.title}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#1d2e26] via-[#243a2f] to-[#1d2e26] flex items-center justify-center">
                              <Calendar className="w-8 h-8 text-[#86cfa7]/30" />
                            </div>
                          )}
                          {/* Status Badge Mengambang */}
                          <div className="absolute top-3 right-3">
                            <span className={`text-[10px] px-2.5 py-1 rounded-xl font-bold uppercase tracking-wider backdrop-blur-md shadow-lg ${event.status === 'upcoming'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                                : event.status === 'ongoing'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                                  : 'bg-zinc-500/20 text-zinc-300 border border-zinc-400/30'
                              }`}>
                              {event.status}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-bold text-white text-sm group-hover:text-[#86cfa7] transition-colors leading-snug">
                            {event.title}
                          </h4>
                          {event.desc && (
                            <p className="text-xs text-[#8da698] line-clamp-2 leading-relaxed">
                              {event.desc}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center justify-between pt-3 border-t border-[#2d473a]/50 text-[11px] text-[#8da698]">
                          <div className="flex items-center space-x-2">
                            <div className="p-1.5 rounded-xl bg-[#25392f] text-[#86cfa7]">
                              <Calendar className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-medium">{event.date}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center space-x-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#86cfa7]" />
                              <span className="truncate max-w-[150px]">{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. MODE COMPACT GRID */}
                {viewMode === 'compact' && (
                  <div className="grid grid-cols-2 gap-3">
                    {catEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => onOpenEvent(event)}
                        className="bg-gradient-to-br from-[#1f3228] to-[#18261f] border border-[#2d473a]/80 rounded-2xl p-3.5 cursor-pointer hover:border-[#86cfa7]/50 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className="text-[10px] text-[#86cfa7] font-bold bg-[#25392f] px-2 py-0.5 rounded-md">{event.date}</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                          </div>
                          <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">{event.title}</h4>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1.5 text-[10px] text-[#8da698] mt-3 pt-2 border-t border-[#2d473a]/40">
                            <MapPin className="w-3 h-3 text-[#86cfa7] flex-shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. MODE CAROUSEL HORIZONTAL */}
                {viewMode === 'carousel' && (
                  <div className="flex gap-3.5 overflow-x-auto no-scrollbar pb-3 pt-1 snap-x">
                    {catEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => onOpenEvent(event)}
                        className="min-w-[260px] max-w-[260px] bg-gradient-to-br from-[#1f3228] to-[#18261f] border border-[#2d473a]/80 rounded-[24px] p-4 flex-shrink-0 cursor-pointer hover:border-[#86cfa7] hover:shadow-xl hover:-translate-y-1 transition-all snap-start flex flex-col justify-between"
                      >
                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] bg-[#25392f] text-[#86cfa7] px-2.5 py-1 rounded-xl font-bold shadow-sm">
                              {event.date}
                            </span>
                            <span className="text-[10px] text-amber-300 font-semibold capitalize bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/20">{event.status}</span>
                          </div>
                          <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">{event.title}</h4>
                          {event.desc && (
                            <p className="text-[10px] text-[#8da698] line-clamp-2 leading-relaxed">
                              {event.desc}
                            </p>
                          )}
                        </div>

                        {event.location && (
                          <div className="flex items-center gap-1.5 text-[10px] text-[#8da698] pt-2.5 border-t border-[#2d473a]/50 mt-3">
                            <MapPin className="w-3 h-3 text-[#86cfa7] flex-shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
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