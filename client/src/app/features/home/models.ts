export type BudgetFrequency = 'one-time' | 'weekly' | 'monthly' | 'yearly';

export interface BudgetCategory {
  id: string;
  icon: string;       // Material icon name
  name: string;
  limit: number | null; // null = tracking only, no hard limit
}

export interface SheetBudget {
  globalLimit: number;
  frequency: BudgetFrequency;
  categories: BudgetCategory[];
}

export interface ExpenseSheet {
  id: string;
  name: string;
  createdAt: string;
  budget?: SheetBudget;
  categories?: string[];
}

export interface Testimonial {
  avatar: string;
  name: string;
  title: string;
  stars: string;
  quote: string;
}
