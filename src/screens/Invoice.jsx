import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const InvoiceScreen = ({route, navigation}) => {
  const {cartItems, total} = route.params;

  const handleOrderNow = async () => {
    try {
      const userDetails = await AsyncStorage.getItem('userDetails');
      if (userDetails) {
        const formattedCartItems = cartItems.map(item => ({
          ...item,
          product: item._id,
        }));

        await AsyncStorage.setItem(
          'orderDetails',
          JSON.stringify({
            userDetails: JSON.parse(userDetails),
            cartItems: formattedCartItems,
            total,
          }),
        );

        const response = await axios.post(
          'http://192.168.18.13:8000/api/v1/orders/create-order',
          {
            cartItems: formattedCartItems,
            total: total,
            userDetails: JSON.parse(userDetails),
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.status === 200 || response.status === 201) {
          console.log('Order created successfully:', response.data);
          ToastAndroid.show('Order Placed Successfully', ToastAndroid.SHORT);
          navigation.navigate('success');
        } else {
          console.error('Order creation failed:', response.data);
        }
      } else {
        navigation.navigate('userdetails', {
          cartItems: cartItems,
          total: total,
        });
      }
    } catch (error) {
      if (error.response) {
        console.error('Order creation failed:', error.response.data);
      } else if (error.request) {
        console.error(
          'Order creation failed: No response received',
          error.request,
        );
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sherin Huts</Text>
        <Text style={styles.headerSubtitle}>@sherinHuts</Text>
      </View>
      {cartItems.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
          </View>
          <Text style={styles.itemPrice}>
            Rs.{(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      ))}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Item Total</Text>
        <Text style={styles.summaryPrice}>Rs.{total.toFixed(2)}</Text>
        <Text style={styles.summaryText}>GST</Text>
        <Text style={styles.summaryPrice}>Rs.{(total * 0.07).toFixed(2)}</Text>
        <Text style={styles.totalLabel}>To Pay</Text>
        <Text style={styles.totalPrice}>Rs.{(total * 1.07).toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleOrderNow}>
        <Text style={styles.buttonText}>Order Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#f7f7f7',
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e2e2',
  },
  headerTitle: {
    fontSize: 25,
    color: '#333',
    fontFamily: 'Outfit-Bold',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'black',
    marginBottom: 8,
    fontFamily: 'Outfit-Bold',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e2e2',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontFamily: 'Outfit-Medium',
    fontSize: 18,
    color: 'black',
  },
  itemQuantity: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    color: 'black',
  },
  itemPrice: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Outfit-Medium',
  },
  summary: {
    padding: 16,
  },
  summaryText: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'Outfit-Medium',
  },
  summaryPrice: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Outfit-Medium',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'Outfit-Medium',
    marginTop: 10,
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e44c4c',
  },
  button: {
    backgroundColor: '#FF6347',
    padding: 16,
    borderRadius: 25,
    margin: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
  },
});

export default InvoiceScreen;
