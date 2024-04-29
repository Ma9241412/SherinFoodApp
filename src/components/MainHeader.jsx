import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native'; // Assuming you are using React Navigation

const MainHeader = ({
  onCartPress,
  onSearchChange,
  searchTerm,
  profilePicture,
}) => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('Guest');
  const [profilePictureUri, setProfilePictureUri] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);

  const fetchCartItems = async () => {
    try {
      const cartItemsJson = await AsyncStorage.getItem('cartItems');
      const cartItems = cartItemsJson ? JSON.parse(cartItemsJson) : [];
      setCartItemCount(cartItems.length);
    } catch (error) {
      console.error('Failed to load cart items', error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchCartItems();
    }, []),
  );
  const renderProfilePicture = profilePicture
    ? {uri: profilePicture}
    : require('../assets/dummy.png');

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Yes',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('userDetails');
          navigation.navigate('Login');
        },
      },
    ]);
  };

  const fetchUserDetails = async () => {
    try {
      const userDetails = await AsyncStorage.getItem('userDetails');
      console.log(userDetails);
      if (userDetails !== null) {
        const {name, image} = JSON.parse(userDetails);
        setUserName(name);
        setProfilePictureUri(image);
      }
    } catch (error) {
      console.error('Failed to load the user details', error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserDetails();
    }, []),
  );
  const imageSource = profilePictureUri
    ? {uri: `http://192.168.18.13:8000/uploads/${profilePictureUri}`}
    : require('../assets/dummy.png');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <Image source={imageSource} style={styles.profilePic} />
        <TouchableOpacity style={styles.cartButton} onPress={onCartPress}>
          <Icon name="shopping-cart" size={23} color="white" />
          {cartItemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.item}>
          <Icon name="sign-out" size={20} color="white" style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={{paddingHorizontal: 10}}>
        <TextInput
          value={searchTerm}
          onChangeText={onSearchChange}
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#C7C7CD"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    color: '#E4A112',
    fontSize: 15,
    fontFamily: 'Outfit-Regular',
  },
  userName: {
    color: '#223263',
    fontSize: 20,
    fontFamily: 'Outfit-Medium',
  },
  cartButton: {
    marginRight: 10,
    position: 'relative',
    backgroundColor: '#E4A112',
    padding: 7,
    borderRadius: 28,
  },
  cartBadge: {
    position: 'absolute',
    right: -4,
    top: -3,
    borderRadius: 10,
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
  profilePic: {
    width: 38,
    height: 38,
    borderRadius: 25,
    marginRight: 15,
  },
  searchInput: {
    height: 45,
    borderRadius: 5,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Avenir' : 'Roboto',
    borderWidth: 1,
    borderColor: '#DEDEDE',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E4A112',
    padding: 9,
    borderRadius: 25,
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default MainHeader;
