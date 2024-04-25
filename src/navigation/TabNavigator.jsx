import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import CartScreen from '../screens/Cart';
import {HomeScreen} from '../screens/Home';
import OrdersScreen from '../components/UserOrders';

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
        } else if (route.name === 'orders') {
          iconName = focused ? 'user' : 'list-alt';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#E4A112',
      tabBarInactiveTintColor: '#9098B1',
      headerShown: false,
    })}>
    <Tab.Screen name="home" component={HomeScreen} />
    <Tab.Screen
      name="cart"
      component={CartScreen}
      options={{headerShown: false}}
    />
    <Tab.Screen
      name="orders"
      component={OrdersScreen}
      options={{headerShown: false}}
    />
  </Tab.Navigator>
);

export default TabNavigator;
