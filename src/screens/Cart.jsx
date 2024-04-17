import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

const CartScreen = ({route, navigation}) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (route.params?.cartItems) {
      setCartItems(route.params.cartItems);
    } else {
      setCartItems([]);
    }
  }, [route.params]);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const calculateTotal = () => {
    const newTotal = cartItems.reduce(
      (accumulator, currentItem) =>
        accumulator + currentItem.price * currentItem.quantity,
      0,
    );
    setTotal(newTotal);
  };

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
    AsyncStorage.removeItem('cartItems'); // This line is not necessary as we are updating the AsyncStorage in the useEffect above
  };

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Image
        source={{uri: `http://192.168.18.13:8000/uploads/${item.photo}`}}
        style={styles.itemImage}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={{
              backgroundColor: 'red',
              marginRight: 5,
              width: 30,
              height: 30,
            }}
            onPress={() => decrementQuantity(item._id)}>
            <Text style={styles.changeQuantity}>-</Text>
          </TouchableOpacity>
          <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
          <TouchableOpacity
            style={{
              backgroundColor: 'green',
              marginLeft: 5,
              width: 30,
              height: 30,
            }}
            onPress={() => incrementQuantity(item._id)}>
            <Text style={styles.changeQuantity}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.itemPrice}>Price: Rs.{item.price.toFixed(2)}</Text>
        <TouchableOpacity onPress={() => removeItem(item._id)}>
          <Text style={styles.removeItem}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item._id.toString()}
        ListHeaderComponent={<Text style={styles.header}>Your Cart</Text>}
        ListFooterComponent={
          <View>
            <Text style={styles.total}>Total: Rs {total.toFixed(2)}</Text>
            <TouchableOpacity
              style={[
                styles.checkoutButton,
                cartItems.length === 0 && styles.disabledButton,
              ]}
              activeOpacity={0.7}
              onPress={() =>
                cartItems.length > 0 &&
                navigation.navigate('invoice', {
                  cartItems: cartItems,
                  total: total,
                })
              }
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
    color: '#333',
    backgroundColor: 'white',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    backgroundColor: '#FFFFFF',
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
  },
  itemQuantity: {
    fontSize: 18,
    color: 'black',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 18,
    color: 'black',
  },
  total: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E44C4C',
    textAlign: 'center',
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  changeQuantity: {
    fontWeight: 'bold',
    fontSize: 18,
    marginHorizontal: 10,
    color: 'white',
    textAlign: 'center',
  },
  removeItem: {
    marginTop: 5,
    color: 'red',
    fontSize: 18,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
});

export default CartScreen;
