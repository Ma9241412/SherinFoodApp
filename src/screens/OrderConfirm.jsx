import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const OrderConfirmationScreen = ({navigation}) => {
  const handlePressBack = () => {
    navigation.navigate('Home');
  };
  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={handlePressBack}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.iconContainer}>
        <Image
          source={require('../assets/success2.png')}
          style={styles.successIcon}
        />
      </View>

      <Text style={styles.successTitle}>Order Placed!</Text>
      <Text style={styles.subText}>
        Thank you for your order! You will recieve a confirmation call in a few
        minutes.{' '}
      </Text>

      <TouchableOpacity onPress={handlePressBack} style={styles.button}>
        <Text style={styles.buttonText}>Order More</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#FFF',
  },
  navBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  iconContainer: {
    marginBottom: 24,
  },
  successIcon: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  successTitle: {
    fontSize: 24,
    marginBottom: 8,
    color: '#F49E1A',
    fontFamily: 'Outfit-SemiBold',
  },
  thankYouText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subText: {
    fontSize: 20,
    color: '#6C6C6C',
    marginBottom: 32,
    textAlign: 'center',
    fontFamily: 'Outfit-Medium',
  },
  button: {
    backgroundColor: '#E4A112',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Outfit-SemiBold',
  },
});

export default OrderConfirmationScreen;
