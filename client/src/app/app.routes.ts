import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'sheets',
    loadComponent: () => import('./features/sheets/sheets.component').then(m => m.SheetsComponent)
  },
  {
    path: 'sheets/:id',
    loadComponent: () => import('./features/expense-sheet/expense-sheet.component').then(m => m.ExpenseSheetComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
