import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ImageOff, RotateCw } from 'lucide-react';
import { DrawerButton } from '@/components/DrawerButton';

interface Props { photos: string[]; title: string; }

export function EventPhotoCarousel({ photos, title }: Props) {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [retry, setRetry] = useState(0);
  const start = useRef<{ x: number; y: number } | null>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const signature = photos.join('\n');
  useEffect(() => { setIndex(0); setFailed({}); setLoaded({}); }, [signature]);
  const active = Math.min(index, Math.max(photos.length - 1, 0));
  const url = photos[active];
  const go = (step: number) => setIndex(current => (current + step + photos.length) % photos.length);
  useEffect(() => { thumbRefs.current[active]?.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }, [active]);

  if (!photos.length) return <div className="event-photo-empty"><ImageOff size={28} /><span>Belum ada foto kegiatan</span></div>;

  return (
    <section className="event-gallery" aria-label={`Foto ${title}`}>
      <div className="event-photo-stage" role="region" aria-roledescription="carousel" aria-label="Foto kegiatan" tabIndex={0}
        onKeyDown={e => {
          if (photos.length < 2) return;
          if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
        }}
        onTouchStart={e => { const touch = e.touches[0]; if (touch) start.current = { x: touch.clientX, y: touch.clientY }; }}
        onTouchEnd={e => {
          const touch = e.changedTouches[0];
          if (touch && start.current && photos.length > 1) {
            const dx = touch.clientX - start.current.x;
            const dy = touch.clientY - start.current.y;
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
          }
          start.current = null;
        }}>
        {!loaded[url] && !failed[url] && <div className="event-photo-loading" aria-label="Memuat foto" />}
        {failed[url] ? (
          <div className="event-photo-error" role="status">
            <ImageOff size={28} />
            <strong>Foto tidak dapat dimuat</strong>
            <span>Tautan mungkin bukan gambar langsung atau aksesnya dibatasi.</span>
            <DrawerButton title="Coba muat foto lagi" onClick={() => {
              setFailed(old => ({ ...old, [url]: false })); setLoaded(old => ({ ...old, [url]: false })); setRetry(old => old + 1);
            }}><RotateCw size={15} /> Coba lagi</DrawerButton>
            <a href={url} target="_blank" rel="noopener noreferrer">Buka tautan foto</a>
          </div>
        ) : <img key={`${url}-${retry}`} src={url} alt={`${title} — foto ${active + 1}`} className="event-photo-main" referrerPolicy="no-referrer" draggable={false}
          onLoad={() => setLoaded(old => ({ ...old, [url]: true }))}
          onError={() => setFailed(old => ({ ...old, [url]: true }))} />}
        <div className="event-photo-shade" />
        <span className="event-photo-count" aria-live="polite">{active + 1} / {photos.length}</span>
        {photos.length > 1 && <>
          <DrawerButton className="event-photo-arrow event-photo-prev" aria-label="Foto sebelumnya" title="Foto sebelumnya" onClick={() => go(-1)}><ChevronLeft size={20} /></DrawerButton>
          <DrawerButton className="event-photo-arrow event-photo-next" aria-label="Foto berikutnya" title="Foto berikutnya" onClick={() => go(1)}><ChevronRight size={20} /></DrawerButton>
          <div className="event-photo-dots" aria-label="Pilih foto">
            {photos.map((photo, i) => <DrawerButton key={photo} className={`event-photo-dot ${active === i ? 'is-active' : ''}`} aria-label={`Tampilkan foto ${i + 1}`} aria-current={active === i ? 'true' : undefined} title={`Foto ${i + 1}`} onClick={() => setIndex(i)} />)}
          </div>
        </>}
      </div>
      {photos.length > 1 && <div className="event-photo-thumbnails" aria-label="Pratinjau foto">
        {photos.map((photo, i) => <DrawerButton key={photo} ref={undefined} className={`event-photo-thumb ${active === i ? 'is-active' : ''}`} aria-label={`Pilih foto ${i + 1}`} aria-pressed={active === i} title={`Foto ${i + 1}`} onClick={() => setIndex(i)}>
          {failed[photo] ? <ImageOff size={18} /> : <img src={photo} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(old => ({ ...old, [photo]: true }))} />}
        </DrawerButton>)}
      </div>}
    </section>
  );
}