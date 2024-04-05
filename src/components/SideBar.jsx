// Sidebar.js
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, Animated} from 'react-native';

const MenuBar = ({isVisible, children, hideSidebar}) => {
  const [translateX] = useState(
    new Animated.Value(-Dimensions.get('window').width),
  );

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: isVisible ? 0 : -Dimensions.get('window').width,
      useNativeDriver: true,
    }).start();
  }, [isVisible, translateX]);

  return (
    <Animated.View
      style={[
        styles.sidebar,
        {
          transform: [{translateX}],
          height: Dimensions.get('window').height,
        },
      ]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 250,
    backgroundColor: 'red',
  },
});

export default MenuBar;
