import React, {useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProductCard = () => {
  const [quantity, setQuantity] = useState(0);

  const incrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prevQuantity => (prevQuantity > 0 ? prevQuantity - 1 : 0));
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require('../assets/cat2.jpg')} // Replace with your image URL
          style={styles.image}
        />
        <Text style={styles.title}>BURGER QUEEN XTRA PLUS</Text>
        <Text style={styles.description}>Double decker with extra cheese</Text>
        <View style={styles.priceRatingContainer}>
          <Text style={styles.originalPrice}>$11.00</Text>
          <Text style={styles.discountedPrice}>$7.70</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>4.8</Text>
          </View>
        </View>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={decrementQuantity}
            style={styles.quantityButton}>
            <Icon name="minus" size={16} color="#000" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity
            onPress={incrementQuantity}
            style={styles.quantityButton}>
            <Icon name="plus" size={16} color="#000" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.orderButton}>
          <Text style={styles.orderButtonText}>ORDER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    flex: 1,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 300, // Adjust width as needed
    marginVertical: 20,
  },
  image: {
    width: 150, // Adjust width as needed
    height: 150, // Adjust height as needed
    borderRadius: 75, // Make it round
    marginTop: -75, // Half of height to pull it out of card
    alignSelf: 'center',
    borderWidth: 5,
    borderColor: '#FFF',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 80, // Make room for the image
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  priceRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%', // Card width
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  discountedPrice: {
    fontWeight: 'bold',
    color: '#E44C4C',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    backgroundColor: '#DDD',
    padding: 4,
    borderRadius: 4,
  },
  quantity: {
    marginHorizontal: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderButton: {
    backgroundColor: 'red',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 8,
    width: '100%', // Match the card width
  },
  orderButtonText: {
    color: '#FFF',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ProductCard;
