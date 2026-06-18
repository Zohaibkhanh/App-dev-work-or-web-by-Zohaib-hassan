import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { expenses, categories } from '@/data/mockData';

export default function ExpenseDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const expense = expenses.find(exp => exp.id === id);
  const category = expense
    ? categories.find(cat => cat.id === expense.categoryId)
    : null;

  if (!expense || !category) {
    return (
      <View style={styles.container}>
        <Text>Expense not found</Text>
      </View>
    );
  }

  const handleEdit = () => {
    router.push(`/add-expense?edit=true&id=${expense.id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Expense deleted successfully!', [
              { text: 'OK', onPress: () => router.back() },
            ]);
          },
        },
      ]
    );
  };

  const dateObj = new Date(expense.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expense Details</Text>
        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Amount Card */}
        <View style={[styles.amountCard, { backgroundColor: category.color }]}>
          <View
            style={[styles.categoryIconLarge, { backgroundColor: 'rgba(255,255,255,0.3)' }]}
          >
            <Ionicons name={category.icon as any} size={48} color="#fff" />
          </View>
          <Text style={styles.amount}>${expense.amount.toFixed(2)}</Text>
          <Text style={styles.categoryName}>{expense.category}</Text>
        </View>

        {/* Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailItem}>
            <View style={styles.detailHeader}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.detailLabel}>Date</Text>
            </View>
            <Text style={styles.detailValue}>{formattedDate}</Text>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailHeader}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.detailLabel}>Time</Text>
            </View>
            <Text style={styles.detailValue}>{expense.time}</Text>
          </View>

          {expense.notes && (
            <View style={styles.detailItem}>
              <View style={styles.detailHeader}>
                <Ionicons name="document-text-outline" size={20} color="#666" />
                <Text style={styles.detailLabel}>Notes</Text>
              </View>
              <Text style={styles.detailValue}>{expense.notes}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Edit Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Ionicons name="pencil" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Edit Expense</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    flex: 1,
  },
  amountCard: {
    margin: 20,
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryIconLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  amount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
  },
  detailsSection: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailItem: {
    marginBottom: 24,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginLeft: 28,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});

