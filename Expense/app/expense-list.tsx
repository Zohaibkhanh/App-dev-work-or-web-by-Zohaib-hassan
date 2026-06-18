import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { expenses, categories } from '@/data/mockData';

export default function ExpenseListScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'daily' | 'monthly'>('all');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Group expenses by date
  const groupedExpenses = expenses.reduce((acc, expense) => {
    if (!acc[expense.date]) {
      acc[expense.date] = [];
    }
    acc[expense.date].push(expense);
    return acc;
  }, {} as Record<string, typeof expenses>);

  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => b.localeCompare(a));

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  const renderExpenseItem = (expense: typeof expenses[0]) => {
    const categoryInfo = getCategoryInfo(expense.categoryId);
    return (
      <TouchableOpacity
        style={styles.expenseItem}
        onPress={() => router.push(`/expense-details?id=${expense.id}`)}
      >
        <View
          style={[styles.categoryIcon, { backgroundColor: `${categoryInfo.color}20` }]}
        >
          <Ionicons name={categoryInfo.icon as any} size={24} color={categoryInfo.color} />
        </View>
        <View style={styles.expenseInfo}>
          <Text style={styles.expenseCategory}>{expense.category}</Text>
          <Text style={styles.expenseNotes}>{expense.notes}</Text>
        </View>
        <View style={styles.expenseAmountContainer}>
          <Text style={styles.expenseAmount}>${expense.amount.toFixed(2)}</Text>
          <Text style={styles.expenseTime}>{expense.time}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>
    );
  };

  const renderDateSection = (date: string) => {
    const dateExpenses = groupedExpenses[date];
    const total = dateExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const dateObj = new Date(date);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let dateLabel = date;
    if (date === today) {
      dateLabel = 'Today';
    } else if (date === yesterday) {
      dateLabel = 'Yesterday';
    } else {
      dateLabel = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });
    }

    return (
      <View key={date} style={styles.dateSection}>
        <View style={styles.dateHeader}>
          <Text style={styles.dateLabel}>{dateLabel}</Text>
          <Text style={styles.dateTotal}>${total.toFixed(2)}</Text>
        </View>
        {dateExpenses.map(expense => (
          <View key={expense.id}>{renderExpenseItem(expense)}</View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expense History</Text>
        <TouchableOpacity onPress={() => router.push('/search-filter')}>
          <Ionicons name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'daily' && styles.activeFilterTab]}
          onPress={() => setFilter('daily')}
        >
          <Text style={[styles.filterText, filter === 'daily' && styles.activeFilterText]}>
            Daily
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'monthly' && styles.activeFilterTab]}
          onPress={() => setFilter('monthly')}
        >
          <Text style={[styles.filterText, filter === 'monthly' && styles.activeFilterText]}>
            Monthly
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {sortedDates.map(date => renderDateSection(date))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  activeFilterTab: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  dateSection: {
    marginBottom: 24,
    paddingTop: 20,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  dateTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  expenseNotes: {
    fontSize: 14,
    color: '#666',
  },
  expenseAmountContainer: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  expenseTime: {
    fontSize: 12,
    color: '#999',
  },
});

