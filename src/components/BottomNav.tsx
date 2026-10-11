import React from 'react';
import { Home, Users, Calendar, Wallet } from 'lucide-react';

export type TabType = 'home' | 'members' | 'events' | 'finance';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Ringkasan', icon: <Home className="w-5 h-5" /> },
    { id: 'members', label: 'Pengurus', icon: <Users className="w-5 h-5" /> },
    { id: 'events', label: 'Kegiatan', icon: <Calendar className="w-5 h-5" /> },
    { id: 'finance', label: 'Keuangan', icon: <Wallet className="w-5 h-5" /> }
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-[#1d2e26]/95 backdrop-blur-md border-t border-[#2d473a] px-4 py-2 flex justify-around items-center z-20">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`flex flex-col items-center py-1 transition ${
              isActive ? 'text-[#86cfa7]' : 'text-[#779986] hover:text-white'
            }`}
          >
            {tab.icon}
            <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
            <div
              className={`w-1 h-1 rounded-full mt-0.5 ${
                isActive ? 'bg-[#86cfa7]' : 'bg-transparent'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};