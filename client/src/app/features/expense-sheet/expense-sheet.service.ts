import { Injectable, signal, computed } from '@angular/core';
import { Transaction, DateRange, CreateTransaction, UpdateTransaction } from './models';
import { MOCK_TRANSACTIONS } from './constants';

@Injectable({
  providedIn: 'root'
})
export class ExpenseSheetService {
  private allTransactionsSignal = signal<Transaction[]>([...MOCK_TRANSACTIONS]);
  private selectedSheetIdSignal = signal<string | null>(null);
  private selectedDateRangeSignal = signal<DateRange>('this_month');
  private selectedCategorySignal = signal<string>('all');

  readonly selectedSheetId = this.selectedSheetIdSignal.asReadonly();
  readonly selectedDateRange = this.selectedDateRangeSignal.asReadonly();
  readonly selectedCategory = this.selectedCategorySignal.asReadonly();
  readonly allTransactions = this.allTransactionsSignal.asReadonly();

  readonly filteredTransactions = computed(() => {
    const sheetId = this.selectedSheetIdSignal();
    if (!sheetId) return [];

    const range = this.selectedDateRangeSignal();
    const category = this.selectedCategorySignal();
    const now = new Date();
    let startDate = new Date(0);
    let endDate = new Date(now); // default to now

    if (range !== 'all') {
      startDate = new Date();
      if (range === 'this_month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (range === '1month') {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      } else if (range === '3months') {
        startDate.setMonth(now.getMonth() - 3);
      } else if (range === '6months') {
        startDate.setMonth(now.getMonth() - 6);
      } else if (range === 'this_week') {
        const day = now.getDay() || 7;
        startDate.setDate(now.getDate() - day + 1);
        startDate.setHours(0,0,0,0);
      } else if (range === 'last_week') {
        const day = now.getDay() || 7;
        startDate.setDate(now.getDate() - day - 6);
        startDate.setHours(0,0,0,0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
      } else if (range === '4weeks') {
        startDate.setDate(now.getDate() - 28);
      } else if (range === '12weeks') {
        startDate.setDate(now.getDate() - 84);
      } else if (range === 'this_year') {
        startDate = new Date(now.getFullYear(), 0, 1);
      } else if (range === 'last_year') {
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
      } else if (range === '3years') {
        startDate.setFullYear(now.getFullYear() - 3);
      }
    }

    const filtered = this.allTransactionsSignal().filter(t => {
      const tDate = new Date(t.date);
      const matchesSheet = t.sheetId === sheetId;
      const matchesDate = tDate >= startDate && tDate <= endDate;
      const matchesCat = category === 'all' || t.category === category;
      return matchesSheet && matchesDate && matchesCat;
    });

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  // All transactions for the active sheet — unfiltered (used by Analysis tab)
  readonly sheetTransactions = computed(() => {
    const sheetId = this.selectedSheetIdSignal();
    if (!sheetId) return [];
    return this.allTransactionsSignal()
      .filter(t => t.sheetId === sheetId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  });


  setSheetId(id: string) {
    this.selectedSheetIdSignal.set(id);
  }

  setDateRange(range: DateRange) {
    this.selectedDateRangeSignal.set(range);
  }

  setCategory(category: string) {
    this.selectedCategorySignal.set(category);
  }

  addTransaction(transaction: CreateTransaction) {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    this.allTransactionsSignal.update(transactions => [newTransaction, ...transactions]);
  }

  updateTransaction(id: string, updates: UpdateTransaction) {
    this.allTransactionsSignal.update(transactions =>
      transactions.map(t => t.id === id ? { ...t, ...updates } : t)
    );
  }

  deleteTransaction(id: string) {
    this.allTransactionsSignal.update(transactions =>
      transactions.filter(t => t.id !== id)
    );
  }
}
