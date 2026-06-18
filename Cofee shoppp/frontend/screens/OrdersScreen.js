// frontend/screens/OrdersScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import axios from 'axios';

const BASE_URL = 'http://192.168.100.12:5000';
const API_URL = `${BASE_URL}/api`;

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // CANCEL ORDER FUNCTION — DELETES FROM DB + UI
  const cancelOrder = async (orderId) => {
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/orders/${orderId}`);
              setOrders(orders.filter(order => order._id !== orderId));
              Alert.alert("Cancelled!", "Order has been removed", [{ text: "OK" }]);
            } catch (error) {
              Alert.alert("Error", "Cannot cancel order. Try again.");
            }
          }
        }
      ]
    );
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item._id.slice(-6)}</Text>
        <View style={[styles.status,
          item.status === 'pending' && { backgroundColor: '#fef08a' },
          item.status === 'preparing' && { backgroundColor: '#dbeafe' },
          item.status === 'ready' && { backgroundColor: '#bbf7d0' },
          item.status === 'delivered' && { backgroundColor: '#86efac' }
        ]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      {item.items.map((orderItem, index) => (
        <View key={index} style={styles.itemRow}>
          <Image
            source={{ uri: `${BASE_URL}/assets/${orderItem.coffee.image}` }}
            style={styles.itemImage}
            resizeMode="cover"
          />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{orderItem.coffee.name}</Text>
            <Text style={styles.itemDetails}>
              {orderItem.quantity}x {orderItem.size} - ${orderItem.price.toFixed(2)}
            </Text>
          </View>
        </View>
      ))}

      <View style={styles.orderFooter}>
        <Text style={styles.total}>Total: ${item.totalAmount.toFixed(2)}</Text>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>

      {/* CANCEL BUTTON — ONLY FOR PENDING ORDERS */}
      {item.status === 'pending' && (
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => cancelOrder(item._id)}
        >
          <Text style={styles.cancelBtnText}>Cancel Order</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading your orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders</Text>
      {orders.length === 0 ? (
        <Text style={styles.noOrders}>No orders yet. Go order some coffee!</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#f8fafc', marginBottom: 20, textAlign: 'center' },
  list: { paddingBottom: 20 },
  noOrders: { color: '#94a3b8', fontSize: 18, textAlign: 'center', marginTop: 50 },
  orderCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  orderId: { fontSize: 16, fontWeight: '600', color: '#f8fafc' },
  status: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { color: '#1e293b', fontSize: 12, fontWeight: '600' },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  itemImage: { width: 50, height: 50, borderRadius: 10, marginRight: 12, backgroundColor: '#334155' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '600', color: '#f8fafc', marginBottom: 4 },
  itemDetails: { fontSize: 14, color: '#cbd5e1' },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#334155' },
  total: { fontSize: 18, fontWeight: '700', color: '#059669' },
  date: { fontSize: 14, color: '#94a3b8' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 18, color: '#f8fafc' },
  cancelBtn: {
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    elevation: 4,
  },
  cancelBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});