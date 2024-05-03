import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
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
      const newQuantity =
        operation === 'increase'
          ? prevQuantity + 1
          : Math.max(1, prevQuantity - 1);

      AsyncStorage.setItem('quantity', newQuantity.toString())
        .then(() =>
          console.log('Quantity updated in AsyncStorage:', newQuantity),
        )
        .catch(error =>
          console.error('Failed to update quantity in AsyncStorage:', error),
        );

      return newQuantity;
    });
  };

  const handleAddCart = async (newItem, quantity) => {
    console.log(newItem);
    console.log(quantity);
    try {
      const existingCart = await AsyncStorage.getItem('cartItems');
      console.log('Existing Cart:', existingCart);

      let cart = existingCart ? JSON.parse(existingCart) : [];

      const existingItemIndex = cart.findIndex(
        item => item._id === newItem._id,
      );

      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += quantity;
        cart[existingItemIndex].totalPrice = (
          cart[existingItemIndex].price * cart[existingItemIndex].quantity
        ).toFixed(2);
      } else {
        const cartItem = {
          ...newItem,
          quantity: quantity,
          totalPrice: (newItem.price * quantity).toFixed(2),
        };
        cart.push(cartItem);
      }

      await AsyncStorage.setItem('cartItems', JSON.stringify(cart));
      console.log('Updated Cart:', cart);

      ToastAndroid.show('Item Added Successfully to Cart', ToastAndroid.SHORT);
      navigation.goBack();
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      ToastAndroid.show('Failed to add item to cart', ToastAndroid.LONG);
    }
  };

  const totalPrice = (item.discountPrice * quantity).toFixed(2);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress}>
          <Icon name="chevron-left" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{item.name}</Text>
        <Icon name="ellipsis-v" size={24} color="#000" />
      </View>

      <ScrollView style={{paddingHorizontal: 10}}>
        <View style={styles.quantityContainer1}>
          <Image
            source={{
              uri: `https://shc.fayazk.com/uploads/${item.photo}`,
            }}
            style={styles.image}
          />
          <View style={{flexDirection: 'column', marginLeft: 10}}>
            <Text style={styles.title1}>{item.name}</Text>

            <Text style={styles.title}>Discounted Price: Rs.{totalPrice}</Text>
            <View style={styles.footer}>
              <View
                style={{
                  paddingVertical: 5,
                  borderRadius: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Icon name="clock-o" size={16} color="#000000" />

                <Text style={styles.timeText}>25-30 min</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          paddingHorizontal: 10,
          position: 'absolute',
          bottom: 90,
          right: 4,
          left: 4,
        }}>
        <Text
          style={{
            paddingHorizontal: 4,
            color: 'black',
            fontFamily: 'Outfit-Medium',
          }}>
          Quantity
        </Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => updateQuantity('decrease')}
            disabled={quantity <= 1}>
            <Icon name="minus" size={20} color="#AEAEB2" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity onPress={() => updateQuantity('increase')}>
            <Icon name="plus" size={20} color="#AEAEB2" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.orderButtonContainer}>
        <View>
          <Text style={styles.description2}>Rs .{totalPrice}</Text>
          <Text style={styles.description3}>Total Price</Text>
        </View>

        <TouchableOpacity
          onPress={() => handleAddCart(item, quantity)}
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
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  orderButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  headerTitle: {
    fontSize: 15,
    fontFamily: 'Outfit-SemiBold',
    color: 'black',
  },
  title1: {
    fontSize: 15,
    fontFamily: 'Outfit-Medium',
    color: '#000000',
  },
  timeText: {
    color: '#000000',
    fontSize: 10,
    fontFamily: 'Outfit-Regular',
    marginLeft: 4,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 60,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    borderColor: '#F2F2F7',
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  quantityContainer1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    borderColor: '#CECECE69',
    borderWidth: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 90,
    borderBottomLeftRadius: 90,
    borderRadius: 15,
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
    fontSize: 10,
    color: 'black',
    fontFamily: 'Outfit-SemiBold',
  },
  description: {
    fontSize: 16,
    color: 'black',
    marginVertical: 4,
    fontFamily: 'Outfit-Medium',
  },
  description2: {
    fontSize: 20,
    color: 'black',
    fontFamily: 'Outfit-Bold',
  },
  description3: {
    fontSize: 10,
    color: 'black',
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

  orderButton: {
    backgroundColor: '#E4A112',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: 150,
  },
  orderButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
  },
});

export default ProductDetailsScreen;
