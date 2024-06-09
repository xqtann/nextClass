import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const TeleChannels = () => {
    const [messages, setMessages] = useState({});

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.post('https://your-backend-url/messages', {
                    channels: ['NUS ConfessIt 📣'] // Replace with your actual channel usernames
                });
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, []);

    return (
        <View style={styles.container}>
            {Object.keys(messages).map(channel => (
                <View key={channel} style={styles.channelContainer}>
                    <Text style={styles.channelName}>{channel}</Text>
                    <FlatList
                        data={messages[channel]}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => <Text style={styles.message}>{item}</Text>}
                    />
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    channelContainer: {
        marginBottom: 20,
        width: '100%',
    },
    channelName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default TeleChannels;
