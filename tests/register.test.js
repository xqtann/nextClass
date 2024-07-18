import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import Register from '../screens/register'; 
import { FirebaseConfig } from '../FirebaseConfig'; // Adjust the import path as necessary
import { DarkModeContext } from '../DarkModeContext'; // Adjust the import path as necessary

// Mock Firebase services and navigation
jest.mock('../FirebaseConfig', () => ({
    FIREBASE_AUTH: {
        signOut: jest.fn().mockResolvedValue(() => Promise.resolve()),
      },
  FIRESTORE_DB: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
    createUserWithEmailAndPassword: jest.fn(),
    updateProfile: jest.fn(),
    getAuth: jest.fn(() => ({ currentUser: { uid: 'testUid' } })),
  }));

jest.mock('firebase/firestore', () => ({
  setDoc: jest.fn(),
  doc: jest.fn(),
  addDoc: jest.fn(),
  collection: jest.fn(),
}));

jest.mock('react-native-really-awesome-button', () => ({
    ThemedButton: jest.fn(({ testID, onPress, children }) => (
      <button testID={testID} onPress={onPress}>
        {children}
      </button>
    )),
  }));

jest.mock('@react-native-async-storage/async-storage', () => ({
    AsyncStorage: jest.fn(() => null),
}));

describe('Register Component', () => {
    beforeEach(() => {
        window.alert = jest.fn();
        jest.clearAllMocks();
      });
    
      afterEach(() => {
        window.alert.mockRestore();
      });
  it('renders correctly', () => {
    const { getByTestId } = render(
      <DarkModeContext.Provider value={{darkMode: false}}>
        <Register navigation={{ navigate: jest.fn() }} />
      </DarkModeContext.Provider>
    );

    expect(getByTestId('emailInput')).toBeTruthy();
    expect(getByTestId('usernameInput')).toBeTruthy();
    expect(getByTestId('passwordInput')).toBeTruthy();
  });

  it('should handle user inputs correctly', async () => {
    const logSpy = jest.spyOn(console, 'log');
    const { getByTestId, queryByText } = render(
      <DarkModeContext.Provider value={{darkMode: false}}>
        <Register navigation={{ navigate: jest.fn() }} />
      </DarkModeContext.Provider>
    );

    const usernameInput = getByTestId('usernameInput');
    const emailInput = getByTestId('emailInput');
    const passwordInput = getByTestId('passwordInput');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(usernameInput.props.value).toBe('testuser');
    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('should handle sign up process', async () => {
    const mockNavigation = { navigate: jest.fn(), goBack: jest.fn(() => {}) };
    const mockCreateUser = require('firebase/auth').createUserWithEmailAndPassword;
    const mockUpdateProfile = require('firebase/auth').updateProfile;
    const mockSetDoc = require('firebase/firestore').setDoc;

    mockCreateUser.mockResolvedValueOnce({ user: { uid: 'testUid' } });

    const { getByPlaceholderText, getByTestId } = render(
      <DarkModeContext.Provider value={{darkMode: false}}>
        <Register navigation={mockNavigation} />
      </DarkModeContext.Provider>
    );

    const usernameInput = getByTestId('usernameInput');
    const emailInput = getByTestId('emailInput');
    const passwordInput = getByTestId('passwordInput');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    fireEvent.press(getByTestId('RegisterButton'));

    await waitFor(() => expect(mockCreateUser).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'password123'));
    await waitFor(() => expect(mockSetDoc).toHaveBeenCalledWith(undefined, { uid: 'testUid', username: 'testuser', email: 'test@example.com' }));
    await waitFor(() => expect(mockUpdateProfile).toHaveBeenCalledWith(undefined, { displayName: 'testuser' }));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
});
  // Add more tests for different lengths and stress test as needed
});