import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';

const RegisterScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const handleRegister = async () => {
    // Simple validation checks
    if (!name.trim()) {
      alert('Please enter your name.');
      return;
    }
    if (!email.trim()) {
      alert('Please enter your email.');
      return;
    }
    if (!password) {
      alert('Please enter a password.');
      return;
    }
    if (!phone.trim()) {
      alert('Please enter your phone number.');
      return;
    }
    if (!address.trim()) {
      alert('Please enter your address.');
      return;
    }

    // More advanced email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      alert('Please enter a valid email address.');
      return;
    }

    // Password length check
    if (password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }

    // Phone number validation (very basic, adjust regex to fit your requirements)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone.trim())) {
      alert('Please enter a valid phone number with 10 digits.');
      return;
    }

    try {
      const response = await fetch(
        'http://192.168.18.13:8000/api/v1/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            phone: phone.trim(),
            address: address.trim(),
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful:', data);
        ToastAndroid.show('Registration successful', ToastAndroid.SHORT);
      } else {
        console.error('Registration failed:', data.message);
        ToastAndroid.show(
          data.message || 'Registration failed',
          ToastAndroid.LONG,
        );
      }
    } catch (error) {
      console.error('Registration error:', error);
      ToastAndroid.show('Registration error', ToastAndroid.LONG);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <Text style={styles.header}>Register Yourself</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          autoCapitalize="words"
          multiline
        />
        <TouchableOpacity onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      <TouchableOpacity onPress={navigateToLogin}>
        <Text style={styles.register}>Already Have An Account? Login Now</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 34,
    color: '#FF6347',
    marginBottom: 10,
    fontWeight: 'bold',
    fontFamily: 'Avenir Next',
  },

  input: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginVertical: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    height: 45,
  },
  button: {
    backgroundColor: '#FF6347',
    borderRadius: 10,
    width: '80%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  register: {
    position: 'absolute',
    color: '#FF6347',
    bottom: 10,
    width: '100%',
    textAlign: 'center',
  },
});

export default RegisterScreen;
