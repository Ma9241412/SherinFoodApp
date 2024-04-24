import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import CartScreen from '../screens/Cart';
import {HomeScreen} from '../screens/Home';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="login"
    screenOptions={({route}) => ({
      tabBarIcon: ({focused, color, size}) => {
        let iconName;

        if (route.name === 'login') {
          iconName = focused ? 'sign-in' : 'sign-in';
        } else if (route.name === 'home') {
          iconName = focused ? 'home' : 'home';
        } else if (route.name === 'invoice') {
          iconName = focused ? 'file-text' : 'file-text-o';
        } else if (route.name === 'cart') {
          iconName = focused ? 'shopping-cart' : 'shopping-cart';
        } else if (route.name === 'userdetails') {
          iconName = focused ? 'user' : 'user-o';
        }

        // You can return any component that you like here!
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}>
    <Tab.Screen name="home" component={HomeScreen} />
    <Tab.Screen
      name="cart"
      component={CartScreen}
      options={{headerShown: false}}
    />
  </Tab.Navigator>
);

export default TabNavigator;
