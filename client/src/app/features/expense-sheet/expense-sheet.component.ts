import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { ExpenseSheetService } from './expense-sheet.service';
import { HomeService } from '../home/home.service';
import { getDateRangesForFrequency, CATEGORIES, CATEGORY_ICONS } from './constants';
import { DateRange, Transaction, DayGroup } from './models';
import { SheetBudget } from '../home/models';
import { AddTransactionComponent } from '../../shared/dialogs/add-transaction/add-transaction.component';
import { AnalysisComponent } from './analysis/analysis.component';



@Component({
  selector: 'app-expense-sheet',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatButtonModule, MatIconModule,
    MatDialogModule, MatTooltipModule, MatTabsModule, MatMenuModule, AnalysisComponent
  ],
  templateUrl: './expense-sheet.component.html',
  styleUrl: './expense-sheet.component.scss'
})
export class ExpenseSheetComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  expenseSheetService = inject(ExpenseSheetService);
  homeService = inject(HomeService);
  dialog = inject(MatDialog);

  sheetId: string | null = null;
  sheetName = '';
  sheetBudget = signal<SheetBudget | undefined>(undefined);
  sheetCreatedAt = signal<string | undefined>(undefined);

  dateRanges = computed(() => {
    return getDateRangesForFrequency(this.sheetBudget()?.frequency);
  });

  transactions   = this.expenseSheetService.filteredTransactions;
  allTransactions = this.expenseSheetService.sheetTransactions; // unfiltered, for analysis
  selectedRange  = this.expenseSheetService.selectedDateRange;
  selectedCategory = this.expenseSheetService.selectedCategory;

  categories = computed(() => {
    const budgetCats = this.sheetBudget()?.categories.map(c => c.name.toLowerCase()) || [];
    if (budgetCats.length > 0) return budgetCats;
    return CATEGORIES;
  });

  // Grouped by date — Money Lover pattern
  groupedTransactions = computed<DayGroup[]>(() => {
    const map = new Map<string, Transaction[]>();
    for (const t of this.transactions()) {
      const d = new Date(t.date);
      const key = d.toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }
    return Array.from(map.entries()).map(([key, txs]) => {
      const d = new Date(key);
      return {
        dateLabel: key,
        dayOfMonth: d.getDate().toString().padStart(2, '0'),
        dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'short' }),
        transactions: txs
      };
    });
  });

  // Summary stats
  totalReceived = computed(() => this.transactions().filter(t => t.type === 'RECEIVED').reduce((s, t) => s + t.amount, 0));
  totalSent     = computed(() => this.transactions().filter(t => t.type === 'SENT').reduce((s, t) => s + t.amount, 0));
  netBalance    = computed(() => this.totalReceived() - this.totalSent());

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.sheetId = params.get('id');
      if (this.sheetId) {
        this.expenseSheetService.setSheetId(this.sheetId);
        const sheet = this.homeService.sheets().find(s => s.id === this.sheetId);
        if (!sheet) {
          this.router.navigate(['/']);
          return;
        }
        this.sheetName   = sheet.name;
        this.sheetBudget.set(sheet.budget);
        this.sheetCreatedAt.set(sheet.createdAt);
      }
    });
  }

  onDateRangeChange(range: DateRange) { this.expenseSheetService.setDateRange(range); }
  onCategoryChange(cat: string)       { this.expenseSheetService.setCategory(cat); }

  getSelectedRangeLabel(): string {
    const range = this.selectedRange();
    const found = this.dateRanges().find(r => r.value === range);
    return found ? found.label : 'Select Period';
  }

  openAddTransactionDialog() {
    if (!this.sheetId) return;
    const sheet = this.homeService.sheets().find(s => s.id === this.sheetId);
    this.dialog.open(AddTransactionComponent, { width: '500px', data: { sheetId: this.sheetId, sheetBudget: this.sheetBudget(), sheet } })
      .afterClosed().subscribe(r => { if (r) this.expenseSheetService.addTransaction(r); });
  }

  editTransaction(t: Transaction, event: Event) {
    event.stopPropagation();
    if (!this.sheetId) return;
    this.dialog.open(AddTransactionComponent, { width: '500px', data: { sheetId: this.sheetId, transaction: t, sheetBudget: this.sheetBudget() } })
      .afterClosed().subscribe(r => { if (r) this.expenseSheetService.updateTransaction(t.id, r); });
  }

  deleteTransaction(t: Transaction, event: Event) {
    event.stopPropagation();
    this.expenseSheetService.deleteTransaction(t.id);
  }

  getCategoryIcon(cat: string): string {
    return CATEGORY_ICONS[cat] ?? 'payments';
  }
}
