import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

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

  const handleOrderPress = () => {
    const cartItem = {
      ...item,
      quantity: quantity,
      totalPrice: totalPrice,
    };

    // Navigate to CartScreen with the cartItem
    navigation.navigate('cart', {cartItems: [cartItem]});
  };

  const totalPrice = (item.price * quantity).toFixed(2);

  return (
    <ScrollView style={styles.container}>
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
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          onPress={() => updateQuantity('decrease')}
          disabled={quantity <= 1}>
          <Icon name="minus" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.quantity}>{quantity}</Text>
        <TouchableOpacity onPress={() => updateQuantity('increase')}>
          <Icon name="plus" size={20} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.details}>
        <Text style={styles.title}>
          {item.name} – ₨.{totalPrice}
        </Text>

        <Text style={styles.description}>{item.description}</Text>
      </View>

      <View style={styles.orderButtonContainer}>
        <TouchableOpacity onPress={handleOrderPress} style={styles.orderButton}>
          <Text style={styles.orderButtonText}>Proceed </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  quantity: {
    marginHorizontal: 16,
    fontSize: 18,
  },
  details: {
    alignItems: 'center',
    padding: 16,
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
    padding: 16,
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
