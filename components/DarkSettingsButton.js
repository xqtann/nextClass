import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Image } from 'react-native';

export default function DarkSettingsButton(props) {
  return (
    <TouchableOpacity 
      style={props.style || stylesDark.btnContainer}
      onPress={props.onPress}>
      <View style={{flexDirection: "row", alignItems: "center"}}>
        <Image source={props.icon} style={{width: 20, height: 20, marginRight: 10}} />
        <Text style={props.textStyle || stylesDark.btnText}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const stylesDark = StyleSheet.create({
  btnContainer: {
    backgroundColor: "#333333",
    width: 350,
    height: 40,
    borderRadius: 15,
    justifyContent: "center",
    paddingHorizontal: 20,
    alignItems: "left",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
    marginBottom: 10
  },
  btnText: {
    fontSize: 17,
    fontFamily: "System",
    color: "#bb86fc", // Highlight color for text
    fontWeight: "400"
  },
});
