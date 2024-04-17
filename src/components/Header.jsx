import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const backgroundImageIndex = useRef(new Animated.Value(0)).current;

  const backgroundImages = [
    require('../assets/cat1.jpg'),
    require('../assets/cat3.jpg'),
    require('../assets/cat4.jpg'),
  ];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.timing(backgroundImageIndex, {
        toValue: 2,
        duration: 6000,
        useNativeDriver: false,
      }),
    ).start();
  }, [fadeAnim, backgroundImageIndex]);

  const handleArrowPress = direction => {
    setCurrentImageIndex(prevIndex => {
      if (direction === 'left') {
        return prevIndex === 0 ? backgroundImages.length - 1 : prevIndex - 1;
      } else {
        return (prevIndex + 1) % backgroundImages.length;
      }
    });
  };
  return (
    <ImageBackground
      source={require('../assets/cat4.jpg')}
      style={styles.headerContainer}
      resizeMode="cover">
      <View style={styles.overlay}>
        <TouchableOpacity
          onPress={() => handleArrowPress('left')}
          style={styles.arrowButton}>
          <Icon name="chevron-left" size={30} color="white" />
        </TouchableOpacity>
        <Animated.Text style={[styles.headerTitle, {opacity: fadeAnim}]}>
          New and popular at Sherin Huts
        </Animated.Text>
        <TouchableOpacity
          onPress={() => handleArrowPress('right')}
          style={styles.arrowButton}>
          <Icon name="chevron-right" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Hot & New Restaurants"
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: 150,
    flexDirection: 'row',
    alignItems: 'center', // Center items vertically in the container
  },
  backgroundImage: {
    flex: 1, // Image background takes the full space of the headerContainer
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    flexDirection: 'row', // Arrange elements horizontally
    justifyContent: 'space-between', // Space out arrow icons
    alignItems: 'center', // Center items vertically
    padding: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    textAlign: 'center',
    fontFamily: 'Outfit-Bold',
    flex: 1, // Allows the title to take up the available space between the icons
  },
  searchInput: {
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    position: 'absolute', // Position input on top of other elements
    bottom: 10, // Place it at the bottom of the overlay
    left: 20,
    right: 20,
  },
  arrowButton: {
    // Additional styles for the arrow button, if needed
  },
});

export default HeaderComp;
