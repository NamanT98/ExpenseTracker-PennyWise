import { TestBed } from '@angular/core/testing';

import { ExpenseSheetService } from './expense-sheet.service';

describe('ExpenseSheetService', () => {
  let service: ExpenseSheetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseSheetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
