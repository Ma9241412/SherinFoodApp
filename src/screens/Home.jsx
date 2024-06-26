import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import axios from 'axios';
import {Products} from '../components/Products';
import MainHeader from '../components/MainHeader';
import Sidebar from '../components/SideBar';
import {API_URL} from '../Constants/Helper';

export const HomeScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const backAction = () => {
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };
  const initialLoad = useRef(true);
  const navigateToCart = () => {
    navigation.navigate('Cart');
  };
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        let endpoint = `${API_URL}/category/get-category`;

        const response = await axios.get(endpoint);
        setCategories(response.data.category);
        if (response.data.category.length > 0 && initialLoad.current) {
          setSelectedCategoryId(response.data.category[0]._id);
          initialLoad.current = false;
        }
      } catch (error) {
        console.error('Error fetching categories', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearchChange = newSearchTerm => {
    setSearchTerm(newSearchTerm);
  };
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
      <MainHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onMenuPress={toggleSidebar}
        onCartPress={navigateToCart}
      />
      <ScrollView>
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
            fontSize: 14,
            color: '#223263',
            fontFamily: 'Outfit-Medium',
            marginLeft: 14,
            marginTop: 10,
          }}>
          Quick Orders
        </Text>

        <Products
          searchTerm={searchTerm}
          selectedCategoryId={selectedCategoryId}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
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
    height: 82,
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
    fontFamily: 'Outfit-Medium',
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
    backgroundColor: '#E4A112',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
