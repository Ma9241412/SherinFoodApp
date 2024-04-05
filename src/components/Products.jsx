import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
export const Products = ({selectedCategoryId}) => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddProduct = () => {
    navigation.navigate('cart');
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          'http://192.168.18.13:8000/api/v1/product/get-products',
        );
        const filteredProducts = response.data.products.filter(
          product => product.category._id === selectedCategoryId,
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCategoryId) {
      fetchProducts();
    }
  }, [selectedCategoryId]);

  const renderFoodItem = ({item}) => (
    <View style={styles.foodItemCard}>
      <Image
        source={{uri: `http://192.168.18.13:8000/uploads/${item.photo}`}}
        style={styles.foodItemImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.foodItemName}>{item.name}</Text>
        <Text style={styles.foodItemDescription}>{item.description}</Text>
        <Text style={styles.foodItemPrice}>${item.price}</Text>
      </View>
      <TouchableOpacity style={styles.favIcon}>
        <Icon name="heart-o" size={20} color="#FFC107" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={() => handleAddProduct(item._id)}>
        <Icon name="plus" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#F17547" />
      </View>
    );
  }
  return (
    <FlatList
      data={products}
      renderItem={renderFoodItem}
      keyExtractor={item => item._id}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  foodItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },

  foodItemImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
  },
  addToCartButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  favIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  foodItemDescription: {
    color: '#555',
    marginBottom: 5,
    color: 'black',
  },
  foodItemPrice: {
    color: '#000',
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'Outfit-Black',
  },
  addToCartButton: {
    backgroundColor: '#F17547',
    borderRadius: 30,
    marginTop: 40,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  addToCartButtonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
  },
  foodItemName: {
    color: 'black',
    fontSize: 20,
    fontFamily: 'Outfit-SemiBold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
