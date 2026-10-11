import React, { useState } from 'react';
import type { OrgEvent } from '../types';
import { Calendar, MapPin, Users } from 'lucide-react';

interface EventsTabProps {
  events: OrgEvent[];
  onOpenEvent: (event: OrgEvent) => void;
  searchFilter: string;
}

export const EventsTab: React.FC<EventsTabProps> = ({ events, onOpenEvent, searchFilter }) => {
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const categories = ['All', 'Lingkungan', 'Edukasi', 'Konferensi'];

  const filtered = events.filter(e => {
    const matchCat = selectedCat === 'All' || e.cat.toLowerCase() === selectedCat.toLowerCase();
    const matchSearch = e.title.toLowerCase().includes(searchFilter.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Category Pills */}
      <div className="flex space-x-2 overflow-x-auto no-scrollbar py-0.5">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
              selectedCat === cat ? 'bg-[#86cfa7] text-[#121c17] font-bold' : 'bg-[#2a4336] text-[#8da698]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filtered.map(event => (
          <div
            key={event.id}
            onClick={() => onOpenEvent(event)}
            className="bg-[#2a4336] rounded-2xl overflow-hidden border border-[#385948] cursor-pointer hover:border-[#86cfa7] transition"
          >
            <img src={event.img} alt={event.title} className="w-full h-32 object-cover" />
            <div className="p-3.5 space-y-2">
              <span className="text-[9px] bg-[#1d2e26] text-[#86cfa7] px-2 py-0.5 rounded font-bold">{event.cat}</span>
              <h4 className="font-bold text-white text-sm">{event.title}</h4>
              <div className="flex justify-between items-center text-[10px] text-[#8da698]">
                <div className="flex items-center space-x-1.5"><Calendar className="w-3.5 h-3.5 text-[#86cfa7]" /><span>{event.date}</span></div>
                <div className="flex items-center space-x-1.5"><MapPin className="w-3.5 h-3.5 text-[#86cfa7]" /><span>{event.location}</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
