import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { 
  Users, 
  Calendar, 
  Wallet, 
  Plus, 
  ArrowLeft, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  Hash
} from 'lucide-react';
import { AdminInputModal } from './AdminInputModal';
import { MasterDataTab } from './MasterDataTab';
import { RowActionMenu } from './RowActionMenu';
import { getRobotAvatar } from '../../utils/avatar';

interface AdminDashboardProps {
  onBackToApp: () => void;
  currentAngkatan: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToApp, currentAngkatan }) => {
  const [selectedAngkatan, setSelectedAngkatan] = useState(currentAngkatan);
  const [activeTab, setActiveTab] = useState<'member' | 'event' | 'transaction' | 'master'>('member');
  const [availableAngkatan, setAvailableAngkatan] = useState<string[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State Modal (Create, Edit, Duplicate)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'duplicate'>('create');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // State Collapsible Groups (Wikipedia Style)
  const [expandedDept, setExpandedDept] = useState<Record<string, boolean>>({});
  const [expandedCat, setExpandedCat] = useState<Record<string, boolean>>({});

  const fetchAdminData = async () => {
    setLoading(true);
    const { data: orgs } = await supabase.from('organizations').select('id').order('id', { ascending: false });
    const orgList = orgs?.map((o) => o.id) || ['2026', '2025'];
    setAvailableAngkatan(orgList);

    const { data: mData } = await supabase.from('members').select('*').eq('org_id', selectedAngkatan).order('order_index', { ascending: true });
    const { data: eData } = await supabase.from('events').select('*').eq('org_id', selectedAngkatan).order('date', { ascending: true });
    const { data: tData } = await supabase.from('transactions').select('*').eq('org_id', selectedAngkatan).order('date', { ascending: false });

    setMembers(mData || []);
    setEvents(eData || []);
    setTransactions(tData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAdminData();
  }, [selectedAngkatan]);

  // Grouping Pengurus per Departemen
  const groupedMembers = members.reduce((acc: Record<string, any[]>, m) => {
    const dept = m.dept || 'Umum';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(m);
    return acc;
  }, {});

  // Grouping Kegiatan per Kategori
  const groupedEvents = events.reduce((acc: Record<string, any[]>, e) => {
    const cat = e.category || 'Umum';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(e);
    return acc;
  }, {});

  const toggleDept = (dept: string) => {
    setExpandedDept(prev => ({ ...prev, [dept]: !prev[dept] }));
  };

  const toggleCat = (cat: string) => {
    setExpandedCat(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setModalMode('edit');
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleOpenDuplicate = (item: any) => {
    setModalMode('duplicate');
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const deleteItem = async (table: string, id: string) => {
    if (!confirm('Hapus item ini dari database?')) return;
    await supabase.from(table).delete().eq('id', id);
    fetchAdminData();
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#16241d] text-white">
      {/* Top Header */}
      <div className="p-4 bg-[#1d2e26] border-b border-[#2d473a] flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button onClick={onBackToApp} className="p-2 bg-[#2a4336] rounded-xl text-[#8da698] hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-bold text-sm">Dashboard Admin</h2>
            <p className="text-[10px] text-[#86cfa7]">Kelola Data & Master Struktur</p>
          </div>
        </div>

        {activeTab !== 'master' && (
          <button
            onClick={handleOpenCreate}
            className="px-3.5 py-2 bg-[#86cfa7] hover:bg-[#97dfb7] text-[#121c17] rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah</span>
          </button>
        )}
      </div>

      {/* Selector Angkatan */}
      {activeTab !== 'master' && (
        <div className="px-4 py-2.5 bg-[#1d2e26]/80 border-b border-[#2d473a] flex items-center justify-between">
          <span className="text-xs text-[#8da698]">Angkatan Aktif:</span>
          <select
            value={selectedAngkatan}
            onChange={(e) => setSelectedAngkatan(e.target.value)}
            className="bg-[#2a4336] text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-[#385948] outline-none"
          >
            {availableAngkatan.map((yr) => (
              <option key={yr} value={yr}>Angkatan {yr}</option>
            ))}
          </select>
        </div>
      )}

      {/* 4 Tabs Navigasi */}
      <div className="flex border-b border-[#2d473a] bg-[#1d2e26]/50 px-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('member')}
          className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'member' ? 'border-[#86cfa7] text-[#86cfa7]' : 'border-transparent text-[#8da698]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Pengurus ({members.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('event')}
          className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'event' ? 'border-[#86cfa7] text-[#86cfa7]' : 'border-transparent text-[#8da698]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Kegiatan ({events.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('transaction')}
          className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'transaction' ? 'border-[#86cfa7] text-[#86cfa7]' : 'border-transparent text-[#8da698]'
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>Kas ({transactions.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('master')}
          className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'master' ? 'border-[#86cfa7] text-[#86cfa7]' : 'border-transparent text-[#8da698]'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Master Data</span>
        </button>
      </div>

      {/* Konten Tab */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'master' ? (
          <MasterDataTab />
        ) : loading ? (
          <p className="text-center text-xs text-[#8da698] py-8">Memuat data...</p>
        ) : activeTab === 'member' ? (
          members.length === 0 ? (
            <p className="text-center text-xs text-[#8da698] py-8">Belum ada pengurus di Angkatan {selectedAngkatan}.</p>
          ) : (
            // COLLAPSIBLE PENGURUS STYLE HEADING WIKIPEDIA (TANPA WRAPPER KARTU / TANPA OVERFLOW HIDDEN)
            <div className="space-y-6">
              {Object.keys(groupedMembers).map((dept) => {
                const isExpanded = expandedDept[dept] !== false; // default open
                const list = groupedMembers[dept];

                return (
                  <div key={dept} className="space-y-2">
                    {/* Wikipedia Style Heading */}
                    <div
                      onClick={() => toggleDept(dept)}
                      className="flex items-center justify-between py-2 border-b-2 border-[#2d473a] hover:border-[#86cfa7]/60 cursor-pointer select-none transition group"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-1.5 h-4 bg-[#86cfa7] rounded-full inline-block" />
                        <h3 className="text-sm font-bold text-white group-hover:text-[#86cfa7] transition">
                          {dept}
                        </h3>
                        <span className="text-[10px] bg-[#2a4336] text-[#86cfa7] px-2 py-0.5 rounded-full font-bold">
                          {list.length}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-[#8da698]">
                        <span className="text-[10px] hidden sm:inline">{isExpanded ? 'Tutup' : 'Buka'}</span>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-[#86cfa7]" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-[#8da698]" />
                        )}
                      </div>
                    </div>

                    {/* Content Items Langsung Mengalir (Dropdown Bebas Tanpa Clipping) */}
                    {isExpanded && (
                      <div className="space-y-2 pt-1 pl-1">
                        {list.map((m) => (
                          <div
                            key={m.id}
                            className="p-3 bg-[#1d2e26] hover:bg-[#243a30] rounded-2xl flex items-center justify-between border border-[#2d473a] transition relative shadow-sm"
                          >
                            <div className="flex items-center space-x-3">
                              <img
                                src={m.img || getRobotAvatar(m.name)}
                                alt={m.name}
                                className="w-10 h-10 rounded-xl object-cover border border-[#2d473a]"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = getRobotAvatar(m.name);
                                }}
                              />
                              <div>
                                <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                                  <span>{m.name}</span>
                                  <span className="text-[9px] text-[#86cfa7] bg-[#2a4336] px-1.5 py-0.2 rounded font-mono">
                                    #{m.order_index ?? 99}
                                  </span>
                                </h4>
                                <p className="text-[11px] text-[#86cfa7]">{m.role}</p>
                                {m.bio && <p className="text-[10px] text-[#8da698] line-clamp-1 italic">{m.bio}</p>}
                              </div>
                            </div>

                            {/* Dropdown Menu Opsi (Edit, Duplikat, Hapus) */}
                            <RowActionMenu
                              onEdit={() => handleOpenEdit(m)}
                              onDuplicate={() => handleOpenDuplicate(m)}
                              onDelete={() => deleteItem('members', m.id)}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        ) : activeTab === 'event' ? (
          events.length === 0 ? (
            <p className="text-center text-xs text-[#8da698] py-8">Belum ada kegiatan di Angkatan {selectedAngkatan}.</p>
          ) : (
            // COLLAPSIBLE KEGIATAN STYLE HEADING WIKIPEDIA
            <div className="space-y-6">
              {Object.keys(groupedEvents).map((cat) => {
                const isExpanded = expandedCat[cat] !== false; // default open
                const list = groupedEvents[cat];

                return (
                  <div key={cat} className="space-y-2">
                    {/* Wikipedia Style Heading */}
                    <div
                      onClick={() => toggleCat(cat)}
                      className="flex items-center justify-between py-2 border-b-2 border-[#2d473a] hover:border-[#86cfa7]/60 cursor-pointer select-none transition group"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-1.5 h-4 bg-[#86cfa7] rounded-full inline-block" />
                        <h3 className="text-sm font-bold text-white group-hover:text-[#86cfa7] transition">
                          {cat}
                        </h3>
                        <span className="text-[10px] bg-[#2a4336] text-[#86cfa7] px-2 py-0.5 rounded-full font-bold">
                          {list.length}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-[#8da698]">
                        <span className="text-[10px] hidden sm:inline">{isExpanded ? 'Tutup' : 'Buka'}</span>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-[#86cfa7]" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-[#8da698]" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="space-y-2 pt-1 pl-1">
                        {list.map((e) => (
                          <div
                            key={e.id}
                            className="p-3 bg-[#1d2e26] hover:bg-[#243a30] rounded-2xl flex items-center justify-between border border-[#2d473a] transition relative shadow-sm"
                          >
                            <div>
                              <h4 className="font-bold text-xs text-white">{e.title}</h4>
                              <p className="text-[10px] text-[#86cfa7]">{e.date} • {e.status}</p>
                              {e.location && <p className="text-[10px] text-[#8da698]">{e.location}</p>}
                            </div>
                            <RowActionMenu
                              onEdit={() => handleOpenEdit(e)}
                              onDuplicate={() => handleOpenDuplicate(e)}
                              onDelete={() => deleteItem('events', e.id)}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        ) : (
          // TAB KAS
          transactions.length === 0 ? (
            <p className="text-center text-xs text-[#8da698] py-8">Belum ada transaksi kas di Angkatan {selectedAngkatan}.</p>
          ) : (
            <div className="space-y-2">
              {transactions.map((t) => (
                <div key={t.id} className="p-3 bg-[#1d2e26] rounded-2xl flex items-center justify-between border border-[#2d473a]">
                  <div>
                    <h4 className="font-bold text-xs text-white">{t.desc}</h4>
                    <p className="text-[10px] text-[#8da698]">{t.date}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {t.type === 'income' ? '+' : '-'} Rp {Number(t.amount).toLocaleString('id-ID')}
                    </span>
                    <RowActionMenu
                      onEdit={() => handleOpenEdit(t)}
                      onDuplicate={() => handleOpenDuplicate(t)}
                      onDelete={() => deleteItem('transactions', t.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Modal Input/Edit/Duplicate */}
      <AdminInputModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={activeTab === 'master' ? 'member' : activeTab}
        defaultOrgId={selectedAngkatan}
        onSuccess={fetchAdminData}
        initialData={selectedItem}
        mode={modalMode}
      />
    </div>
  );
};