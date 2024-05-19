// components/CustomCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

const CustomCard = ({ children, title, style, onPress, backgroundSource }) => {
  return (
    <View style={[styles.card, style]}>
      <TouchableOpacity onPress={onPress}>
        <ImageBackground source={backgroundSource} style={styles.imageBackground} imageStyle={styles.imageStyle}>
          <Text style={styles.title}>{title}</Text>
        </ImageBackground>
      </TouchableOpacity>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 20,
    flex: 1,
    backgroundColor: '#fff', // Ensure card background color matches image background
  },
  imageBackground: {
    padding: 20,
  },
  imageStyle: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // Adjust based on your image for readability
  },
  content: {
    flex: 1,
    padding: 20,
  },
});

export default CustomCard;
