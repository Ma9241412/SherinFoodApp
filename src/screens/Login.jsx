import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useAuth} from '../AuthContext';

const LoginScreen = () => {
  const {setIsAuthenticated} = useAuth();
  const navigation = useNavigation();
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to {'\n'} Sherin Huts</Text>

      <View style={styles.inputContainer}>
        <Icon name="user" style={styles.icon} />
        <TextInput style={styles.input} placeholder="Email" />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={{marginLeft: 190, marginTop: 10}}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.register}>Don't have an account? Sign Up</Text>
    </View>
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
