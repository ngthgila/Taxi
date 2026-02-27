import React, { useState } from 'react';
import { CarTaxiFront, ArrowRight, Users } from 'lucide-react';
import { useRecords } from '../hooks/useRecords';

export function LoginScreen() {
  const { setLedgerId } = useRecords();
  const [inputCode, setInputCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = inputCode.trim();
    if (code.length < 3) {
      alert("Mã nhóm phải có ít nhất 3 ký tự");
      return;
    }
    setLedgerId(code);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center border border-slate-100">
        <div className="flex justify-center mb-6 text-indigo-600">
          <CarTaxiFront size={64} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">TaxiLedger</h1>
        <p className="text-slate-500 mb-8">
          Nhập "Mã Nhóm" để bắt đầu.<br/>
          Dùng chung mã này với bạn bè để cùng quản lý.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Ví dụ: taxi-hanoi-123"
              className="w-full p-4 text-center text-lg font-bold tracking-wide rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none uppercase placeholder:normal-case placeholder:font-normal"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-xl font-medium transition-colors shadow-lg shadow-indigo-200"
          >
            <span>Vào Sổ</span>
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Users size={14} />
          <span>Không cần tài khoản - Chỉ cần nhớ mã</span>
        </div>
      </div>
    </div>
  );
}
