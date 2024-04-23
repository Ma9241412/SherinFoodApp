import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useAuth} from '../AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {setIsAuthenticated} = useAuth();

  const handleLoginPress = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://192.168.18.13:8000/api/v1/auth/login',
        {email, password},
        {headers: {'Content-Type': 'application/json'}},
      );
      const data = await response.data;
      setIsLoading(false);
      if (response.status === 200) {
        const expiryDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('tokenExpiry', expiryDate.toString());
        // Store the complete user details from the login response
        await AsyncStorage.setItem('userDetails', JSON.stringify(data.user));

        console.log('Login successful, user details stored:', data.user);
        navigation.navigate('Home');
      } else {
        ToastAndroid.show(
          data.message || 'An error occurred',
          ToastAndroid.LONG,
        );
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Login failed:', error);
      ToastAndroid.show('Login failed', ToastAndroid.LONG);
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      const tokenExpiry = await AsyncStorage.getItem('tokenExpiry');

      if (token && new Date(tokenExpiry) > new Date()) {
        navigation.navigate('Home');
      }
    };

    checkToken();
  }, []);

  const navigateToRegister = () => {
    navigation.navigate('Register'); // Make sure 'Register' matches the name of your registration screen in the navigator config
  };
  const handleGuest = () => {
    navigation.navigate('Home');
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.header}>Welcome to {'\n'} Sherin Huts</Text>

        <View style={styles.inputContainer}>
          <Icon name="user" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={{marginLeft: 190, marginTop: 10}}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {isLoading ? (
          <ActivityIndicator size="large" color="#FF6347" />
        ) : (
          <TouchableOpacity onPress={handleLoginPress} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={navigateToRegister}>
        <Text style={styles.register}>Don't have an account? Sign Up</Text>
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
    marginBottom: 30,
    fontWeight: 'bold',
    fontFamily: 'Avenir Next',
  },

  inputContainer: {
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
  icon: {
    marginRight: 10,
    fontSize: 20,
    color: '#FF6347',
  },
  input: {
    flex: 1,
    padding: 10,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  forgotPassword: {
    color: '#FF6347',
    width: '80%',
    textAlign: 'right',
    marginBottom: 10,
  },
  register: {
    position: 'absolute',
    color: '#FF6347',
    bottom: 10,
    width: '100%',
    textAlign: 'center',
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
});

export default LoginScreen;
