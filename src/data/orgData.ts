import type { OrganizationYearData } from '../types';

export const orgData: Record<string, OrganizationYearData> = {
  "2026": {
    tagline: "Daya Cipta & Keberlanjutan",
    about: "Informasi kepengurusan dan kegiatan resmi organisasi periode angkatan 2026.",
    stats: { membersCount: 4, eventsCount: 3, fundRaised: "Rp 18.5 jt" },
    members: [
      { id: "m1", name: "Arya Pratama", role: "Ketua Umum", dept: "BPH", order_index: 1, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300" },
      { id: "m2", name: "Nabila Putri", role: "Wakil Ketua", dept: "BPH", order_index: 2, img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300" },
      { id: "m5", name: "Dimas Anggara", role: "Koordinator Divisi", dept: "Acara & Program", order_index: 5, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300" },
      { id: "m6", name: "Clara Shinta", role: "Koordinator Divisi", dept: "Humas & Media", order_index: 5, img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300" }
    ],
    events: [
      { id: "e1", title: "Penanaman 1.000 Pohon Mangrove", category: "Lingkungan", date: "2026-10-24", location: "Hutan Mangrove PIK", desc: "Aksi restorasi ekosistem pesisir bersama 200 relawan pemuda.", status: "upcoming" },
      { id: "e2", title: "Workshop Zero-Waste Campus", category: "Edukasi", date: "2026-11-05", location: "Auditorium Utama", desc: "Pelatihan pengolahan limbah organik dan daur ulang plastik.", status: "upcoming" },
      { id: "e3", title: "Green Innovation Summit 2026", category: "Konferensi", date: "2026-12-12", location: "Grand Ballroom Hall B", desc: "Simposium tahunan ide bisnis hijau tingkat nasional.", status: "upcoming" }
    ],
    finance: {
      income: 25000000,
      expense: 6550000,
      balance: 18450000,
      history: [
        { id: "t1", desc: "Dana Hibah Proyek Hijau", category: "Hibah", amount: 15000000, type: "income", date: "2026-10-10" },
        { id: "t3", desc: "Pembelian Bibit Mangrove", category: "Pengadaan", amount: 4500000, type: "expense", date: "2026-10-06" }
      ]
    }
  },
  "2025": {
    tagline: "Inovasi & Sinergi Komunitas",
    about: "Informasi kepengurusan dan kegiatan resmi organisasi periode angkatan 2025.",
    stats: { membersCount: 1, eventsCount: 0, fundRaised: "Rp 8.2 jt" },
    members: [
      { id: "m201", name: "Bagus Santoso", role: "Ketua Umum", dept: "BPH", order_index: 1, img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300" }
    ],
    events: [],
    finance: { income: 18000000, expense: 9800000, balance: 8200000, history: [] }
  }
};
