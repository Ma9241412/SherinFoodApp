import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {API_URL} from '../Constants/Helper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserDetailsScreen = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    cartItems,
    total,
    deliveryaddress,
    gst,
    discount,
    deliverycharges,
    status,
    setCartItems,
    setTotal,
  } = route.params;
  const [userDetails, setUserDetails] = useState({
    name: '',
    // email: '',
    phone: '',
    // address: '',
  });

  const handleInputChange = (name, value) => {
    setUserDetails(prevDetails => ({...prevDetails, [name]: value}));
  };

  const handleInputBlur = name => {
    setUserDetails(prevDetails => ({
      ...prevDetails,
      [name]: prevDetails[name].trim(),
    }));
  };

  // Create Order
  const handleSubmit = async () => {
    setIsLoading(true);

    // Format cart items with necessary details
    const formattedCartItems = cartItems.map(item => ({
      ...item,
      product: item._id,
      name: item.name.toUpperCase(),
      photo: `https://shc.fayazk.com/uploads/${item.photo}`,
      price: item.price,
    }));
    await AsyncStorage.removeItem('cartItems');
    setCartItems([]);
    setTotal(0);
    // Trim user details to avoid leading/trailing whitespace issues
    const trimmedDetails = {
      name: userDetails.name.trim(),
      phone: userDetails.phone.trim(),
    };

    // Compile the complete order details
    const orderDetails = {
      userDetails: trimmedDetails,
      cartItems: formattedCartItems,
      total,
      deliveryaddress,
      status,
      gst,
      discount,
      deliverycharges,
    };

    try {
      const response = await axios.post(
        `${API_URL}/orders/create-order`,
        orderDetails,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Order creation:', response.data);
      setIsLoading(false);

      if (response.status === 200 || response.status === 201) {
        const guestOrder = {
          id: response.data.orderId,
          userDetails: trimmedDetails,
          cartItems: formattedCartItems.map(item => ({
            ...item,
            product: {
              name: item.name,
              photo: `https://shc.fayazk.com/uploads/${item.photo}`,
              price: item.price,
            },
          })),
          total,
          status,
          gst,
          discount,
          deliveryaddress,
          deliverycharges,
        };

        await AsyncStorage.setItem('guestOrder', JSON.stringify(guestOrder));

        navigation.navigate('success');
      } else {
        Alert.alert('Error', 'Something went wrong with your order.');
      }
    } catch (error) {
      setIsLoading(false);
      console.error(
        'Order submission error:',
        error.response ? error.response.data : error.message,
      );
      Alert.alert('Error', 'There was a problem submitting your order.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF6347" />
        </View>
      ) : (
        <ScrollView>
          <Text style={styles.title}>Please add your info!</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              onChangeText={text => handleInputChange('name', text)}
              onBlur={() => handleInputBlur('name')}
              value={userDetails.name}
            />
            {/* <TextInput
              style={styles.input}
              placeholder="Email Address"
              keyboardType="email-address"
              onChangeText={text => handleInputChange('email', text)}
              onBlur={() => handleInputBlur('email')}
              value={userDetails.email}
            /> */}
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              onChangeText={text => handleInputChange('phone', text)}
              onBlur={() => handleInputBlur('phone')}
              value={userDetails.phone}
            />
            {/* <TextInput
              style={styles.input}
              placeholder="Delivery Address"
              onChangeText={text => handleInputChange('address', text)}
              onBlur={() => handleInputBlur('address')}
              value={userDetails.address}
              multiline
            /> */}
          </View>
        </ScrollView>
      )}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>PLACE ORDER</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: 2,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#E4A112',
    borderRadius: 8,
    padding: 15,
    position: 'absolute',
    bottom: 10,
    right: 20,
    left: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Outfit-Regular',
    textAlign: 'center',
  },
  title: {
    marginTop: 25,
    marginLeft: 20,
    color: 'black',
    fontFamily: 'Outfit-Bold',
    fontSize: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserDetailsScreen;
