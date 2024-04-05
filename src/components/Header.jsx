import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MenuBar from './SideBar';

export const HeaderComp = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
        <Icon name="bars" size={24} color="#F17547" />
      </TouchableOpacity>

      <MenuBar isVisible={sidebarVisible} />
      <Text style={styles.headerTitle}>Sherin Huts</Text>

      <TouchableOpacity onPress={() => alert('Cart Icon Clicked!')}>
        <Icon name="shopping-cart" size={24} color="#F17547" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  headerTitle: {
    color: 'black',
    fontSize: 15,
  },
});
