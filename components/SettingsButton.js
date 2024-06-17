import {Text, TouchableOpacity, View, StyleSheet, Image} from 'react-native';

export default function SettingsButton(props) {
  return (
    <TouchableOpacity 
    style={props.style || styles.btnContainer}
    onPress={props.onPress}>
      <View style={{flexDirection: "row", alignItems: "center"}}>
        <Image source={props.icon} style={{width: 20, height: 20, marginRight: 10}} />
        <Text style={props.textStyle || styles.btnText}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
}

styles = StyleSheet.create({
  btnContainer: {
    backgroundColor: "#f8f8f8",
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
    color: "#003D7C",
    fontWeight: "400"
  },
});