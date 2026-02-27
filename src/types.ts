export interface Record {
  id: number | string;
  date: string;
  revenue: number;
  expense: number;
  expense_note: string;
  general_note: string;
  created_at: string;
}

export interface Stats {
  totalRevenue: number;
  totalExpense: number;
  totalDays: number;
}
