import React, { useState } from 'react';
import { supabase } from '../../utils/supabase';
import { X, Plus } from 'lucide-react';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgId: string;
  onSuccess: () => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, orgId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    dept: '',
    tier: 'atas',
    img: '',
    email: '',
    phone: '',
    bio: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('members').insert([
        {
          org_id: orgId,
          ...formData,
          img: formData.img || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
        }
      ]);
      if (error) throw error;
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Gagal menambahkan anggota');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-[#1d2e26] border border-[#385948] rounded-2xl w-full max-w-md p-5 space-y-4">
        <div className="flex justify-between items-center border-b border-[#2d473a] pb-2">
          <h3 className="text-sm font-bold text-white">Tambah Pengurus ({orgId})</h3>
          <button onClick={onClose} className="text-[#8da698] hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-[#8da698] block mb-1">Nama Lengkap</label>
            <input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl outline-none border border-[#385948]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[#8da698] block mb-1">Jabatan / Role</label>
              <input
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl outline-none border border-[#385948]"
                placeholder="Ketua Umum"
              />
            </div>
            <div>
              <label className="text-[#8da698] block mb-1">Departemen / Divisi</label>
              <input
                required
                value={formData.dept}
                onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl outline-none border border-[#385948]"
                placeholder="BPH / Humas"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[#8da698] block mb-1">Tingkatan Struktur</label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl outline-none border border-[#385948]"
              >
                <option value="atas">Atas (BPH)</option>
                <option value="menengah">Menengah (Koordinator)</option>
                <option value="bawah">Bawah (Staff)</option>
              </select>
            </div>
            <div>
              <label className="text-[#8da698] block mb-1">URL Foto Profil</label>
              <input
                value={formData.img}
                onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                placeholder="https://..."
                className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl outline-none border border-[#385948]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#86cfa7] text-[#121c17] font-bold rounded-xl mt-4 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>{loading ? 'Menyimpan...' : 'Simpan Pengurus'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};