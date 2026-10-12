/** Accept legacy JSON, arrays, newline/space-separated URLs, and direct URLs. */
export function parsePhotoUrls(value: unknown): string[] {
  if (Array.isArray(value)) return [...new Set(value.flatMap(parsePhotoUrls))];
  if (typeof value !== 'string' || !value.trim()) return [];
  const text = value.trim();
  if (text.startsWith('[') || text.startsWith('"')) {
    try {
      const decoded: unknown = JSON.parse(text);
      if (decoded !== text) return parsePhotoUrls(decoded);
    } catch { /* Legacy plain text falls through to URL extraction. */ }
  }
  const matches = text.match(/https?:\/\/[^\s<>"\[\]]+/gi) || [];
  return [...new Set(matches.map(raw => raw.replace(/[,;]+$/, '')).filter(raw => {
    try { const url = new URL(raw); return ['http:', 'https:'].includes(url.protocol); }
    catch { return false; }
  }))];
}

export function getEventPhotos(event: { photos?: unknown; img?: unknown; desc?: unknown; description?: unknown } | null | undefined): string[] {
  if (!event) return [];
  const explicit = parsePhotoUrls(event.photos);
  if (explicit.length) return explicit;
  const legacyImage = parsePhotoUrls(event.img);
  if (legacyImage.length) return legacyImage;
  // Only recover image-looking links from prose, not social/registration pages.
  return parsePhotoUrls(event.desc || event.description).filter(url =>
    /\.(avif|webp|png|jpe?g|gif)(?:[?#]|$)/i.test(url) ||
    /(?:images\.unsplash\.com|images\.pexels\.com|i\.imgur\.com|\/storage\/v1\/object\/)/i.test(url)
  );
}

export function getEventDescription(event: { desc?: unknown; description?: unknown } | null | undefined, photos: string[]): string {
  const raw = event?.desc || event?.description;
  if (typeof raw !== 'string') return '';
  return photos.reduce((text, url) => text.split(url).join(''), raw).replace(/\n{3,}/g, '\n\n').trim();
}