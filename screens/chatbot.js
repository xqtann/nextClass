// ChatScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Composer } from 'react-native-gifted-chat';
import axios from 'axios';
import { DarkModeContext } from '../DarkModeContext';

const ChatScreen = ( { navigation } ) => {
  const [messages, setMessages] = useState([]);
  const [currentQueryType, setCurrentQueryType] = useState(''); 
  const [currentQuery, setCurrentQuery] = useState('');
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext); 

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
      return 'Sorry, I am unable to process your request at the moment. Please try again later.';
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
        {...props}
        textStyle={{
          left: {
            color: darkMode ? '#ffffff' : '#000000',
          },
          right: {
            color: darkMode ? '#000000' : '#ffffff',
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: darkMode ? '#4a4a4a' : '#f0f0f0',
          },
          right: {
            backgroundColor: darkMode ? '#a1a1a1' : '#007aff',
          },
        }}
        onPress={() => props.currentMessage.text.includes('Click on this message to navigate there.') ? 
          (setCurrentQueryType('navigate'),
           setCurrentQuery(`${props.currentMessage.text.split(' ')[6]}`), 
           console.log(props.currentMessage.text.split(' ')[6]), 
           navigation.navigate('Profile', {screen: 'Map', params: {destVenue: props.currentMessage.text.split(' ')[6] }})) : null}
      />
    );
  };

  const customtInputToolbar = props => {
    return (
      <InputToolbar
        {...props}
        containerStyle={darkMode ? {
          backgroundColor: "#282828",
          borderTopColor: "#121212",
          borderTopWidth: 1,
          padding: 1,
          borderRadius: 8
        } : {
          borderTopColor: 'white',
          borderTopWidth: 1,
          padding: 2,
          borderRadius: 8
        }}
        renderComposer={(composerProps) => customComposer(composerProps)}
      />
    );
  };

  const customComposer = props => {
    return (
      <Composer
        {...props}
        textInputStyle={{
          color: darkMode ? '#e0e0e0' : '#000000',
        }}
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
    <View style={darkMode ? stylesDark.container : styles.container}>
      <GiftedChat
        messages={messages}
        onSend={message => onSend(message)}
        renderBubble={renderBubble}
        user={{ _id: 1 }}
        renderInputToolbar={props => customtInputToolbar(props)}
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

const stylesDark = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#192734',
  },
});

export default ChatScreen;
