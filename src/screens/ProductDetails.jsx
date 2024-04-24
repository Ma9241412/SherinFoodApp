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

      <View style={styles.quantityContainer1}>
        <Image
          source={{uri: `http://192.168.18.13:8000/uploads/${item.photo}`}}
          style={styles.image}
        />
        <View style={{flexDirection: 'column', marginLeft: 10}}>
          <Text style={styles.title1}>{item.name}</Text>

          <Text style={styles.title}>Price: Rs.{item.price}</Text>
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

      <View style={{paddingHorizontal: 10}}>
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
      {/* <View style={styles.details}>
        <Text style={styles.description}>{item.description}</Text>
      </View> */}
      <View style={styles.orderButtonContainer}>
        <View>
          <Text style={styles.description2}>Rs .{totalPrice}</Text>
          <Text style={styles.description3}>Total Price</Text>
        </View>

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
    width: '20%',
    height: 80,
    borderRadius: 40,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 30,
    borderColor: '#F2F2F7',
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 8,
  },
  quantityContainer1: {
    flexDirection: 'row',
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
