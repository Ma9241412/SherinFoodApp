import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MainHeader = ({onMenuPress, onCartPress}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onMenuPress}>
        <Icon name="menu" size={30} color="#F17547" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onCartPress}>
        <Icon name="shopping-cart" size={30} color="#F17547" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default MainHeader;
