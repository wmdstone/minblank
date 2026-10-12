export type TabType = 'home' | 'members' | 'events' | 'finance';

export interface Member {
  id: string | number;
  name: string;
  role: string;
  dept: string;
  img?: string;
  order_index?: number;
  role_description?: string;
  bio?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  whatsapp?: string;
  website?: string;
  email?: string;
  phone?: string;
}

export interface MasterRole {
  id: string | number;
  department: string;
  title: string;
  order_index: number;
  description?: string;
}

export interface OrgEvent {
  id: string | number;
  title: string;
  date: string;
  category: string;
  desc: string;
  status: 'upcoming' | 'completed' | 'ongoing';
  location?: string;
  photos?: string[]; // Kumpulan URL foto untuk carousel mini blog
}

export interface Transaction {
  id: string | number;
  desc: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category?: string;
}

export interface FinanceData {
  income: number;
  expense: number;
  balance: number;
  history: Transaction[];
}

export interface OrganizationYearData {
  tagline: string;
  about: string;
  stats: {
    membersCount: number;
    eventsCount: number;
    fundRaised: string;
  };
  members: Member[];
  events: OrgEvent[];
  finance: FinanceData;
}