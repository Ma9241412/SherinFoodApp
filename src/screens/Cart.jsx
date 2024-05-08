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
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

const CartScreen = ({navigation}) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const loadCartItems = async () => {
        try {
          const storedCartItems = await AsyncStorage.getItem('cartItems');
          if (storedCartItems !== null) {
            setCartItems(JSON.parse(storedCartItems));
          }
        } catch (error) {
          console.error('Failed to load cart items:', error);
        }
      };

      loadCartItems();

      return () => {};
    }, []),
  );

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
    let total = 0;
    let totalDiscounted = 0;

    cartItems.forEach(item => {
      total += item.price * item.quantity;
      totalDiscounted += (item.price - item.discountPrice) * item.quantity;
    });

    return {total, totalDiscounted};
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
      const {total, totalDiscounted} = calculateTotal();

      const navigateToInvoice = async () => {
        navigation.navigate('invoice', {
          setCartItems,
          setTotal,
          cartItems,
          total,
          totalDiscounted, // Send the discounted total as well
          dis: total - totalDiscounted, // This might represent the total savings
        });
        // await AsyncStorage.removeItem('cartItems');
        // setCartItems([]);
        // setTotal(0);
        ToastAndroid.show('Continuing as guest', ToastAndroid.SHORT);
      };

      const navigateToLogin = () => {
        ToastAndroid.show('Please log in', ToastAndroid.SHORT);
        navigation.navigate('Login');
      };

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
          source={{uri: `https://shc.fayazk.com/uploads/${item.photo}`}}
          style={styles.itemImage}
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>
            Discounted Rs.{item.discountPrice.toFixed(2)}
          </Text>

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => decrementQuantity(item._id)}
              disabled={item.quantity === 1}>
              <Icon name="minus" size={20} color="#AEAEB2" />
            </TouchableOpacity>
            <Text style={styles.itemQuantity}> {item.quantity}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => incrementQuantity(item._id)}>
              <Icon name="plus" size={20} color="#AEAEB2" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.trash}
          onPress={() => removeItem(item._id)}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                marginRight: 5,
                color: 'white',
                fontSize: 12,
                fontFamily: 'Outfit-Regular',
              }}>
              Remove
            </Text>
            <Icon name="trash" size={15} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <ScrollView style={styles.container}>
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyMessage}>Your cart is empty.</Text>
          }
          showsVerticalScrollIndicator={false}
        />
      </ScrollView>
      <View style={styles.footer}>
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  listContainer: {
    padding: 8,
    marginBottom: 50,
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
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 10,
    marginHorizontal: 16,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    borderColor: '#CECECE69',
    borderWidth: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 15,
    color: 'black',
  },
  itemPrice: {
    fontSize: 12,
    color: 'black',
    fontFamily: 'Outfit-Regular',
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
    backgroundColor: '#E4A112',
    borderRadius: 8,
    padding: 15,
    position: 'absolute',

    bottom: 10,
    right: 10,
    left: 10,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
    fontFamily: 'Outfit-Bold',
    textAlign: 'center',
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
  trash: {
    backgroundColor: '#C73F3F',
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingHorizontal: 30,
    paddingVertical: 7,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
  },
});

export default CartScreen;
