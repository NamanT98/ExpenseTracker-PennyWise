import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-sheet',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './add-sheet.component.html',
  styleUrl: './add-sheet.component.scss'
})
export class AddSheetComponent implements OnInit {
  dialogRef = inject(MatDialogRef<AddSheetComponent>);
  data = inject(MAT_DIALOG_DATA, { optional: true });
  
  sheetName: string = '';
  isEditMode: boolean = false;

  ngOnInit() {
    if (this.data && this.data.sheet) {
      this.isEditMode = true;
      this.sheetName = this.data.sheet.name;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.sheetName.trim()) {
      this.dialogRef.close(this.sheetName.trim());
    }
  }
}
