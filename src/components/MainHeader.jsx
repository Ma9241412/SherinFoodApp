import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Platform,
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
  const [userDetailsExist, setUserDetailsExist] = useState(false);
  const [address, setAddress] = useState('');

  const fetchAddress = async () => {
    try {
      const savedAddress = await AsyncStorage.getItem('selectedAddress');
      if (savedAddress) {
        setAddress(JSON.parse(savedAddress).address);
      }
    } catch (error) {
      console.error('Failed to load address', error);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchAddress();
    }, []),
  );
  const handleAddressPress = () => {
    navigation.navigate('maps');
  };

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
      if (userDetails !== null) {
        const {name, image} = JSON.parse(userDetails);
        setUserName(name);
        setProfilePictureUri(image);
        setUserDetailsExist(true);
      } else {
        setUserDetailsExist(false);
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
    ? {uri: `https://shc.fayazk.com/api/v1/uploads/${profilePictureUri}`}
    : require('../assets/avatar.png');

  const handleProfilePress = () => {
    if (!userDetailsExist) {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.addressContainer}>
        {address && (
          <TouchableOpacity
            onPress={handleAddressPress}
            style={styles.addressButton}>
            <Icon
              name="map-marker"
              size={20}
              color="#E4A112"
              style={styles.addressIcon}
            />
            <Text style={styles.addressText}>{address}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.header}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <TouchableOpacity onPress={handleProfilePress} style={{marginRight: 5}}>
          <Image source={imageSource} style={styles.profilePic} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cartButton} onPress={onCartPress}>
          <Icon name="shopping-cart" size={20} color="white" />
          {cartItemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        {userDetailsExist && (
          <TouchableOpacity onPress={handleLogout} style={styles.cartButton}>
            <Icon name="sign-out" size={20} color="white" />
          </TouchableOpacity>
        )}
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
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  addressButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  addressIcon: {
    marginRight: 5,
  },

  addressText: {
    fontSize: 13,
    color: '#E4A112',
    fontFamily: 'Outfit-Medium',
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
    marginRight: 8,
    backgroundColor: '#E4A112',
    padding: 5,
    borderRadius: 15,
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
    width: 35,
    height: 35,
    borderRadius: 25,
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
  },
  icon: {
    width: 12,
    height: 12,
  },
});

export default MainHeader;
