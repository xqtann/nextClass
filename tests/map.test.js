import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Map from '../screens/map';
import { DarkModeContext } from '../DarkModeContext';
import SelectDropdown from 'react-native-select-dropdown';
import MapView from 'react-native-maps';

// Mock the SelectDropdown component
jest.mock('react-native-select-dropdown', () => {
  return jest.fn(({data, onSelect, testID, parentProp}) => (
    <mock-select-dropdown testID={testID} onSelect={onSelect}>
      {data.map((item, index) => (
        <mock-item key={index} testID={`${testID}-${index}`} onPress={() => onSelect(item, index)}>
          {item.venue}
        </mock-item>
      ))}
    </mock-select-dropdown>
  ));
});

// Mock expo-location directly in the test file
jest.mock('expo-location', () => ({
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({
    coords: {
      latitude: 1.2968034900222334,
      longitude: 103.77634025228224,
    },
  })),
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
}));

jest.mock('@expo/vector-icons', () => ({
    AntDesign: jest.fn()
}));

jest.mock('react-native-really-awesome-button', () => ({ 
    ThemedButton: jest.fn(({ onPress, children, testID }) => (
      <button onPress={onPress} testID={testID}>{children}</button>
    )),
  }));

jest.mock('@react-native-async-storage/async-storage', () => ({
    AsyncStorage: jest.fn(() => null),
}));

describe('Map Screen Tests', () => {
    const route = {
        params: {
          destVenue: '',
        },
      };
      const navigation = {
        navigate: jest.fn(),
      };
  it('loads loading indicator', () => {
    const { getByText, getByTestId } = render(
        <DarkModeContext.Provider value={{ darkMode: false }}>
            <Map navigation={navigation} route={route} />
        </DarkModeContext.Provider>
);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders map after loaded', async () => {
    const { getByTestId, queryByTestId } = render(
      <DarkModeContext.Provider value={{ darkMode: false }}>
        <Map navigation={navigation} route={route} />
      </DarkModeContext.Provider>
    ); 
    const mapView = getByTestId('map-view');
    fireEvent(mapView, 'onMapReady');

    await waitFor(() => {
        expect(queryByTestId('loading-indicator')).toBeNull();
      }, { timeout: 5000 });
  
    expect(getByTestId('map-view')).toBeTruthy();
  });

  it('should animate camera when origin and destination set, Go button pressed', async () => {
    const logSpy = jest.spyOn(console, 'log');
    const { getByTestId, getByText } = render(
        <DarkModeContext.Provider value={{ darkMode: false }}>
          <Map navigation={navigation} route={route} />
        </DarkModeContext.Provider>
      ); 

    const originDropdown = getByTestId('origin-dropdown');
    const destinationDropdown = getByTestId('dest-dropdown');
    const goButton = getByTestId('go-button');

    fireEvent.press(originDropdown);
    fireEvent.press(getByTestId('origin-dropdown-5'));
    fireEvent.press(destinationDropdown);
    fireEvent.press(getByTestId('dest-dropdown-55'));
    fireEvent.press(goButton);
    
    const mapView = getByTestId('map-view');
    fireEvent(mapView, 'onMapReady');

    await (async () => {
        await waitFor(() => {
          expect(logSpy).toHaveBeenCalledWith('Go button pressed');
        });
      });
  });
});