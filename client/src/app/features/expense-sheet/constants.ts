import { Transaction, DateRange } from './models';

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    sheetId: '1',
    date: new Date().toISOString(),
    title: 'Lunch',
    category: 'food',
    amount: 15.50,
    type: 'SENT'
  },
  {
    id: 't2',
    sheetId: '1',
    date: new Date(Date.now() - 86400000).toISOString(),
    title: 'Salary',
    category: 'miscellaneous',
    amount: 5000,
    type: 'RECEIVED'
  },
  {
    id: 't3',
    sheetId: '1',
    date: new Date(Date.now() - 86400000 * 8).toISOString(),
    title: 'Uber',
    category: 'travel',
    amount: 25.00,
    type: 'SENT'
  }
];

export const DATE_RANGES: { value: DateRange; label: string }[] = [
  { value: '7days', label: 'Last 7 Days' },
  { value: '1week', label: 'Past Week' },
  { value: '1month', label: 'Past Month' },
  { value: '3months', label: 'Last 3 Months' },
  { value: '6months', label: 'Last 6 Months' },
  { value: 'all', label: 'All Time' }
];

export const CATEGORIES: string[] = ['food', 'travel', 'fashion', 'electricity bills', 'rent', 'miscellaneous'];

export const CATEGORY_ICONS: Record<string, string> = {
  food: 'restaurant',
  travel: 'flight',
  fashion: 'checkroom',
  'electricity bills': 'bolt',
  rent: 'home',
  miscellaneous: 'more_horiz'
};
