import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CATEGORIES } from '../../../features/expense-sheet/constants';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatIconModule
  ],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.scss'
})
export class AddTransactionComponent implements OnInit {
  dialogRef = inject(MatDialogRef<AddTransactionComponent>);
  data = inject(MAT_DIALOG_DATA);
  fb = inject(FormBuilder);
  
  categories: string[] = CATEGORIES;
  isEditMode = false;
  
  transactionForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    summary: [''],
    category: ['', Validators.required],
    amount: [null, [Validators.required, Validators.min(0.01)]],
    type: ['SENT', Validators.required]
  });

  ngOnInit() {
    const budgetCats = this.data?.sheetBudget?.categories.map((c: any) => c.name.toLowerCase()) || [];
    
    if (budgetCats.length > 0) {
      this.categories = budgetCats;
    } else {
      this.categories = CATEGORIES;
    }

    if (this.categories.length > 0) {
      this.transactionForm.patchValue({ category: this.categories[0] });
    }

    if (this.data && this.data.transaction) {
      this.isEditMode = true;
      const t = this.data.transaction;
      this.transactionForm.patchValue({
        title: t.title,
        summary: t.summary || '',
        category: t.category,
        amount: t.amount,
        type: t.type
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.transactionForm.valid) {
      const val = this.transactionForm.value;
      this.dialogRef.close({
        sheetId: this.data.sheetId,
        title: val.title,
        summary: val.summary,
        category: val.category,
        amount: val.amount,
        type: val.type
      });
    }
  }
}
