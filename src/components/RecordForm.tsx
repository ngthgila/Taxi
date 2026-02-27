import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Save, X, AlertCircle } from 'lucide-react';
import { Record } from '../types';

interface RecordFormProps {
  onSave: (record: Partial<Record>) => Promise<void>;
  onCancel: () => void;
  initialData?: Record | null;
  existingDates?: string[];
}

export function RecordForm({ onSave, onCancel, initialData, existingDates = [] }: RecordFormProps) {
  // Use string for numbers to allow empty input (no leading zero)
  const [formData, setFormData] = useState<{
    date: string;
    revenue: string | number;
    expense: string | number;
    expense_note: string;
    general_note: string;
  }>({
    date: initialData?.date || new Date().toLocaleDateString('en-CA'),
    revenue: initialData?.revenue ?? '',
    expense: initialData?.expense ?? '',
    expense_note: initialData?.expense_note || '',
    general_note: initialData?.general_note || '',
  });

  const isDuplicateDate = existingDates.includes(formData.date);
  const isUpdatingSameRecord = initialData && initialData.date === formData.date;
  const showWarning = isDuplicateDate && !isUpdatingSameRecord;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      ...formData,
      revenue: Number(formData.revenue) || 0,
      expense: Number(formData.expense) || 0,
    });
    onCancel();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          {initialData ? 'Sửa Ghi Chép' : 'Thêm Ghi Chép Mới'}
        </h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Ngày</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
          {showWarning && (
            <div className="mt-2 flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded-xl text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>
                Đã có ghi chép cho ngày này. Dữ liệu cũ sẽ bị ghi đè bởi dữ liệu mới.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Doanh Thu (VNĐ)</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={formData.revenue}
              onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Chi Phí (VNĐ)</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={formData.expense}
              onChange={(e) => setFormData({ ...formData, expense: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Ghi Chú Chi Phí</label>
          <input
            type="text"
            placeholder="Ví dụ: Xăng, rửa xe, ăn trưa..."
            value={formData.expense_note}
            onChange={(e) => setFormData({ ...formData, expense_note: e.target.value })}
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Ghi Chú Chung</label>
          <textarea
            rows={3}
            placeholder="Ghi chú khác về ngày làm việc..."
            value={formData.general_note}
            onChange={(e) => setFormData({ ...formData, general_note: e.target.value })}
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Lưu
          </button>
        </div>
      </form>
    </motion.div>
  );
}
