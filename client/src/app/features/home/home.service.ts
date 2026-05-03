import { Injectable, signal } from '@angular/core';
import { ExpenseSheet, SheetBudget } from './models';
import { MOCK_EXPENSE_SHEETS } from './constants';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private sheetsSignal = signal<ExpenseSheet[]>([...MOCK_EXPENSE_SHEETS]);

  readonly sheets = this.sheetsSignal.asReadonly();

  addSheet(name: string, budget?: SheetBudget) {
    const newSheet: ExpenseSheet = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
      budget
    };
    this.sheetsSignal.update(sheets => [newSheet, ...sheets]);
  }

  updateSheet(id: string, name: string, budget?: SheetBudget) {
    this.sheetsSignal.update(sheets =>
      sheets.map(s => s.id === id ? { ...s, name, budget } : s)
    );
  }

  addCategoryToSheet(id: string, category: string) {
    this.sheetsSignal.update(sheets =>
      sheets.map(s => {
        if (s.id === id) {
          const currentCats = s.categories || [];
          if (!currentCats.includes(category)) {
            return { ...s, categories: [...currentCats, category] };
          }
        }
        return s;
      })
    );
  }
}
