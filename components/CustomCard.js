// components/CustomCard.js
import { useContext } from 'react';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { DarkModeContext } from '../DarkModeContext';

const CustomCard = ({ children, title, style, onPress, backgroundSource }) => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext); 

  return (
    <View style={[darkMode ? stylesDark.card : styles.card, style]}>
      <TouchableOpacity onPress={onPress}>
        <ImageBackground source={backgroundSource} style={styles.imageBackground} imageStyle={styles.imageStyle}>
          <Text style={styles.title}>{title}</Text>
        </ImageBackground>
      </TouchableOpacity>
      <View style={darkMode ? stylesDark.content : styles.content}>
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
    backgroundColor: '#fab972', // Ensure card background color matches image background
  },
  imageBackground: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  imageStyle: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  title: {

    fontSize: 25,
    fontWeight: 'bold',
    color: 'black', // Adjust based on your image for readability
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 10,
  },
});
const stylesDark = StyleSheet.create({
  card: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 20,
    flex: 1,
    backgroundColor: '#a35a00', // Ensure card background color matches image background
  },
  imageBackground: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  imageStyle: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  title: {

    fontSize: 25,
    fontWeight: 'bold',
    color: 'black', // Adjust based on your image for readability
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 10,
  },
});

export default CustomCard;
