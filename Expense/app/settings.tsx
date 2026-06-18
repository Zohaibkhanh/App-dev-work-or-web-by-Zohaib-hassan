import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  ];

  const handleBackup = () => {
    Alert.alert('Backup', 'Your data will be backed up to the cloud.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Backup',
        onPress: () => Alert.alert('Success', 'Data backed up successfully!'),
      },
    ]);
  };

  const handleRestore = () => {
    Alert.alert('Restore', 'Restore data from backup?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Restore',
        onPress: () => Alert.alert('Success', 'Data restored successfully!'),
      },
    ]);
  };

  const settingsSections = [
    {
      title: 'General',
      items: [
        {
          icon: 'cash-outline',
          label: 'Currency',
          value: currencies.find(c => c.code === selectedCurrency)?.name || 'USD',
          onPress: () => setShowCurrencyModal(true),
          showArrow: true,
        },
        {
          icon: 'color-palette-outline',
          label: 'Theme',
          value: darkMode ? 'Dark' : 'Light',
          onPress: () => setDarkMode(!darkMode),
          showArrow: true,
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: 'notifications-outline',
          label: 'Enable Notifications',
          value: notificationsEnabled,
          onPress: () => setNotificationsEnabled(!notificationsEnabled),
          showSwitch: true,
        },
      ],
    },
    {
      title: 'Data',
      items: [
        {
          icon: 'cloud-upload-outline',
          label: 'Backup Data',
          onPress: handleBackup,
          showArrow: true,
        },
        {
          icon: 'cloud-download-outline',
          label: 'Restore Data',
          onPress: handleRestore,
          showArrow: true,
        },
        {
          icon: 'trash-outline',
          label: 'Clear All Data',
          onPress: () =>
            Alert.alert(
              'Clear Data',
              'This will delete all your expenses. This action cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Clear',
                  style: 'destructive',
                  onPress: () => Alert.alert('Success', 'All data cleared!'),
                },
              ]
            ),
          showArrow: true,
          danger: true,
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: 'information-circle-outline',
          label: 'App Version',
          value: '1.0.0',
          showArrow: false,
        },
        {
          icon: 'star-outline',
          label: 'Rate App',
          onPress: () => Alert.alert('Info', 'Rate app feature coming soon!'),
          showArrow: true,
        },
        {
          icon: 'share-outline',
          label: 'Share App',
          onPress: () => Alert.alert('Info', 'Share app feature coming soon!'),
          showArrow: true,
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    itemIndex === section.items.length - 1 && styles.lastItem,
                  ]}
                  onPress={item.onPress}
                  disabled={!item.onPress}
                >
                  <View style={styles.settingItemLeft}>
                    <Ionicons
                      name={item.icon as any}
                      size={24}
                      color={item.danger ? '#FF3B30' : '#666'}
                    />
                    <View style={styles.settingItemText}>
                      <Text
                        style={[
                          styles.settingItemLabel,
                          item.danger && styles.dangerText,
                        ]}
                      >
                        {item.label}
                      </Text>
                      {item.value !== undefined && typeof item.value !== 'boolean' && (
                        <Text style={styles.settingItemValue}>{item.value}</Text>
                      )}
                    </View>
                  </View>
                  {item.showSwitch ? (
                    <Switch
                      value={item.value as boolean}
                      onValueChange={item.onPress as () => void}
                      trackColor={{ false: '#f0f0f0', true: '#007AFF' }}
                      thumbColor="#fff"
                    />
                  ) : item.showArrow ? (
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Currency Modal */}
      {showCurrencyModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Currency</Text>
              <TouchableOpacity onPress={() => setShowCurrencyModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {currencies.map(currency => (
                <TouchableOpacity
                  key={currency.code}
                  style={styles.currencyItem}
                  onPress={() => {
                    setSelectedCurrency(currency.code);
                    setShowCurrencyModal(false);
                  }}
                >
                  <Text style={styles.currencySymbol}>{currency.symbol}</Text>
                  <View style={styles.currencyInfo}>
                    <Text style={styles.currencyName}>{currency.name}</Text>
                    <Text style={styles.currencyCode}>{currency.code}</Text>
                  </View>
                  {selectedCurrency === currency.code && (
                    <Ionicons name="checkmark" size={20} color="#007AFF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
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
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    paddingHorizontal: 20,
    textTransform: 'uppercase',
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingItemText: {
    marginLeft: 16,
    flex: 1,
  },
  settingItemLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingItemValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  dangerText: {
    color: '#FF3B30',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    width: 40,
  },
  currencyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  currencyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  currencyCode: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

