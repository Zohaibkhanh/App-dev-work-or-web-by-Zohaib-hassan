import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LineChart, PieChart } from 'react-native-chart-kit';
import {
  expenses,
  categories,
  budget,
  getTotalExpenses,
  getTodayExpenses,
  getMonthlyExpenses,
  getExpensesByCategory,
} from '@/data/mockData';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const router = useRouter();
  const todayExpenses = getTodayExpenses(expenses);
  const monthlyExpenses = getMonthlyExpenses(expenses);
  const todayTotal = getTotalExpenses(todayExpenses);
  const monthlyTotal = getTotalExpenses(monthlyExpenses);
  const remaining = budget.monthly - monthlyTotal;
  const categoryData = getExpensesByCategory(monthlyExpenses);

  // Prepare chart data
  const pieData = categories
    .filter(cat => categoryData[cat.name])
    .map(cat => ({
      name: cat.name,
      amount: categoryData[cat.name],
      color: cat.color,
      legendFontColor: '#333',
      legendFontSize: 12,
    }));

  // Line chart data for last 7 days
  const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [45, 60, 80, 65, 90, 75, 100],
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#007AFF',
    },
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, John</Text>
            <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Ionicons name="person-circle-outline" size={32} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Total Expenses Card */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Expenses (This Month)</Text>
          <Text style={styles.totalAmount}>${monthlyTotal.toFixed(2)}</Text>
          <View style={styles.totalSubInfo}>
            <Text style={styles.todayText}>Today: ${todayTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Budget Remaining Card */}
        <View style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <Text style={styles.budgetLabel}>Budget Remaining</Text>
            <Text style={styles.budgetAmount}>${remaining.toFixed(2)}</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${(monthlyTotal / budget.monthly) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.budgetInfo}>
            ${monthlyTotal.toFixed(2)} of ${budget.monthly.toFixed(2)} used
          </Text>
        </View>

        {/* Quick Add Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add-expense')}
        >
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add Expense</Text>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/budget')}
          >
            <Ionicons name="wallet-outline" size={24} color="#007AFF" />
            <Text style={styles.quickActionText}>Budget</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/expense-categories')}
          >
            <Ionicons name="grid-outline" size={24} color="#007AFF" />
            <Text style={styles.quickActionText}>Categories</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/expense-list')}
          >
            <Ionicons name="list-outline" size={24} color="#007AFF" />
            <Text style={styles.quickActionText}>History</Text>
          </TouchableOpacity>
        </View>

        {/* Expense Summary Cards */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Quick Summary</Text>
          <View style={styles.summaryCards}>
            <View style={styles.summaryCard}>
              <Ionicons name="calendar-outline" size={24} color="#FF6B6B" />
              <Text style={styles.summaryAmount}>${todayTotal.toFixed(2)}</Text>
              <Text style={styles.summaryLabel}>Today</Text>
            </View>
            <View style={styles.summaryCard}>
              <Ionicons name="calendar" size={24} color="#4ECDC4" />
              <Text style={styles.summaryAmount}>${monthlyTotal.toFixed(2)}</Text>
              <Text style={styles.summaryLabel}>This Month</Text>
            </View>
            <View style={styles.summaryCard}>
              <Ionicons name="trending-up-outline" size={24} color="#45B7D1" />
              <Text style={styles.summaryAmount}>{monthlyExpenses.length}</Text>
              <Text style={styles.summaryLabel}>Transactions</Text>
            </View>
          </View>
        </View>

        {/* Charts */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Weekly Spending</Text>
          <LineChart
            data={lineData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          {pieData.length > 0 && (
            <PieChart
              data={pieData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              style={styles.chart}
            />
          )}
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
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  totalCard: {
    backgroundColor: '#007AFF',
    margin: 20,
    marginTop: 20,
    padding: 24,
    borderRadius: 16,
  },
  totalLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  totalSubInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  todayText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  budgetCard: {
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
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetLabel: {
    fontSize: 16,
    color: '#666',
  },
  budgetAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  budgetInfo: {
    fontSize: 12,
    color: '#999',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  summarySection: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  summaryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  chartSection: {
    margin: 20,
    marginTop: 0,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
    marginTop: 0,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontWeight: '600',
  },
});
