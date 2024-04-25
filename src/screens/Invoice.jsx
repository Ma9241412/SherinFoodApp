import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  ImageBackground,
  Image,
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sherin Huts</Text>
        <Text style={styles.headerSubtitle}>@sherinHuts</Text>
      </View>

      <View style={styles.fullWidthContainer}>
        <ImageBackground
          source={require('../assets/BG.png')}
          style={styles.backgroundImage}>
          {cartItems.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>Items: {item.quantity}</Text>
            </View>
          ))}

          <View style={styles.summary}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.summaryText}>Sub Total</Text>
              <Text style={styles.summaryPrice}>Rs.{total.toFixed(2)}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.summaryText}>GST</Text>
              <Text style={styles.summaryPrice}>
                Rs.{(total * 0.07).toFixed(2)}
              </Text>
            </View>
            <View style={styles.dottedLine} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <Text style={styles.totalLabel}>To Pay</Text>
              <Text style={styles.totalPrice}>
                Rs.{(total * 1.07).toFixed(2)}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* Order Now Button */}
      <TouchableOpacity style={styles.button} onPress={handleOrderNow}>
        <Text style={styles.buttonText}>Order Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    justifyContent: 'center',
  },
  fullWidthContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  dottedLine: {
    height: 1,
    width: '100%',
    borderWidth: 1,
    borderRadius: 1,
    borderStyle: 'dotted',
    borderColor: 'white',
    marginTop: 20,
  },
  stretchImage: {
    resizeMode: 'cover',
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    color: '#000000',
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
    paddingVertical: 10,
    paddingHorizontal: 20,
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
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 15,
    color: '#505050',
    fontFamily: 'Outfit-Medium',
  },
  summaryPrice: {
    fontSize: 16,
    color: '#2B2B2B',
    fontFamily: 'Outfit-Bold',
  },
  totalLabel: {
    fontSize: 15,
    color: '#505050',
    fontFamily: 'Outfit-Medium',
  },
  totalPrice: {
    fontSize: 20,
    color: '#2B2B2B',
    fontFamily: 'Outfit-Bold',
  },
  button: {
    backgroundColor: '#E4A112',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
  },
});

export default InvoiceScreen;
