// ChatScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import Constants from 'expo-constants';
import { Dialogflow_V2 } from 'react-native-dialogflow';
import axios from 'axios';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);

  const sendMessageToRasa = async (message) => {
    try {
      const response = await axios.post('https://e640-219-74-78-251.ngrok-free.app/webhooks/rest/webhook', {
        sender: 'user',
        message: message
      });
  
      if (response.data && response.data.length) {
        // The response from Rasa server is an array of messages
        // You can customize the response as per your needs
        console.log(response.data[0].text);
        return response.data[0].text;
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  // sendMessageToRasa('Hello');

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hi! How can I help you?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Bot',
        },
      },
    ]);
  }, []);

  const onSend = async (newMessage) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessage));
  
    console.log('Sending message to Rasa:', newMessage[0].text); // Log the message being sent
    const responseText = await sendMessageToRasa(newMessage[0].text);
    sendBotResponse(responseText);
  };

  const sendBotResponse = (text) => {
    let msg = {
      _id: messages.length + 1,
      text,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Bot',
      },
    };

    setMessages(previousMessages => GiftedChat.append(previousMessages, [msg]));
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={message => onSend(message)}
        user={{ _id: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default ChatScreen;
