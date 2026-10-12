import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import { orgData as fallbackStaticData } from '../data/orgData';
import type { OrganizationYearData, Member, OrgEvent, Transaction } from '../types';

export function useOrgData(activeAngkatan: string) {
  const [data, setData] = useState<OrganizationYearData>(() => {
    return fallbackStaticData[activeAngkatan] || {
      name: 'GreenGen Org',
      tagline: `Generasi ${activeAngkatan}`,
      overview: { membersCount: 0, eventsCount: 0, transparency: '100%' },
      members: { atas: [], menengah: [], bawah: [], anggota: [] },
      events: [],
      finance: { balance: 0, income: 0, expense: 0, transactions: [] }
    };
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUsingSupabase, setIsUsingSupabase] = useState<boolean>(false);

  const fetchByAngkatan = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Pengurus berdasarkan angkatan
      const { data: membersRaw, error: mErr } = await supabase
        .from('members')
        .select('*')
        .eq('org_id', activeAngkatan)
        .order('created_at', { ascending: true });

      if (mErr) throw mErr;

      // 2. Fetch Kegiatan berdasarkan angkatan
      const { data: eventsRaw, error: eErr } = await supabase
        .from('events')
        .select('*')
        .eq('org_id', activeAngkatan)
        .order('created_at', { ascending: false });

      if (eErr) throw eErr;

      // 3. Fetch Transaksi Keuangan berdasarkan angkatan
      const { data: txRaw, error: tErr } = await supabase
        .from('transactions')
        .select('*')
        .eq('org_id', activeAngkatan)
        .order('date', { ascending: false });

      if (tErr) throw tErr;

      // Jika ada data di salah satu tabel Supabase, pakai data Supabase murni
      const hasSupabaseData = (membersRaw?.length || 0) > 0 || (eventsRaw?.length || 0) > 0 || (txRaw?.length || 0) > 0;

      if (hasSupabaseData) {
        setIsUsingSupabase(true);

        const atas: Member[] = [];
        const menengah: Member[] = [];
        const bawah: Member[] = [];
        const anggota: Member[] = [];

        membersRaw?.forEach((m) => {
          const item: Member = {
            id: m.id,
            name: m.name,
            role: m.role,
            dept: m.dept,
            img: m.img || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
            bio: m.bio || '',
            email: m.email || '',
            phone: m.phone || ''
          };
          if (m.tier === 'atas') atas.push(item);
          else if (m.tier === 'menengah') menengah.push(item);
          else if (m.tier === 'bawah') bawah.push(item);
          else anggota.push(item);
        });

        const events: OrgEvent[] = (eventsRaw || []).map((e) => ({
          id: e.id,
          title: e.title,
          cat: e.cat,
          date: e.date,
          time: e.time || '08:00 WIB',
          location: e.location || 'Kampus',
          img: e.img || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600',
          desc: e.description || '',
          attendees: e.attendees || 0
        }));

        const transactions: Transaction[] = (txRaw || []).map((t) => ({
          id: t.id,
          title: t.title,
          category: t.category,
          amount: Number(t.amount),
          type: t.type,
          date: t.date
        }));

        const income = transactions.filter(t => t.type === 'in').reduce((acc, cur) => acc + cur.amount, 0);
        const expense = transactions.filter(t => t.type === 'out').reduce((acc, cur) => acc + cur.amount, 0);

        setData({
          name: 'GreenGen Org',
          tagline: `Generasi Angkatan ${activeAngkatan}`,
          overview: {
            membersCount: (membersRaw?.length || 0),
            eventsCount: events.length,
            transparency: '100%'
          },
          members: { atas, menengah, bawah, anggota },
          events,
          finance: {
            balance: income - expense,
            income,
            expense,
            transactions
          }
        });
      } else {
        // Jika belum ada data di Supabase untuk angkatan ini, gunakan template statis
        setIsUsingSupabase(false);
        const staticItem = fallbackStaticData[activeAngkatan] || {
          name: 'GreenGen Org',
          tagline: `Generasi Angkatan ${activeAngkatan}`,
          overview: { membersCount: 0, eventsCount: 0, transparency: '100%' },
          members: { atas: [], menengah: [], bawah: [], anggota: [] },
          events: [],
          finance: { balance: 0, income: 0, expense: 0, transactions: [] }
        };
        setData(staticItem);
      }
    } catch (err) {
      console.error('Error fetching Supabase data:', err);
      setIsUsingSupabase(false);
    } finally {
      setIsLoading(false);
    }
  }, [activeAngkatan]);

  useEffect(() => {
    fetchByAngkatan();

    // Listen realtime changes untuk semua tabel
    const channel = supabase
      .channel(`realtime-org-${activeAngkatan}`)
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchByAngkatan();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchByAngkatan, activeAngkatan]);

  return { data, isLoading, isUsingSupabase, refetch: fetchByAngkatan };
}