import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import NewReminder from '../screens/newReminder';
import { DarkModeContext } from '../DarkModeContext';

jest.mock('react-native-really-awesome-button', () => ({
    ThemedButton: jest.fn(() => null),
  }));

jest.mock('@react-native-async-storage/async-storage', () => ({
AsyncStorage: jest.fn(() => null),
}));

// Mock expo-notifications
jest.mock('expo-notifications', () => {
  return {
    setNotificationHandler: jest.fn(),
    getPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
    requestPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
    getExpoPushTokenAsync: jest.fn(async () => ({ data: 'ExpoPushToken[xxxxxxxxxxxxxxxxxxxxxx]' })),
    scheduleNotificationAsync: jest.fn(async () => ({})),
    addNotificationReceivedListener: jest.fn(),
    addNotificationResponseReceivedListener: jest.fn(),
    removeNotificationSubscription: jest.fn(),
  };
});

// Mock expo-device
jest.mock('expo-device', () => {
  return {
    isDevice: true,
  };
});

// Mock expo-constants
jest.mock('expo-constants', () => {
  return {
    __esModule: true,
    default: {
      expoConfig: {
        extra: {
          eas: {
            projectId: 'your-project-id'
          }
        }
      },
      easConfig: {
        projectId: 'your-project-id'
      }
    }
  };
});

describe('NewReminder Input Fields Stress Test', () => {
  const mockNavigation = { pop: jest.fn(), setOptions: jest.fn() };
  const mockRoute = { params: { moduleCode: 'CS1010' } };

  beforeAll(() => {
    global.alert = jest.fn(); // Add this line to mock alert globally
  });

  // Reset mocks after each test to clean up
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle long text input for title and description', async () => {
    const { getByPlaceholderText } = render(
    <DarkModeContext.Provider value={{ darkMode: false }}>
        <NewReminder navigation={mockNavigation} route={mockRoute} />
    </DarkModeContext.Provider>
);
    
    const titleInput = getByPlaceholderText('Reminder Title');
    const descriptionInput = getByPlaceholderText('Description');

    const longText = 'A'.repeat(5000);

    await act(async () => {
      fireEvent.changeText(titleInput, longText);
      fireEvent.changeText(descriptionInput, longText);
    });

    expect(titleInput.props.value).toBe(longText);
    expect(descriptionInput.props.value).toBe(longText);
  });

  it('should handle special characters in input fields', async () => {
    const { getByTestId } = render(
        <DarkModeContext.Provider value={{ darkMode: false }}>
            <NewReminder navigation={mockNavigation} route={mockRoute} />
        </DarkModeContext.Provider>);

    const titleInput = getByTestId('titleInput');
    const descriptionInput = getByTestId('descriptionInput');

    const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    await act(async () => {
      fireEvent.changeText(titleInput, specialChars);
      fireEvent.changeText(descriptionInput, specialChars);
    });

    expect(titleInput.props.value).toBe(specialChars);
    expect(descriptionInput.props.value).toBe(specialChars);
  });

  it('should handle rapid text input changes', async () => {
    const { getByTestId } = render(
        <DarkModeContext.Provider value={{ darkMode: false }}>
            <NewReminder navigation={mockNavigation} route={mockRoute} />
        </DarkModeContext.Provider>
    );

    const titleInput = getByTestId('titleInput');
    const descriptionInput = getByTestId('descriptionInput');

    const rapidTexts = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];

    await act(async () => {
      rapidTexts.forEach(text => {
        fireEvent.changeText(titleInput, text);
        fireEvent.changeText(descriptionInput, text);
      });
    });

    expect(titleInput.props.value).toBe(rapidTexts[rapidTexts.length - 1]);
    expect(descriptionInput.props.value).toBe(rapidTexts[rapidTexts.length - 1]);
  });

  it('should handle input field clearing', async () => {
    const { getByTestId } = render(
        <DarkModeContext.Provider value={{ darkMode: false }}>
            <NewReminder navigation={mockNavigation} route={mockRoute} />
        </DarkModeContext.Provider>
    );

    const titleInput = getByTestId('titleInput');
    const descriptionInput = getByTestId('descriptionInput');

    await act(async () => {
      fireEvent.changeText(titleInput, 'Initial Text');
      fireEvent.changeText(descriptionInput, 'Initial Text');
      fireEvent.changeText(titleInput, '');
      fireEvent.changeText(descriptionInput, '');
    });

    expect(titleInput.props.value).toBe('');
    expect(descriptionInput.props.value).toBe('');
  });
});
