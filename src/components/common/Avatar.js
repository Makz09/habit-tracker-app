import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const DEFAULT_AVATAR = 'file:///C:/Users/Boss%20Makz/.gemini/antigravity/brain/154728ab-49c8-497c-b511-bb69742de0a5/default_avatar_placeholder_1776957506175.png';

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
