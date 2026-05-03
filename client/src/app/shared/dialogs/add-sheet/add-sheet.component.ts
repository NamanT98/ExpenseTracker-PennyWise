import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { BudgetCategory, SheetBudget } from '../../../features/home/models';

export const ICON_PALETTE = [
  'restaurant', 'flight', 'checkroom', 'bolt', 'home', 'more_horiz',
  'directions_car', 'local_hospital', 'school', 'sports_esports',
  'fitness_center', 'coffee', 'shopping_cart', 'phone_iphone',
  'celebration', 'work', 'beach_access', 'hotel', 'attractions',
  'shopping_bag', 'local_gas_station', 'pets', 'movie', 'music_note',
  'child_care', 'favorite', 'savings', 'trending_up', 'payments'
];

const QUICK_START_TEMPLATES: Record<string, { frequency: string; categories: Omit<BudgetCategory, 'id'>[] }> = {
  vacation: {
    frequency: 'one-time',
    categories: [
      { icon: 'flight',       name: 'Flights',       limit: null },
      { icon: 'hotel',        name: 'Accommodation', limit: null },
      { icon: 'restaurant',   name: 'Food',          limit: null },
      { icon: 'attractions',  name: 'Activities',    limit: null },
      { icon: 'shopping_bag', name: 'Shopping',      limit: null },
    ]
  },
  monthly: {
    frequency: 'monthly',
    categories: [
      { icon: 'home',         name: 'Rent',           limit: null },
      { icon: 'restaurant',   name: 'Food & Dining',  limit: null },
      { icon: 'bolt',         name: 'Utilities',      limit: null },
      { icon: 'flight',       name: 'Travel',         limit: null },
      { icon: 'more_horiz',   name: 'Miscellaneous',  limit: null },
    ]
  },
  business: {
    frequency: 'monthly',
    categories: [
      { icon: 'flight',          name: 'Business Travel', limit: null },
      { icon: 'restaurant',      name: 'Client Meals',    limit: null },
      { icon: 'work',            name: 'Equipment',       limit: null },
      { icon: 'phone_iphone',    name: 'Subscriptions',   limit: null },
      { icon: 'local_hospital',  name: 'Health & Wellness', limit: null },
    ]
  }
};

@Component({
  selector: 'app-add-sheet',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatSelectModule, MatSlideToggleModule,
    MatTooltipModule, MatChipsModule, MatRippleModule, MatMenuModule
  ],
  templateUrl: './add-sheet.component.html',
  styleUrl: './add-sheet.component.scss'
})
export class AddSheetComponent implements OnInit {
  dialogRef = inject(MatDialogRef<AddSheetComponent>);
  data = inject(MAT_DIALOG_DATA, { optional: true });
  fb = inject(FormBuilder);

  isEditMode = false;
  iconPalette = ICON_PALETTE;

  form: FormGroup = this.fb.group({
    name:          ['', Validators.required],
    enableBudget:  [false],
    globalLimit:   [null as number | null],
    frequency:     ['monthly'],
    categories:    this.fb.array([])
  });

  get categoriesArray(): FormArray { return this.form.get('categories') as FormArray; }
  get enableBudget(): boolean { return this.form.get('enableBudget')?.value; }
  get globalLimit(): number { return this.form.get('globalLimit')?.value ?? 0; }
  get frequency(): string { return this.form.get('frequency')?.value; }

  allocatedTotal = computed(() => {
    const rows = this.categoriesArray.controls;
    return rows.reduce((sum, c) => sum + (Number(c.get('limit')?.value) || 0), 0);
  });

  // Force recompute on changes
  _tick = signal(0);

  getAllocatedTotal(): number {
    return this.categoriesArray.controls.reduce(
      (sum, c) => sum + (Number(c.get('limit')?.value) || 0), 0
    );
  }

  getAllocatedPercent(): number {
    const total = this.globalLimit;
    if (!total) return 0;
    return Math.min((this.getAllocatedTotal() / total) * 100, 100);
  }

  isOverBudget(): boolean {
    return this.globalLimit > 0 && this.getAllocatedTotal() > this.globalLimit;
  }

  isNearBudget(): boolean {
    const pct = this.getAllocatedPercent();
    return pct >= 80 && pct < 100;
  }

  ngOnInit() {
    if (this.data?.sheet) {
      this.isEditMode = true;
      const s = this.data.sheet;
      this.form.patchValue({ name: s.name });
      if (s.budget) {
        this.form.patchValue({
          enableBudget: true,
          globalLimit: s.budget.globalLimit,
          frequency: s.budget.frequency
        });
        s.budget.categories.forEach((cat: BudgetCategory) => this.addCategoryRow(cat));
      }
    }
  }

  private addCategoryRow(cat?: Partial<BudgetCategory>) {
    const row = this.fb.group({
      id:    [cat?.id ?? Date.now().toString() + Math.random()],
      icon:  [cat?.icon ?? 'payments'],
      name:  [cat?.name ?? '', Validators.required],
      limit: [cat?.limit ?? null]
    });
    row.valueChanges.subscribe(() => this._tick.set(this._tick() + 1));
    this.categoriesArray.push(row);
  }

  addCategory() { this.addCategoryRow(); }

  removeCategory(index: number) {
    this.categoriesArray.removeAt(index);
    this._tick.set(this._tick() + 1);
  }

  applyTemplate(key: string) {
    const tpl = QUICK_START_TEMPLATES[key];
    if (!tpl) return;
    this.form.patchValue({ frequency: tpl.frequency });
    this.categoriesArray.clear();
    tpl.categories.forEach(cat => this.addCategoryRow(cat));
    this._tick.set(this._tick() + 1);
  }

  selectIcon(rowIndex: number, icon: string) {
    this.categoriesArray.at(rowIndex).get('icon')?.setValue(icon);
  }

  onCancel() { this.dialogRef.close(); }

  onSave() {
    if (!this.form.get('name')?.value?.trim()) return;
    const val = this.form.value;
    let budget: SheetBudget | undefined;

    if (val.enableBudget && val.globalLimit) {
      budget = {
        globalLimit: val.globalLimit,
        frequency: val.frequency,
        categories: this.categoriesArray.value.map((c: any) => ({
          id: c.id,
          icon: c.icon,
          name: c.name,
          limit: c.limit ? Number(c.limit) : null
        }))
      };
    }
    this.dialogRef.close({ name: val.name.trim(), budget });
  }

  getFrequencyHint(): string {
    switch (this.frequency) {
      case 'monthly': return 'Resets on the 1st of every month.';
      case 'weekly':  return 'Resets every Monday.';
      case 'yearly':  return 'Resets on January 1st.';
      default:        return '';
    }
  }
}
