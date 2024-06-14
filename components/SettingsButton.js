import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';

export default function SettingsButton(props) {
  return (
    <TouchableOpacity 
    style={styles.btnContainer}
    onPress={props.onPress}>
      <Text style={styles.btnText}>{props.title}</Text>
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
  },
  btnText: {
    fontSize: 17,
    fontFamily: "System",
    color: "#003D7C",
    fontWeight: "400"
  },
});