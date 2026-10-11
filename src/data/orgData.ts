import type { OrganizationYearData } from '../types';


export const orgData: Record<string, OrganizationYearData> = {
  "2026": {
    name: "GreenGen Org",
    tagline: "Daya Cipta & Keberlanjutan",
    overview: {
      membersCount: 48,
      eventsCount: 18,
      transparency: "100%"
    },
    members: {
      atas: [
        { id: "m1", name: "Arya Pratama", role: "Ketua Umum", dept: "BPH", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300", bio: "Fokus pada akselerasi program kerja berbasis keberlanjutan lingkungan dan pemberdayaan pemuda.", email: "arya@greengen.org", phone: "+62 812-3456-7890" },
        { id: "m2", name: "Nabila Putri", role: "Wakil Ketua", dept: "BPH", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300", bio: "Mengkoordinasikan sinergi divisi riset dan eksekusi lapangan.", email: "nabila@greengen.org" },
        { id: "m3", name: "Rizky Ramadhan", role: "Sekretaris Jenderal", dept: "Kesekretariatan", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300", bio: "Manajemen tata kelola administrasi dan pengarsipan digital organisasi.", email: "rizky@greengen.org" },
        { id: "m4", name: "Siti Rahma", role: "Bendahara Umum", dept: "Keuangan", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300", bio: "Pengelolaan alokasi dana dan audit transparansi keuangan publik.", email: "siti@greengen.org" }
      ],
      menengah: [
        { id: "m5", name: "Dimas Anggara", role: "Kadiv Program & Acara", dept: "Divisi Acara", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300", bio: "Penanggung jawab teknis seluruh timeline acara.", email: "dimas@greengen.org" },
        { id: "m6", name: "Clara Shinta", role: "Kadiv Humas & Media", dept: "Divisi Humas", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300", bio: "Membangun branding dan relasi eksternal.", email: "clara@greengen.org" },
        { id: "m7", name: "Fajar Nugraha", role: "Kadiv Logistik & Operasional", dept: "Divisi Logistik", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300", bio: "Penyedia sarana prasarana operasional komunitas.", email: "fajar@greengen.org" }
      ],
      bawah: [
        { id: "m8", name: "Intan Permata", role: "Staff Desain Grafis", dept: "Divisi Humas", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300", bio: "Kreator visual media sosial dan publikasi promosi." },
        { id: "m9", name: "Gilang Pratama", role: "Staff Lapangan", dept: "Divisi Acara", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300", bio: "Fasilitator teknis onsite." }
      ]
    },
    events: [
      { id: "e1", title: "Penanaman 1.000 Pohon Mangrove", cat: "Lingkungan", date: "24 Okt 2026", time: "07:30 WIB", location: "Hutan Mangrove PIK", img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600", desc: "Aksi restorasi ekosistem pesisir bersama 200 relawan pemuda.", attendees: 184 },
      { id: "e2", title: "Workshop Zero-Waste Campus", cat: "Edukasi", date: "05 Nov 2026", time: "13:00 WIB", location: "Auditorium Utama", img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600", desc: "Pelatihan pengolahan limbah organik dan daur ulang plastik.", attendees: 120 },
      { id: "e3", title: "Green Innovation Summit 2026", cat: "Konferensi", date: "12 Des 2026", time: "09:00 WIB", location: "Grand Ballroom Hall B", img: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600", desc: "Simposium tahunan ide bisnis hijau tingkat nasional.", attendees: 310 }
    ],
    finance: {
      balance: 18450000,
      income: 25000000,
      expense: 6550000,
      transactions: [
        { id: "t1", title: "Dana Hibah Proyek Hijau Kemendikbud", category: "Hibah", amount: 15000000, type: "in", date: "10 Okt 2026" },
        { id: "t2", title: "Iuran Kas Angkatan 2026 (Bulan Okt)", category: "Iuran", amount: 2400000, type: "in", date: "08 Okt 2026" },
        { id: "t3", title: "Pembelian Bibit Mangrove 1.000 bibit", category: "Pengadaan", amount: 4500000, type: "out", date: "06 Okt 2026" },
        { id: "t4", title: "Konsumsi & Logistik Rapat Kerja", category: "Operasional", amount: 1250000, type: "out", date: "02 Okt 2026" }
      ]
    }
  },
  "2025": {
    name: "GreenGen Org",
    tagline: "Inovasi & Sinergi Komunitas",
    overview: { membersCount: 42, eventsCount: 15, transparency: "100%" },
    members: {
      atas: [
        { id: "m201", name: "Bagus Santoso", role: "Ketua Demisioner", dept: "BPH", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300", bio: "Dewan Penasihat Organisasi periode 2026.", email: "bagus@greengen.org" }
      ],
      menengah: [],
      bawah: []
    },
    events: [],
    finance: { balance: 8200000, income: 18000000, expense: 9800000, transactions: [] }
  }
};