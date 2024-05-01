import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';

export const SplashScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/splash.jpg')}
        resizeMode="stretch"
        style={styles.backgroundImage}
      />

      <Image source={require('../assets/logo2.png')} style={styles.logo} />

      <View style={styles.bottomContainer}>
        <Text style={styles.welcomeText}>Welcome to Sherin Huts</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={styles.button}>
          <LinearGradient
            colors={['#E38A00', '#F49E1A']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.gradient}>
            <Text style={styles.buttonText}>Continue to app</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundImage: {
    width: '100%',
    height: '40%',
  },
  logo: {
    width: 126,
    height: 125,
    resizeMode: 'contain',
    position: 'absolute',
    left: '35%',
    top: '13%',
  },
  welcomeText: {
    color: '#6C6C6C',
    fontSize: 22,
    marginBottom: 20,
    fontFamily: 'Outfit-Medium',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  button: {
    width: '80%',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontFamily: 'Outfit-Regular',
  },
  gradient: {
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
});

export default SplashScreen;
