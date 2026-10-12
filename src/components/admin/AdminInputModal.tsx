import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { X, Plus } from 'lucide-react';

interface AdminInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAngkatan: string;
  type: 'member' | 'event' | 'transaction';
  onSuccess: () => void;
}

export const AdminInputModal: React.FC<AdminInputModalProps> = ({
  isOpen,
  onClose,
  defaultAngkatan,
  type,
  onSuccess
}) => {
  const [angkatan, setAngkatan] = useState(defaultAngkatan);
  const [loading, setLoading] = useState(false);

  // Master Data Options
  const [availableAngkatan, setAvailableAngkatan] = useState<string[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [roles, setRoles] = useState<{ title: string; tier: string }[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Form Fields
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [memberDept, setMemberDept] = useState('');
  const [memberTier, setMemberTier] = useState('atas');
  const [memberImg, setMemberImg] = useState('');

  const [eventTitle, setEventTitle] = useState('');
  const [eventCat, setEventCat] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDesc, setEventDesc] = useState('');

  const [txTitle, setTxTitle] = useState('');
  const [txCat, setTxCat] = useState('Iuran');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState<'in' | 'out'>('in');

  useEffect(() => {
    if (isOpen) {
      const loadMasters = async () => {
        const { data: orgs } = await supabase.from('organizations').select('id').order('id', { ascending: false });
        const { data: depts } = await supabase.from('master_departments').select('name').order('name');
        const { data: rls } = await supabase.from('master_roles').select('title, tier').order('title');
        const { data: cats } = await supabase.from('master_event_categories').select('name').order('name');

        const orgList = orgs?.map((o) => o.id) || ['2026', '2025', '2024'];
        setAvailableAngkatan(orgList);
        if (!orgList.includes(angkatan) && orgList.length > 0) {
          setAngkatan(orgList[0]);
        }

        const deptList = depts?.map((d) => d.name) || ['BPH'];
        setDepartments(deptList);
        setMemberDept(deptList[0] || 'BPH');

        const roleList = rls || [{ title: 'Ketua Umum', tier: 'atas' }];
        setRoles(roleList);
        if (roleList.length > 0) {
          setMemberRole(roleList[0].title);
          setMemberTier(roleList[0].tier);
        }

        const catList = cats?.map((c) => c.name) || ['Lingkungan', 'Edukasi'];
        setCategories(catList);
        setEventCat(catList[0] || 'Lingkungan');
      };
      loadMasters();
    }
  }, [isOpen]);

  const handleRoleChange = (selectedTitle: string) => {
    setMemberRole(selectedTitle);
    const matched = roles.find((r) => r.title === selectedTitle);
    if (matched) {
      setMemberTier(matched.tier);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === 'member') {
        const { error } = await supabase.from('members').insert([{
          org_id: angkatan,
          name: memberName.trim(),
          role: memberRole,
          dept: memberDept,
          tier: memberTier,
          img: memberImg.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
        }]);
        if (error) throw error;
      } else if (type === 'event') {
        const { error } = await supabase.from('events').insert([{
          org_id: angkatan,
          title: eventTitle.trim(),
          cat: eventCat,
          date: eventDate.trim() || new Date().toLocaleDateString('id-ID'),
          location: eventLocation.trim() || 'Sekretariat',
          description: eventDesc.trim()
        }]);
        if (error) throw error;
      } else if (type === 'transaction') {
        const { error } = await supabase.from('transactions').insert([{
          org_id: angkatan,
          title: txTitle.trim(),
          category: txCat,
          amount: parseFloat(txAmount) || 0,
          type: txType
        }]);
        if (error) throw error;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      alert(`Gagal menyimpan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="bg-[#1d2e26] border border-[#385948] rounded-3xl w-full max-w-md p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-2 border-b border-[#2d473a]">
          <h3 className="text-sm font-bold text-white capitalize">
            Tambah {type === 'member' ? 'Pengurus' : type === 'event' ? 'Kegiatan' : 'Kas Keuangan'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full bg-[#2a4336] text-[#8da698] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {/* Pilihan Angkatan yang Terstandardisasi */}
          <div className="bg-[#23372e] p-3 rounded-2xl border border-[#385948]">
            <label className="text-[#86cfa7] font-bold block mb-1">Pilih Angkatan Target</label>
            <select
              value={angkatan}
              onChange={(e) => setAngkatan(e.target.value)}
              className="w-full bg-[#1a2a22] text-white p-2.5 rounded-xl border border-[#385948] font-bold outline-none"
            >
              {availableAngkatan.map((yr) => (
                <option key={yr} value={yr}>Angkatan {yr}</option>
              ))}
            </select>
          </div>

          {/* Form Pengurus Berdasarkan Master Data */}
          {type === 'member' && (
            <>
              <div>
                <label className="text-[#8da698] block mb-1">Nama Lengkap</label>
                <input
                  required
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Nama Pengurus"
                  className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl border border-[#385948] outline-none"
                />
              </div>

              <div>
                <label className="text-[#8da698] block mb-1">Jabatan Resmi (Master Role)</label>
                <select
                  value={memberRole}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl border border-[#385948] outline-none"
                >
                  {roles.map((r) => (
                    <option key={r.title} value={r.title}>
                      {r.title} ({r.tier.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#8da698] block mb-1">Departemen / Divisi (Master Dept)</label>
                <select
                  value={memberDept}
                  onChange={(e) => setMemberDept(e.target.value)}
                  className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl border border-[#385948] outline-none"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#8da698] block mb-1">URL Foto Profil (Opsional)</label>
                <input
                  value={memberImg}
                  onChange={(e) => setMemberImg(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl border border-[#385948] outline-none"
                />
              </div>
            </>
          )}

          {/* Form Kegiatan Berdasarkan Master Kategori */}
          {type === 'event' && (
            <>
              <div>
                <label className="text-[#8da698] block mb-1">Nama Kegiatan</label>
                <input
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Nama Event"
                  className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl border border-[#385948] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#8da698] block mb-1">Kategori Kegiatan</label>
                  <select
                    value={eventCat}
                    onChange={(e) => setEventCat(e.target.value)}
                    className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl border border-[#385948] outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[#8da698] block mb-1">Tanggal</label>
                  <input
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="25 Okt 2026"
                    className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl border border-[#385948] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#8da698] block mb-1">Lokasi Kegiatan</label>
                <input
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="Aula Utama"
                  className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl border border-[#385948] outline-none"
                />
              </div>

              <div>
                <label className="text-[#8da698] block mb-1">Deskripsi Kegiatan</label>
                <textarea
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="Keterangan singkat..."
                  className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl border border-[#385948] h-16 outline-none"
                />
              </div>
            </>
          )}

          {/* Form Keuangan */}
          {type === 'transaction' && (
            <>
              <div>
                <label className="text-[#8da698] block mb-1">Keterangan Transaksi</label>
                <input
                  required
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  placeholder="Iuran Bulanan / Konsumsi"
                  className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl border border-[#385948] outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#8da698] block mb-1">Tipe</label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as any)}
                    className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl border border-[#385948] outline-none"
                  >
                    <option value="in">Pemasukan (+)</option>
                    <option value="out">Pengeluaran (-)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#8da698] block mb-1">Nominal (Rp)</label>
                  <input
                    type="number"
                    required
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    placeholder="50000"
                    className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl border border-[#385948] outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#86cfa7] hover:bg-[#96e0b7] text-[#121c17] font-bold rounded-xl mt-4 flex items-center justify-center space-x-2 transition disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>{loading ? 'Menyimpan...' : 'Simpan Data'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};