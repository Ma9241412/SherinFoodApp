import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ToastAndroid,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartScreen = ({navigation}) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const storedCartItems = await AsyncStorage.getItem('cartItems');
        console.log('storedItems', storedCartItems);
        if (storedCartItems !== null) {
          setCartItems(JSON.parse(storedCartItems));
        }
      } catch (error) {
        console.error('Failed to load cart items:', error);
      }
    };
    loadCartItems();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('cartItems', JSON.stringify(cartItems))
      .then(() => {
        console.log('Cart items updated successfully!');
      })
      .catch(error => {
        console.error('Failed to save cart items:', error);
      });
  }, [cartItems]);

  useEffect(() => {
    console.log('Cart items:', cartItems);
  }, [cartItems]);

  const calculateTotal = () => {
    const newTotal = cartItems.reduce(
      (accumulator, currentItem) =>
        accumulator + currentItem.price * currentItem.quantity,
      0,
    );
    setTotal(newTotal);
  };

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const incrementQuantity = itemId => {
    const updatedCartItems = cartItems.map(item =>
      item._id === itemId ? {...item, quantity: item.quantity + 1} : item,
    );
    setCartItems(updatedCartItems);
  };

  const decrementQuantity = itemId => {
    const updatedCartItems = cartItems
      .map(item =>
        item._id === itemId ? {...item, quantity: item.quantity - 1} : item,
      )
      .filter(item => item.quantity > 0);
    setCartItems(updatedCartItems);
  };

  const removeItem = itemId => {
    const updatedCartItems = cartItems.filter(item => item._id !== itemId);
    setCartItems(updatedCartItems);
  };

  const keyExtractor = item => {
    return item && item._id ? item._id.toString() : `item-${Math.random()}`;
  };

  const proceedToCheckout = async () => {
    try {
      const userDetails = await AsyncStorage.getItem('userDetails');

      const navigateToInvoice = async () => {
        navigation.navigate('invoice', {cartItems, total});
        await AsyncStorage.removeItem('cartItems');
        setCartItems([]);
        setTotal(0);
        ToastAndroid.show('Continuing as guest', ToastAndroid.SHORT);
      };

      const navigateToLogin = () => {
        ToastAndroid.show('Please log in', ToastAndroid.SHORT);
        navigation.navigate('Login');
      };

      // If userDetails exist, go ahead to invoice
      if (userDetails !== null) {
        navigateToInvoice();
      } else {
        Alert.alert(
          'Proceed to Checkout',
          'How would you like to continue?',
          [
            {
              text: 'Continue as Guest',
              onPress: navigateToInvoice,
            },
            {
              text: 'Login as User',
              onPress: navigateToLogin,
            },
          ],
          {cancelable: true},
        );
      }
    } catch (error) {
      console.error('Error during checkout process:', error);
      ToastAndroid.show('Failed to proceed to checkout', ToastAndroid.LONG);
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View style={styles.itemContainer}>
        <Image
          source={{uri: `http://192.168.18.13:8000/uploads/${item.photo}`}} // Replace with `item.photo` or a placeholder if `item.photo` is null
          style={styles.itemImage}
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>Rs.{item.price.toFixed(2)}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => decrementQuantity(item._id)}
              disabled={item.quantity === 1}>
              <Icon name="minus" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => incrementQuantity(item._id)}>
              <Icon name="plus" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => removeItem(item._id)}>
            <Icon name="trash" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.total}>Total: Rs {total.toFixed(2)}</Text>
            <TouchableOpacity
              style={[
                styles.checkoutButton,
                cartItems.length === 0 && styles.disabledButton,
              ]}
              activeOpacity={0.7}
              onPress={proceedToCheckout}
              disabled={cartItems.length === 0}>
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>Your cart is empty.</Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContainer: {
    padding: 8,
  },
  header: {
    fontSize: 24,
    paddingVertical: 20,
    textAlign: 'center',
    color: 'black',
    backgroundColor: 'white',
    fontFamily: 'Outfit-SemiBold',
  },
  card: {
    backgroundColor: '#E5E4E4',
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 18,
    color: 'black',
  },
  itemPrice: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Outfit-SemiBold',
  },
  itemQuantity: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Outfit-SemiBold',
    marginHorizontal: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: 'rgba(255, 99, 71, 0.87)',
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 3,
  },

  total: {
    fontSize: 22,
    color: '#E44C4C',
    textAlign: 'center',
    fontFamily: 'Outfit-SemiBold',
    padding: 20,
  },
  checkoutButton: {
    backgroundColor: '#FF6347',
    borderRadius: 25,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    elevation: 3,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 18,
    fontFamily: 'Outfit-Regular',
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 18,
    color: '#AAAAAA',
    marginTop: 50,
  },
  footer: {
    marginTop: 16,
  },
});

export default CartScreen;
