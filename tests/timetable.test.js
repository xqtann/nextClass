// Timetable.test.js
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import Timetable from '../screens/timetable'; // Adjust the import based on your file structure
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { setDoc, getDoc, doc } from 'firebase/firestore';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkModeContext } from '../DarkModeContext';

// Mock necessary Firebase functions and modules
jest.mock('../FirebaseConfig', () => ({
  FIREBASE_AUTH: {},
  FIRESTORE_DB: {},
}));
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
}));
jest.mock('firebase/firestore', () => ({
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  doc: jest.fn(),
}));
jest.mock('axios');

// Mock expo-blur
jest.mock('expo-blur', () => ({
  BlurView: jest.fn(() => null),
}));

// Mock react-native-really-awesome-button
jest.mock('react-native-really-awesome-button', () => ({
  ThemedButton: jest.fn(() => null),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  AsyncStorage: jest.fn(() => null),
}));

describe('Timetable Component', () => {
  it('should render the initial loading state', async () => {
    const { getByTestId } = render(
      <DarkModeContext.Provider value={{ darkMode: false }}>
        <Timetable navigation={{ setOptions: jest.fn() }} />
      </DarkModeContext.Provider>
  );
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('should render timetable after loading', async () => {
    // Mock Firebase auth state change
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ uid: 'test-user-id' });
      return jest.fn(); // Mock the unsubscribe function
    });

    // Mock Firestore document retrieval
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        timetableData: [],
      }),
    });

    const { getByText } = render(
      <DarkModeContext.Provider value={{ darkMode: false }}>
        <Timetable navigation={{ setOptions: jest.fn() }} />
      </DarkModeContext.Provider>
  );

    await (async () => {
      await waitFor(() => {
        expect(getByText('Paste your NUSMods timetable link!')).toBeTruthy();
      });
    });
  });

  
});
