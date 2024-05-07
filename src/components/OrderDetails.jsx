import React from 'react';
import {
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export const OrderDetails = ({route}) => {
  const {order} = route.params;

  console.log('ordeDetails', order.cartItems);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.detail}>Name:</Text>
          <Text style={styles.detail2}> {order.userDetails.name}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.detail}>Email: </Text>
          <Text style={styles.detail2}>{order.userDetails.email}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.detail}>Phone: </Text>
          <Text style={styles.detail2}>{order.userDetails.phone}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.detail}>Address:</Text>
          <Text style={styles.detail2}>{order.userDetails.address}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        {order.cartItems.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Image
              source={{
                uri: `https://shc.fayazk.com/uploads/${item.product.photo}`,
              }}
              style={styles.productImage}
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.product.name}</Text>
              <Text style={styles.itemPrice}>
                {item.product.discountPrice < item.product.price
                  ? `Price: Rs.${item.product.discountPrice} (Discounted from Rs.${item.product.price})`
                  : `Price: Rs.${item.product.price}`}
              </Text>
              <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
            </View>
          </View>
        ))}
        <View style={{paddingHorizontal: 70}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={styles.totalPrice1}>GST: </Text>
            <Text style={styles.totalPrice2}> {order.gst}.Rs </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={styles.totalPrice1}>Discount: </Text>
            <Text style={styles.totalPrice2}> {order.discount}.Rs </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={styles.totalPrice1}>After: </Text>
            <Text style={styles.totalPrice2}>{order.total}.Rs</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={styles.totalPrice1}>Delivery Address: </Text>
            <Text style={styles.totalPrice2}> {order.deliveryaddress}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section2}>
        <Text style={styles.sectionTitle2}>Total</Text>
        <Text style={styles.totalPrice}>Rs. {order.total}</Text>
      </View>

      <View style={styles.section3}>
        <Text style={styles.sectionTitle2}>Order Status</Text>
        <Text style={styles.status}>{order.status || 'Pending'}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F2F2F7',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  section: {
    marginVertical: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  section2: {
    marginVertical: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  section3: {
    marginVertical: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
    color: '#333',
    marginBottom: 15,
  },
  sectionTitle2: {
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
    color: '#333',
  },
  detail: {
    fontSize: 12,
    color: '#505050',
    marginVertical: 2,
    fontFamily: 'Outfit-Medium',
  },
  detail2: {
    fontSize: 12,
    color: '#2B2B2B',
    marginVertical: 2,
    fontFamily: 'Outfit-Bold',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    color: '#444',
    fontFamily: 'Outfit-Bold',
  },
  itemPrice: {
    fontSize: 13,
    color: '#888',
    fontFamily: 'Outfit-Regular',
  },
  itemQuantity: {
    fontSize: 13,
    color: '#888',
    fontFamily: 'Outfit-Regular',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E63946',
  },
  totalPrice1: {
    fontSize: 15,
    fontFamily: 'Outfit-Medium',
    color: '#E63946',
  },
  totalPrice2: {
    fontSize: 12,
    fontFamily: 'Outfit-Regular',
    color: 'black',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
});
