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
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useAuth} from '../AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {setIsAuthenticated} = useAuth();

  const HTTP_STATUS_OK = 200;

  const handleLoginPress = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://192.168.18.13:8000/api/v1/auth/login',
        {email, password},
        {headers: {'Content-Type': 'application/json'}},
      );

      if (response.status === HTTP_STATUS_OK) {
        const data = response.data;
        const expiryDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('tokenExpiry', expiryDate.toISOString());
        await AsyncStorage.setItem('userDetails', JSON.stringify(data.user));

        ToastAndroid.show('Login successful!', ToastAndroid.SHORT);
        navigation.navigate('Home');
      } else {
        throw new Error(response.data.message || 'An unknown error occurred');
      }
    } catch (error) {
      ToastAndroid.show(
        error.response?.data?.message || 'Login failed',
        ToastAndroid.LONG,
      );
      if (error.response?.status === 401) {
        Alert.alert(
          'Login Failed',
          'The email or password you entered is incorrect. Please try again.',
          [{text: 'OK'}],
        );
      } else {
        Alert.alert(
          'Login Error',
          'An unexpected error occurred. Please try again later.',
          [{text: 'OK'}],
        );
      }
    } finally {
      setIsLoading(false);
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
    navigation.navigate('Register');
  };
  const handleGuest = () => {
    navigation.navigate('Home');
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.header}>Welcome Back!</Text>
        <Text style={styles.header2}>Login to your account.</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        {/* <TouchableOpacity style={{marginLeft: 190, marginTop: 10}}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity> */}

        {isLoading ? (
          <ActivityIndicator size="large" color="#FF6347" />
        ) : (
          <TouchableOpacity onPress={handleLoginPress} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={navigateToRegister}
          style={styles.registerContainer}>
          <Text style={styles.register}>
            Don't have an account?{' '}
            <Text style={styles.registerHighlight}>Signup</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  header: {
    fontSize: 25,
    color: '#F49E1A',
    fontFamily: 'Outfit-Medium',
    marginBottom: 5,
  },
  header2: {
    fontSize: 20,
    color: '#6C6C6C',
    fontFamily: 'Outfit-Regular',
    marginBottom: 20,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginVertical: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 3,
    borderRadius: 5,
    height: 50,
    borderColor: '#BFBFBF',
    borderWidth: 1,
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
  registerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  register: {
    color: '#6C6C6C',
    fontSize: 20,
    fontFamily: 'Outfit-Regular',
  },
  registerHighlight: {
    fontFamily: 'Outfit-Regular',
    color: '#E38A00',
  },
  button: {
    backgroundColor: '#F49E1A',
    borderRadius: 10,
    width: '90%',
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
