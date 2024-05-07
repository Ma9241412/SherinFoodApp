import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Ensure FontAwesome5 is used
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
        // Set the icon based on the route name
        switch (route.name) {
          case 'Home':
            iconName = 'home';
            break;
          case 'Orders':
            iconName = 'clipboard-list';
            break;
          case 'Cart':
            iconName = 'shopping-cart';
            break;
          default:
            iconName = 'circle';
            break;
        }
        // Return the icon component
        return (
          <Icon name={iconName} size={size} color={color} solid={focused} />
        );
      },
      tabBarActiveTintColor: '#E4A112', // Set the active icon color
      tabBarInactiveTintColor: '#9098B1', // Set the inactive icon color
      tabBarShowLabel: true, // Ensure labels are shown
      headerShown: false,
      tabBarStyle: {backgroundColor: '#FFFFFF'}, // Set the tab bar background color
    })}>
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{tabBarLabel: 'Home'}}
    />
    <Tab.Screen
      name="orders"
      component={OrdersScreen}
      options={{tabBarLabel: 'Orders'}}
    />
    <Tab.Screen
      name="Cart"
      component={CartScreen}
      options={{tabBarLabel: 'Cart'}}
    />
  </Tab.Navigator>
);

export default TabNavigator;
