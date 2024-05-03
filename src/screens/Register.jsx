import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  ToastAndroid,
  Image,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Make sure you have installed react-native-vector-icons
import {API_URL} from '../Constants/Helper';

const RegisterScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null);

  const selectImage = () => {
    const options = {
      noData: true,
      mediaType: 'photo',
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.assets[0].uri};
        setImage(source);
      }
    });
  };

  const handleRegister = async () => {
    if (!name.trim()) {
      alert('Please enter your name.');
      return;
    }
    if (!email.trim()) {
      alert('Please enter your email.');
      return;
    }
    if (!password) {
      alert('Please enter a password.');
      return;
    }
    if (!phone.trim()) {
      alert('Please enter your phone number.');
      return;
    }
    if (!address.trim()) {
      alert('Please enter your address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      alert('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone.trim())) {
      alert('Please enter a valid phone number with 10 digits.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('email', email.trim());
      formData.append('password', password);
      formData.append('phone', phone.trim());
      formData.append('address', address.trim());

      if (image) {
        formData.append('image', {
          uri: image.uri,
          type: 'image/jpeg',
          name: 'profilepic.jpg',
        });
      }

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful:', data);
        ToastAndroid.show('Registration successful', ToastAndroid.SHORT);
      } else {
        console.error('Registration failed:', data.message);
        ToastAndroid.show(
          data.message || 'Registration failed',
          ToastAndroid.LONG,
        );
      }
    } catch (error) {
      console.error('Registration error:', error);
      ToastAndroid.show('Registration error', ToastAndroid.LONG);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <Text style={styles.header}>Create an account!</Text>

        <TouchableOpacity onPress={selectImage} style={styles.imageUploader}>
          {image?.uri ? (
            <Image source={{uri: image.uri}} style={styles.imagePreview} />
          ) : (
            <>
              <Icon name="camera-alt" size={30} color="#F49E1A" />
              <Text style={styles.imageUploadText}>Select Image</Text>
            </>
          )}
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          autoCapitalize="words"
          multiline
        />

        <TouchableOpacity onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      <TouchableOpacity
        onPress={navigateToLogin}
        style={styles.registerContainer}>
        <Text style={styles.register}>
          Already have an account?{' '}
          <Text style={styles.registerHighlight}>Login</Text>
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  header: {
    fontSize: 25,
    color: '#F49E1A',
    fontFamily: 'Outfit-Medium',
    marginBottom: 5,
  },

  input: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginVertical: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 3,
    borderRadius: 5,
    height: 50,
    borderColor: '#BFBFBF',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#F49E1A',
    borderRadius: 8,
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
  },
  register: {
    color: '#6C6C6C',
    fontSize: 20,
    fontFamily: 'Outfit-Regular',
    position: 'absolute',
    bottom: 10,
  },
  registerHighlight: {
    fontFamily: 'Outfit-Regular',
    color: '#E38A00',
  },
  imageUploader: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  imagePreview: {
    width: '50%',
    height: '50%',
    borderRadius: 60,
  },
  imageUploadText: {
    color: '#6C6C6C',
    marginTop: 8,
    fontFamily: 'Outfit-Regular',
  },
});

export default RegisterScreen;
