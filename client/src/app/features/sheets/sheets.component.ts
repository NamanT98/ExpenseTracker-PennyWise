import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HomeService } from '../home/home.service';
import { ExpenseSheetService } from '../expense-sheet/expense-sheet.service';
import { AddSheetComponent } from '../../shared/dialogs/add-sheet/add-sheet.component';
import { ExpenseSheet } from '../home/models';
import { SheetTotal } from './models';

@Component({
  selector: 'app-sheets',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './sheets.component.html',
  styleUrl: './sheets.component.scss'
})
export class SheetsComponent {
  homeService = inject(HomeService);
  expenseSheetService = inject(ExpenseSheetService);
  dialog = inject(MatDialog);
  
  sheets = this.homeService.sheets;
  allTransactions = this.expenseSheetService.allTransactions;

  sheetTotals = computed(() => {
    const totals = new Map<string, SheetTotal>();
    for (const sheet of this.sheets()) totals.set(sheet.id, { received: 0, sent: 0 });
    for (const t of this.allTransactions()) {
      const s = totals.get(t.sheetId);
      if (s) { t.type === 'RECEIVED' ? s.received += t.amount : s.sent += t.amount; }
    }
    return totals;
  });

  txCount = computed(() => {
    const counts = new Map<string, number>();
    for (const t of this.allTransactions()) counts.set(t.sheetId, (counts.get(t.sheetId) ?? 0) + 1);
    return counts;
  });

  totalReceived = computed(() => Array.from(this.sheetTotals().values()).reduce((s, v) => s + v.received, 0));
  totalSent     = computed(() => Array.from(this.sheetTotals().values()).reduce((s, v) => s + v.sent, 0));

  openAddSheetDialog() {
    this.dialog.open(AddSheetComponent, { width: '420px' }).afterClosed().subscribe(result => {
      if (result) this.homeService.addSheet(result);
    });
  }

  editSheet(sheet: ExpenseSheet, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.dialog.open(AddSheetComponent, { width: '420px', data: { sheet } }).afterClosed().subscribe(result => {
      if (result) this.homeService.updateSheet(sheet.id, result);
    });
  }
}
