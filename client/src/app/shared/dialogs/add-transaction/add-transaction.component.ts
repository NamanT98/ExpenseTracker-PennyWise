import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CATEGORIES } from '../../../features/expense-sheet/constants';
import { HomeService } from '../../../features/home/home.service';

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
  homeService = inject(HomeService);
  
  categories: string[] = CATEGORIES;
  isEditMode = false;
  showNewCategoryInput = false;
  newCategoryControl = new FormControl('', Validators.required);
  
  transactionForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    summary: [''],
    category: ['', Validators.required],
    amount: [null, [Validators.required, Validators.min(0.01)]],
    type: ['SENT', Validators.required]
  });

  ngOnInit() {
    const sheet = this.data?.sheet;
    const customCats = sheet?.categories || [];
    const budgetCats = this.data?.sheetBudget?.categories.map((c: any) => c.name.toLowerCase()) || [];
    
    let allCats = Array.from(new Set([...customCats, ...budgetCats]));
    if (allCats.length === 0) {
      allCats = CATEGORIES;
    }
    this.categories = allCats;

    if (this.categories.length > 0) {
      this.transactionForm.patchValue({ category: this.categories[0] });
    }

    // Subscribe to category changes to detect NEW_CATEGORY selection
    this.transactionForm.get('category')?.valueChanges.subscribe(val => {
      if (val === 'NEW_CATEGORY') {
        this.toggleNewCategory();
        this.transactionForm.patchValue({ category: this.categories[0] || 'miscellaneous' }, { emitEvent: false });
      }
    });

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

  toggleNewCategory() {
    this.showNewCategoryInput = !this.showNewCategoryInput;
    if (this.showNewCategoryInput) {
      this.newCategoryControl.reset();
    }
  }

  addNewCategory(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.newCategoryControl.valid && this.newCategoryControl.value) {
      const newCat = this.newCategoryControl.value.toLowerCase().trim();
      if (!this.categories.includes(newCat)) {
        this.categories.push(newCat);
        if (this.data?.sheetId) {
          this.homeService.addCategoryToSheet(this.data.sheetId, newCat);
        }
      }
      this.transactionForm.patchValue({ category: newCat });
      this.toggleNewCategory();
    }
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
