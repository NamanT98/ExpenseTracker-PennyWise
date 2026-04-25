export type TransactionCategory = 'food' | 'travel' | 'fashion' | 'electricity bills' | 'rent' | 'miscellaneous';
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

export type DateRange = 'all' |'7days' | '1week' | '1month' | '3months' | '6months';

export interface DayGroup {
  dateLabel: string;
  dayOfMonth: string;
  dayOfWeek: string;
  transactions: Transaction[];
}
