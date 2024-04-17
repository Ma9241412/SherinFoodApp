import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export const HeaderComp = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const headerData = [
    {
      title: 'New and popular at Sherin Huts - Dish 1',
      image: require('../assets/cat1.jpg'),
    },
    {
      title: 'New and popular at Sherin Huts - Dish 2',
      image: require('../assets/cat3.jpg'),
    },
    {
      title: 'New and popular at Sherin Huts - Dish 3',
      image: require('../assets/cat4.jpg'),
    },
  ];

  const handleArrowPress = direction => {
    setCurrentImageIndex(prevIndex => {
      return direction === 'left'
        ? (prevIndex + headerData.length - 1) % headerData.length
        : (prevIndex + 1) % headerData.length;
    });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={headerData[currentImageIndex].image}
        style={styles.headerContainer}
        resizeMode="cover">
        <View style={styles.overlay}>
          <TouchableOpacity
            onPress={() => handleArrowPress('left')}
            style={styles.arrow}>
            <Icon name="chevron-left" size={30} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {headerData[currentImageIndex].title}
          </Text>
          <TouchableOpacity
            onPress={() => handleArrowPress('right')}
            style={styles.arrow}>
            <Icon name="chevron-right" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <TextInput
        style={styles.searchInput}
        placeholder="Hot & Spicy Food"
        placeholderTextColor="#8e8e8e"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
  },
  headerContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  searchInput: {
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
  },
  arrow: {
    padding: 10, // For easier pressing
  },
});

export default HeaderComp;
