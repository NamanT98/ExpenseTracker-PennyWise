import { Injectable, signal, computed } from '@angular/core';
import { Transaction, DateRange, CreateTransaction, UpdateTransaction } from './models';
import { MOCK_TRANSACTIONS } from './constants';

@Injectable({
  providedIn: 'root'
})
export class ExpenseSheetService {
  private allTransactionsSignal = signal<Transaction[]>([...MOCK_TRANSACTIONS]);
  private selectedSheetIdSignal = signal<string | null>(null);
  private selectedDateRangeSignal = signal<DateRange>('all');
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

    if (range !== 'all') {
      startDate = new Date();
      if (range === '7days' || range === '1week') {
        startDate.setDate(now.getDate() - 7);
      } else if (range === '1month') {
        startDate.setMonth(now.getMonth() - 1);
      } else if (range === '3months') {
        startDate.setMonth(now.getMonth() - 3);
      } else if (range === '6months') {
        startDate.setMonth(now.getMonth() - 6);
      }
    }

    const filtered = this.allTransactionsSignal().filter(t => {
      const tDate = new Date(t.date);
      const matchesSheet = t.sheetId === sheetId;
      const matchesDate = tDate >= startDate && tDate <= now;
      const matchesCat = category === 'all' || t.category === category;
      return matchesSheet && matchesDate && matchesCat;
    });

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
}
