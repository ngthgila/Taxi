import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Wallet, User, Car } from 'lucide-react';
import { Stats } from '../types';
import { formatCurrency } from '../lib/utils';

interface DashboardStatsProps {
  stats: Stats | null;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  if (!stats) return null;

  const profit = (stats.totalRevenue || 0) - (stats.totalExpense || 0);
  
  // Profit Sharing Logic
  const DRIVER_SHARE_PERCENTAGE = 29.23 / 100;
  const DRIVER_FIXED_SUPPORT = 3000000;

  const driverShare = profit * DRIVER_SHARE_PERCENTAGE;
  const driverTotalIncome = driverShare + DRIVER_FIXED_SUPPORT;
  
  const ownerShare = profit - driverShare;
  const ownerTotalIncome = ownerShare - DRIVER_FIXED_SUPPORT;

  return (
    <div className="space-y-6 mb-8">
      {/* General Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Tổng Doanh Thu</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {formatCurrency(stats.totalRevenue || 0)}
              </h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
              <TrendingDown size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Tổng Chi Phí</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {formatCurrency(stats.totalExpense || 0)}
              </h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${profit >= 0 ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Lợi Nhuận Ròng</p>
              <h3 className={`text-2xl font-bold ${profit >= 0 ? 'text-slate-900' : 'text-orange-600'}`}>
                {formatCurrency(profit)}
              </h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Profit Distribution */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4">Phân Chia Lợi Nhuận (Tạm Tính)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl shadow-sm border border-indigo-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <User size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Tài Xế</h4>
                  <p className="text-xs text-slate-500">29.23% + 3tr Lương cứng</p>
                </div>
              </div>
              <span className="text-xl font-bold text-indigo-700">
                {formatCurrency(driverTotalIncome)}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Chia sẻ lợi nhuận:</span>
                <span>{formatCurrency(driverShare)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Lương cứng:</span>
                <span>{formatCurrency(DRIVER_FIXED_SUPPORT)}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl shadow-sm border border-slate-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-200 text-slate-700 rounded-lg">
                  <Car size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Chủ Xe</h4>
                  <p className="text-xs text-slate-500">Phần còn lại - 3tr Lương cứng</p>
                </div>
              </div>
              <span className="text-xl font-bold text-slate-800">
                {formatCurrency(ownerTotalIncome)}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Chia sẻ lợi nhuận:</span>
                <span>{formatCurrency(ownerShare)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Chi lương cứng:</span>
                <span className="text-rose-600">-{formatCurrency(DRIVER_FIXED_SUPPORT)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
