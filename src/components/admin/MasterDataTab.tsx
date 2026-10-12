import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { 
  Building2, 
  Calendar, 
  Briefcase, 
  GraduationCap, 
  Plus, 
  Trash2, 
  AlertCircle,
  Hash,
  FileText
} from 'lucide-react';

export const MasterDataTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'angkatan' | 'categories' | 'departments' | 'roles'>('roles');
  const [angkatanList, setAngkatanList] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string | number; name: string }[]>([]);
  const [departments, setDepartments] = useState<{ id: string | number; name: string }[]>([]);
  const [roles, setRoles] = useState<{ id: string | number; title: string; order_index: number; description?: string }[]>([]);
  
  const [newAngkatanId, setNewAngkatanId] = useState('');
  const [newAngkatanName, setNewAngkatanName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newDept, setNewDept] = useState('');
  
  // State Jabatan Baru
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newRoleOrder, setNewRoleOrder] = useState<number>(1);
  const [newRoleDesc, setNewRoleDesc] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchAllMasterData();
  }, []);

  const fetchAllMasterData = async () => {
    try {
      const [resOrg, resCat, resDept, resRoles] = await Promise.all([
        supabase.from('organizations').select('id, name').order('id', { ascending: true }),
        supabase.from('master_event_categories').select('*').order('name'),
        supabase.from('master_departments').select('*').order('name'),
        supabase.from('master_roles').select('*').order('order_index', { ascending: true })
      ]);

      if (resOrg.data) setAngkatanList(resOrg.data);
      if (resCat.data) setCategories(resCat.data);
      if (resDept.data) setDepartments(resDept.data);
      if (resRoles.data) setRoles(resRoles.data);
    } catch (err) {
      console.error(err);
    }
  };

  const showNotification = (text: string, type: 'success' | 'error') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleAddAngkatan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAngkatanId.trim()) return;
    setLoading(true);
    const { error } = await supabase.from('organizations').upsert({
      id: newAngkatanId.trim(),
      name: newAngkatanName.trim() || `Generasi Angkatan ${newAngkatanId}`
    });
    setLoading(false);
    if (!error) {
      setNewAngkatanId('');
      setNewAngkatanName('');
      fetchAllMasterData();
      showNotification('Angkatan berhasil ditambahkan!', 'success');
    } else {
      showNotification(error.message, 'error');
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setLoading(true);
    const { error } = await supabase.from('master_event_categories').insert({ name: newCategory.trim() });
    setLoading(false);
    if (!error) {
      setNewCategory('');
      fetchAllMasterData();
      showNotification('Kategori kegiatan berhasil didaftarkan!', 'success');
    } else {
      showNotification(error.message, 'error');
    }
  };

  const handleAddDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.trim()) return;
    setLoading(true);
    const { error } = await supabase.from('master_departments').insert({ name: newDept.trim() });
    setLoading(false);
    if (!error) {
      setNewDept('');
      fetchAllMasterData();
      showNotification('Departemen berhasil ditambahkan!', 'success');
    } else {
      showNotification(error.message, 'error');
    }
  };

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleTitle.trim()) return;
    setLoading(true);
    const { error } = await supabase.from('master_roles').insert({
      title: newRoleTitle.trim(),
      order_index: Number(newRoleOrder) || 99,
      description: newRoleDesc.trim() || null
    });
    setLoading(false);
    if (!error) {
      setNewRoleTitle('');
      setNewRoleOrder(roles.length + 1);
      setNewRoleDesc('');
      fetchAllMasterData();
      showNotification('Jabatan & urutan berhasil ditambahkan!', 'success');
    } else {
      showNotification(error.message, 'error');
    }
  };

  const handleDeleteItem = async (table: string, id: string | number, col = 'id') => {
    if (!confirm('Yakin ingin menghapus data master ini?')) return;
    const { error } = await supabase.from(table).delete().eq(col, id);
    if (!error) {
      fetchAllMasterData();
      showNotification('Data berhasil dihapus', 'success');
    } else {
      showNotification(error.message, 'error');
    }
  };

  return (
    <div className="space-y-5">
      {/* Sub-Navigasi Master */}
      <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#15231c] rounded-xl border border-[#2d473a]">
        <button
          onClick={() => setActiveSubTab('roles')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg transition-all ${
            activeSubTab === 'roles' ? 'bg-[#86cfa7] text-[#0d1612]' : 'text-[#8da698] hover:text-white'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Jabatan</span>
        </button>

        <button
          onClick={() => setActiveSubTab('departments')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg transition-all ${
            activeSubTab === 'departments' ? 'bg-[#86cfa7] text-[#0d1612]' : 'text-[#8da698] hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Departemen</span>
        </button>

        <button
          onClick={() => setActiveSubTab('categories')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg transition-all ${
            activeSubTab === 'categories' ? 'bg-[#86cfa7] text-[#0d1612]' : 'text-[#8da698] hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Kategori</span>
        </button>

        <button
          onClick={() => setActiveSubTab('angkatan')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg transition-all ${
            activeSubTab === 'angkatan' ? 'bg-[#86cfa7] text-[#0d1612]' : 'text-[#8da698] hover:text-white'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Angkatan</span>
        </button>
      </div>

      {msg && (
        <div className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
          msg.type === 'success' ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' : 'bg-red-950/60 border-red-500/50 text-red-300'
        }`}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{msg.text}</span>
        </div>
      )}

      {/* 1. MASTER JABATAN (DENGAN URUTAN & DESKRIPSI) */}
      {activeSubTab === 'roles' && (
        <div className="space-y-4">
          <form onSubmit={handleAddRole} className="p-4 bg-[#1d2e26] border border-[#2d473a] rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-[#86cfa7] uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Tambah Standar Jabatan & Hierarki Urutan
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
              <div className="md:col-span-3">
                <label className="text-[11px] text-[#8da698] block mb-1">Nama Jabatan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ketua Divisi, Sekretaris Umum..."
                  value={newRoleTitle}
                  onChange={(e) => setNewRoleTitle(e.target.value)}
                  className="w-full bg-[#15231c] border border-[#2d473a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#86cfa7]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#8da698] block mb-1 flex items-center gap-1">
                  <Hash className="w-3 h-3 text-[#86cfa7]" /> No. Urut Hierarki *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newRoleOrder}
                  onChange={(e) => setNewRoleOrder(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#15231c] border border-[#2d473a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#86cfa7]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-[#8da698] block mb-1 flex items-center gap-1">
                <FileText className="w-3 h-3 text-[#8da698]" /> Deskripsi Tugas / Peran (Opsional)
              </label>
              <textarea
                rows={2}
                placeholder="Rincian peran, tanggung jawab, wewenang, dan koordinasi..."
                value={newRoleDesc}
                onChange={(e) => setNewRoleDesc(e.target.value)}
                className="w-full bg-[#15231c] border border-[#2d473a] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#86cfa7]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-[#86cfa7] hover:bg-[#74be95] text-[#0d1612] font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Simpan Jabatan
            </button>
          </form>

          {/* List Jabatan dengan Scrollbar Custom */}
          <div className="bg-[#1d2e26] border border-[#2d473a] rounded-xl p-3">
            <h5 className="text-[11px] font-semibold text-[#8da698] mb-2 px-1">
              Urutan Jabatan Pada Tampilan Publik ({roles.length}):
            </h5>
            <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
              {roles.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#8da698]">Belum ada jabatan.</div>
              ) : (
                roles.map((r) => (
                  <div key={r.id} className="p-2.5 bg-[#15231c] border border-[#2d473a]/60 rounded-lg flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-md bg-[#2a4336] text-[#86cfa7] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {r.order_index ?? '-'}
                      </span>
                      <div>
                        <div className="text-xs font-semibold text-white">{r.title}</div>
                        {r.description && (
                          <div className="text-[11px] text-[#8da698] mt-0.5 line-clamp-2">
                            {r.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteItem('master_roles', r.id)}
                      className="text-red-400 hover:text-red-300 p-1 flex-shrink-0"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. MASTER DEPARTEMEN */}
      {activeSubTab === 'departments' && (
        <div className="space-y-4">
          <form onSubmit={handleAddDept} className="p-4 bg-[#1d2e26] border border-[#2d473a] rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-[#86cfa7] uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Tambah Standar Departemen / Divisi
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Contoh: BPH, Humas & Media, Acara..."
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
                className="flex-1 bg-[#15231c] border border-[#2d473a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#86cfa7]"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#86cfa7] text-[#0d1612] font-semibold text-xs rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah
              </button>
            </div>
          </form>

          <div className="bg-[#1d2e26] border border-[#2d473a] rounded-xl p-3">
            <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
              {departments.map((d) => (
                <div key={d.id} className="p-2.5 bg-[#15231c] border border-[#2d473a]/60 rounded-lg flex items-center justify-between">
                  <span className="text-xs font-medium text-white">{d.name}</span>
                  <button onClick={() => handleDeleteItem('master_departments', d.id)} className="text-red-400 hover:text-red-300 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. MASTER KATEGORI KEGIATAN */}
      {activeSubTab === 'categories' && (
        <div className="space-y-4">
          <form onSubmit={handleAddCategory} className="p-4 bg-[#1d2e26] border border-[#2d473a] rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-[#86cfa7] uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Tambah Kategori Kegiatan
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Contoh: Workshop, Bakti Sosial, Webinar..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 bg-[#15231c] border border-[#2d473a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#86cfa7]"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#86cfa7] text-[#0d1612] font-semibold text-xs rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah
              </button>
            </div>
          </form>

          <div className="bg-[#1d2e26] border border-[#2d473a] rounded-xl p-3">
            <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
              {categories.map((c) => (
                <div key={c.id} className="p-2.5 bg-[#15231c] border border-[#2d473a]/60 rounded-lg flex items-center justify-between">
                  <span className="text-xs font-medium text-white">{c.name}</span>
                  <button onClick={() => handleDeleteItem('master_event_categories', c.id)} className="text-red-400 hover:text-red-300 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. MASTER ANGKATAN ORGANISASI */}
      {activeSubTab === 'angkatan' && (
        <div className="space-y-4">
          <form onSubmit={handleAddAngkatan} className="p-4 bg-[#1d2e26] border border-[#2d473a] rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-[#86cfa7] uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4" /> Daftarkan Angkatan Baru
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder="Kode/Tahun (contoh: 2027)"
                value={newAngkatanId}
                onChange={(e) => setNewAngkatanId(e.target.value)}
                className="bg-[#15231c] border border-[#2d473a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#86cfa7]"
              />
              <input
                type="text"
                placeholder="Nama Label (opsional)"
                value={newAngkatanName}
                onChange={(e) => setNewAngkatanName(e.target.value)}
                className="bg-[#15231c] border border-[#2d473a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#86cfa7]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-[#86cfa7] text-[#0d1612] font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Daftarkan Angkatan
            </button>
          </form>

          <div className="bg-[#1d2e26] border border-[#2d473a] rounded-xl p-3">
            <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
              {angkatanList.map((a) => (
                <div key={a.id} className="p-2.5 bg-[#15231c] border border-[#2d473a]/60 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-[#86cfa7] mr-2">[{a.id}]</span>
                    <span className="text-xs text-white">{a.name}</span>
                  </div>
                  <button onClick={() => handleDeleteItem('organizations', a.id, 'id')} className="text-red-400 hover:text-red-300 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};