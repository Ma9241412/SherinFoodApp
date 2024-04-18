import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

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
    AsyncStorage.removeItem('cartItems');
  };

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Image
        source={{uri: `http://192.168.18.13:8000/uploads/${item.photo}`}}
        style={styles.itemImage}
      />
      <View style={styles.itemDetails}>
        <View>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>Rs.{item.price.toFixed(2)}</Text>

          <View style={styles.quantityContainer1}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={{
                  backgroundColor: 'rgba(255, 99, 71, 0.87)',
                  paddingHorizontal: 5,
                  paddingVertical: 4,
                  borderRadius: 3,
                }}
                onPress={() => decrementQuantity(item._id)}>
                <Icon name="minus" size={20} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              <TouchableOpacity
                style={{
                  backgroundColor: 'rgba(255, 99, 71, 0.87)',
                  paddingHorizontal: 5,
                  paddingVertical: 4,
                  borderRadius: 3,
                }}
                onPress={() => incrementQuantity(item._id)}>
                <Icon name="plus" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: 'rgba(255, 99, 71, 0.87)',
                paddingHorizontal: 5,
                paddingVertical: 4,
                borderRadius: 3,
              }}
              onPress={() => removeItem(item._id)}>
              <Icon name="trash" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item._id.toString()}
        ListHeaderComponent={<Text style={styles.header}>My Cart</Text>}
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
    padding: 20,
    textAlign: 'center',
    color: 'black',
    backgroundColor: 'white',
    fontFamily: 'Outfit-SemiBold',
  },
  itemContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 10,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  itemName: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 20,
    marginBottom: 2,
    color: 'black',
  },
  itemQuantity: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'Outfit-SemiBold',
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'Outfit-SemiBold',
  },
  total: {
    fontSize: 22,
    color: '#E44C4C',
    textAlign: 'center',
    padding: 20,
    fontFamily: 'Outfit-SemiBold',
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
    gap: 4,
  },
  quantityContainer1: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
    justifyContent: 'space-between',
  },
  changeQuantity: {
    fontWeight: 'bold',
    fontSize: 18,
    marginHorizontal: 10,
    color: 'white',
    textAlign: 'center',
  },
  removeItem: {
    marginTop: 2,
    color: 'red',
    fontSize: 18,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
});

export default CartScreen;
