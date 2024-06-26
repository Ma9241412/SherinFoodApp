import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {API_URL} from '../Constants/Helper';

const OrdersScreen = ({navigation}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const statusColors = {
    pending: '#E38A00',
    processing: '#E60023',
    completed: 'blue',
    delivered: '#04A200',
  };

  const getStatusColor = status => {
    const effectiveStatus = status || 'pending';
    return statusColors[effectiveStatus.toLowerCase()] || '#808080';
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchOrders = async () => {
        setLoading(true);
        setError('');

        try {
          const userDetailsString = await AsyncStorage.getItem('userDetails');
          const userDetails = JSON.parse(userDetailsString);

          if (userDetails && userDetails.userId) {
            try {
              const response = await axios.get(
                `${API_URL}/orders/user/${userDetails.userId}`,
              );
              if (
                response.data &&
                response.data.data &&
                response.data.data.length > 0
              ) {
                setOrders(response.data.data);
              } else {
                throw new Error('No user orders found');
              }
            } catch (error) {
              console.error('Failed to fetch user orders:', error);
              throw new Error('Fetching user orders failed');
            }
          } else {
            throw new Error('No user details found');
          }
        } catch (error) {
          console.log(error.message);
          try {
            const guestOrderString = await AsyncStorage.getItem('guestOrder');
            console.log('guestorder', guestOrderString);
            const guestOrder = JSON.parse(guestOrderString);
            if (guestOrder) {
              setOrders([guestOrder]);
            } else {
              setError('No orders found');
            }
          } catch (err) {
            setError('Failed to fetch guest orders');
            console.error('Failed to fetch guest orders:', err);
          }
        }

        setLoading(false);
      };

      fetchOrders();
      return () => {};
    }, []),
  );

  const renderOrderItem = ({item}) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('orderdetail', {order: item})}>
      <View style={styles.orderDetails}>
        {item._id && (
          <Text style={styles.productName}>{'#SH' + item._id.slice(0, 7)}</Text>
        )}

        <Text style={styles.productCount}>
          {item.cartItems.map(cartItem => cartItem.product.name).join(', ')}
        </Text>
        <Text style={styles.productCount}>
          {item.cartItems.reduce(
            (total, cartItem) => total + cartItem.quantity,
            0,
          )}{' '}
          Items
        </Text>
        <View style={styles.detailsRow}>
          <Text style={styles.detailValue}>{item.total} Rs</Text>
          <View
            style={[
              styles.statusBG,
              {backgroundColor: getStatusColor(item.status)},
            ]}>
            <Text style={styles.status}>{item.status || 'Pending'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders</Text>
      <>
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
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    color: 'black',
    fontFamily: 'Outfit-Bold',
    fontSize: 25,
  },
  orderCard: {
    flexDirection: 'row',
    backgroundColor: '#F6F6F6',
    margin: 8,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderColor: '#CECECE69',
    borderWidth: 2,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 20,
    paddingHorizontal: 0,
    paddingVertical: 10,
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
    paddingHorizontal: 10,
  },
  productCount: {
    fontSize: 15,
    color: '#787F93',
    marginBottom: 6,
    fontFamily: 'Outfit-Medium',
    paddingHorizontal: 10,
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
    paddingHorizontal: 10,
  },
  status: {
    fontSize: 12,
    fontFamily: 'Outfit-Medium',
    color: 'white',
  },
  statusBG: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    bottom: 0,
    right: 1,
    top: 10,
    borderBottomRightRadius: 15,
    // borderTopLeftRadius: 15,
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white', // Ensure text color contrasts with background
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
