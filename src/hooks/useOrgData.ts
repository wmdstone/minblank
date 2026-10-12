import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { orgData as staticOrgData } from '../data/orgData';
import type { OrganizationYearData, Member, OrgEvent, Transaction } from '../types';

export const useOrgData = (selectedYear: string) => {
  const [data, setData] = useState<OrganizationYearData>(() => {
    return staticOrgData[selectedYear] || staticOrgData['2026'];
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [isUsingSupabase, setIsUsingSupabase] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [membersRes, eventsRes, transRes] = await Promise.all([
        supabase
          .from('members')
          .select('*')
          .eq('org_id', selectedYear)
          .order('order_index', { ascending: true }),
        supabase
          .from('events')
          .select('*')
          .eq('org_id', selectedYear)
          .order('date', { ascending: true }),
        supabase
          .from('transactions')
          .select('*')
          .eq('org_id', selectedYear)
          .order('date', { ascending: false })
      ]);

      const dbMembers: Member[] = (membersRes.data || []).map(m => ({
        id: m.id,
        name: m.name,
        role: m.role,
        dept: m.dept,
        img: m.img,
        order_index: m.order_index ?? 99,
        role_description: m.role_description,
        bio: m.bio,
        instagram: m.instagram,
        linkedin: m.linkedin,
        email: m.email,
        phone: m.phone
      }));


      const dbEvents: OrgEvent[] = (eventsRes.data || []).map(e => ({
        id: e.id,
        title: e.title,
        date: e.date,
        category: e.category,
        desc: e.desc,
        status: e.status || 'upcoming'
      }));

      const dbTrans: Transaction[] = (transRes.data || []).map(t => ({
        id: t.id,
        desc: t.desc,
        amount: Number(t.amount),
        type: t.type,
        date: t.date
      }));

      const hasSupabaseData = dbMembers.length > 0 || dbEvents.length > 0 || dbTrans.length > 0;
      setIsUsingSupabase(hasSupabaseData);

      if (hasSupabaseData) {
        const income = dbTrans.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const expense = dbTrans.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        const balance = income - expense;

        setData({
          tagline: `Generasi Angkatan ${selectedYear}`,
          about: `Informasi kepengurusan dan kegiatan resmi organisasi periode angkatan ${selectedYear}.`,
          stats: {
            membersCount: dbMembers.length,
            eventsCount: dbEvents.length,
            fundRaised: `Rp ${(balance / 1000000).toFixed(1)} jt`
          },
          members: dbMembers,
          events: dbEvents,
          finance: {
            income,
            expense,
            balance,
            history: dbTrans
          }
        });
      } else {
        const fallback = staticOrgData[selectedYear] || staticOrgData['2026'];
        setData(fallback);
      }
    } catch (err) {
      console.error('Error fetching data from Supabase:', err);
      const fallback = staticOrgData[selectedYear] || staticOrgData['2026'];
      setData(fallback);
      setIsUsingSupabase(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedYear]);

  return { data, loading, isUsingSupabase, refetch: fetchData };
};