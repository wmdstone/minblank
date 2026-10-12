import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { X, User, Calendar, DollarSign, Upload, AlertCircle, Hash } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: 'member' | 'event' | 'transaction';
  defaultOrgId: string;
  onSuccess: () => void;
}

export const AdminInputModal: React.FC<Props> = ({
  isOpen,
  onClose,
  type,
  defaultOrgId,
  onSuccess
}) => {
  const [targetOrgId, setTargetOrgId] = useState(defaultOrgId);
  const [availableOrgs, setAvailableOrgs] = useState<{ id: string; name: string }[]>([]);
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [deptList, setDeptList] = useState<string[]>([]);
  const [rolesList, setRolesList] = useState<{ title: string; order_index: number; description?: string }[]>([]);

  // Member form state
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [memberOrderIndex, setMemberOrderIndex] = useState<number>(1);
  const [memberDept, setMemberDept] = useState('');
  const [memberImg, setMemberImg] = useState('');
  const [memberRoleDesc, setMemberRoleDesc] = useState('');

  // Event form state
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventStatus, setEventStatus] = useState<'upcoming' | 'completed' | 'ongoing'>('upcoming');

  // Transaction form state
  const [txDesc, setTxDesc] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState<'income' | 'expense'>('expense');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTargetOrgId(defaultOrgId);
      loadMasterOptions();
    }
  }, [isOpen, defaultOrgId]);

  const loadMasterOptions = async () => {
    try {
      const [orgsRes, catRes, deptRes, roleRes] = await Promise.all([
        supabase.from('organizations').select('id, name').order('id', { ascending: true }),
        supabase.from('master_event_categories').select('name').order('name'),
        supabase.from('master_departments').select('name').order('name'),
        supabase.from('master_roles').select('title, order_index, description').order('order_index', { ascending: true })
      ]);

      if (orgsRes.data) setAvailableOrgs(orgsRes.data);
      if (catRes.data) setCategoriesList(catRes.data.map(c => c.name));
      if (deptRes.data) setDeptList(deptRes.data.map(d => d.name));
      if (roleRes.data) {
        setRolesList(roleRes.data);
        if (roleRes.data.length > 0 && !memberRole) {
          const first = roleRes.data[0];
          setMemberRole(first.title);
          setMemberOrderIndex(first.order_index);
          setMemberRoleDesc(first.description || '');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRoleChange = (selectedTitle: string) => {
    setMemberRole(selectedTitle);
    const matched = rolesList.find(r => r.title === selectedTitle);
    if (matched) {
      setMemberOrderIndex(matched.order_index);
      if (matched.description) setMemberRoleDesc(matched.description);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Pastikan angkatan ada di organisasi
      await supabase.from('organizations').upsert(
        { id: targetOrgId, name: `Generasi Angkatan ${targetOrgId}` },
        { onConflict: 'id' }
      );

      if (type === 'member') {
        const { error } = await supabase.from('members').insert({
          org_id: targetOrgId,
          name: memberName,
          role: memberRole,
          order_index: memberOrderIndex,
          dept: memberDept,
          role_description: memberRoleDesc.trim() || null,
          img: memberImg || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
        });
        if (error) throw error;
      } else if (type === 'event') {
        const { error } = await supabase.from('events').insert({
          org_id: targetOrgId,
          title: eventTitle,
          date: eventDate,
          category: eventCategory,
          desc: eventDesc,
          status: eventStatus
        });
        if (error) throw error;
      } else if (type === 'transaction') {
        const { error } = await supabase.from('transactions').insert({
          org_id: targetOrgId,
          desc: txDesc,
          amount: parseFloat(txAmount),
          type: txType,
          date: txDate
        });
        if (error) throw error;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1d2e26] border border-[#2d473a] rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header Modal */}
        <div className="p-4 border-b border-[#2d473a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#2a4336] text-[#86cfa7]">
              {type === 'member' && <User className="w-5 h-5" />}
              {type === 'event' && <Calendar className="w-5 h-5" />}
              {type === 'transaction' && <DollarSign className="w-5 h-5" />}
            </span>
            <div>
              <h3 className="font-bold text-white text-sm">
                {type === 'member' && 'Tambah Pengurus / Anggota'}
                {type === 'event' && 'Tambah Agenda Kegiatan'}
                {type === 'transaction' && 'Catat Transaksi Keuangan'}
              </h3>
              <p className="text-[11px] text-[#8da698]">Tersinkronisasi langsung ke database publik</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#8da698] hover:text-white rounded-lg hover:bg-[#2a4336]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body dengan Scrollbar Custom */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 overflow-y-auto max-h-[75vh]">
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-lg text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Selector Target Angkatan */}
          <div className="p-3 bg-[#15231c] rounded-xl border border-[#2d473a]/80">
            <label className="text-[11px] font-bold text-[#86cfa7] uppercase tracking-wider block mb-1">
              Target Angkatan Organisasi *
            </label>
            <select
              value={targetOrgId}
              onChange={(e) => setTargetOrgId(e.target.value)}
              className="w-full bg-[#1d2e26] border border-[#2d473a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#86cfa7]"
            >
              {availableOrgs.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} ({org.id})
                </option>
              ))}
            </select>
          </div>

          {/* Form Anggota */}
          {type === 'member' && (
            <>
              <div>
                <label className="text-xs text-[#8da698] block mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Contoh: Muhammad Fikri"
                  className="w-full bg-[#15231c] border border-[#2d473a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#86cfa7]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-xs text-[#8da698] block mb-1">Jabatan *</label>
                  <select
                    value={memberRole}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full bg-[#15231c] border border-[#2d473a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#86cfa7]"
                  >
                    {rolesList.map((r, idx) => (
                      <option key={idx} value={r.title}>{r.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#8da698] block mb-1 flex items-center gap-1">
                    <Hash className="w-3 h-3 text-[#86cfa7]" /> Urutan *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={memberOrderIndex}
                    onChange={(e) => setMemberOrderIndex(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#15231c] border border-[#2d473a] rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#86cfa7]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#8da698] block mb-1">Departemen / Divisi *</label>
                <select
                  value={memberDept}
                  onChange={(e) => setMemberDept(e.target.value)}
                  required
                  className="w-full bg-[#15231c] border border-[#2d473a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#86cfa7]"
                >
                  <option value="">-- Pilih Departemen --</option>
                  {deptList.map((dept, idx) => (
                    <option key={idx} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-[#8da698] block mb-1">Deskripsi Tugas & Peran (Opsional)</label>
                <textarea
                  rows={2}
                  value={memberRoleDesc}
                  onChange={(e) => setMemberRoleDesc(e.target.value)}
                  placeholder="Rincian tanggung jawab dan koordinasi..."
                  className="w-full bg-[#15231c] border border-[#2d473a] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#86cfa7]"
                />
              </div>

              <div>
                <label className="text-xs text-[#8da698] block mb-1">URL Foto Profil</label>
                <input
                  type="url"
                  value={memberImg}
                  onChange={(e) => setMemberImg(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#15231c] border border-[#2d473a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#86cfa7]"
                />
              </div>
            </>
          )}

          {/* Form Kegiatan */}
          {type === 'event' && (
            <>
              <div>
                <label className="text-xs text-[#8da698] block mb-1">Judul Agenda Kegiatan *</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Contoh: Diskusi Terbuka Mahasiswa"
                  className="w-full bg-[#15231c] border border-[#2d473a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#86cfa7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-[#8da698] block mb-1">Tanggal *</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-[#15231c] border border-[#2d473a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#86cfa7]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8da698] block mb-1">Kategori Kegiatan *</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value)}
                    required
                    className="w-full bg-[#15231c] border border-[#2d473a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#86cfa7]"
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {categoriesList.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#8da698] block mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="Jelaskan tujuan dan audiens kegiatan..."
                  className="w-full bg-[#15231c] border border-[#2d473a] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#86cfa7]"
                />
              </div>
            </>
          )}

          {/* Form Keuangan */}
          {type === 'transaction' && (
            <>
              <div>
                <label className="text-xs text-[#8da698] block mb-1">Keterangan Transaksi *</label>
                <input
                  type="text"
                  required
                  value={txDesc}
                  onChange={(e) => setTxDesc(e.target.value)}
                  placeholder="Contoh: Iuran Kas Bulanan, Konsumsi Rapat"
                  className="w-full bg-[#15231c] border border-[#2d473a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#86cfa7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-[#8da698] block mb-1">Nominal (Rp) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    placeholder="150000"
                    className="w-full bg-[#15231c] border border-[#2d473a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#86cfa7]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8da698] block mb-1">Jenis Kas *</label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as any)}
                    className="w-full bg-[#15231c] border border-[#2d473a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#86cfa7]"
                  >
                    <option value="expense">Pengeluaran (-)</option>
                    <option value="income">Pemasukan (+)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#8da698] block mb-1">Tanggal Transaksi *</label>
                <input
                  type="date"
                  required
                  value={txDate}
                  onChange={(e) => setTxDate(e.target.value)}
                  className="w-full bg-[#15231c] border border-[#2d473a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#86cfa7]"
                />
              </div>
            </>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#86cfa7] hover:bg-[#74be95] text-[#0d1612] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Menyimpan...' : 'Simpan ke Database'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
