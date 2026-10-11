// src/types/index.ts


export interface Member {
  id: string;
  name: string;
  role: string;
  dept: string;
  img: string;
  bio?: string;
  phone?: string;
  email?: string;
}

export interface OrgEvent {
  id: string;
  title: string;
  cat: string;
  date: string;
  time: string;
  location: string;
  img: string;
  desc: string;
  attendees: number;
}

export interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: 'in' | 'out';
  date: string;
}

export interface FinanceData {
  balance: number;
  income: number;
  expense: number;
  transactions: Transaction[];
}

// INI YANG SEBELUMNYA HILANG ATAU BELUM TER-EKSPOR:
export interface OrganizationYearData {
  name: string;
  tagline: string;
  overview: {
    membersCount: number;
    eventsCount: number;
    transparency: string;
  };
  members: {
    atas: Member[];
    menengah: Member[];
    bawah: Member[];
    anggota?: Member[];
  };
  events: OrgEvent[];
  finance: FinanceData;
}

