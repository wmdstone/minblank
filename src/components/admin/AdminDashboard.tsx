import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Users, Calendar, Wallet, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { AddMemberModal } from "./addMemberModal"

interface AdminDashboardProps {
  onBackToApp: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToApp }) => {
  const [activeTab, setActiveTab] = useState<'members' | 'events' | 'finance'>('members');
  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const { data: memberData } = await supabase.from('members').select('*').order('created_at', { ascending: false });
    const { data: eventData } = await supabase.from('events').select('*').order('created_at', { ascending: false });
    const { data: txData } = await supabase.from('transactions').select('*').order('date', { ascending: false });

    if (memberData) setMembers(memberData);
    if (eventData) setEvents(eventData);
    if (txData) setTransactions(txData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteItem = async (table: string, id: string) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return;
    await supabase.from(table).delete().eq('id', id);
    fetchData();
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#16241d] text-white">
      {/* Top Bar Admin */}
      <div className="p-4 bg-[#1d2e26] border-b border-[#2d473a] flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button onClick={onBackToApp} className="p-2 bg-[#2a4336] rounded-xl text-[#8da698] hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="font-bold text-sm">Dashboard Admin Organisasi</h2>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3 py-1.5 bg-[#86cfa7] text-[#121c17] rounded-xl text-xs font-bold flex items-center space-x-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah</span>
        </button>
      </div>

      {/* Nav Tabs */}
      <div className="flex border-b border-[#2d473a] bg-[#1d2e26]/60 px-4">
        <button
          onClick={() => setActiveTab('members')}
          className={`py-2.5 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 ${
            activeTab === 'members' ? 'border-[#86cfa7] text-[#86cfa7]' : 'border-transparent text-[#8da698]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Pengurus ({members.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`py-2.5 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 ${
            activeTab === 'events' ? 'border-[#86cfa7] text-[#86cfa7]' : 'border-transparent text-[#8da698]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Kegiatan ({events.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('finance')}
          className={`py-2.5 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 ${
            activeTab === 'finance' ? 'border-[#86cfa7] text-[#86cfa7]' : 'border-transparent text-[#8da698]'
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>Kas ({transactions.length})</span>
        </button>
      </div>

      {/* Konten CRUD */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <p className="text-center text-xs text-[#8da698] py-8">Memuat data dari Supabase...</p>
        ) : activeTab === 'members' ? (
          members.map((m) => (
            <div key={m.id} className="p-3 bg-[#2a4336] rounded-xl flex items-center justify-between border border-[#385948]">
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
        ) : activeTab === 'events' ? (
          events.map((e) => (
            <div key={e.id} className="p-3 bg-[#2a4336] rounded-xl flex items-center justify-between border border-[#385948]">
              <div>
                <h4 className="font-bold text-xs">{e.title}</h4>
                <p className="text-[10px] text-[#8da698]">{e.date} • {e.cat}</p>
              </div>
              <button onClick={() => deleteItem('events', e.id)} className="p-2 text-rose-400 hover:text-rose-300">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          transactions.map((t) => (
            <div key={t.id} className="p-3 bg-[#2a4336] rounded-xl flex items-center justify-between border border-[#385948]">
              <div>
                <h4 className="font-bold text-xs">{t.title}</h4>
                <p className="text-[10px] text-[#8da698]">{t.date} • {t.category}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-bold ${t.type === 'in' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {t.type === 'in' ? '+' : '-'}Rp {Number(t.amount).toLocaleString('id-ID')}
                </span>
                <button onClick={() => deleteItem('transactions', t.id)} className="p-1 text-rose-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form Tambah Pengurus */}
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        orgId="2026"
        onSuccess={fetchData}
      />
    </div>
  );
};