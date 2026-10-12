import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { 
  Building2, 
  Briefcase, 
  GraduationCap, 
  Plus, 
  ChevronDown, 
  ChevronRight,
  FileText,
  X,
  Folder
} from 'lucide-react';
import { RowActionMenu } from './RowActionMenu';

export const MasterDataTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'roles' | 'departments' | 'categories' | 'angkatan'>('roles');
  const [angkatanList, setAngkatanList] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string | number; name: string }[]>([]);
  const [departments, setDepartments] = useState<{ id: string | number; name: string }[]>([]);
  const [roles, setRoles] = useState<{ id: string | number; department: string; title: string; order_index: number; description?: string }[]>([]);
  
  // State Input Baru
  const [newAngkatanId, setNewAngkatanId] = useState('');
  const [newAngkatanName, setNewAngkatanName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newDept, setNewDept] = useState('');
  
  // State Jabatan Baru
  const [newRoleDept, setNewRoleDept] = useState('');
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newRoleOrder, setNewRoleOrder] = useState<number>(1);
  const [newRoleDesc, setNewRoleDesc] = useState('');

  // State Collapsible Wikipedia Style
  const [expandedDeptGroup, setExpandedDeptGroup] = useState<Record<string, boolean>>({});
  const [expandedRoleDesc, setExpandedRoleDesc] = useState<Record<string | number, boolean>>({});
  const [editingItem, setEditingItem] = useState<{ type: string; id: any; data: any } | null>(null);

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
      if (resDept.data) {
        setDepartments(resDept.data);
        if (resDept.data.length > 0 && !newRoleDept) {
          setNewRoleDept(resDept.data[0].name);
        }
      }
      if (resRoles.data) {
        setRoles(resRoles.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const showNotification = (text: string, type: 'success' | 'error') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const toggleDept = (deptName: string) => {
    setExpandedDeptGroup(prev => ({ ...prev, [deptName]: !prev[deptName] }));
  };

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleTitle.trim() || !newRoleDept.trim()) return;
    setLoading(true);
    const { error } = await supabase.from('master_roles').insert({
      department: newRoleDept.trim(),
      title: newRoleTitle.trim(),
      order_index: Number(newRoleOrder) || 99,
      description: newRoleDesc.trim() || null
    });
    setLoading(false);
    if (!error) {
      setNewRoleTitle('');
      setNewRoleDesc('');
      fetchAllMasterData();
      showNotification(`Jabatan berhasil ditambahkan ke departemen ${newRoleDept}!`, 'success');
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
      showNotification('Departemen baru berhasil ditambahkan!', 'success');
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

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    setLoading(true);
    let table = '';
    let payload = editingItem.data;
    let col = 'id';

    if (editingItem.type === 'roles') {
      table = 'master_roles';
    } else if (editingItem.type === 'departments') {
      table = 'master_departments';
    } else if (editingItem.type === 'categories') {
      table = 'master_event_categories';
    } else if (editingItem.type === 'angkatan') {
      table = 'organizations';
    }

    const { error } = await supabase.from(table).update(payload).eq(col, editingItem.id);
    setLoading(false);

    if (!error) {
      setEditingItem(null);
      fetchAllMasterData();
      showNotification('Data master berhasil diperbarui!', 'success');
    } else {
      showNotification(error.message, 'error');
    }
  };

  // Grouping roles by department
  const rolesByDepartment: Record<string, typeof roles> = {};
  departments.forEach(d => {
    rolesByDepartment[d.name] = [];
  });
  roles.forEach(r => {
    const deptKey = r.department || 'Lainnya';
    if (!rolesByDepartment[deptKey]) rolesByDepartment[deptKey] = [];
    rolesByDepartment[deptKey].push(r);
  });

  return (
    <div className="space-y-4">
      {/* Sub-Navigasi Master */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-[#15231c] rounded-xl border border-[#2d473a]">
        <button
          onClick={() => setActiveSubTab('roles')}
          className={`py-2 px-1 text-[11px] font-semibold rounded-lg transition-all ${
            activeSubTab === 'roles' ? 'bg-[#86cfa7] text-[#0d1612]' : 'text-[#8da698] hover:text-white'
          }`}
        >
          Jabatan ({roles.length})
        </button>
        <button
          onClick={() => setActiveSubTab('departments')}
          className={`py-2 px-1 text-[11px] font-semibold rounded-lg transition-all ${
            activeSubTab === 'departments' ? 'bg-[#86cfa7] text-[#0d1612]' : 'text-[#8da698] hover:text-white'
          }`}
        >
          Departemen ({departments.length})
        </button>
        <button
          onClick={() => setActiveSubTab('categories')}
          className={`py-2 px-1 text-[11px] font-semibold rounded-lg transition-all ${
            activeSubTab === 'categories' ? 'bg-[#86cfa7] text-[#0d1612]' : 'text-[#8da698] hover:text-white'
          }`}
        >
          Kategori
        </button>
        <button
          onClick={() => setActiveSubTab('angkatan')}
          className={`py-2 px-1 text-[11px] font-semibold rounded-lg transition-all ${
            activeSubTab === 'angkatan' ? 'bg-[#86cfa7] text-[#0d1612]' : 'text-[#8da698] hover:text-white'
          }`}
        >
          Angkatan
        </button>
      </div>

      {msg && (
        <div className={`p-2.5 rounded-xl text-xs ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'}`}>
          {msg.text}
        </div>
      )}

      {/* SUBTAB 1: JABATAN PER DEPARTEMEN */}
      {activeSubTab === 'roles' && (
        <div className="space-y-5">
          {/* Form Tambah Jabatan */}
          <form onSubmit={handleAddRole} className="p-3 bg-[#1d2e26] border border-[#2d473a] rounded-2xl space-y-2.5">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#86cfa7]" />
              Tambah Jabatan Baru ke Departemen
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-[#8da698] block mb-1">Pilih Departemen *</label>
                <select
                  required
                  value={newRoleDept}
                  onChange={(e) => setNewRoleDept(e.target.value)}
                  className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-2.5 py-1.5 text-xs text-white outline-none"
                >
                  {departments.length === 0 ? (
                    <option value="">Belum ada departemen (Tambah di tab Departemen)</option>
                  ) : (
                    departments.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#8da698] block mb-1">No. Urut Publik *</label>
                <input
                  type="number"
                  required
                  min={1}
                  placeholder="1, 2, 3..."
                  value={newRoleOrder}
                  onChange={(e) => setNewRoleOrder(Number(e.target.value))}
                  className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-1.5 text-xs text-white outline-none text-center"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#8da698] block mb-1">Nama Jabatan *</label>
              <input
                type="text"
                required
                placeholder="Misal: Ketua Divisi, Sekretaris, Staff Ahli, Anggota"
                value={newRoleTitle}
                onChange={(e) => setNewRoleTitle(e.target.value)}
                className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#456755] outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#8da698] block mb-1">Deskripsi Tugas & Wewenang (Tupoksi)</label>
              <textarea
                rows={2}
                placeholder="Rincian peran, koordinasi, dan tanggung jawab khusus jabatan ini..."
                value={newRoleDesc}
                onChange={(e) => setNewRoleDesc(e.target.value)}
                className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#456755] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || departments.length === 0}
              className="w-full py-2 bg-[#86cfa7] hover:bg-[#97dfb7] text-[#0d1612] text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan Jabatan ke Departemen</span>
            </button>
          </form>

          {/* DAFTAR JABATAN MENGGUNAKAN HEADING STYLE WIKIPEDIA (PERSIS ADMIN DASHBOARD) */}
          <div className="space-y-6 pt-2">
            {Object.keys(rolesByDepartment).length === 0 ? (
              <p className="text-xs text-[#8da698] text-center py-4">Belum ada departemen yang terdaftar.</p>
            ) : (
              Object.keys(rolesByDepartment).map((deptName) => {
                const deptRoles = rolesByDepartment[deptName];
                const isDeptOpen = expandedDeptGroup[deptName] !== false; // default terbuka

                return (
                  <div key={deptName} className="space-y-2">
                    {/* Heading Style Wikipedia */}
                    <div
                      onClick={() => toggleDept(deptName)}
                      className="flex items-center justify-between py-2 border-b-2 border-[#2d473a] hover:border-[#86cfa7]/60 cursor-pointer select-none transition group"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-1.5 h-4 bg-[#86cfa7] rounded-full inline-block" />
                        <h3 className="text-sm font-bold text-white group-hover:text-[#86cfa7] transition">
                          {deptName}
                        </h3>
                        <span className="text-[10px] bg-[#2a4336] text-[#86cfa7] px-2 py-0.5 rounded-full font-bold">
                          {deptRoles.length}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-[#8da698]">
                        <span className="text-[10px] hidden sm:inline">{isDeptOpen ? 'Tutup' : 'Buka'}</span>
                        {isDeptOpen ? (
                          <ChevronDown className="w-4 h-4 text-[#86cfa7]" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-[#8da698]" />
                        )}
                      </div>
                    </div>

                    {/* Content Items Langsung Mengalir (Bebas Overflow, Dropdown Tidak Terpotong) */}
                    {isDeptOpen && (
                      <div className="space-y-2 pt-1 pl-1">
                        {deptRoles.length === 0 ? (
                          <p className="text-[11px] text-[#8da698] py-2 pl-2 italic">
                            Belum ada jabatan khusus untuk departemen {deptName}.
                          </p>
                        ) : (
                          deptRoles.map((r) => {
                            const isDescOpen = expandedRoleDesc[r.id];
                            return (
                              <div key={r.id} className="p-3 bg-[#1d2e26] hover:bg-[#243a30] rounded-2xl border border-[#2d473a] transition space-y-2 shadow-sm">
                                <div className="flex items-center justify-between">
                                  <button
                                    type="button"
                                    onClick={() => setExpandedRoleDesc(prev => ({ ...prev, [r.id]: !prev[r.id] }))}
                                    className="flex items-center space-x-2 text-left flex-1"
                                  >
                                    <span className="w-5 h-5 rounded-md bg-[#2a4336] text-[#86cfa7] text-[10px] font-bold flex items-center justify-center font-mono">
                                      #{r.order_index}
                                    </span>
                                    <span className="text-xs font-bold text-white">{r.title}</span>
                                    {isDescOpen ? (
                                      <ChevronDown className="w-3.5 h-3.5 text-[#86cfa7]" />
                                    ) : (
                                      <ChevronRight className="w-3.5 h-3.5 text-[#8da698]" />
                                    )}
                                  </button>
                                  <RowActionMenu
                                    onEdit={() => setEditingItem({
                                      type: 'roles',
                                      id: r.id,
                                      data: {
                                        department: r.department,
                                        title: r.title,
                                        order_index: r.order_index,
                                        description: r.description || ''
                                      }
                                    })}
                                    onDelete={() => handleDeleteItem('master_roles', r.id)}
                                  />
                                </div>

                                {/* Deskripsi Tupoksi Mengalir */}
                                {isDescOpen && (
                                  <div className="pt-2 border-t border-[#2d473a] text-xs text-[#b0c8bb]">
                                    <div className="flex items-start gap-1.5 bg-[#16241d] p-2 rounded-xl">
                                      <FileText className="w-3.5 h-3.5 text-[#86cfa7] shrink-0 mt-0.5" />
                                      <div>
                                        <p className="text-[10px] font-semibold text-[#86cfa7] mb-0.5">Tugas & Tanggung Jawab:</p>
                                        <p className="text-[11px] leading-relaxed">
                                          {r.description || 'Belum ada rincian tugas untuk jabatan ini. Gunakan tombol opsi Edit untuk menambahkan.'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: DEPARTEMEN */}
      {activeSubTab === 'departments' && (
        <div className="space-y-4">
          <form onSubmit={handleAddDept} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Nama Departemen Baru (mis: Humas & Media)"
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
              className="flex-1 bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-2 text-xs text-white placeholder-[#456755] outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#86cfa7] text-[#0d1612] text-xs font-bold rounded-xl flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah</span>
            </button>
          </form>

          <div className="space-y-2">
            {departments.map((d) => (
              <div key={d.id} className="p-3 bg-[#1d2e26] border border-[#2d473a] rounded-xl flex items-center justify-between">
                <span className="text-xs font-semibold text-white">{d.name}</span>
                <RowActionMenu
                  onEdit={() => setEditingItem({ type: 'departments', id: d.id, data: { name: d.name } })}
                  onDelete={() => handleDeleteItem('master_departments', d.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: KATEGORI KEGIATAN */}
      {activeSubTab === 'categories' && (
        <div className="space-y-4">
          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Kategori Baru (mis: Workshop & Pelatihan)"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-2 text-xs text-white placeholder-[#456755] outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#86cfa7] text-[#0d1612] text-xs font-bold rounded-xl flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah</span>
            </button>
          </form>

          <div className="space-y-2">
            {categories.map((c) => (
              <div key={c.id} className="p-3 bg-[#1d2e26] border border-[#2d473a] rounded-xl flex items-center justify-between">
                <span className="text-xs font-semibold text-white">{c.name}</span>
                <RowActionMenu
                  onEdit={() => setEditingItem({ type: 'categories', id: c.id, data: { name: c.name } })}
                  onDelete={() => handleDeleteItem('master_event_categories', c.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: ANGKATAN */}
      {activeSubTab === 'angkatan' && (
        <div className="space-y-4">
          <form onSubmit={handleAddAngkatan} className="p-3 bg-[#1d2e26] border border-[#2d473a] rounded-2xl space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#86cfa7]" />
              Tambah Angkatan Baru
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                required
                placeholder="ID (mis: 2027)"
                value={newAngkatanId}
                onChange={(e) => setNewAngkatanId(e.target.value)}
                className="bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#456755] outline-none"
              />
              <div className="col-span-2">
                <input
                  type="text"
                  placeholder="Nama (mis: Generasi Emas 2027)"
                  value={newAngkatanName}
                  onChange={(e) => setNewAngkatanName(e.target.value)}
                  className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#456755] outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-[#86cfa7] hover:bg-[#97dfb7] text-[#0d1612] text-xs font-bold rounded-xl transition"
            >
              Daftarkan Angkatan
            </button>
          </form>

          <div className="space-y-2">
            {angkatanList.map((a) => (
              <div key={a.id} className="p-3 bg-[#1d2e26] border border-[#2d473a] rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white">Angkatan {a.id}</span>
                  <p className="text-[10px] text-[#8da698]">{a.name}</p>
                </div>
                <RowActionMenu
                  onEdit={() => setEditingItem({ type: 'angkatan', id: a.id, data: { name: a.name } })}
                  onDelete={() => handleDeleteItem('organizations', a.id, 'id')}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL EDIT MASTER DATA */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1d2e26] border border-[#2d473a] rounded-2xl w-full max-w-sm p-4 space-y-3 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-[#2d473a]">
              <h4 className="text-xs font-bold text-white">Edit Master {editingItem.type}</h4>
              <button onClick={() => setEditingItem(null)} className="text-[#8da698] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {editingItem.type === 'roles' && (
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-[#8da698] block mb-1">Departemen</label>
                  <select
                    value={editingItem.data.department}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, department: e.target.value } })}
                    className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-1.5 text-xs text-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-[#8da698] block mb-1">Nama Jabatan</label>
                  <input
                    type="text"
                    value={editingItem.data.title}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                    className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#8da698] block mb-1">Nomor Urutan Publik</label>
                  <input
                    type="number"
                    value={editingItem.data.order_index}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, order_index: Number(e.target.value) } })}
                    className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#8da698] block mb-1">Deskripsi Tupoksi</label>
                  <textarea
                    rows={3}
                    value={editingItem.data.description}
                    onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, description: e.target.value } })}
                    className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {(editingItem.type === 'departments' || editingItem.type === 'categories' || editingItem.type === 'angkatan') && (
              <div>
                <label className="text-[10px] text-[#8da698] block mb-1">Nama</label>
                <input
                  type="text"
                  value={editingItem.data.name}
                  onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, name: e.target.value } })}
                  className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setEditingItem(null)}
                className="flex-1 py-2 rounded-xl border border-[#2d473a] text-xs text-[#8da698]"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={loading}
                className="flex-1 py-2 rounded-xl bg-[#86cfa7] text-[#0d1612] text-xs font-bold"
              >
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
