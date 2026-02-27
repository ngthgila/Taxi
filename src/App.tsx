/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Plus, CarTaxiFront, LayoutDashboard, List, ChevronDown, AlertTriangle } from 'lucide-react';
import { useRecords } from './hooks/useRecords';
import { DashboardStats } from './components/DashboardStats';
import { RecordList } from './components/RecordList';
import { RecordForm } from './components/RecordForm';
import { RevenueChart } from './components/RevenueChart';
import { AuthButton } from './components/AuthButton';
import { LoginScreen } from './components/LoginScreen';
import { Record } from './types';
import { generateTimeOptions, getMissingDates, formatDate } from './lib/utils';

export default function App() {
  const { records, loading, saveRecord, deleteRecord, ledgerId } = useRecords();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);
  const [currentView, setCurrentView] = useState<'records' | 'dashboard'>('records');
  
  // Time Range Management
  const timeOptions = useMemo(() => generateTimeOptions(), []);
  // Flatten options for easy lookup
  const allOptions = useMemo(() => timeOptions.flatMap(group => group.options), [timeOptions]);
  
  const [selectedRangeValue, setSelectedRangeValue] = useState(allOptions[0].value);
  const selectedRange = allOptions.find(o => o.value === selectedRangeValue) || allOptions[0];

  // Filter records by selected range
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const recordDate = new Date(record.date);
      // Reset time for accurate comparison
      recordDate.setHours(0, 0, 0, 0);
      const start = new Date(selectedRange.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(selectedRange.endDate);
      end.setHours(23, 59, 59, 999);
      
      return recordDate >= start && recordDate <= end;
    });
  }, [records, selectedRange]);

  // Calculate missing dates (only for Cycle and Week views to avoid noise in Year view)
  const missingDates = useMemo(() => {
    if (selectedRange.type === 'year') return [];
    const dates = filteredRecords.map(r => r.date);
    return getMissingDates(dates);
  }, [filteredRecords, selectedRange]);

  // Calculate stats for the filtered records
  const cycleStats = useMemo(() => {
    const totalRevenue = filteredRecords.reduce((sum, r) => sum + r.revenue, 0);
    const totalExpense = filteredRecords.reduce((sum, r) => sum + r.expense, 0);
    return {
      totalRevenue,
      totalExpense,
      totalDays: filteredRecords.length
    };
  }, [filteredRecords]);

  const handleEdit = (record: Record) => {
    setEditingRecord(record);
    setIsFormOpen(true);
  };

  const handleSave = async (record: Partial<Record>) => {
    await saveRecord(record);
    setIsFormOpen(false);
    setEditingRecord(null);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingRecord(null);
  };

  const handleAddMissingDate = (date: string) => {
    setEditingRecord({
      id: 0, // Placeholder
      date: date,
      revenue: 0,
      expense: 0,
      expense_note: '',
      general_note: '',
      created_at: ''
    });
    setIsFormOpen(true);
  };

  if (!ledgerId && !loading) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600">
            <CarTaxiFront size={28} />
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">TaxiLedger</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <div className="relative max-w-[140px] sm:max-w-[180px]">
              <select
                value={selectedRangeValue}
                onChange={(e) => setSelectedRangeValue(e.target.value)}
                className="w-full appearance-none bg-slate-100 border-none text-sm font-medium text-slate-700 py-2 pl-4 pr-8 rounded-full focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer truncate"
              >
                {timeOptions.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>

            <AuthButton />
          </div>
        </div>
        
        {/* Sub-header for Date Range */}
        <div className="bg-slate-50 border-b border-slate-200 py-2 text-center">
          <p className="text-xs text-slate-500">
            Thời gian: {selectedRange.subLabel}
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {currentView === 'dashboard' ? (
              <div className="space-y-6">
                <DashboardStats stats={cycleStats} />
                <RevenueChart records={filteredRecords} />
              </div>
            ) : (
              <div className="space-y-4">
                {missingDates.length > 0 && (
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={20} />
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-orange-800 mb-1">Phát hiện ngày thiếu ghi chép</h3>
                        <p className="text-xs text-orange-600 mb-2">
                          Vui lòng bổ sung thông tin cho các ngày sau (nhập 0đ nếu nghỉ):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {missingDates.map(date => (
                            <button
                              key={date}
                              onClick={() => handleAddMissingDate(date)}
                              className="text-xs bg-white border border-orange-200 text-orange-700 px-2 py-1 rounded-md hover:bg-orange-100 transition-colors"
                            >
                              {formatDate(date)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-800">Nhật Ký: {selectedRange.label}</h2>
                  <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-lg">
                    {filteredRecords.length} ngày
                  </span>
                </div>
                <RecordList 
                  records={filteredRecords} 
                  onEdit={handleEdit} 
                  onDelete={deleteRecord} 
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Action Button (Only on Records view) */}
      {currentView === 'records' && (
        <button
          onClick={() => setIsFormOpen(true)}
          className="fixed bottom-24 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-20"
        >
          <Plus size={24} />
        </button>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-30">
        <div className="max-w-3xl mx-auto flex justify-around">
          <button
            onClick={() => setCurrentView('records')}
            className={`flex flex-col items-center py-3 px-6 w-full ${
              currentView === 'records' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <List size={24} />
            <span className="text-[10px] font-medium mt-1">Sổ Ghi Chép</span>
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center py-3 px-6 w-full ${
              currentView === 'dashboard' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <LayoutDashboard size={24} />
            <span className="text-[10px] font-medium mt-1">Thống Kê</span>
          </button>
        </div>
      </div>

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg">
            <RecordForm 
              onSave={handleSave} 
              onCancel={handleCancel} 
              initialData={editingRecord}
              existingDates={records.map(r => r.date)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

