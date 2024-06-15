// ChatScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import Constants from 'expo-constants';
import { Dialogflow_V2 } from 'react-native-dialogflow';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const { extra } = Constants.expoConfig || {};

    console.log('DIALOGFLOW_CLIENT_EMAIL:',extra?.DIALOGFLOW_CLIENT_EMAIL);
    console.log('DIALOGFLOW_PRIVATE_KEY:',extra?.DIALOGFLOW_PRIVATE_KEY);
    console.log('DIALOGFLOW_PROJECT_ID:',extra?.DIALOGFLOW_PROJECT_ID);

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

    if (extra?.DIALOGFLOW_CLIENT_EMAIL && extra?.DIALOGFLOW_PRIVATE_KEY && extra?.DIALOGFLOW_PROJECT_ID) {
      // Initialize Dialogflow
      Dialogflow_V2.setConfiguration(
        extra.DIALOGFLOW_CLIENT_EMAIL,
        extra.DIALOGFLOW_PRIVATE_KEY,  // Replace escaped newlines
        Dialogflow_V2.LANG_ENGLISH,
        extra.DIALOGFLOW_PROJECT_ID,
        'dialogflow.googleapis.com'
      );
    } else {
      console.error('One or more Dialogflow environment variables are missing.');
    }
  }, []);

  const onSend = (newMessages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));

    let message = newMessages[0].text;

    console.log('Sending message to Dialogflow:', message); // Log the message being sent

    Dialogflow_V2.requestQuery(
      message,
      result => {
        console.log('Dialogflow response:', result); // Log the response from Dialogflow
        if (result.queryResult) {
          handleDialogflowResponse(result);
        } else {
          console.error('No queryResult in Dialogflow response');
        }
      },
      error => {
        console.error('Dialogflow error:', error); // Log any error from Dialogflow
      }
    );
  };

  const handleDialogflowResponse = (result) => {
    let text = result.queryResult.fulfillmentText;
    sendBotResponse(text);
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
        onSend={messages => onSend(messages)}
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
