// frontend/screens/DetailsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

// YOUR IP - IMAGES WORK HERE
const BASE_URL = 'http://192.168.100.12:5000';
const API_URL = `${BASE_URL}/api`;

export default function DetailsScreen() {
  const route = useRoute();
  const { coffee } = route.params;
  const navigation = useNavigation();
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [quantity, setQuantity] = useState(1); // FIXED: was broken line!

  const placeOrder = async () => {
    try {
      const orderData = {
        items: [{
          coffee: coffee._id,
          quantity,
          size: selectedSize,
          price: coffee.price * quantity // FIXED: was missing price!
        }],
        totalAmount: coffee.price * quantity,
        customerName: 'Customer',
        customerPhone: '1234567890',
        paymentMethod: 'cash'
      };

      await axios.post(`${API_URL}/orders`, orderData);
      Alert.alert('Success', 'Order placed successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (error) {
      console.error('Order error:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to place order');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* FIXED: coffee.image + correct URL */}
      <Image 
        source={{ uri: `${BASE_URL}/assets/${coffee.image}` }}
        style={styles.heroImage}
        resizeMode="cover"
        //defaultSource={require('../assets/latte.jpg')} // fallback if slow
      />
      
      <View style={styles.content}>
        <Text style={styles.name}>{coffee.name}</Text>
        <Text style={styles.description}>{coffee.description}</Text>
        <Text style={styles.price}>${coffee.price.toFixed(2)}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Size</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {['Small', 'Medium', 'Large'].map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeBtn,
                  selectedSize === size && styles.sizeBtnActive
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text style={[
                  styles.sizeBtnText,
                  selectedSize === size && styles.sizeBtnTextActive
                ]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text style={styles.qtyBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.orderBtn} onPress={placeOrder}>
          <Text style={styles.orderBtnText}>
            Place Order - ${(coffee.price * quantity).toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  heroImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#1e293b',
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#cbd5e1',
    lineHeight: 24,
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 12,
  },
  sizeBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#334155',
    borderRadius: 12,
    marginRight: 12,
    marginBottom: 12,
  },
  sizeBtnActive: {
    borderColor: '#059669',
    backgroundColor: '#05966920',
  },
  sizeBtnText: {
    color: '#cbd5e1',
    fontSize: 16,
    fontWeight: '500',
  },
  sizeBtnTextActive: {
    color: '#059669',
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  qtyBtnText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  quantity: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f8fafc',
    minWidth: 30,
  },
  orderBtn: {
    backgroundColor: '#059669',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  orderBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});