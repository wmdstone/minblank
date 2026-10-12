import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Plus, Trash2, Layers, Tag, Briefcase, Calendar } from 'lucide-react';

export const MasterDataTab: React.FC = () => {
  const [subTab, setSubTab] = useState<'angkatan' | 'categories' | 'departments' | 'roles'>('angkatan');
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form Inputs
  const [newAngkatanId, setNewAngkatanId] = useState('');
  const [newAngkatanTagline, setNewAngkatanTagline] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newDeptName, setNewDeptName] = useState('');
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newRoleTier, setNewRoleTier] = useState<'atas' | 'menengah' | 'bawah' | 'anggota'>('atas');

  const fetchMaster = async () => {
    setLoading(true);
    const { data: orgs } = await supabase.from('organizations').select('*').order('id', { ascending: false });
    const { data: cats } = await supabase.from('master_event_categories').select('*').order('name');
    const { data: depts } = await supabase.from('master_departments').select('*').order('name');
    const { data: rls } = await supabase.from('master_roles').select('*').order('title');

    setOrganizations(orgs || []);
    setCategories(cats || []);
    setDepartments(depts || []);
    setRoles(rls || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMaster();
  }, []);

  const addAngkatan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAngkatanId.trim()) return;
    await supabase.from('organizations').upsert({
      id: newAngkatanId.trim(),
      name: 'GreenGen Org',
      tagline: newAngkatanTagline.trim() || `Generasi Angkatan ${newAngkatanId.trim()}`
    });
    setNewAngkatanId('');
    setNewAngkatanTagline('');
    fetchMaster();
  };

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    await supabase.from('master_event_categories').insert([{ name: newCategoryName.trim() }]);
    setNewCategoryName('');
    fetchMaster();
  };

  const addDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;
    await supabase.from('master_departments').insert([{ name: newDeptName.trim() }]);
    setNewDeptName('');
    fetchMaster();
  };

  const addRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleTitle.trim()) return;
    await supabase.from('master_roles').insert([{ title: newRoleTitle.trim(), tier: newRoleTier }]);
    setNewRoleTitle('');
    fetchMaster();
  };

  const deleteItem = async (table: string, id: string | number, idCol = 'id') => {
    if (!confirm('Yakin ingin menghapus item master ini?')) return;
    await supabase.from(table).delete().eq(idCol, id);
    fetchMaster();
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Sub Tabs Master */}
      <div className="grid grid-cols-4 gap-1 bg-[#1d2e26] p-1.5 rounded-2xl border border-[#2d473a]">
        <button
          onClick={() => setSubTab('angkatan')}
          className={`py-2 rounded-xl flex items-center justify-center space-x-1.5 font-bold transition ${
            subTab === 'angkatan' ? 'bg-[#385948] text-white shadow' : 'text-[#8da698]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Angkatan</span>
        </button>
        <button
          onClick={() => setSubTab('categories')}
          className={`py-2 rounded-xl flex items-center justify-center space-x-1.5 font-bold transition ${
            subTab === 'categories' ? 'bg-[#385948] text-white shadow' : 'text-[#8da698]'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Kategori</span>
        </button>
        <button
          onClick={() => setSubTab('departments')}
          className={`py-2 rounded-xl flex items-center justify-center space-x-1.5 font-bold transition ${
            subTab === 'departments' ? 'bg-[#385948] text-white shadow' : 'text-[#8da698]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Departemen</span>
        </button>
        <button
          onClick={() => setSubTab('roles')}
          className={`py-2 rounded-xl flex items-center justify-center space-x-1.5 font-bold transition ${
            subTab === 'roles' ? 'bg-[#385948] text-white shadow' : 'text-[#8da698]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Jabatan</span>
        </button>
      </div>

      {/* 1. Pengelolaan Angkatan */}
      {subTab === 'angkatan' && (
        <div className="space-y-3">
          <form onSubmit={addAngkatan} className="bg-[#2a4336] p-3.5 rounded-2xl border border-[#385948] space-y-2">
            <span className="font-bold text-white block">Tambah Angkatan Baru</span>
            <div className="flex space-x-2">
              <input
                type="text"
                required
                value={newAngkatanId}
                onChange={(e) => setNewAngkatanId(e.target.value)}
                placeholder="Tahun (cth: 2027)"
                className="w-32 bg-[#1d2e26] text-white p-2.5 rounded-xl border border-[#385948] font-bold"
              />
              <input
                type="text"
                value={newAngkatanTagline}
                onChange={(e) => setNewAngkatanTagline(e.target.value)}
                placeholder="Tagline Periode"
                className="flex-1 bg-[#1d2e26] text-white p-2.5 rounded-xl border border-[#385948]"
              />
              <button type="submit" className="px-3 bg-[#86cfa7] text-[#121c17] font-bold rounded-xl flex items-center space-x-1">
                <Plus className="w-4 h-4" />
                <span>Simpan</span>
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {organizations.map((org) => (
              <div key={org.id} className="p-3 bg-[#2a4336] rounded-xl flex justify-between items-center border border-[#385948]">
                <div>
                  <h5 className="font-extrabold text-white text-sm">Angkatan {org.id}</h5>
                  <p className="text-[#86cfa7] text-[10px]">{org.tagline || 'Organisasi Aktif'}</p>
                </div>
                <button onClick={() => deleteItem('organizations', org.id)} className="p-1.5 text-rose-400 hover:text-rose-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Pengelolaan Kategori Kegiatan */}
      {subTab === 'categories' && (
        <div className="space-y-3">
          <form onSubmit={addCategory} className="bg-[#2a4336] p-3.5 rounded-2xl border border-[#385948] space-y-2">
            <span className="font-bold text-white block">Tambah Kategori Acara</span>
            <div className="flex space-x-2">
              <input
                type="text"
                required
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nama Kategori (cth: Webinar)"
                className="flex-1 bg-[#1d2e26] text-white p-2.5 rounded-xl border border-[#385948]"
              />
              <button type="submit" className="px-3 bg-[#86cfa7] text-[#121c17] font-bold rounded-xl flex items-center space-x-1">
                <Plus className="w-4 h-4" />
                <span>Simpan</span>
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {categories.map((c) => (
              <div key={c.id} className="p-3 bg-[#2a4336] rounded-xl flex justify-between items-center border border-[#385948]">
                <span className="font-bold text-white">{c.name}</span>
                <button onClick={() => deleteItem('master_event_categories', c.id)} className="p-1.5 text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Pengelolaan Departemen */}
      {subTab === 'departments' && (
        <div className="space-y-3">
          <form onSubmit={addDepartment} className="bg-[#2a4336] p-3.5 rounded-2xl border border-[#385948] space-y-2">
            <span className="font-bold text-white block">Tambah Departemen / Divisi</span>
            <div className="flex space-x-2">
              <input
                type="text"
                required
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                placeholder="Nama Divisi (cth: Divisi Kemitraan)"
                className="flex-1 bg-[#1d2e26] text-white p-2.5 rounded-xl border border-[#385948]"
              />
              <button type="submit" className="px-3 bg-[#86cfa7] text-[#121c17] font-bold rounded-xl flex items-center space-x-1">
                <Plus className="w-4 h-4" />
                <span>Simpan</span>
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {departments.map((d) => (
              <div key={d.id} className="p-3 bg-[#2a4336] rounded-xl flex justify-between items-center border border-[#385948]">
                <span className="font-bold text-white">{d.name}</span>
                <button onClick={() => deleteItem('master_departments', d.id)} className="p-1.5 text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Pengelolaan Jabatan & Tingkatan */}
      {subTab === 'roles' && (
        <div className="space-y-3">
          <form onSubmit={addRole} className="bg-[#2a4336] p-3.5 rounded-2xl border border-[#385948] space-y-2">
            <span className="font-bold text-white block">Tambah Standar Jabatan</span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                value={newRoleTitle}
                onChange={(e) => setNewRoleTitle(e.target.value)}
                placeholder="Nama Jabatan (cth: Koordinator Lapangan)"
                className="bg-[#1d2e26] text-white p-2.5 rounded-xl border border-[#385948]"
              />
              <select
                value={newRoleTier}
                onChange={(e) => setNewRoleTier(e.target.value as any)}
                className="bg-[#1d2e26] text-white p-2.5 rounded-xl border border-[#385948]"
              >
                <option value="atas">Tingkat Atas (BPH)</option>
                <option value="menengah">Tingkat Menengah (Koordinator)</option>
                <option value="bawah">Tingkat Bawah (Staff)</option>
                <option value="anggota">Anggota Umum</option>
              </select>
            </div>
            <button type="submit" className="w-full py-2.5 bg-[#86cfa7] text-[#121c17] font-bold rounded-xl flex items-center justify-center space-x-1">
              <Plus className="w-4 h-4" />
              <span>Tambah Standar Jabatan</span>
            </button>
          </form>

          <div className="space-y-2">
            {roles.map((r) => (
              <div key={r.id} className="p-3 bg-[#2a4336] rounded-xl flex justify-between items-center border border-[#385948]">
                <div>
                  <h5 className="font-bold text-white">{r.title}</h5>
                  <span className="text-[9px] bg-[#1d2e26] text-[#86cfa7] px-2 py-0.5 rounded uppercase font-semibold">
                    {r.tier}
                  </span>
                </div>
                <button onClick={() => deleteItem('master_roles', r.id)} className="p-1.5 text-rose-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};