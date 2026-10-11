import React from 'react';
import { Info } from 'lucide-react';

interface ToastProps {
  message: string;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2 bg-[#2a4336] text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-[#385948] text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-200">
      <Info className="w-4 h-4 text-[#86cfa7]" />
      <span>{message}</span>
    </div>
  );
};