import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Make sure to use FontAwesome5 to access the latest icons
import OrdersScreen from '../components/UserOrders';
import CartScreen from '../screens/Cart';
import {HomeScreen} from '../screens/Home';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={({route}) => ({
      tabBarIcon: ({focused, color, size}) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'orders') {
          iconName = 'history';
        } else if (route.name === 'Cart') {
          iconName = 'shopping-cart';
        }

        return (
          <Icon name={iconName} size={size} color={color} solid={focused} />
        );
      },
      tabBarActiveTintColor: '#E4A112',
      tabBarInactiveTintColor: '#9098B1',
      tabBarShowLabel: false,
      headerShown: false,
      tabBarStyle: {backgroundColor: '#FFFFFF'},
    })}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="orders" component={OrdersScreen} />
    <Tab.Screen name="Cart" component={CartScreen} />
  </Tab.Navigator>
);

export default TabNavigator;
