import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseSheetComponent } from './expense-sheet.component';

describe('ExpenseSheetComponent', () => {
  let component: ExpenseSheetComponent;
  let fixture: ComponentFixture<ExpenseSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseSheetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpenseSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
