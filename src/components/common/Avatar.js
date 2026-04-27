import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff';

const Avatar = ({ uri, size = 40, style }) => {
  return (
    <View style={[
      styles.container, 
      { width: size, height: size, borderRadius: size / 2 },
      style
    ]}>
      <Image 
        source={{ uri: uri || DEFAULT_AVATAR }} 
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default Avatar;
