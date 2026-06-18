export interface Expense {
  id: string;
  amount: number;
  category: string;
  categoryId: string;
  date: string;
  time: string;
  notes: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'budget' | 'reminder' | 'alert';
  date: string;
  read: boolean;
}

export interface Budget {
  monthly: number;
  weekly: number;
  daily: number;
}

// Static Categories
export const categories: Category[] = [
  { id: '1', name: 'Food', icon: 'restaurant', color: '#FF6B6B' },
  { id: '2', name: 'Transport', icon: 'car', color: '#4ECDC4' },
  { id: '3', name: 'Shopping', icon: 'shopping-bag', color: '#45B7D1' },
  { id: '4', name: 'Bills', icon: 'receipt', color: '#FFA07A' },
  { id: '5', name: 'Entertainment', icon: 'film', color: '#98D8C8' },
  { id: '6', name: 'Health', icon: 'medical', color: '#F7DC6F' },
  { id: '7', name: 'Education', icon: 'book', color: '#BB8FCE' },
  { id: '8', name: 'Travel', icon: 'airplane', color: '#85C1E2' },
];

// Static Expenses
export const expenses: Expense[] = [
  {
    id: '1',
    amount: 45.50,
    category: 'Food',
    categoryId: '1',
    date: '2025-01-15',
    time: '12:30',
    notes: 'Lunch at restaurant',
  },
  {
    id: '2',
    amount: 25.00,
    category: 'Transport',
    categoryId: '2',
    date: '2025-01-15',
    time: '08:15',
    notes: 'Uber ride',
  },
  {
    id: '3',
    amount: 120.00,
    category: 'Shopping',
    categoryId: '3',
    date: '2025-01-14',
    time: '15:45',
    notes: 'Grocery shopping',
  },
  {
    id: '4',
    amount: 80.00,
    category: 'Bills',
    categoryId: '4',
    date: '2025-01-14',
    time: '10:00',
    notes: 'Electricity bill',
  },
  {
    id: '5',
    amount: 35.00,
    category: 'Entertainment',
    categoryId: '5',
    date: '2025-01-13',
    time: '20:00',
    notes: 'Movie tickets',
  },
  {
    id: '6',
    amount: 60.00,
    category: 'Health',
    categoryId: '6',
    date: '2025-01-13',
    time: '14:20',
    notes: 'Pharmacy',
  },
  {
    id: '7',
    amount: 15.00,
    category: 'Food',
    categoryId: '1',
    date: '2025-01-12',
    time: '19:30',
    notes: 'Dinner',
  },
  {
    id: '8',
    amount: 200.00,
    category: 'Education',
    categoryId: '7',
    date: '2025-01-12',
    time: '11:00',
    notes: 'Online course',
  },
];

// Static User
export const currentUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
};

// Static Budget
export const budget: Budget = {
  monthly: 2000,
  weekly: 500,
  daily: 70,
};

// Static Notifications
export const notifications: Notification[] = [
  {
    id: '1',
    title: 'Budget Alert',
    message: 'You have used 80% of your monthly budget',
    type: 'budget',
    date: '2025-01-15',
    read: false,
  },
  {
    id: '2',
    title: 'Daily Reminder',
    message: "Don't forget to log your expenses today!",
    type: 'reminder',
    date: '2025-01-15',
    read: false,
  },
  {
    id: '3',
    title: 'Budget Alert',
    message: 'Weekly budget limit reached',
    type: 'alert',
    date: '2025-01-14',
    read: true,
  },
];

// Helper functions
export const getTotalExpenses = (expenseList: Expense[]): number => {
  return expenseList.reduce((sum, expense) => sum + expense.amount, 0);
};

export const getTodayExpenses = (expenseList: Expense[]): Expense[] => {
  const today = new Date().toISOString().split('T')[0];
  return expenseList.filter(expense => expense.date === today);
};

export const getMonthlyExpenses = (expenseList: Expense[]): Expense[] => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  return expenseList.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });
};

export const getExpensesByCategory = (expenseList: Expense[]): Record<string, number> => {
  return expenseList.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
};

