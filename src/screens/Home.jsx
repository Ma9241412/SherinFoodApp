import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

import {Products} from '../components/Products';
import {HeaderComp} from '../components/Header';

export const HomeScreen = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'http://192.168.18.13:8000/api/v1/category/get-category',
        );
        setCategories(response.data.category);
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
      <View>
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
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderComp />
      <ScrollView>
        <View
          style={{
            marginTop: 20,
            marginLeft: 15,
            marginBottom: 15,
            fontFamily: 'Outfit-ExtraBold',
          }}>
          <Text
            style={{fontSize: 30, color: 'black', fontFamily: 'Outfit-Medium'}}>
            Categories
          </Text>
        </View>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#F17547" />
          </View>
        ) : (
          <View>
            <FlatList
              horizontal
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={item => item._id}
              extraData={selectedCategoryId}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
        <Text
          style={{
            fontSize: 30,
            color: 'black',
            fontFamily: 'Outfit-Medium',
            marginLeft: 14,
            marginTop: 10,
          }}>
          Featured Food
        </Text>

        <Products selectedCategoryId={selectedCategoryId} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    borderRadius: 20,
    margin: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.35,
    shadowRadius: 4.5,
    elevation: 6,
    width: 85,
    height: 100,
  },
  categoryImage: {
    width: 40,
    height: 40,
    marginBottom: 5,
    borderRadius: 100,
  },
  categoryText: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'Outfit-SemiBold',
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
    backgroundColor: '#F17547',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
