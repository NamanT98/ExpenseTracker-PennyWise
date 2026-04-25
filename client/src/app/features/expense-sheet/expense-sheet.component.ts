import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExpenseSheetService } from './expense-sheet.service';
import { HomeService } from '../home/home.service';
import { DATE_RANGES, CATEGORIES, CATEGORY_ICONS } from './constants';
import { DateRange, Transaction, DayGroup } from './models';
import { AddTransactionComponent } from '../../shared/dialogs/add-transaction/add-transaction.component';



@Component({
  selector: 'app-expense-sheet',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatButtonModule, MatIconModule,
    MatDialogModule, MatTooltipModule
  ],
  templateUrl: './expense-sheet.component.html',
  styleUrl: './expense-sheet.component.scss'
})
export class ExpenseSheetComponent implements OnInit {
  route = inject(ActivatedRoute);
  expenseSheetService = inject(ExpenseSheetService);
  homeService = inject(HomeService);
  dialog = inject(MatDialog);

  dateRanges = DATE_RANGES;
  categories = CATEGORIES;
  sheetId: string | null = null;
  sheetName = '';

  transactions   = this.expenseSheetService.filteredTransactions;
  selectedRange  = this.expenseSheetService.selectedDateRange;
  selectedCategory = this.expenseSheetService.selectedCategory;

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
        this.sheetName = sheet?.name ?? 'Sheet';
      }
    });
  }

  onDateRangeChange(range: DateRange) { this.expenseSheetService.setDateRange(range); }
  onCategoryChange(cat: string)       { this.expenseSheetService.setCategory(cat); }

  openAddTransactionDialog() {
    if (!this.sheetId) return;
    this.dialog.open(AddTransactionComponent, { width: '500px', data: { sheetId: this.sheetId } })
      .afterClosed().subscribe(r => { if (r) this.expenseSheetService.addTransaction(r); });
  }

  editTransaction(t: Transaction, event: Event) {
    event.stopPropagation();
    if (!this.sheetId) return;
    this.dialog.open(AddTransactionComponent, { width: '500px', data: { sheetId: this.sheetId, transaction: t } })
      .afterClosed().subscribe(r => { if (r) this.expenseSheetService.updateTransaction(t.id, r); });
  }

  getCategoryIcon(cat: string): string {
    return CATEGORY_ICONS[cat] ?? 'payments';
  }
}
