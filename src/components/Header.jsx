import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TextInput,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';

const {width: windowWidth} = Dimensions.get('window');

export const HeaderComp = ({onSearchChange, searchTerm}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const headerData = [
    {
      image: require('../assets/cat1.jpg'),
    },
    {
      image: require('../assets/cat3.jpg'),
    },
    {
      image: require('../assets/cat4.jpg'),
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentImageIndex + 1) % headerData.length;

      Animated.spring(scrollX, {
        toValue: -nextIndex * windowWidth,
        useNativeDriver: true,
      }).start();

      setCurrentImageIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentImageIndex]);

  const handleInputChange = event => {
    onSearchChange(event.target.value);
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        style={styles.searchInput}
        placeholder="Search Hot & Spicy Food ..."
        placeholderTextColor="black"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    position: 'relative',
    overflow: 'hidden',
  },
  scrollView: {
    flexDirection: 'row',
  },
  imageBackground: {
    width: windowWidth,
    height: 200,
    opacity: 1,
  },
  searchInput: {
    height: 40,
    borderRadius: 7,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    position: 'absolute',
    top: 140,
    left: 10,
    right: 10,
    fontFamily: Platform.OS === 'ios' ? 'Outfit-Medium' : 'sans-serif-medium',
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'white',
  },
});

export default HeaderComp;
