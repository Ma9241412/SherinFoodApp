
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './src/screens/Login';
import TabNavigator from './src/navigation/TabNavigator';
import { AuthProvider, useAuth } from './src/AuthContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DetailsScreen from './src/screens/ProductDetails';
import InvoiceScreen from './src/screens/Invoice';
import UserDetailsScreen from './src/screens/UserDetails';

const Stack = createNativeStackNavigator();

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Stack.Navigator>
          <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Details" component={DetailsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="invoice" component={InvoiceScreen} options={{ headerShown: false }} />
          <Stack.Screen name="userdetails" component={UserDetailsScreen} options={{ headerShown: false }} />


          {/* You can add more screens here */}
        </Stack.Navigator>
      ) : (
        <LoginScreen />
      )}
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
