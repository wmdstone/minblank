import React, { useState } from 'react';
import { useOrgData } from './hooks/useOrgData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { BottomDrawer } from './components/BottomDrawer';
import { Toast } from './components/Toast';
import { HomeTab } from './tabs/HomeTab';
import { MembersTab } from './tabs/MembersTab';
import { EventsTab } from './tabs/EventsTab';
import { FinanceTab } from './tabs/FinanceTab';
import { AdminDashboard } from './components/admin/AdminDashboard';
import type { TabType } from './types';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [angkatan, setAngkatan] = useState<string>('2026');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [drawer, setDrawer] = useState<{ isOpen: boolean; type: string; payload?: any }>({
    isOpen: false,
    type: '',
  });

  // Data dinamis tersambung langsung ke Supabase dengan live-sync
  const { data: currentOrg, isLoading, refetch } = useOrgData(angkatan);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-[#0d1612] p-0 md:p-4 selection:bg-[#3b5848] selection:text-white">
      <div className="w-full max-w-md h-screen md:h-[94vh] md:rounded-[40px] bg-[#1d2e26] shadow-2xl flex flex-col relative overflow-hidden border border-[#2d473a]">
        
        {isAdminMode ? (
          <AdminDashboard
            onBackToApp={() => {
              setIsAdminMode(false);
              refetch(); // Refresh data tampilan publik setelah keluar dari admin
            }}
          />
        ) : (
          <>
            {/* Header Global */}
            <Header
              angkatan={angkatan}
              onAngkatanChange={(yr) => {
                setAngkatan(yr);
                showToast(`Memuat Angkatan ${yr}`);
              }}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onOpenNotifications={() => setDrawer({ isOpen: true, type: 'notification' })}
            />

            {/* Bar Navigasi Mode Admin & Indikator Supabase */}
            <div className="px-4 py-1.5 bg-[#23382d] flex justify-between items-center text-[10px] text-[#86cfa7] border-b border-[#2d473a]">
              <div className="flex items-center space-x-1.5">
                <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                <span>{isLoading ? 'Menyelaraskan Supabase...' : 'Tersambung ke Supabase'}</span>
              </div>
              <button
                onClick={() => setIsAdminMode(true)}
                className="flex items-center space-x-1 font-bold text-white hover:text-[#86cfa7] transition"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Buka Admin Panel</span>
              </button>
            </div>

            {/* Konten Tab yang Terhubung Data Supabase */}
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
                  onDownloadReport={() => showToast('Mengunduh Laporan Kas (PDF)...')}
                />
              )}
            </div>

            {/* Navigasi Bawah */}
            <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />

            {/* Bottom Drawer */}
            <BottomDrawer
              isOpen={drawer.isOpen}
              type={drawer.type}
              payload={drawer.payload}
              onClose={() => setDrawer((prev) => ({ ...prev, isOpen: false }))}
            />

            {/* Toast Notifikasi */}
            {toastMessage && <Toast message={toastMessage} />}
          </>
        )}
      </div>
    </div>
  );
}