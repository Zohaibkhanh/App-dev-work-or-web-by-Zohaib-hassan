import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { expenses, categories } from '@/data/mockData';

export default function SearchFilterScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Filter expenses based on search and filters
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch =
      !searchQuery ||
      expense.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || expense.categoryId === selectedCategory;
    const matchesDate = !selectedDate || expense.date === selectedDate;

    return matchesSearch && matchesCategory && matchesDate;
  });

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0];
  };

  const renderExpenseItem = ({ item }: { item: typeof expenses[0] }) => {
    const categoryInfo = getCategoryInfo(item.categoryId);
    return (
      <TouchableOpacity
        style={styles.expenseItem}
        onPress={() => router.push(`/expense-details?id=${item.id}`)}
      >
        <View style={[styles.categoryIcon, { backgroundColor: `${categoryInfo.color}20` }]}>
          <Ionicons name={categoryInfo.icon as any} size={24} color={categoryInfo.color} />
        </View>
        <View style={styles.expenseInfo}>
          <Text style={styles.expenseCategory}>{item.category}</Text>
          <Text style={styles.expenseNotes}>{item.notes}</Text>
          <Text style={styles.expenseDate}>{item.date} • {item.time}</Text>
        </View>
        <Text style={styles.expenseAmount}>${item.amount.toFixed(2)}</Text>
      </TouchableOpacity>
    );
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedDate(null);
  };

  const uniqueDates = Array.from(new Set(expenses.map(exp => exp.date))).sort(
    (a, b) => b.localeCompare(a)
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search & Filter</Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search expenses..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {/* Category Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                !selectedCategory && styles.activeFilterChip,
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  !selectedCategory && styles.activeFilterChipText,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.filterChip,
                  selectedCategory === category.id && styles.activeFilterChip,
                ]}
                onPress={() =>
                  setSelectedCategory(selectedCategory === category.id ? null : category.id)
                }
              >
                <Ionicons
                  name={category.icon as any}
                  size={16}
                  color={selectedCategory === category.id ? '#fff' : category.color}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.filterChipText,
                    selectedCategory === category.id && styles.activeFilterChipText,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Date Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                !selectedDate && styles.activeFilterChip,
              ]}
              onPress={() => setSelectedDate(null)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  !selectedDate && styles.activeFilterChipText,
                ]}
              >
                All Dates
              </Text>
            </TouchableOpacity>
            {uniqueDates.slice(0, 10).map(date => (
              <TouchableOpacity
                key={date}
                style={[
                  styles.filterChip,
                  selectedDate === date && styles.activeFilterChip,
                ]}
                onPress={() => setSelectedDate(selectedDate === date ? null : date)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedDate === date && styles.activeFilterChipText,
                  ]}
                >
                  {new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Results */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredExpenses.length} result{filteredExpenses.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      <FlatList
        data={filteredExpenses}
        renderItem={renderExpenseItem}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
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
  resetText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    marginBottom: 0,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 50,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterScroll: {
    maxHeight: 120,
  },
  filterSection: {
    padding: 20,
    paddingTop: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: '#007AFF',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  activeFilterChipText: {
    color: '#fff',
  },
  resultsHeader: {
    padding: 20,
    paddingTop: 0,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
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
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 12,
    color: '#999',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

