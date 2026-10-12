import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import { orgData as fallbackStaticData } from '../data/orgData';
import type { OrganizationYearData, Member, OrgEvent, Transaction } from '../types';

export function useOrgData(year: string) {
  const [data, setData] = useState<OrganizationYearData>(
    fallbackStaticData[year] || fallbackStaticData['2026']
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrgData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Ambil data pengurus untuk angkatan aktif
      const { data: membersRaw, error: membersError } = await supabase
        .from('members')
        .select('*')
        .eq('org_id', year)
        .order('created_at', { ascending: true });

      if (membersError) throw membersError;

      // Kelompokkan pengurus ke dalam tier (atas, menengah, bawah, anggota)
      const atas: Member[] = [];
      const menengah: Member[] = [];
      const bawah: Member[] = [];
      const anggota: Member[] = [];

      (membersRaw || []).forEach((m: any) => {
        const item: Member = {
          id: m.id,
          name: m.name,
          role: m.role,
          dept: m.dept,
          img: m.img || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
          bio: m.bio,
          phone: m.phone,
          email: m.email,
        };

        if (m.tier === 'atas') atas.push(item);
        else if (m.tier === 'menengah') menengah.push(item);
        else if (m.tier === 'bawah') bawah.push(item);
        else anggota.push(item);
      });

      // 2. Ambil data kegiatan
      const { data: eventsRaw, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('org_id', year)
        .order('date', { ascending: false });

      if (eventsError) throw eventsError;

      const events: OrgEvent[] = (eventsRaw || []).map((e: any) => ({
        id: e.id,
        title: e.title,
        cat: e.cat,
        date: e.date,
        time: e.time || '09:00 WIB',
        location: e.location || 'Aula Utama',
        img: e.img || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600',
        desc: e.description || '',
        attendees: e.attendees || 0,
      }));

      // 3. Ambil mutasi kas keuangan
      const { data: txRaw, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .eq('org_id', year)
        .order('date', { ascending: false });

      if (txError) throw txError;

      const transactions: Transaction[] = (txRaw || []).map((t: any) => ({
        id: t.id,
        title: t.title,
        category: t.category,
        amount: Number(t.amount),
        type: t.type,
        date: t.date,
      }));

      const income = transactions
        .filter((t) => t.type === 'in')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = transactions
        .filter((t) => t.type === 'out')
        .reduce((sum, t) => sum + t.amount, 0);

      const balance = income - expense;

      // 4. Update state jika data di Supabase ada, jika kosong fallback ke static
      const staticFallback = fallbackStaticData[year] || fallbackStaticData['2026'];

      const totalMembersCount =
        membersRaw && membersRaw.length > 0
          ? membersRaw.length
          : staticFallback.overview.membersCount;

      const totalEventsCount =
        eventsRaw && eventsRaw.length > 0
          ? eventsRaw.length
          : staticFallback.overview.eventsCount;

      setData({
        name: 'GreenGen Org',
        tagline: 'Daya Cipta & Keberlanjutan',
        overview: {
          membersCount: totalMembersCount,
          eventsCount: totalEventsCount,
          transparency: '100%',
        },
        members: {
          atas: atas.length > 0 ? atas : staticFallback.members.atas,
          menengah: menengah.length > 0 ? menengah : staticFallback.members.menengah,
          bawah: bawah.length > 0 ? bawah : staticFallback.members.bawah,
          anggota: anggota.length > 0 ? anggota : staticFallback.members.anggota,
        },
        events: events.length > 0 ? events : staticFallback.events,
        finance: {
          balance: transactions.length > 0 ? balance : staticFallback.finance.balance,
          income: transactions.length > 0 ? income : staticFallback.finance.income,
          expense: transactions.length > 0 ? expense : staticFallback.finance.expense,
          transactions: transactions.length > 0 ? transactions : staticFallback.finance.transactions,
        },
      });

      setError(null);
    } catch (err: any) {
      console.warn('Gagal memuat dari Supabase, beralih ke data lokal:', err.message);
      setError(err.message);
      setData(fallbackStaticData[year] || fallbackStaticData['2026']);
    } finally {
      setIsLoading(false);
    }
  }, [year]);

  useEffect(() => {
    fetchOrgData();

    // Setup Realtime Subscription: jika admin menambah/mengubah data, langsung update di app
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        () => {
          fetchOrgData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrgData]);

  return { data, isLoading, error, refetch: fetchOrgData };
}