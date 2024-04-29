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
export const Products = ({selectedCategoryId, searchTerm}) => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] =
    useState(selectedCategoryId);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let endpoint = 'http://192.168.18.13:8000/api/v1/product/get-products';

        if (selectedCategoryId) {
          endpoint += `?categoryId=${selectedCategoryId}`;
        }

        const response = await axios.get(endpoint);
        let filteredProducts = response.data.products;

        if (searchTerm) {
          filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()),
          );
        }

        if (filteredProducts.length > 0) {
          const updatedProducts = filteredProducts
            .filter(product => product.category._id === selectedCategoryId)
            .map(item => {
              const {category, ...rest} = item;
              return rest;
            });
          setProducts(updatedProducts);
        } else {
          setProducts([]);
          Alert.alert(
            'No Items Available',
            'There are no available items matching your search',
            [{text: 'OK'}],
          );
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        Alert.alert(
          'Error',
          'Failed to fetch products. Please try again later.',
          [{text: 'OK'}],
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategoryId, searchTerm]);

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

          <TouchableOpacity style={styles.favIcon}>
            <Icon name="star" size={16} color="#000000" />
            <Text style={styles.ratingText}>4.7</Text>
          </TouchableOpacity>
          <View style={styles.cardContent}>
            <Text style={styles.foodItemName}>{item.name}</Text>
            <Text style={styles.categoryText}>Rs .{item.price}</Text>
            <View style={styles.footer}>
              <View
                style={{
                  paddingVertical: 5,
                  borderRadius: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 8,
                }}>
                <Icon name="clock-o" size={16} color="#000000" />

                <Text style={styles.timeText}>25-30 min</Text>
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
    margin: 10,
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomLeftRadius: 50,
    borderTopLeftRadius: 50,
    borderColor: '#CECECE69',
    borderWidth: 1,
    borderRadius: 15,
  },
  foodItemImage: {
    width: '25%',
    height: 100,
    borderRadius: 50,
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
    color: '#000000',
    fontSize: 10,
    fontFamily: 'Outfit-Regular',
    marginLeft: 4,
  },
  favIcon: {
    position: 'absolute',
    right: 10,
    top: 2,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  cardContent: {
    padding: 10,
    marginTop: 5,
  },
  foodItemName: {
    fontSize: 15,
    fontFamily: 'Outfit-Bold',
    color: '#2B2B2B',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 13,
    color: '#000000',
    fontFamily: 'Outfit-Medium',
    marginLeft: 5,
  },
  categoryText: {
    fontSize: 12,
    color: '#223263',
    fontFamily: 'Outfit-Medium',
  },
  priceRange: {
    fontSize: 16,
    color: '#555',
    marginLeft: 10,
  },
});
