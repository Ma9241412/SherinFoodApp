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
          source={require('../assets/order.png')}
          style={styles.successIcon}
        />
      </View>

      <Text style={styles.successTitle}>Order Successful</Text>
      <Text style={styles.thankYouText}>Thank you!</Text>
      <Text style={styles.subText}>Rider is on his way to your table</Text>

      <TouchableOpacity onPress={handlePressBack} style={styles.button}>
        <Text style={styles.buttonText}>Wanna Order More</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  thankYouText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#F17547',
    padding: 16,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Outfit-Bold',
  },
});

export default OrderConfirmationScreen;
