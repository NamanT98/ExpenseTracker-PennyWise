import { ExpenseSheet } from './models';

export const APP_NAME = 'PennyWise';

export const MOCK_EXPENSE_SHEETS: ExpenseSheet[] = [
  {
    id: '1',
    name: 'Personal Expenses',
    createdAt: new Date().toISOString(),
    budget: {
      globalLimit: 3000,
      frequency: 'monthly',
      categories: [
        { id: 'c1', icon: 'restaurant', name: 'Food & Dining', limit: 600 },
        { id: 'c2', icon: 'flight', name: 'Travel', limit: 400 },
        { id: 'c3', icon: 'checkroom', name: 'Fashion', limit: 300 },
        { id: 'c4', icon: 'bolt', name: 'Electricity Bills', limit: 200 },
        { id: 'c5', icon: 'home', name: 'Rent', limit: 1200 },
        { id: 'c6', icon: 'more_horiz', name: 'Miscellaneous', limit: 300 },
      ]
    }
  },
  { id: '2', name: 'Office Work', createdAt: new Date(Date.now() - 86400000).toISOString() },
  {
    id: '3',
    name: 'Trip to Hawaii',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    budget: {
      globalLimit: 5000,
      frequency: 'one-time',
      categories: [
        { id: 'h1', icon: 'flight', name: 'Flights', limit: 1500 },
        { id: 'h2', icon: 'hotel', name: 'Accommodation', limit: 1800 },
        { id: 'h3', icon: 'restaurant', name: 'Food', limit: 700 },
        { id: 'h4', icon: 'attractions', name: 'Activities', limit: 600 },
        { id: 'h5', icon: 'shopping_bag', name: 'Shopping', limit: null },
      ]
    }
  },
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
