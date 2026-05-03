export type TransactionCategory = string;
export type TransactionType = 'SENT' | 'RECEIVED';

export interface Transaction {
  id: string;
  sheetId: string;
  date: string; // ISO string
  title: string;
  summary?: string;
  category: TransactionCategory;
  amount: number;
  type: TransactionType;
}

export type CreateTransaction = Omit<Transaction, 'id' | 'date'>;
export type UpdateTransaction = Partial<Omit<Transaction, 'id' | 'date' | 'sheetId'>>;

export type DateRange = 'all' | 'this_week' | 'last_week' | '4weeks' | '12weeks' | 'this_month' | '1month' | '3months' | '6months' | 'this_year' | 'last_year' | '3years';

export interface DayGroup {
  dateLabel: string;
  dayOfMonth: string;
  dayOfWeek: string;
  transactions: Transaction[];
}
