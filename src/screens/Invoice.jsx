import React, {useEffect, useState} from 'react';
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
import {API_URL} from '../Constants/Helper';

const InvoiceScreen = ({route, navigation}) => {
  const {cartItems, total, totalDiscounted, dis} = route.params;
  const [discount, setDiscount] = useState(null);
  const [gst, setGst] = useState(null);
  const [delivery, setdelivery] = useState(null);

  //OrderDiscount
  useEffect(() => {
    axios
      .get(`${API_URL}/settings/order-discount`)
      .then(response => {
        const {data} = response.data;
        setDiscount(data.orderDiscount);
      })
      .catch(error => {
        console.error('Error fetching discount:', error);
      });
  }, []);

  //GST
  useEffect(() => {
    axios
      .get(`${API_URL}/settings/get-gst`)
      .then(response => {
        const {data} = response.data;
        console.log(data);
        setGst(data.gst);
      })
      .catch(error => {
        console.error('Error fetching discount:', error);
      });
  }, []);

  //DeliveryCharges
  useEffect(() => {
    axios
      .get(`${API_URL}/settings/get-delivery`)
      .then(response => {
        const {data} = response.data;
        console.log(data);
        setdelivery(data.deliveryCharges);
      })
      .catch(error => {
        console.error('Error fetching discount:', error);
      });
  }, []);

  function calculateDiscountedAmount(dis, discount) {
    return (dis * discount) / 100;
  }

  const discountedAmount = calculateDiscountedAmount(dis, discount);

  const totalAfterDiscount = dis - discountedAmount;
  const totalgst = (dis * gst) / 100;

  const totalWithGST = totalAfterDiscount + totalgst;
  console.log(totalWithGST);

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
            dis,
          }),
        );

        const response = await axios.post(
          `${API_URL}/orders/create-order`,
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
    <>
      <ScrollView style={{backgroundColor: 'white'}}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Sherin Huts</Text>
            <Text style={styles.headerSubtitle}>@sherinHuts</Text>
          </View>
          <ScrollView style={{height: 360}}>
            {cartItems.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <Image
                  source={{
                    uri: `https://shc.fayazk.com/uploads/${item.photo}`,
                  }}
                  style={styles.Image}
                />
                <View
                  style={{
                    flexDirection: 'column',
                    marginLeft: 8,
                    marginTop: 10,
                  }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text
                    style={[
                      styles.itemQuantity,
                      {textDecorationLine: 'line-through'},
                    ]}>
                    Actual Price. {item.price}
                  </Text>
                  <Text style={styles.itemQuantity}>
                    {' '}
                    Discounted Rs. {item.discountPrice}
                  </Text>
                  <Text style={styles.itemQuantity}>Items {item.quantity}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.fullWidthContainer}>
            <ImageBackground
              imageStyle={{borderRadius: 20}}
              source={require('../assets/BG.png')}
              style={styles.backgroundImage}>
              <ImageBackground
                imageStyle={{
                  position: 'absolute',
                  right: 10,
                  top: '40%',
                  left: '50%',
                  bottom: 10,
                  width: '50%',
                  height: '50%',
                }}
                source={require('../assets/BG2.png')}
                style={styles.innerBackground}>
                <View style={styles.summary}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 20,
                    }}>
                    <Text style={styles.summaryText}>Sub Total</Text>

                    <Text style={styles.summaryPrice}>Rs.{dis}</Text>
                  </View>
                  <View>
                    {discount !== null && (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: 20,
                        }}>
                        <Text style={styles.summaryText}>
                          Discount ({discount}%)
                        </Text>
                        <Text style={styles.summaryPrice}>
                          -Rs.{((dis * discount) / 100).toFixed(2)}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 20,
                    }}>
                    <Text style={styles.summaryText}>Gst ({gst}%)</Text>
                    <Text style={styles.summaryPrice}>
                      Rs.{((gst * dis) / 100).toFixed(2)}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: 20,
                    }}>
                    <Text style={styles.summaryText}>Delievery</Text>
                    <Text style={styles.summaryPrice}>Rs.{delivery} /km</Text>
                  </View>
                  <View style={styles.dottedLine} />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}>
                    <Text style={styles.totalLabel}>Total Amount</Text>
                    <Text style={styles.totalPrice}>
                      Rs.{totalWithGST.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            </ImageBackground>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleOrderNow}>
          <Text style={styles.buttonText}>Order Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    borderRadius: 50,
  },

  fullWidthContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 30,
    marginBottom: 50,
    backgroundColor: 'white',
  },
  Image: {
    width: '22%',
    height: 90,
    borderRadius: 50,
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
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: 'white',
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e2e2',
    marginBottom: 10,
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
    margin: 10,
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomLeftRadius: 50,
    borderTopLeftRadius: 50,
    borderColor: '#CECECE69',
    borderWidth: 1,
    borderRadius: 15,
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
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
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
    borderRadius: 8,
    padding: 15,
    position: 'absolute',
    bottom: 10,
    right: 10,
    left: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    alignItems: 'center',
    marginLeft: 140,
  },
});

export default InvoiceScreen;
