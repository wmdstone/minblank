import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit2, Copy, Trash2 } from 'lucide-react';

interface RowActionMenuProps {
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete: () => void;
  title?: string;
}

export const RowActionMenu: React.FC<RowActionMenuProps> = ({
  onEdit,
  onDuplicate,
  onDelete,
  title
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="p-1.5 rounded-lg text-[#8da698] hover:text-white hover:bg-[#2a4336] transition"
        title="Opsi"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-[#16241d] border border-[#2d473a] rounded-xl shadow-xl z-30 py-1 overflow-hidden backdrop-blur-md">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onEdit();
              }}
              className="w-full px-3 py-1.5 text-left text-xs text-[#86cfa7] hover:bg-[#2a4336] flex items-center gap-2 transition"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          )}

          {onDuplicate && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onDuplicate();
              }}
              className="w-full px-3 py-1.5 text-left text-xs text-[#b0c8bb] hover:bg-[#2a4336] flex items-center gap-2 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Duplikat</span>
            </button>
          )}

          <div className="border-t border-[#2d473a] my-1" />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onDelete();
            }}
            className="w-full px-3 py-1.5 text-left text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus</span>
          </button>
        </div>
      )}
    </div>
  );
};