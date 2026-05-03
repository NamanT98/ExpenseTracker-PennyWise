import { Transaction, DateRange } from './models';

const d = (daysAgo: number, hour = 12) => new Date(Date.now() - daysAgo * 86400000).toISOString();

export const MOCK_TRANSACTIONS: Transaction[] = [
  // Today
  { id: 't1', sheetId: '1', date: d(0, 9),  title: 'Lunch at Cafe',    category: 'food',              amount: 18.50,  type: 'SENT' },
  { id: 't2', sheetId: '1', date: d(0, 19), title: 'Uber Eats',        category: 'food',              amount: 22.00,  type: 'SENT' },
  // Yesterday
  { id: 't3', sheetId: '1', date: d(1, 8),  title: 'Salary',           category: 'miscellaneous',     amount: 5000,   type: 'RECEIVED' },
  { id: 't4', sheetId: '1', date: d(1, 18), title: 'Netflix',          category: 'miscellaneous',     amount: 15.99,  type: 'SENT' },
  // 2 days ago
  { id: 't5', sheetId: '1', date: d(2, 10), title: 'Metro Card',       category: 'travel',            amount: 40.00,  type: 'SENT' },
  { id: 't6', sheetId: '1', date: d(2, 13), title: 'Groceries',        category: 'food',              amount: 75.30,  type: 'SENT' },
  // 4 days ago
  { id: 't7', sheetId: '1', date: d(4, 9),  title: 'Electricity Bill', category: 'electricity bills', amount: 110.00, type: 'SENT' },
  { id: 't8', sheetId: '1', date: d(4, 11), title: 'Jacket',           category: 'fashion',           amount: 89.99,  type: 'SENT' },
  // 7 days ago
  { id: 't9', sheetId: '1', date: d(7, 10), title: 'Rent',             category: 'rent',              amount: 1100,   type: 'SENT' },
  { id: 't10',sheetId: '1', date: d(7, 14), title: 'Freelance Income', category: 'miscellaneous',     amount: 800,    type: 'RECEIVED' },
  // 10 days ago
  { id: 't11',sheetId: '1', date: d(10, 9), title: 'Gym Membership',   category: 'miscellaneous',     amount: 45.00,  type: 'SENT' },
  { id: 't12',sheetId: '1', date: d(10, 12),'title': 'Flight Tickets', category: 'travel',            amount: 230.00, type: 'SENT' },
  // 14 days ago
  { id: 't13',sheetId: '1', date: d(14, 10),'title': 'Dinner Out',     category: 'food',              amount: 55.00,  type: 'SENT' },
  { id: 't14',sheetId: '1', date: d(14, 16),'title': 'Sneakers',       category: 'fashion',           amount: 120.00, type: 'SENT' },
  // 20 days ago
  { id: 't15',sheetId: '1', date: d(20, 11),'title': 'Consulting Fee', category: 'miscellaneous',     amount: 600,    type: 'RECEIVED' },
  { id: 't16',sheetId: '1', date: d(20, 15),'title': 'Uber',           category: 'travel',            amount: 25.00,  type: 'SENT' },

  // Sheet 2 (Office Work)
  { id: 't17', sheetId: '2', date: d(1, 10),  title: 'Client Lunch',     category: 'food',              amount: 45.00,  type: 'SENT' },
  { id: 't18', sheetId: '2', date: d(2, 14),  title: 'Office Supplies',  category: 'miscellaneous',     amount: 120.00, type: 'SENT' },
  { id: 't19', sheetId: '2', date: d(5, 9),   title: 'Flight to NY',     category: 'travel',            amount: 350.00, type: 'SENT' },
  { id: 't20', sheetId: '2', date: d(10, 11), title: 'Reimbursement',    category: 'miscellaneous',     amount: 515.00, type: 'RECEIVED' },

  // Sheet 3 (Trip to Hawaii)
  { id: 't21', sheetId: '3', date: d(5, 12),  title: 'Flights',          category: 'flights',           amount: 1200.00,type: 'SENT' },
  { id: 't22', sheetId: '3', date: d(4, 15),  title: 'Hotel Deposit',    category: 'accommodation',     amount: 500.00, type: 'SENT' },
  { id: 't23', sheetId: '3', date: d(2, 19),  title: 'Luau Tickets',     category: 'activities',        amount: 150.00, type: 'SENT' },
  { id: 't24', sheetId: '3', date: d(1, 13),  title: 'Surfboard Rental', category: 'activities',        amount: 40.00,  type: 'SENT' },
  { id: 't25', sheetId: '3', date: d(0, 20),  title: 'Seafood Dinner',   category: 'food',              amount: 85.00,  type: 'SENT' },
];


export const MONTHLY_DATE_RANGES: { value: DateRange; label: string }[] = [
  { value: 'this_month', label: 'This Month' },
  { value: '1month', label: 'Past Month' },
  { value: '3months', label: 'Last 3 Months' },
  { value: '6months', label: 'Last 6 Months' },
  { value: 'all', label: 'All Time' }
];

export const WEEKLY_DATE_RANGES: { value: DateRange; label: string }[] = [
  { value: 'this_week', label: 'This Week' },
  { value: 'last_week', label: 'Last Week' },
  { value: '4weeks', label: 'Last 4 Weeks' },
  { value: '12weeks', label: 'Last 12 Weeks' },
  { value: 'all', label: 'All Time' }
];

export const YEARLY_DATE_RANGES: { value: DateRange; label: string }[] = [
  { value: 'this_year', label: 'This Year' },
  { value: 'last_year', label: 'Last Year' },
  { value: '3years', label: 'Last 3 Years' },
  { value: 'all', label: 'All Time' }
];

export function getDateRangesForFrequency(freq?: string): { value: DateRange; label: string }[] {
  if (freq === 'weekly') return WEEKLY_DATE_RANGES;
  if (freq === 'yearly') return YEARLY_DATE_RANGES;
  return MONTHLY_DATE_RANGES; // Default for monthly, one-time, and undefined
}

export const CATEGORIES: string[] = ['food', 'travel', 'fashion', 'electricity bills', 'rent', 'miscellaneous'];

export const CATEGORY_ICONS: Record<string, string> = {
  food: 'restaurant',
  travel: 'flight',
  fashion: 'checkroom',
  'electricity bills': 'bolt',
  rent: 'home',
  miscellaneous: 'more_horiz'
};
