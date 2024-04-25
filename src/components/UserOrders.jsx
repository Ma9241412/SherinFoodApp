import React, {useCallback, useEffect, useState} from 'react';
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
    <>
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
            <Text style={styles.detailValue}>{item.total}.Rs</Text>
            <View style={styles.statusBG}>
              <Text style={styles.status}>{item.status}</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#E4A112" />
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
    backgroundColor: 'white',
  },
  orderCard: {
    flexDirection: 'row',
    backgroundColor: '#F6F6F6',
    margin: 8,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    borderColor: '#CECECE69',
    borderWidth: 2,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 20,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    marginRight: 16,
  },
  orderDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontFamily: 'Outfit-Bold',
    fontSize: 15,
    marginBottom: 4,
    color: '#2B2B2B',
  },
  productCount: {
    fontSize: 15,
    color: '#787F93',
    marginBottom: 8,
    fontFamily: 'Outfit-Medium',
  },
  tag: {
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  statusBG: {
    backgroundColor: 'orange',
    paddingHorizontal: 20,
    paddingVertical: 5,
    bottom: 0,
    right: 0,
    top: 10,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
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
