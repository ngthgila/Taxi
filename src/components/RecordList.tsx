import React from 'react';
import { motion } from 'motion/react';
import { Edit2, Trash2, FileText } from 'lucide-react';
import { Record } from '../types';
import { formatCurrency, formatDate } from '../lib/utils';

interface RecordListProps {
  records: Record[];
  onEdit: (record: Record) => void;
  onDelete: (id: number | string) => void;
}

export function RecordList({ records, onEdit, onDelete }: RecordListProps) {
  if (records.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
        <FileText size={48} className="mx-auto mb-4 opacity-50" />
        <p>Chưa có dữ liệu cho tháng này.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {records.map((record, index) => (
        <motion.div
          key={record.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03 }}
          className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">{formatDate(record.date)}</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => onEdit(record)}
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => {
                  if (confirm('Bạn có chắc chắn muốn xóa ghi chép này?')) {
                    onDelete(record.id);
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-2">
            <div className="flex-1 bg-emerald-50 px-2 py-1.5 rounded-lg flex justify-between items-center">
              <span className="text-[10px] text-emerald-600 font-medium uppercase">Thu</span>
              <span className="font-bold text-emerald-700 text-sm">{formatCurrency(record.revenue)}</span>
            </div>
            <div className="flex-1 bg-rose-50 px-2 py-1.5 rounded-lg flex justify-between items-center">
              <span className="text-[10px] text-rose-600 font-medium uppercase">Chi</span>
              <span className="font-bold text-rose-700 text-sm">{formatCurrency(record.expense)}</span>
            </div>
          </div>

          {(record.expense_note || record.general_note) && (
            <div className="space-y-1 pt-2 border-t border-slate-100 text-xs">
              {record.expense_note && (
                <div className="flex gap-2 text-slate-600">
                  <span className="font-medium text-slate-400 shrink-0 w-12">Chi phí:</span>
                  <span>{record.expense_note}</span>
                </div>
              )}
              {record.general_note && (
                <div className="flex gap-2 text-slate-600">
                  <span className="font-medium text-slate-400 shrink-0 w-12">Ghi chú:</span>
                  <span>{record.general_note}</span>
                </div>
              )}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
