import { Injectable, signal } from '@angular/core';
import { ExpenseSheet } from './models';
import { MOCK_EXPENSE_SHEETS } from './constants';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private sheetsSignal = signal<ExpenseSheet[]>([...MOCK_EXPENSE_SHEETS]);

  readonly sheets = this.sheetsSignal.asReadonly();

  addSheet(name: string) {
    const newSheet: ExpenseSheet = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString()
    };
    this.sheetsSignal.update(sheets => [newSheet, ...sheets]);
  }

  updateSheet(id: string, name: string) {
    this.sheetsSignal.update(sheets => 
      sheets.map(s => s.id === id ? { ...s, name } : s)
    );
  }
}
