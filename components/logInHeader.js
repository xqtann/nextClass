import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LogInHeader() {
    return (
    <View style={styles.header}> 
        <Text style={styles.title}>
        Log In
        </Text>
    </View>);
}

const styles = StyleSheet.create({
    header: {
        width: '100%',        // Full width of the screen
        height: 60,           // Set the height of the header
        backgroundColor: '#f8f8f8', // Background color of the header
        justifyContent: 'center', // Centers the child components along the main axis
        alignItems: 'center',     // Centers the child components along the cross axis
        shadowColor: '#000',      // Shadow color
        shadowOffset: { width: 0, height: 2 },  // Shadow offset
        shadowOpacity: 0.2,       // Shadow opacity
        elevation: 2,             // Elevation for Android
        borderBottomWidth: 1,     // Border bottom width
        borderBottomColor: '#ddd' // Border color
    },
    title: {
        fontSize: 20, // Font size of the title
        color: '#000', // Color of the title
      }
});
