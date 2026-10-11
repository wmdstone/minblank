import React, { useState } from 'react';
import { orgData } from './data/orgData';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { BottomDrawer } from './components/BottomDrawer';
import { HomeTab } from './tabs/HomeTab';
import { MembersTab } from './tabs/MembersTab';
import { EventsTab } from './tabs/EventsTab';
import { FinanceTab } from './tabs/FinanceTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [angkatan, setAngkatan] = useState('2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [drawer, setDrawer] = useState<{ isOpen: boolean; type: string; payload?: any }>({
    isOpen: false,
    type: ''
  });

  const currentOrg = orgData[angkatan] || orgData['2026'];

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-[#0d1612] p-0 md:p-4">
      {/* Mobile Shell Frame */}
      <div className="w-full max-w-md h-screen md:h-[92vh] md:rounded-[40px] bg-[#1d2e26] shadow-2xl flex flex-col relative overflow-hidden border border-[#2d473a]">
        
        {/* Header Bar */}
        <Header
          angkatan={angkatan}
          onAngkatanChange={setAngkatan}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenNotifications={() => setDrawer({ isOpen: true, type: 'notification' })}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24 pt-4 px-4 space-y-4">
          {activeTab === 'home' && (
            <HomeTab
              data={currentOrg}
              onOpenEvent={(event) => setDrawer({ isOpen: true, type: 'event', payload: event })}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}
          {activeTab === 'members' && (
            <MembersTab
              members={currentOrg.members}
              onOpenMember={(member) => setDrawer({ isOpen: true, type: 'member', payload: member })}
              searchFilter={searchQuery}
            />
          )}
          {activeTab === 'events' && (
            <EventsTab
              events={currentOrg.events}
              onOpenEvent={(event) => setDrawer({ isOpen: true, type: 'event', payload: event })}
              searchFilter={searchQuery}
            />
          )}
          {activeTab === 'finance' && (
            <FinanceTab
              finance={currentOrg.finance}
              onDownloadReport={() => alert('Fitur unduh laporan PDF berhasil diinisiasi!')}
            />
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />

        {/* Slide-Up Drawer */}
        <BottomDrawer
          isOpen={drawer.isOpen}
          type={drawer.type}
          payload={drawer.payload}
          onClose={() => setDrawer({ ...drawer, isOpen: false })}
        />
      </div>
    </div>
  );
}