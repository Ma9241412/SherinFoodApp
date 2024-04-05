import React, { useState } from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  StyleSheet,
 useColorScheme,
} from 'react-native';
import { QueryClient, QueryClientProvider,  } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './src/screens/Login';
import { HomeScreen } from './src/screens/Home';
import ProductCard from './src/screens/Cart';



function App(): React.JSX.Element {
  const [initialRoute, setInitialRoute] = useState('login');
  const Stack = createNativeStackNavigator();
  const queryClient = new QueryClient();

  const isDarkMode = useColorScheme() === 'dark';



  return (
    <QueryClientProvider client={queryClient}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          options={{headerShown: false}}
          name="login"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="home"
          component={HomeScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="cart"
          component={ProductCard}
        />

        
      
      </Stack.Navigator>
    </NavigationContainer>
  </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    backgroundColor:"white"
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
