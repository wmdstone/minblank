import React, { useEffect, useState, useMemo } from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  Globe,
  MessageCircle,
  Briefcase,
  Image as ImageIcon
} from 'lucide-react';
import { getRobotAvatar } from '@/utils/avatar';
import { getEventPhotos, getEventDescription } from '@/utils/eventPhotos';
import { EventPhotoCarousel } from '@/components/EventPhotoCarousel';
import { DrawerButton } from '@/components/DrawerButton';
import { createPortal } from 'react-dom';
import { useRef } from 'react';

interface BottomDrawerProps {
  isOpen: boolean;
  type: string;
  payload: any;
  onClose: () => void;
}

export const BottomDrawer: React.FC<BottomDrawerProps> = ({ isOpen, type, payload, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);

    } else {
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const photosList = useMemo(() => getEventPhotos(payload), [payload]);
  const cleanDescription = useMemo(() => getEventDescription(payload, photosList), [payload, photosList]);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const elements = panelRef.current?.querySelectorAll<HTMLElement>('button, a[href], [tabindex="0"]');
      if (!elements?.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  if (!mounted && !isOpen) return null;
  const formatUrl = (url?: string) => {
    if (!url) return '';
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  };

  return createPortal(
    <div
      onClick={onClose}
      className={`event-drawer-backdrop ${isOpen ? 'is-open' : ''}`}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-heading"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={`event-drawer-panel ${isOpen ? 'is-open' : ''}`}
      >
        <div className="event-drawer-handle" />
        <div className="event-drawer-header">
          <h3 id="drawer-heading">
            {type === 'member' && 'Profil Pengurus'}
            {type === 'event' && <><ImageIcon size={15} /><span>Dokumentasi Kegiatan</span></>}
            {type === 'notification' && 'Pusat Notifikasi'}
          </h3>
          <DrawerButton className="event-drawer-close" onClick={onClose} aria-label="Tutup detail" title="Tutup detail"><X size={18} /></DrawerButton>
        </div>

        {/* 1. KONTEN MEMBER (LAYOUT ALA INSTAGRAM) */}
        {type === 'member' && payload && (
          <div className="space-y-4">
            {/* Header: Foto Kiri, Keterangan Kanan ala Instagram */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-[#86cfa7] via-[#2d473a] to-emerald-400 shrink-0 shadow-lg">
                <img
                  src={payload.img || getRobotAvatar(payload.name)}
                  alt={payload.name}
                  className="w-full h-full rounded-full object-cover bg-[#16241d]"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = getRobotAvatar(payload.name);
                  }}
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-extrabold text-white truncate">{payload.name}</h2>
                  <span className="text-[10px] bg-[#2a4336] text-[#86cfa7] px-2 py-0.5 rounded-md font-bold font-mono">
                    #{payload.order_index ?? '-'}
                  </span>
                </div>
                <p className="text-xs text-[#86cfa7] font-semibold">{payload.role}</p>
                <div className="inline-block bg-[#16241d] px-2.5 py-0.5 rounded-lg text-[10px] text-[#8da698] border border-[#2d473a]">
                  {payload.dept}
                </div>
              </div>
            </div>

            {/* Bio Kutipan / Profil Diri */}
            {payload.bio && (
              <div className="p-3 bg-[#16241d] border border-[#2d473a] rounded-xl text-xs text-[#b0c8bb] leading-relaxed">
                <p className="italic">"{payload.bio}"</p>
              </div>
            )}

            {/* BARIS TOMBOL SOSIAL MEDIA OPSIONAL */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-[#8da698] uppercase tracking-wider block">
                Kontak & Jejaring Sosial:
              </span>
              <div className="flex flex-wrap gap-2">
                {payload.instagram && (
                  <a
                    href={formatUrl(payload.instagram.startsWith('@') ? `instagram.com/${payload.instagram.replace('@', '')}` : payload.instagram)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a4336] hover:bg-[#86cfa7] text-[#86cfa7] hover:text-[#0d1612] text-xs font-semibold transition border border-[#385948]"
                  >
                    <span>Instagram</span>
                  </a>
                )}

                {payload.twitter && (
                  <a
                    href={formatUrl(payload.twitter.startsWith('@') ? `twitter.com/${payload.twitter.replace('@', '')}` : payload.twitter)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a4336] hover:bg-[#86cfa7] text-[#86cfa7] hover:text-[#0d1612] text-xs font-semibold transition border border-[#385948]"
                  >
                    <span>Twitter / X</span>
                  </a>
                )}

                {payload.linkedin && (
                  <a
                    href={formatUrl(payload.linkedin)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a4336] hover:bg-[#86cfa7] text-[#86cfa7] hover:text-[#0d1612] text-xs font-semibold transition border border-[#385948]"
                  >
                    <span>LinkedIn</span>
                  </a>
                )}

                {payload.whatsapp && (
                  <a
                    href={formatUrl(payload.whatsapp.startsWith('http') ? payload.whatsapp : `wa.me/${payload.whatsapp.replace(/[^0-9]/g, '')}`)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a4336] hover:bg-emerald-400 text-emerald-300 hover:text-[#0d1612] text-xs font-semibold transition border border-[#385948]"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}

                {payload.website && (
                  <a
                    href={formatUrl(payload.website)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a4336] hover:bg-[#86cfa7] text-[#86cfa7] hover:text-[#0d1612] text-xs font-semibold transition border border-[#385948]"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Portofolio</span>
                  </a>
                )}

                {payload.email && (
                  <a
                    href={`mailto:${payload.email}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a4336] hover:bg-[#86cfa7] text-[#86cfa7] hover:text-[#0d1612] text-xs font-semibold transition border border-[#385948]"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{payload.email}</span>
                  </a>
                )}

                {payload.phone && (
                  <a
                    href={`tel:${payload.phone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a4336] hover:bg-[#86cfa7] text-[#86cfa7] hover:text-[#0d1612] text-xs font-semibold transition border border-[#385948]"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{payload.phone}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Rincian Tugas & Tanggung Jawab Jabatan (Tupoksi) */}
            {payload.role_description && (
              <div className="p-3 bg-[#16241d] border border-[#2d473a] rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-[#86cfa7] flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  <span>Tugas & Wewenang Jabatan:</span>
                </span>
                <p className="text-xs text-[#8da698] leading-relaxed">
                  {payload.role_description}
                </p>
              </div>
            )}
          </div>
        )}

        {type === 'event' && payload && (
          <article className="event-detail">
            <EventPhotoCarousel key={String(payload.id ?? payload.title)} photos={photosList} title={payload.title || 'Kegiatan'} />
            <div className="event-detail-heading">
              <span className="event-detail-category">{payload.category || payload.cat || 'Kegiatan'}</span>
              <h2>{payload.title}</h2>
              <div className="event-detail-meta">
                {payload.date && <span><Calendar size={14} />{payload.date}</span>}
                {payload.location && <span><MapPin size={14} />{payload.location}</span>}
              </div>
            </div>
            <div className="event-detail-description">
              <h3>Tentang kegiatan</h3>
              <p>{cleanDescription || 'Belum ada deskripsi kegiatan.'}</p>
            </div>
          </article>
        )}

        {/* 3. KONTEN NOTIFIKASI */}
        {type === 'notification' && (
          <div className="space-y-2.5">
            <div className="p-3.5 bg-[#2a4336] rounded-xl flex items-start space-x-3 border border-[#385948]">
              <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white">Sistem Sinkronisasi Aktif</p>
                <p className="text-[10px] text-[#8da698] mt-0.5">
                  Data kegiatan, pengurus, dan kas disinkronkan secara realtime dengan database.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};