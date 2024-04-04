import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

import {Products} from '../components/Products';

export const HomeScreen = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'http://192.168.18.13:8000/api/v1/category/get-category',
        );
        setCategories(response.data.category);
        // Set the first category as selected by default
        if (response.data.category.length > 0) {
          setSelectedCategoryId(response.data.category[0]._id);
        }
      } catch (error) {
        console.error('Error fetching categories', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const renderCategoryItem = ({item}) => {
    const isSelected = item._id === selectedCategoryId;
    return (
      <TouchableOpacity
        onPress={() => setSelectedCategoryId(item._id)}
        style={[
          styles.categoryCard,
          isSelected && styles.categoryCardSelected,
        ]}>
        <Image source={{uri: item.image}} style={styles.categoryImage} />
        <Text
          style={[
            styles.categoryText,
            isSelected && styles.categoryTextSelected,
          ]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for dishes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#F17547" />
        </View>
      ) : (
        <FlatList
          horizontal
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item._id}
          extraData={selectedCategoryId}
          showsHorizontalScrollIndicator={false}
        />
      )}
      <Products selectedCategoryId={selectedCategoryId} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
    margin: 10,
    paddingHorizontal: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 10,
    backgroundColor: 'white',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  categoryCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.35,
    shadowRadius: 4.5,
    elevation: 6,
    width: 100,
    height: 100,
  },
  categoryImage: {
    width: 50,
    height: 50,
    marginBottom: 5,
    borderRadius: 100,
  },
  categoryText: {
    color: 'black',
  },
  categoryTextSelected: {
    color: 'white',
  },
  foodItemCard: {
    backgroundColor: 'white',

    borderRadius: 10,
    margin: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: 'red',
  },
  foodItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  foodItemDescription: {
    color: '#555',
    marginBottom: 5,
    color: 'black',
  },
  foodItemPrice: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addToCartButton: {
    backgroundColor: 'red',
    borderRadius: 10,
    marginTop: 10,
    padding: 10,
  },
  addToCartButtonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryCardSelected: {
    backgroundColor: '#F17547', // Style for when a category is selected
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
