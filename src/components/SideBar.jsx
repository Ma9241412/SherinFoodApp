import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';

const Sidebar = ({visible, onClose}) => {
  return (
    <Modal isVisible={visible} onBackdropPress={onClose} style={styles.sidebar}>
      <View style={styles.container}>
        <Text style={styles.item}>Home</Text>
        <Text style={styles.item}>Profile</Text>
        <Text style={styles.item}>Settings</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    margin: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    width: 250,
    height: '100%',
  },
  item: {
    marginBottom: 16,
    fontSize: 18,
  },
  closeButton: {
    marginTop: 10,
  },
});

export default Sidebar;
