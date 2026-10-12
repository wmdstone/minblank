import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../utils/supabase';
import { X, User, Calendar, DollarSign, Info, Image as ImageIcon } from 'lucide-react';
import { getRobotAvatar } from '@/utils/avatar';
import { getEventPhotos, parsePhotoUrls } from '@/utils/eventPhotos';
import { EventPhotoCarousel } from '@/components/EventPhotoCarousel';

interface MasterRoleOption {
  department: string;
  title: string;
  order_index: number;
  description?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: 'member' | 'event' | 'transaction';
  defaultOrgId: string;
  onSuccess: () => void;
  initialData?: any;
  mode?: 'create' | 'edit' | 'duplicate';
}

export const AdminInputModal: React.FC<Props> = ({
  isOpen,
  onClose,
  type,
  defaultOrgId,
  onSuccess,
  initialData,
  mode = 'create'
}) => {
  const [targetOrgId, setTargetOrgId] = useState(defaultOrgId);
  const [availableOrgs, setAvailableOrgs] = useState<{ id: string; name: string }[]>([]);
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [deptList, setDeptList] = useState<string[]>([]);
  const [rolesList, setRolesList] = useState<MasterRoleOption[]>([]);

  // Member form state
  const [memberName, setMemberName] = useState('');
  const [memberDept, setMemberDept] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [memberOrderIndex, setMemberOrderIndex] = useState<number>(1);
  const [memberImg, setMemberImg] = useState('');
  const [memberBio, setMemberBio] = useState('');
  const [memberInstagram, setMemberInstagram] = useState('');
  const [memberTwitter, setMemberTwitter] = useState('');
  const [memberLinkedin, setMemberLinkedin] = useState('');
  const [memberWhatsapp, setMemberWhatsapp] = useState('');
  const [memberWebsite, setMemberWebsite] = useState('');
  const [selectedRoleDescPreview, setSelectedRoleDescPreview] = useState('');

  // Event form state (Mini Blog)
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventStatus, setEventStatus] = useState<'upcoming' | 'completed' | 'ongoing'>('upcoming');
  const [eventLocation, setEventLocation] = useState('');
  const [eventPhotosText, setEventPhotosText] = useState(''); // Multi-line photo URLs

  // Transaction form state
  const [txDesc, setTxDesc] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState<'income' | 'expense'>('expense');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadMasterOptions = async () => {
    try {
      const [orgsRes, catRes, deptRes, roleRes] = await Promise.all([
        supabase.from('organizations').select('id, name').order('id', { ascending: true }),
        supabase.from('master_event_categories').select('name').order('name'),
        supabase.from('master_departments').select('name').order('name'),
        supabase.from('master_roles').select('department, title, order_index, description').order('order_index', { ascending: true })
      ]);

      if (orgsRes.data) setAvailableOrgs(orgsRes.data);
      if (catRes.data) setCategoriesList(catRes.data.map((c: any) => c.name));
      if (deptRes.data) {
        const dNames = deptRes.data.map((d: any) => d.name);
        setDeptList(dNames);
        if (dNames.length > 0 && !memberDept && !initialData) {
          setMemberDept(dNames[0]);
        }
      }
      if (roleRes.data) {
        setRolesList(roleRes.data.map((r: any) => ({
          department: r.department || '',
          title: r.title || '',
          order_index: Number(r.order_index) || 99,
          description: r.description || ''
        })));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTargetOrgId(defaultOrgId);
      loadMasterOptions();
      populateInitialData();
    }
  }, [isOpen, defaultOrgId, initialData, mode]);

  const populateInitialData = () => {
    if (initialData) {
      if (type === 'member') {
        setMemberName(mode === 'duplicate' ? `${initialData.name} (Copy)` : initialData.name || '');
        setMemberDept(initialData.dept || '');
        setMemberRole(initialData.role || '');
        setMemberOrderIndex(initialData.order_index ?? 1);
        setMemberImg(initialData.img || '');
        setMemberBio(initialData.bio || '');
        setMemberInstagram(initialData.instagram || '');
        setMemberTwitter(initialData.twitter || '');
        setMemberLinkedin(initialData.linkedin || '');
        setMemberWhatsapp(initialData.whatsapp || '');
        setMemberWebsite(initialData.website || '');
        setSelectedRoleDescPreview(initialData.role_description || '');
      } else if (type === 'event') {
        setEventTitle(mode === 'duplicate' ? `${initialData.title} (Copy)` : initialData.title || '');
        setEventDate(initialData.date || '');
        setEventCategory(initialData.category || initialData.cat || '');
        setEventDesc(initialData.desc || initialData.description || '');
        setEventStatus(initialData.status || 'upcoming');
        setEventLocation(initialData.location || '');
        const photos = getEventPhotos(initialData).join('\n');
        setEventPhotosText(photos);
      } else if (type === 'transaction') {
        setTxDesc(mode === 'duplicate' ? `${initialData.desc} (Copy)` : initialData.desc || '');
        setTxAmount(initialData.amount ? String(initialData.amount) : '');
        setTxType(initialData.type || 'expense');
        setTxDate(initialData.date || new Date().toISOString().split('T')[0]);
      }
    } else {
      setMemberName('');
      setMemberRole('');
      setMemberImg('');
      setMemberBio('');
      setMemberInstagram('');
      setMemberTwitter('');
      setMemberLinkedin('');
      setMemberWhatsapp('');
      setMemberWebsite('');
      setSelectedRoleDescPreview('');

      setEventTitle('');
      setEventDate('');
      setEventDesc('');
      setEventLocation('');
      setEventPhotosText('');

      setTxDesc('');
      setTxAmount('');
      setTxType('expense');
      setTxDate(new Date().toISOString().split('T')[0]);
    }
  };

  // Normalisasi string untuk pencocokan toleran ("Divisi Logistik" == "Logistik")
  const normalize = (str: string) => str.toLowerCase().replace(/^(divisi|departemen|bidang|seksi)\s+/i, '').trim();

  // Filter jabatan secara dinamis dan toleran
  const availableRoles = useMemo(() => {
    if (!memberDept) return rolesList;
    const match = rolesList.filter(r => normalize(r.department) === normalize(memberDept) || r.department.toLowerCase() === memberDept.toLowerCase());
    // Fallback: Jika departemen belum memiliki jabatan khusus di master, tampilkan semua jabatan agar tidak macet!
    return match.length > 0 ? match : rolesList;
  }, [rolesList, memberDept]);

  // Sinkronkan jabatan pertama ketika departemen berganti
  const handleDeptSelect = (dept: string) => {
    setMemberDept(dept);
    const match = rolesList.filter(r => normalize(r.department) === normalize(dept));
    if (match.length > 0) {
      setMemberRole(match[0].title);
      setMemberOrderIndex(match[0].order_index);
      setSelectedRoleDescPreview(match[0].description || '');
    } else {
      setMemberRole('');
      setSelectedRoleDescPreview('Departemen ini belum memiliki jabatan di Master Data. Anda dapat memilih dari daftar atau ketik baru.');
    }
  };

  const handleRoleSelect = (title: string) => {
    setMemberRole(title);
    const matched = rolesList.find(r => r.title === title && (normalize(r.department) === normalize(memberDept) || !memberDept));
    if (matched) {
      setMemberOrderIndex(matched.order_index);
      setSelectedRoleDescPreview(matched.description || 'Tidak ada deskripsi rincian peran.');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await supabase.from('organizations').upsert(
        { id: targetOrgId, name: `Generasi Angkatan ${targetOrgId}` },
        { onConflict: 'id' }
      );

      const isEdit = mode === 'edit' && initialData?.id;

      if (type === 'member') {
        const matched = rolesList.find(r => r.title === memberRole);
        const roleDesc = matched?.description || selectedRoleDescPreview || null;
        const avatarImage = memberImg.trim() || getRobotAvatar(memberName || 'robot');

        const payload: any = {
          org_id: targetOrgId,
          name: memberName,
          role: memberRole,
          order_index: matched?.order_index ?? memberOrderIndex,
          dept: memberDept,
          role_description: roleDesc,
          bio: memberBio.trim() || null,
          instagram: memberInstagram.trim() || null,
          twitter: memberTwitter.trim() || null,
          linkedin: memberLinkedin.trim() || null,
          whatsapp: memberWhatsapp.trim() || null,
          website: memberWebsite.trim() || null,
          img: avatarImage,
          tier: 'anggota'
        };

        if (isEdit) {
          const { error } = await supabase.from('members').update(payload).eq('id', initialData.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('members').insert(payload);
          if (error) throw error;
        }
      } else if (type === 'event') {
        // Parse multi-line photo URLs
        const photosArray = parsePhotoUrls(eventPhotosText);
        if (eventPhotosText.trim() && photosArray.length === 0) {
          throw new Error('URL foto tidak valid. Gunakan tautan gambar langsung dengan http:// atau https://.');
        }

        const chosenCategory = eventCategory || 'Umum';
        const descText = eventDesc.trim();
        const payload: any = {
          org_id: targetOrgId,
          title: eventTitle,
          // Kompatibel dengan schema lama (cat) maupun baru (category)
          cat: chosenCategory,
          category: chosenCategory,
          date: eventDate || new Date().toISOString().split('T')[0],
          location: eventLocation || '',
          status: eventStatus || 'upcoming',
          desc: descText,
          description: descText,
          photos: photosArray,
        };

        if (isEdit) {
          const { error } = await supabase.from('events').update(payload).eq('id', initialData.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('events').insert(payload);
          if (error) throw error;
        }
      } else if (type === 'transaction') {
        const payload: any = {
          org_id: targetOrgId,
          desc: txDesc,
          amount: parseFloat(txAmount) || 0,
          type: txType,
          date: txDate
        };

        if (isEdit) {
          const { error } = await supabase.from('transactions').update(payload).eq('id', initialData.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('transactions').insert(payload);
          if (error) throw error;
        }
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
      <div className="bg-[#1d2e26] border border-[#2d473a] rounded-2xl w-full max-w-md max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
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
                {mode === 'edit' ? 'Edit' : mode === 'duplicate' ? 'Duplikasi' : 'Tambah'}{' '}
                {type === 'member' && 'Pengurus / Anggota'}
                {type === 'event' && 'Agenda Kegiatan (Mini Blog)'}
                {type === 'transaction' && 'Transaksi Kas'}
              </h3>
              <p className="text-[11px] text-[#8da698]">Angkatan {targetOrgId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#8da698] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {errorMsg && (
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Target Angkatan */}
          <div>
            <label className="text-[11px] font-semibold text-[#8da698] block mb-1">Target Angkatan Organisasi</label>
            <select
              value={targetOrgId}
              onChange={(e) => setTargetOrgId(e.target.value)}
              className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              {availableOrgs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name || `Angkatan ${o.id}`}
                </option>
              ))}
            </select>
          </div>

          {/* FORM PENGURUS */}
          {type === 'member' && (
            <>
              <div>
                <label className="text-[11px] font-semibold text-[#8da698] block mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Fauzan Hanif"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-2 text-xs text-white placeholder-[#456755] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-[#8da698] block mb-1">Departemen *</label>
                  <select
                    value={memberDept}
                    onChange={(e) => handleDeptSelect(e.target.value)}
                    required
                    className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="">Pilih Departemen</option>
                    {deptList.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#8da698] block mb-1">Jabatan di Dept *</label>
                  <select
                    value={memberRole}
                    onChange={(e) => handleRoleSelect(e.target.value)}
                    required
                    className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="">Pilih Jabatan</option>
                    {availableRoles.map((r) => (
                      <option key={`${r.department}-${r.title}`} value={r.title}>
                        #{r.order_index} {r.title} {r.department ? `(${r.department})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Info Tupoksi */}
              <div className="p-2.5 bg-[#15231c] border border-[#2d473a] rounded-xl flex items-start gap-2">
                <Info className="w-4 h-4 text-[#86cfa7] shrink-0 mt-0.5" />
                <div className="text-[10px] text-[#8da698]">
                  <span className="text-[#86cfa7] font-semibold">Tugas & Peran (Master Data): </span>
                  {selectedRoleDescPreview || 'Dapat dikelola pada Master Data > Jabatan.'}
                </div>
              </div>

              {/* Biodata Profil Diri */}
              <div>
                <label className="text-[11px] font-semibold text-[#8da698] block mb-1">
                  Biodata / Profil Pengurus (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Minat, keahlian, atau moto hidup..."
                  value={memberBio}
                  onChange={(e) => setMemberBio(e.target.value)}
                  className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-2 text-xs text-white placeholder-[#456755] outline-none"
                />
              </div>

              {/* Input Sosial Media Lengkap */}
              <div className="space-y-2 pt-1">
                <label className="text-[11px] font-bold text-[#86cfa7] block">Tautan Media Sosial & Kontak (Opsional)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Instagram (@username / URL)"
                    value={memberInstagram}
                    onChange={(e) => setMemberInstagram(e.target.value)}
                    className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#456755] outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Twitter / X (@handle / URL)"
                    value={memberTwitter}
                    onChange={(e) => setMemberTwitter(e.target.value)}
                    className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#456755] outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="LinkedIn (URL profil)"
                    value={memberLinkedin}
                    onChange={(e) => setMemberLinkedin(e.target.value)}
                    className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#456755] outline-none"
                  />
                  <input
                    type="text"
                    placeholder="WhatsApp (+628... / link)"
                    value={memberWhatsapp}
                    onChange={(e) => setMemberWhatsapp(e.target.value)}
                    className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#456755] outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Website / Portofolio (https://...)"
                  value={memberWebsite}
                  onChange={(e) => setMemberWebsite(e.target.value)}
                  className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-1.5 text-xs text-white placeholder-[#456755] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#8da698] block mb-1">
                  Foto URL (Kosongkan untuk avatar robot otomatis)
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={memberImg}
                  onChange={(e) => setMemberImg(e.target.value)}
                  className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-2 text-xs text-white placeholder-[#456755] outline-none"
                />
              </div>
            </>
          )}

          {/* FORM KEGIATAN (MINI BLOG) */}
          {type === 'event' && (
            <>
              <div>
                <label className="text-[11px] font-semibold text-[#8da698] block mb-1">Judul Agenda Kegiatan *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Musyawarah Kerja & Upgrading Pengurus"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-2 text-xs text-white placeholder-[#456755] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-[#8da698] block mb-1">Kategori *</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value)}
                    required
                    className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="">Pilih Kategori</option>
                    {categoriesList.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#8da698] block mb-1">Tanggal *</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#8da698] block mb-1">Lokasi Kegiatan</label>
                <input
                  type="text"
                  placeholder="Misal: Gedung Graha Mahasiswa / Zoom"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-2 text-xs text-white placeholder-[#456755] outline-none"
                />
              </div>

              {/* Mini Blog: Multi Photo URLs */}
              <div>
                <label className="text-[11px] font-semibold text-[#86cfa7] flex items-center gap-1.5 mb-1">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Koleksi Foto Kegiatan (Masukkan 1 URL per baris)</span>
                </label>
                <textarea
                  id="event-photos"
                  aria-label="Koleksi foto kegiatan"
                  rows={3}
                  placeholder={"https://contoh.com/foto1.jpg\nhttps://contoh.com/foto2.jpg\nhttps://contoh.com/foto3.jpg"}
                  value={eventPhotosText}
                  onChange={(e) => setEventPhotosText(e.target.value)}
                  className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-2 text-xs text-white placeholder-[#456755] outline-none font-mono text-[11px]"
                />
                {eventPhotosText.trim() && <div className="event-form-preview">
                  <EventPhotoCarousel photos={parsePhotoUrls(eventPhotosText)} title={eventTitle || 'Kegiatan'} />
                </div>}
              </div>

              {/* Mini Blog: Deskripsi Narasi Lengkap */}
              <div>
                <label className="text-[11px] font-semibold text-[#8da698] block mb-1">Artikel / Deskripsi Rangkaian Acara (Mini Blog)</label>
                <textarea
                  rows={4}
                  placeholder="Ceritakan latar belakang, jalannya acara, keseruan, dan hasil dari kegiatan ini..."
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-2 text-xs text-white placeholder-[#456755] outline-none leading-relaxed"
                />
              </div>
            </>
          )}

          {/* FORM KAS */}
          {type === 'transaction' && (
            <>
              <div>
                <label className="text-[11px] font-semibold text-[#8da698] block mb-1">Keterangan Transaksi *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Iuran Kas Bulanan / Pembelian Perlengkapan"
                  value={txDesc}
                  onChange={(e) => setTxDesc(e.target.value)}
                  className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-2 text-xs text-white placeholder-[#456755] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-[#8da698] block mb-1">Jenis *</label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as any)}
                    className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="income">Pemasukan (+)</option>
                    <option value="expense">Pengeluaran (-)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#8da698] block mb-1">Nominal (Rp) *</label>
                  <input
                    type="number"
                    required
                    placeholder="100000"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-2 text-xs text-white placeholder-[#456755] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#8da698] block mb-1">Tanggal</label>
                <input
                  type="date"
                  value={txDate}
                  onChange={(e) => setTxDate(e.target.value)}
                  className="w-full bg-[#15231c] border border-[#2d473a] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#2d473a] text-xs font-semibold text-[#8da698] hover:text-white transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-[#86cfa7] hover:bg-[#9ae5bc] text-[#0d1612] text-xs font-bold transition disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : mode === 'edit' ? 'Perbarui Data' : 'Simpan Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};