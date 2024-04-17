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
} from 'react-native';

const UserDetailsScreen = ({route, navigation}) => {
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

  const handleSubmit = () => {
    const allFieldsFilled = Object.values(userDetails).every(
      field => field.length > 0,
    );

    if (!allFieldsFilled) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // Replace this part with the actual order submission logic
    console.log('Order Details:', {
      cartItems,
      total,
      userDetails,
    });

    Alert.alert('Success', 'Your order has been placed.', [
      {text: 'OK', onPress: () => navigation.navigate('OrderConfirmation')}, // Navigate to confirmation screen or back to cart
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
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
});

export default UserDetailsScreen;
