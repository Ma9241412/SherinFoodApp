import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductDetailsScreen = ({route, navigation}) => {
  const {item} = route.params;
  const [quantity, setQuantity] = useState(1);

  const handleBackPress = () => {
    navigation.navigate('Home');
  };

  const updateQuantity = operation => {
    setQuantity(prevQuantity => {
      return operation === 'increase'
        ? prevQuantity + 1
        : Math.max(1, prevQuantity - 1);
    });
  };

  const handleOrderPress = async newItem => {
    try {
      const existingCart = await AsyncStorage.getItem('cartItems');
      let cart = existingCart ? JSON.parse(existingCart) : [];

      if (newItem._id === undefined) {
        console.error('New item does not have an _id:', newItem);
        ToastAndroid.show(
          'Cannot add item without ID to cart',
          ToastAndroid.LONG,
        );
        return;
      }

      cart.push({
        ...newItem,
        totalPrice: (newItem.price * newItem.quantity).toFixed(2),
      });

      await AsyncStorage.setItem('cartItems', JSON.stringify(cart));

      console.log('Updated cart:', cart);

      ToastAndroid.show('Item Added Successfully to Cart', ToastAndroid.SHORT);

      navigation.goBack();
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      ToastAndroid.show('Failed to add item to cart', ToastAndroid.LONG);
    }
  };
  const totalPrice = (item.price * quantity).toFixed(2);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <Icon name="chevron-left" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{item.name}</Text>
        <Icon name="ellipsis-v" size={24} color="#000" />
      </View>
      <Image
        source={{uri: `http://192.168.18.13:8000/uploads/${item.photo}`}}
        style={styles.image}
      />
      <View style={styles.quantityContainer1}>
        <Text style={styles.title}>Price: Rs.{totalPrice}</Text>
        <View style={styles.quantityContainer}>
          <Text style={styles.title}>Qty: </Text>

          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(255, 99, 71, 0.87)',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 3,
              marginLeft: 4,
            }}
            onPress={() => updateQuantity('decrease')}
            disabled={quantity <= 1}>
            <Icon name="minus" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(255, 99, 71, 0.87)',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 3,
            }}
            onPress={() => updateQuantity('increase')}>
            <Icon name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.details}>
        <Text style={styles.title}>{item.name}</Text>

        <Text style={styles.description}>{item.description}</Text>
      </View>

      <View style={styles.orderButtonContainer}>
        <TouchableOpacity
          onPress={() => handleOrderPress(item)}
          style={styles.orderButton}>
          <Text style={styles.orderButtonText}>Add to cart </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Outfit-SemiBold',
    color: 'black',
  },
  image: {
    width: '100%',
    aspectRatio: 0.73,
    resizeMode: 'cover',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  quantity: {
    marginHorizontal: 16,
    fontSize: 24,
    fontFamily: 'Outfit-Bold',
    color: 'black',
  },
  details: {
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 24,
    color: 'black',
    fontFamily: 'Outfit-SemiBold',
  },
  description: {
    fontSize: 16,
    color: 'black',
    marginVertical: 4,
    fontFamily: 'Outfit-Medium',
  },
  calories: {
    fontSize: 16,
    color: '#555',
    marginVertical: 4,
  },
  cartInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  cartItems: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 16,
    color: '#555',
  },
  orderButtonContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FF6347',
  },
  orderButton: {
    backgroundColor: '#FF6347',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  orderButtonText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Outfit-Regular',
  },
});

export default ProductDetailsScreen;
