import React from 'react';
import type { FinanceData } from '../types';
import { ArrowDownRight, ArrowUpRight, Download } from 'lucide-react';

interface FinanceTabProps {
  finance: FinanceData;
  onDownloadReport: () => void;
}

export const FinanceTab: React.FC<FinanceTabProps> = ({ finance, onDownloadReport }) => {
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-4">
      {/* Saldo Kas Utama */}
      <div className="bg-gradient-to-br from-[#2a4336] to-[#1d2e26] p-5 rounded-3xl border border-[#385948]">
        <p className="text-[10px] text-[#8da698] uppercase font-bold tracking-wider">Total Kas Bersih</p>
        <h2 className="text-2xl font-extrabold text-[#86cfa7] mt-1">{formatIDR(finance.balance)}</h2>
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#385948]/60">
          <div>
            <p className="text-[10px] text-[#8da698]">Pemasukan</p>
            <p className="text-xs font-bold text-emerald-400">{formatIDR(finance.income)}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#8da698]">Pengeluaran</p>
            <p className="text-xs font-bold text-rose-400">{formatIDR(finance.expense)}</p>
          </div>
        </div>
      </div>

      {/* Button Download PDF */}
      <button
        onClick={onDownloadReport}
        className="w-full py-2.5 bg-[#86cfa7] hover:bg-[#97dfb7] text-[#121c17] font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition"
      >
        <Download className="w-4 h-4" />
        <span>Unduh Laporan Kas (PDF)</span>
      </button>

      {/* Mutasi Transaksi */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Mutasi Terakhir</h4>
        <div className="space-y-2">
          {finance.history.map((tx) => (
            <div key={tx.id} className="bg-[#2a4336] p-3 rounded-xl flex items-center justify-between border border-[#385948]">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${tx.type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {tx.type === 'income' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div>
                  <h5 className="font-bold text-white text-xs">{tx.desc}</h5>
                  <p className="text-[9px] text-[#8da698]">{tx.date} • {tx.category ?? (tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran')}</p>
                </div>
              </div>
              <span className={`text-xs font-bold ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {tx.type === 'income' ? '+' : '-'}{formatIDR(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};