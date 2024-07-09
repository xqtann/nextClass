// ChatScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import axios from 'axios';

const ChatScreen = ( { navigation } ) => {
  const [messages, setMessages] = useState([]);
  const [currentQueryType, setCurrentQueryType] = useState(''); 
  const [currentQuery, setCurrentQuery] = useState('');

  const sendMessageToRasa = async (message) => {
    try {
      const response = await axios.post('https://social-lights-make.loca.lt/webhooks/rest/webhook', {
        sender: 'user',
        message: message
      });
  
      if (response.data && response.data.length) {
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
          avatar: require('../assets/robot-excited.png')
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

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        onPress={() => props.currentMessage.text.includes('Click on this message to navigate there.') ? 
          (setCurrentQueryType('navigate'),
           setCurrentQuery(`${props.currentMessage.text.split(' ')[6]}`), 
           console.log(props.currentMessage.text.split(' ')[6]), 
           navigation.navigate('Profile', {screen: 'Map', params: {destVenue: props.currentMessage.text.split(' ')[6] }})) : null}
      />
    );
  };

  const sendBotResponse = (text) => {
    let msg = {
      _id: messages.length + 1,
      text,
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'Bot',
        avatar: require('../assets/robot-excited.png')
      },
    };

    setMessages(previousMessages => GiftedChat.append(previousMessages, [msg]));
  };

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={message => onSend(message)}
        renderBubble={renderBubble}
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
