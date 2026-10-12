import React, { useState } from 'react';
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

  // Form states
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [memberDept, setMemberDept] = useState('BPH');
  const [memberTier, setMemberTier] = useState('atas');
  const [memberImg, setMemberImg] = useState('');

  const [eventTitle, setEventTitle] = useState('');
  const [eventCat, setEventCat] = useState('Lingkungan');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDesc, setEventDesc] = useState('');

  const [txTitle, setTxTitle] = useState('');
  const [txCat, setTxCat] = useState('Iuran');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState<'in' | 'out'>('in');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanAngkatan = angkatan.trim();
    if (!cleanAngkatan) {
      alert('Angkatan tidak boleh kosong!');
      setLoading(false);
      return;
    }

    try {
      // 1. Pastikan angkatan ada di tabel organizations terlebih dahulu
      await supabase.from('organizations').upsert(
        {
          id: cleanAngkatan,
          name: 'GreenGen Org',
          tagline: `Generasi Angkatan ${cleanAngkatan}`,
        },
        { onConflict: 'id' }
      );

      // 2. Insert berdasarkan tipe
      if (type === 'member') {
        const payload = {
          org_id: cleanAngkatan,
          name: memberName.trim(),
          role: memberRole.trim(),
          dept: memberDept.trim(),
          tier: memberTier,
          img: memberImg.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
        };

        const { data, error } = await supabase.from('members').insert([payload]).select();
        if (error) {
          console.error('Supabase Member Insert Error:', error);
          throw new Error(error.message || error.details || 'Gagal menyimpan anggota');
        }
      } else if (type === 'event') {
        const payload = {
          org_id: cleanAngkatan,
          title: eventTitle.trim(),
          cat: eventCat.trim(),
          date: eventDate.trim() || new Date().toLocaleDateString('id-ID'),
          location: eventLocation.trim() || 'Sekretariat',
          description: eventDesc.trim(),
        };

        const { error } = await supabase.from('events').insert([payload]).select();
        if (error) {
          console.error('Supabase Event Insert Error:', error);
          throw new Error(error.message || error.details || 'Gagal menyimpan kegiatan');
        }
      } else if (type === 'transaction') {
        const payload = {
          org_id: cleanAngkatan,
          title: txTitle.trim(),
          category: txCat.trim(),
          amount: parseFloat(txAmount) || 0,
          type: txType,
        };

        const { error } = await supabase.from('transactions').insert([payload]).select();
        if (error) {
          console.error('Supabase Transaction Insert Error:', error);
          throw new Error(error.message || error.details || 'Gagal menyimpan transaksi');
        }
      }

      // Reset form dan tutup
      alert(`Berhasil menyimpan data untuk Angkatan ${cleanAngkatan}!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Submit Failed:', err);
      alert(`Error Supabase: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="bg-[#1d2e26] border border-[#385948] rounded-3xl w-full max-w-md p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-2 border-b border-[#2d473a]">
          <h3 className="text-sm font-bold text-white capitalize">
            Tambah {type === 'member' ? 'Pengurus' : type === 'event' ? 'Kegiatan' : 'Transaksi Kas'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full bg-[#2a4336] text-[#8da698] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {/* Target Angkatan (Penting untuk multi-tahun) */}
          <div className="bg-[#23372e] p-3 rounded-2xl border border-[#385948]">
            <label className="text-[#86cfa7] font-bold block mb-1">Target Angkatan Organisasi</label>
            <input
              type="text"
              required
              value={angkatan}
              onChange={(e) => setAngkatan(e.target.value)}
              placeholder="Contoh: 2026, 2027, 2028..."
              className="w-full bg-[#1a2a22] text-white p-2.5 rounded-xl border border-[#385948] font-bold"
            />
            <span className="text-[10px] text-[#8da698] mt-1 block">
              Data ini akan otomatis muncul saat pengguna memilih angkatan ini.
            </span>
          </div>

          {/* Form Pengurus */}
          {type === 'member' && (
            <>
              <div>
                <label className="text-[#8da698] block mb-1">Nama Lengkap</label>
                <input
                  required
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl border border-[#385948]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#8da698] block mb-1">Jabatan</label>
                  <input
                    required
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value)}
                    placeholder="Ketua / Sekretaris"
                    className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl border border-[#385948]"
                  />
                </div>
                <div>
                  <label className="text-[#8da698] block mb-1">Departemen</label>
                  <input
                    required
                    value={memberDept}
                    onChange={(e) => setMemberDept(e.target.value)}
                    className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl border border-[#385948]"
                  />
                </div>
              </div>
              <div>
                <label className="text-[#8da698] block mb-1">Tingkatan Struktur</label>
                <select
                  value={memberTier}
                  onChange={(e) => setMemberTier(e.target.value)}
                  className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl border border-[#385948]"
                >
                  <option value="atas">Struktur Atas (BPH)</option>
                  <option value="menengah">Struktur Menengah (Koordinator)</option>
                  <option value="bawah">Struktur Bawah (Staff)</option>
                </select>
              </div>
            </>
          )}

          {/* Form Kegiatan */}
          {type === 'event' && (
            <>
              <div>
                <label className="text-[#8da698] block mb-1">Judul Kegiatan</label>
                <input
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl border border-[#385948]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#8da698] block mb-1">Kategori</label>
                  <input
                    required
                    value={eventCat}
                    onChange={(e) => setEventCat(e.target.value)}
                    className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl border border-[#385948]"
                  />
                </div>
                <div>
                  <label className="text-[#8da698] block mb-1">Tanggal</label>
                  <input
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="25 Okt 2026"
                    className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl border border-[#385948]"
                  />
                </div>
              </div>
              <div>
                <label className="text-[#8da698] block mb-1">Deskripsi Singkat</label>
                <textarea
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl border border-[#385948] h-16"
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
                  placeholder="Iuran Kas / Sewa Tempat"
                  className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl border border-[#385948]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#8da698] block mb-1">Tipe</label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as 'in' | 'out')}
                    className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl border border-[#385948]"
                  >
                    <option value="in">Pemasukan (+)</option>
                    <option value="out">Pengeluaran (-)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#8da698] block mb-1">Jumlah (Rp)</label>
                  <input
                    type="number"
                    required
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    placeholder="100000"
                    className="w-full bg-[#2a4336] text-white p-2.5 rounded-xl border border-[#385948]"
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
            <span>{loading ? 'Menyimpan ke Supabase...' : 'Simpan Data'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};