import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Guest() {
    return (
        <View>
            <TouchableOpacity> 
                <Text style={styles.guest}> Log in as Guest </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    guest: {
        textDecorationLine: 'underline',
        marginTop: 50,
    }

})