import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { budget, getMonthlyExpenses, getTotalExpenses } from '@/data/mockData';

export default function BudgetScreen() {
  const router = useRouter();
  const [budgetAmount, setBudgetAmount] = useState({
    monthly: budget.monthly,
    weekly: budget.weekly,
    daily: budget.daily,
  });
  const [editing, setEditing] = useState<'monthly' | 'weekly' | 'daily' | null>(null);
  const [editValue, setEditValue] = useState('');

  const monthlyExpenses = getMonthlyExpenses([]);
  const monthlyTotal = getTotalExpenses(monthlyExpenses);
  const monthlyRemaining = budgetAmount.monthly - monthlyTotal;
  const monthlyPercentage = (monthlyTotal / budgetAmount.monthly) * 100;

  const handleEdit = (type: 'monthly' | 'weekly' | 'daily') => {
    setEditing(type);
    setEditValue(budgetAmount[type].toString());
  };

  const handleSave = (type: 'monthly' | 'weekly' | 'daily') => {
    const value = parseFloat(editValue);
    if (isNaN(value) || value <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    setBudgetAmount({ ...budgetAmount, [type]: value });
    setEditing(null);
    setEditValue('');
    Alert.alert('Success', `${type.charAt(0).toUpperCase() + type.slice(1)} budget updated!`);
  };

  const getBudgetStatus = () => {
    if (monthlyPercentage >= 90) return { color: '#FF3B30', message: 'Budget almost exceeded!' };
    if (monthlyPercentage >= 75) return { color: '#FF9500', message: 'Budget warning' };
    return { color: '#34C759', message: 'Budget on track' };
  };

  const status = getBudgetStatus();

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Budget Management</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Monthly Budget Card */}
        <View style={styles.budgetCard}>
          <View style={styles.budgetCardHeader}>
            <View>
              <Text style={styles.budgetCardLabel}>Monthly Budget</Text>
              {editing === 'monthly' ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.editInput}
                    value={editValue}
                    onChangeText={setEditValue}
                    keyboardType="decimal-pad"
                    placeholder="Enter amount"
                  />
                  <TouchableOpacity
                    onPress={() => handleSave('monthly')}
                    style={styles.saveIcon}
                  >
                    <Ionicons name="checkmark" size={24} color="#007AFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setEditing(null)}
                    style={styles.cancelIcon}
                  >
                    <Ionicons name="close" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.budgetAmountContainer}>
                  <Text style={styles.budgetCardAmount}>${budgetAmount.monthly.toFixed(2)}</Text>
                  <TouchableOpacity onPress={() => handleEdit('monthly')}>
                    <Ionicons name="pencil" size={20} color="#007AFF" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${Math.min(monthlyPercentage, 100)}%`,
                    backgroundColor: status.color,
                  },
                ]}
              />
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>
                ${monthlyTotal.toFixed(2)} of ${budgetAmount.monthly.toFixed(2)} used
              </Text>
              <Text style={[styles.progressPercentage, { color: status.color }]}>
                {monthlyPercentage.toFixed(1)}%
              </Text>
            </View>
          </View>

          <View style={[styles.alertBox, { backgroundColor: `${status.color}20` }]}>
            <Ionicons name="information-circle" size={20} color={status.color} />
            <Text style={[styles.alertText, { color: status.color }]}>
              {status.message} - ${Math.abs(monthlyRemaining).toFixed(2)}{' '}
              {monthlyRemaining >= 0 ? 'remaining' : 'over budget'}
            </Text>
          </View>
        </View>

        {/* Weekly Budget */}
        <View style={styles.budgetCard}>
          <View style={styles.budgetCardHeader}>
            <View>
              <Text style={styles.budgetCardLabel}>Weekly Budget</Text>
              {editing === 'weekly' ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.editInput}
                    value={editValue}
                    onChangeText={setEditValue}
                    keyboardType="decimal-pad"
                    placeholder="Enter amount"
                  />
                  <TouchableOpacity
                    onPress={() => handleSave('weekly')}
                    style={styles.saveIcon}
                  >
                    <Ionicons name="checkmark" size={24} color="#007AFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setEditing(null)}
                    style={styles.cancelIcon}
                  >
                    <Ionicons name="close" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.budgetAmountContainer}>
                  <Text style={styles.budgetCardAmount}>${budgetAmount.weekly.toFixed(2)}</Text>
                  <TouchableOpacity onPress={() => handleEdit('weekly')}>
                    <Ionicons name="pencil" size={20} color="#007AFF" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Daily Budget */}
        <View style={styles.budgetCard}>
          <View style={styles.budgetCardHeader}>
            <View>
              <Text style={styles.budgetCardLabel}>Daily Budget</Text>
              {editing === 'daily' ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.editInput}
                    value={editValue}
                    onChangeText={setEditValue}
                    keyboardType="decimal-pad"
                    placeholder="Enter amount"
                  />
                  <TouchableOpacity
                    onPress={() => handleSave('daily')}
                    style={styles.saveIcon}
                  >
                    <Ionicons name="checkmark" size={24} color="#007AFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setEditing(null)}
                    style={styles.cancelIcon}
                  >
                    <Ionicons name="close" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.budgetAmountContainer}>
                  <Text style={styles.budgetCardAmount}>${budgetAmount.daily.toFixed(2)}</Text>
                  <TouchableOpacity onPress={() => handleEdit('daily')}>
                    <Ionicons name="pencil" size={20} color="#007AFF" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  budgetCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  budgetCardHeader: {
    marginBottom: 16,
  },
  budgetCardLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  budgetAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetCardAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 12,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
    paddingBottom: 4,
    marginRight: 8,
  },
  saveIcon: {
    padding: 4,
    marginRight: 8,
  },
  cancelIcon: {
    padding: 4,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  alertText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
});

