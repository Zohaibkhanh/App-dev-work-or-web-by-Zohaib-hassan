import React, { useState } from 'react';
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
import { BarChart, PieChart, LineChart } from 'react-native-chart-kit';
import {
  expenses,
  categories,
  getMonthlyExpenses,
  getExpensesByCategory,
} from '@/data/mockData';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'monthly' | 'weekly'>('monthly');
  const monthlyExpenses = getMonthlyExpenses(expenses);
  const categoryData = getExpensesByCategory(monthlyExpenses);

  const totalSpending = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Bar chart data
  const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [45, 60, 80, 65, 90, 75, 100],
      },
    ],
  };

  // Pie chart data
  const pieData = categories
    .filter(cat => categoryData[cat.name])
    .map(cat => ({
      name: cat.name,
      amount: categoryData[cat.name],
      color: cat.color,
      legendFontColor: '#333',
      legendFontSize: 12,
    }));

  // Line chart data
  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [450, 520, 480, 550],
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'monthly' && styles.activeTab]}
          onPress={() => setActiveTab('monthly')}
        >
          <Text style={[styles.tabText, activeTab === 'monthly' && styles.activeTabText]}>
            Monthly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'weekly' && styles.activeTab]}
          onPress={() => setActiveTab('weekly')}
        >
          <Text style={[styles.tabText, activeTab === 'weekly' && styles.activeTabText]}>
            Weekly
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Spending</Text>
          <Text style={styles.summaryAmount}>${totalSpending.toFixed(2)}</Text>
          <View style={styles.summarySubInfo}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemLabel}>Transactions</Text>
              <Text style={styles.summaryItemValue}>{monthlyExpenses.length}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemLabel}>Average</Text>
              <Text style={styles.summaryItemValue}>
                ${(totalSpending / monthlyExpenses.length || 0).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Weekly Spending Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Weekly Spending</Text>
          <BarChart
            data={barData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            yAxisLabel="$"
            yAxisSuffix=""
            showValuesOnTopOfBars
          />
        </View>

        {/* Category Breakdown */}
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

        {/* Monthly Trend */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Monthly Trend</Text>
          <LineChart
            data={lineData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            yAxisLabel="$"
          />
        </View>

        {/* Top Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Top Categories</Text>
          {pieData
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5)
            .map((item, index) => {
              const category = categories.find(cat => cat.name === item.name);
              const percentage = ((item.amount / totalSpending) * 100).toFixed(1);
              return (
                <View key={index} style={styles.categoryRow}>
                  <View style={styles.categoryRowLeft}>
                    <View
                      style={[
                        styles.categoryRowIcon,
                        { backgroundColor: `${category?.color}20` },
                      ]}
                    >
                      <Ionicons
                        name={category?.icon as any}
                        size={20}
                        color={category?.color}
                      />
                    </View>
                    <View>
                      <Text style={styles.categoryRowName}>{item.name}</Text>
                      <Text style={styles.categoryRowPercentage}>{percentage}%</Text>
                    </View>
                  </View>
                  <Text style={styles.categoryRowAmount}>${item.amount.toFixed(2)}</Text>
                </View>
              );
            })}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: '#007AFF',
    margin: 20,
    marginTop: 20,
    padding: 24,
    borderRadius: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  summarySubInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryItemLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 4,
  },
  summaryItemValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  chartSection: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  categoriesSection: {
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
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryRowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryRowName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  categoryRowPercentage: {
    fontSize: 12,
    color: '#666',
  },
  categoryRowAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

