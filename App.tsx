
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './src/screens/Login';
import TabNavigator from './src/navigation/TabNavigator';
import { AuthProvider, useAuth } from './src/AuthContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DetailsScreen from './src/screens/ProductDetails';
import InvoiceScreen from './src/screens/Invoice';
import UserDetailsScreen from './src/screens/UserDetails';
import OrderConfirmationScreen from './src/screens/OrderConfirm';
import { HomeScreen } from './src/screens/Home';
import CartScreen from './src/screens/Cart';
import RegisterScreen from './src/screens/Register';
import OrdersScreen from './src/components/UserOrders';

const Stack = createNativeStackNavigator();

function App() {
  const [initialRouteName, setInitialRouteName] = useState('Home');

  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (isAuthenticated) {
      setInitialRouteName('Home');
    } else {
      setInitialRouteName('Login');
    }
  }, [isAuthenticated]); 

  return (
    <NavigationContainer >
        <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: true }} />
          <Stack.Screen name="Details" component={DetailsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="invoice" component={InvoiceScreen} options={{ headerShown: false }} />
          <Stack.Screen name="userdetails" component={UserDetailsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="success" component={OrderConfirmationScreen} options={{ headerShown: false }} />
          <Stack.Screen name="orders" component={OrdersScreen} options={{ headerShown: true }} />


        </Stack.Navigator>

    </NavigationContainer>
  );
}

function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWrapper;
