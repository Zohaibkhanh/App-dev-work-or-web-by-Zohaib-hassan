// frontend/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// AUTO IP + CLEAN URLS — NO MORE HARD CODING!
const BASE_URL = 'http://192.168.100.12:5000';
const API_URL = `${BASE_URL}/api`;

export default function HomeScreen() {
  const [coffees, setCoffees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchCoffees();
  }, []);

  const fetchCoffees = async () => {
    try {
      const response = await axios.get(`${API_URL}/coffees`);
      setCoffees(response.data);
    } catch (error) {
      console.error('Fetch coffees error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderCoffee = ({ item }) => (
    <TouchableOpacity
      style={styles.coffeeCard}
      onPress={() => navigation.navigate('Details', { coffee: item })}
    >
      <Image 
        source={{ uri: `${BASE_URL}/assets/${item.image}` }}
        style={styles.image}
        resizeMode="cover"
        //defaultSource={require('../assets/cappuccino.jpg')} // fallback image
        onError={(e) => console.log('Image failed:', e.nativeEvent.error)}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Brewing your coffee...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome to CoffeeShop</Text>
        <TouchableOpacity 
          style={styles.ordersBtn}
          onPress={() => navigation.navigate('Orders')}
        >
          <Text style={styles.ordersBtnText}>My Orders</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={coffees}
        renderItem={renderCoffee}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  loadingText: {
    fontSize: 20,
    color: '#f8fafc',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1e293b',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  ordersBtn: {
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  ordersBtnText: {
    color: 'white',
    fontWeight: '600',
  },
  list: {
    padding: 20,
  },
  coffeeCard: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: '#334155',
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  description: {
    fontSize: 14,
    color: '#cbd5e1',
    marginVertical: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
});