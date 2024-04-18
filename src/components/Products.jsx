import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
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
  const [noProductsMessage, setNoProductsMessage] = useState('');
  const [cart, setCart] = useState([]);

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
        if (filteredProducts.length > 0) {
          const updatedProducts = filteredProducts.map(item => {
            const {category, ...rest} = item; // Destructure category and get rest of the properties
            return rest; // Return an object without the category property
          });
          setProducts(updatedProducts);
        } else {
          Alert.alert(
            'No Items Available',
            'There are no available items in this category',
            [{text: 'OK'}],
          );
        }
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

  const handlePress = item => {
    console.log(item);
    navigation.navigate('Details', {item: item});
  };

  const renderFoodItem = ({item}) => {
    console.log(item);
    return (
      <TouchableOpacity onPress={() => handlePress(item)}>
        <View style={styles.foodItemCard}>
          <Image
            source={{uri: `http://192.168.18.13:8000/uploads/${item.photo}`}}
            style={styles.foodItemImage}
          />
          <View style={styles.deliveryTime}>
            <Text style={styles.timeText}>25-30 min</Text>
          </View>
          <TouchableOpacity style={styles.favIcon}>
            <Icon name="heart-o" size={20} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.cardContent}>
            <Text style={styles.foodItemName}>{item.name}</Text>
            <View style={styles.footer}>
              <Icon name="star" size={16} color="#FFC107" />
              <Text style={styles.ratingText}>4.7</Text>
              <View
                style={{
                  backgroundColor: '#F17547',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  marginLeft: 10,
                  borderRadius: 5,
                }}>
                <Text style={styles.categoryText}>Rs.{item.price}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
    borderRadius: 20,
    margin: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  foodItemImage: {
    width: '100%',
    height: 150,
  },
  deliveryTime: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 5,
    right: 10,
    top: '47%',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  timeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Medium',
  },
  favIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 8,
  },
  cardContent: {
    padding: 10,
  },
  foodItemName: {
    fontSize: 20,
    fontFamily: 'Outfit-Medium',
    marginBottom: 5,
    color: 'black',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 18,
    color: '#FFC107',
    fontFamily: 'Outfit-Medium',
    marginLeft: 5,
  },
  categoryText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Outfit-Medium',
  },
  priceRange: {
    fontSize: 16,
    color: '#555',
    marginLeft: 10,
  },
});
