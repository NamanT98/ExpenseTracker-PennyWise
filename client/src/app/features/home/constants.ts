import { ExpenseSheet } from './models';

export const APP_NAME = 'PennyWise';

export const MOCK_EXPENSE_SHEETS: ExpenseSheet[] = [
  { id: '1', name: 'Personal Expenses', createdAt: new Date().toISOString() },
  { id: '2', name: 'Office Work', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', name: 'Trip to Hawaii', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
];

export const TESTIMONIALS = [
  {
    avatar: 'S',
    name: 'Sarah Jenkins',
    title: 'Freelance Designer',
    stars: '★★★★★',
    quote: '"This is hands down the cleanest expense tracker I\'ve used. The dark mode and date-grouped transactions are exactly what I needed."'
  },
  {
    avatar: 'M',
    name: 'Michael Torres',
    title: 'Small Business Owner',
    stars: '★★★★★',
    quote: '"I use it for tracking both my personal and work expenses. Multiple sheets is a game changer — everything stays separate and clean."'
  },
  {
    avatar: 'P',
    name: 'Priya Nair',
    title: 'Product Manager',
    stars: '★★★★★',
    quote: '"Finally an app that doesn\'t feel like a spreadsheet. The category icons and live balance make it intuitive from day one."'
  },
  {
    avatar: 'R',
    name: 'Rahul Mehta',
    title: 'Software Engineer',
    stars: '★★★★★',
    quote: '"The pill filters make it so easy to see exactly what I spent on food or travel. Super smooth and responsive every step of the way."'
  },
  {
    avatar: 'A',
    name: 'Anya Kowalski',
    title: 'UX Researcher',
    stars: '★★★★★',
    quote: '"I love how the balance updates live as I add transactions. It actually makes me more mindful about where my money goes each month."'
  }
];
