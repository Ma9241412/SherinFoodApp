import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const Sidebar = ({visible, onClose}) => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Yes',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('userDetails');
          onClose();
          navigation.navigate('Login');
        },
      },
    ]);
  };

  return (
    <Modal
      animationIn={'slideInLeft'}
      isVisible={visible}
      onBackdropPress={onClose}
      style={styles.modal}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name="times" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Main Menu</Text>
        <TouchableOpacity style={styles.item}>
          <Icon name="user" size={20} color="white" style={styles.icon} />
          <Text style={styles.itemText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('orders')}
          style={styles.item}>
          <Icon name="briefcase" size={20} color="white" style={styles.icon} />
          <Text style={styles.itemText}>My Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Icon name="tags" size={20} color="white" style={styles.icon} />
          <Text style={styles.itemText}>Discount Promo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Icon
            name="check-circle"
            size={20}
            color="white"
            style={styles.icon}
          />
          <Text style={styles.itemText}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Icon name="shield" size={20} color="white" style={styles.icon} />
          <Text style={styles.itemText}>Privacy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.item}>
          <Icon name="sign-out" size={20} color="white" style={styles.icon} />
          <Text style={styles.itemText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#F17547',
    width: '50%',
    height: '100%',
    paddingTop: 30,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 10,
    marginBottom: 10,
  },
  closeText: {
    color: 'white',
    marginBottom: 10,
    fontSize: 25,
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    paddingLeft: 20,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  itemText: {
    color: 'white',
    fontSize: 15,
  },
});

export default Sidebar;
