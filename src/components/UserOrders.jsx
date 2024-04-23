import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const userDetailsString = await AsyncStorage.getItem('userDetails');
        let userDetails = JSON.parse(userDetailsString);

        const userId = userDetails?.userId;
        if (!userId) {
          setError('User ID not found');
          return;
        }

        const response = await axios.get(
          `http://192.168.18.13:8000/api/v1/orders/user/${userId}`,
        );
        if (
          response.data &&
          response.data.data &&
          response.data.data.length > 0
        ) {
          setOrders(response.data.data);
        } else {
          setError('No orders placed yet');
        }
      } catch (err) {
        setError('Failed to fetch orders');
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const renderOrderItem = ({item}) => (
    <View style={styles.orderCard}>
      <Image
        source={{
          uri: `http://192.168.18.13:8000/uploads/${item.cartItems.map(
            cartItem => cartItem.product.photo,
          )}`,
        }}
        style={styles.productImage}
      />
      <View style={styles.orderDetails}>
        <Text style={styles.productName}>
          {item.cartItems.map(cartItem => cartItem.product.name).join(', ')}
        </Text>
        <Text style={[styles.productCount, styles.tag]}>
          {item.cartItems.map(cartItem => cartItem.product.quantity)} Items
        </Text>
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>OrderId</Text>
          <Text style={styles.detailValue}>{item._id}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Total</Text>
          <Text style={styles.detailValue}>{item.total}.Rs</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Status</Text>
          <Text style={[styles.status, styles.tag]}>{item.status}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={order => order._id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  orderCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    marginRight: 16,
  },
  orderDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontFamily: 'Outfit-Bold',
    fontSize: 18,
    marginBottom: 4,
    color: 'black',
  },
  productCount: {
    fontSize: 15,
    color: 'white',
    marginBottom: 8,
    fontFamily: 'Outfit-Medium',
  },
  tag: {
    backgroundColor: 'orange',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 15,
    color: 'black',
    fontFamily: 'Outfit-Medium',
  },
  detailValue: {
    fontSize: 12,
    color: 'black',
    fontFamily: 'Outfit-Medium',
  },
  status: {
    fontSize: 12,
    fontFamily: 'Outfit-Medium',
    color: 'white',
  },
  errorText: {
    marginTop: 330,
    justifyContent: 'center',
    color: '#F17547',
    fontSize: 25,
    textAlign: 'center',
    fontFamily: 'Outfit-ExtraBold',
  },
});

export default OrdersScreen;
