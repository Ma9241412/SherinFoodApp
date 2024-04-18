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

const UserDetailsScreen = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {cartItems, total} = route.params;
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleInputChange = (name, value) => {
    setUserDetails({...userDetails, [name]: value.trim()});
  };

  //Create Order
  const handleSubmit = async () => {
    const allFieldsFilled = Object.values(userDetails).every(
      field => field.length > 0,
    );

    if (!allFieldsFilled) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    const formattedCartItems = cartItems.map(item => {
      return {
        ...item,
        product: item._id,
      };
    });
    const orderDetails = {
      userDetails,
      cartItems: formattedCartItems,
      total,
    };
    try {
      const response = await axios.post(
        'http://192.168.18.13:8000/api/v1/orders/create-order',
        orderDetails,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('API Response', response.data);
      setTimeout(() => {
        setIsLoading(false);
        if (response.status === 200 || response.status === 201) {
          Alert.alert('Success', 'Your order has been placed.', [
            {text: 'OK', onPress: () => navigation.navigate('success')},
          ]);
        } else {
          Alert.alert('Error', 'Something went wrong with your order.');
        }
      }, 3000);
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
              value={userDetails.name}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              keyboardType="email-address"
              onChangeText={text => handleInputChange('email', text)}
              value={userDetails.email}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              onChangeText={text => handleInputChange('phone', text)}
              value={userDetails.phone}
            />
            <TextInput
              style={styles.input}
              placeholder="Delivery Address"
              onChangeText={text => handleInputChange('address', text)}
              value={userDetails.address}
              multiline
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>PLACE ORDER</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
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
    backgroundColor: '#FF6347',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Outfit-Regular',
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
