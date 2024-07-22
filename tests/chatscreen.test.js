// ChatScreen.test.js
import React from 'react';
import { render, waitFor, act, fireEvent } from '@testing-library/react-native';
import ChatScreen from '../screens/chatbot'; // Adjust the import based on your file structure
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkModeContext } from '../DarkModeContext';

// Mock axios
jest.mock('axios');

jest.mock('@react-native-async-storage/async-storage', () => ({
  AsyncStorage: jest.fn(() => null),
}));

// Mock GiftedChat
jest.mock('react-native-gifted-chat', () => {
  const { View, Text, Button } = require('react-native');
  const GiftedChat = jest.fn(({ onSend, messages }) => (
    <View>
      {messages.map((message, index) => (
        <Text key={index}>{message.text}</Text>
      ))}
      <Button
        title="Send"
        onPress={() => onSend([{ _id: 1, text: 'Hello', createdAt: new Date(), user: { _id: 1 } }])}
      />
    </View>
  ));

  GiftedChat.append = jest.fn((previousMessages, newMessages) => {
    return [...previousMessages, ...newMessages];
  });

  return {
    GiftedChat,
    Bubble: ({ children }) => children,
  };
});

describe('ChatScreen', () => {
  it('should send a message and receive a non-empty response', async () => {
    // Mock the axios post response
    axios.post.mockResolvedValueOnce({
      data: [{ text: 'This is a test response from the bot' }],
    });

    const { getByText, getByRole, findByText } = render(
      <DarkModeContext.Provider value={{ darkMode: false }}>
        <ChatScreen navigation={{ navigate: jest.fn() }} />
      </DarkModeContext.Provider>
  );

    // Initial bot message
    expect(findByText('Hi! I am the NextClass assistant bot.')).toBeTruthy();

    // Simulate sending a message by pressing the mocked Send button
    await (async () => {
      const sendButton = getByRole('button', { name: /Send/i });
      fireEvent.press(sendButton);

      // Wait for the bot's response to appear
      await waitFor(() => {
        expect(getByText('This is a test response from the bot')).toBeTruthy();
      });
    });
  });
});
