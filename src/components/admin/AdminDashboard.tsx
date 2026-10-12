import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Users, Calendar, Wallet, Trash2, Plus, ArrowLeft, Filter } from 'lucide-react';
import { AdminInputModal } from './AdminInputModal';

interface AdminDashboardProps {
  onBackToApp: () => void;
  currentAngkatan: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToApp, currentAngkatan }) => {
  const [selectedAngkatan, setSelectedAngkatan] = useState(currentAngkatan);
  const [activeTab, setActiveTab] = useState<'member' | 'event' | 'transaction'>('member');
  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    const { data: mData } = await supabase.from('members').select('*').eq('org_id', selectedAngkatan);
    const { data: eData } = await supabase.from('events').select('*').eq('org_id', selectedAngkatan);
    const { data: tData } = await supabase.from('transactions').select('*').eq('org_id', selectedAngkatan);

    setMembers(mData || []);
    setEvents(eData || []);
    setTransactions(tData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAdminData();
  }, [selectedAngkatan]);

  const deleteItem = async (table: string, id: string) => {
    if (!confirm('Hapus item ini dari Supabase?')) return;
    await supabase.from(table).delete().eq('id', id);
    fetchAdminData();
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#16241d] text-white">
      {/* Top Header */}
      <div className="p-4 bg-[#1d2e26] border-b border-[#2d473a] flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button onClick={onBackToApp} className="p-2 bg-[#2a4336] rounded-xl text-[#8da698] hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-bold text-sm">Panel Admin Organisasi</h2>
            <p className="text-[10px] text-[#86cfa7]">Kelola Database Supabase</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3.5 py-2 bg-[#86cfa7] hover:bg-[#97dfb7] text-[#121c17] rounded-xl text-xs font-bold flex items-center space-x-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah</span>
        </button>
      </div>

      {/* Filter Angkatan Selector */}
      <div className="px-4 py-2.5 bg-[#1d2e26]/80 border-b border-[#2d473a] flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-xs text-[#8da698]">
          <Filter className="w-3.5 h-3.5 text-[#86cfa7]" />
          <span>Angkatan:</span>
        </div>
        <input
          type="text"
          value={selectedAngkatan}
          onChange={(e) => setSelectedAngkatan(e.target.value)}
          className="bg-[#2a4336] text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-[#385948] outline-none w-28 text-center"
          placeholder="2026"
        />
      </div>

      {/* Nav Tabs */}
      <div className="flex border-b border-[#2d473a] bg-[#1d2e26]/50 px-4">
        <button
          onClick={() => setActiveTab('member')}
          className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center space-x-1.5 ${
            activeTab === 'member' ? 'border-[#86cfa7] text-[#86cfa7]' : 'border-transparent text-[#8da698]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Pengurus ({members.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('event')}
          className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center space-x-1.5 ${
            activeTab === 'event' ? 'border-[#86cfa7] text-[#86cfa7]' : 'border-transparent text-[#8da698]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Kegiatan ({events.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('transaction')}
          className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center space-x-1.5 ${
            activeTab === 'transaction' ? 'border-[#86cfa7] text-[#86cfa7]' : 'border-transparent text-[#8da698]'
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>Kas ({transactions.length})</span>
        </button>
      </div>

      {/* Konten List Data */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {loading ? (
          <p className="text-center text-xs text-[#8da698] py-8">Mengambil data Angkatan {selectedAngkatan}...</p>
        ) : activeTab === 'member' ? (
          members.length === 0 ? (
            <p className="text-center text-xs text-[#8da698] py-8">Belum ada pengurus di Angkatan {selectedAngkatan}.</p>
          ) : (
            members.map((m) => (
              <div key={m.id} className="p-3 bg-[#2a4336] rounded-2xl flex items-center justify-between border border-[#385948]">
                <div className="flex items-center space-x-3">
                  <img src={m.img} alt={m.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-xs">{m.name}</h4>
                    <p className="text-[10px] text-[#86cfa7]">{m.role} • {m.dept} ({m.tier})</p>
                  </div>
                </div>
                <button onClick={() => deleteItem('members', m.id)} className="p-2 text-rose-400 hover:text-rose-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )
        ) : activeTab === 'event' ? (
          events.length === 0 ? (
            <p className="text-center text-xs text-[#8da698] py-8">Belum ada kegiatan di Angkatan {selectedAngkatan}.</p>
          ) : (
            events.map((e) => (
              <div key={e.id} className="p-3 bg-[#2a4336] rounded-2xl flex items-center justify-between border border-[#385948]">
                <div>
                  <h4 className="font-bold text-xs">{e.title}</h4>
                  <p className="text-[10px] text-[#8da698]">{e.date} • {e.cat}</p>
                </div>
                <button onClick={() => deleteItem('events', e.id)} className="p-2 text-rose-400 hover:text-rose-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )
        ) : (
          transactions.length === 0 ? (
            <p className="text-center text-xs text-[#8da698] py-8">Belum ada kas di Angkatan {selectedAngkatan}.</p>
          ) : (
            transactions.map((t) => (
              <div key={t.id} className="p-3 bg-[#2a4336] rounded-2xl flex items-center justify-between border border-[#385948]">
                <div>
                  <h4 className="font-bold text-xs">{t.title}</h4>
                  <p className="text-[10px] text-[#8da698]">{t.date} • {t.category}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-bold ${t.type === 'in' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {t.type === 'in' ? '+' : '-'}Rp {Number(t.amount).toLocaleString('id-ID')}
                  </span>
                  <button onClick={() => deleteItem('transactions', t.id)} className="p-1 text-rose-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )
        )}
      </div>

      <AdminInputModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultAngkatan={selectedAngkatan}
        type={activeTab}
        onSuccess={fetchAdminData}
      />
    </div>
  );
};