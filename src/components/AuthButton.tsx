import React from 'react';
import { LogOut, Hash } from 'lucide-react';
import { useRecords } from '../hooks/useRecords';

export function AuthButton() {
  const { ledgerId, setLedgerId } = useRecords();

  const handleLogout = () => {
    if (confirm("Bạn có chắc muốn thoát khỏi nhóm này?")) {
      setLedgerId(null);
    }
  };

  if (ledgerId) {
    return (
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100">
          <Hash size={12} />
          <span className="font-mono font-bold uppercase">{ledgerId}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-3 py-2 rounded-lg transition-colors"
          title="Thoát nhóm"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Thoát</span>
        </button>
      </div>
    );
  }

  return null;
}
