import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
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
    MatRadioModule
  ],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.scss'
})
export class AddTransactionComponent implements OnInit {
  dialogRef = inject(MatDialogRef<AddTransactionComponent>);
  data = inject(MAT_DIALOG_DATA);
  fb = inject(FormBuilder);
  
  categories = CATEGORIES;
  isEditMode = false;
  
  transactionForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    summary: [''],
    category: ['miscellaneous', Validators.required],
    amount: [null, [Validators.required, Validators.min(0.01)]],
    type: ['SENT', Validators.required]
  });

  ngOnInit() {
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
