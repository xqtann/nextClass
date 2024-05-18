import React, {useState, useEffect, useRef} from 'react';
import { Text, View, StyleSheet, Button, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import MapView, { UrlTile, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import SelectDropdown from 'react-native-select-dropdown'

export default function Map({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef();
  const venues = require('../assets/venues.json');
  const [origin, setOrigin] = useState("");
  const [dest, setDest] = useState("");

  const INITIAL_CAMERA = {
    center: {
      latitude: 1.2968034900222334,
      longitude: 103.77634025228224,
    },
    pitch: 30,
    altitude: 2000,
  }

  let data = [];
  Object.keys(venues).filter(venue => venues[venue].location != undefined)
                    .sort()
                    .map(venue => data.push({venue: venue}));

  // console.log(data);

  // const lt17 = {
  //   latitude: 1.2936062312700383,
  //   longitude: 103.77401107931558
  // }

  // const as7 = {
  //   latitude: 1.2946298656111013,
  //   longitude: 103.7710383009886
  // }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

    let text = 'Waiting..';
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = JSON.stringify(location);
    };

    console.log(location);

    const goHandler = () => {
      
    }
  
    return (
      <View style={styles.container}>
        <MapView 
          style={styles.map}
          initialCamera={INITIAL_CAMERA}
          showsUserLocation={true}
          showsBuildings={true}
          showsMyLocationButton={true}
          scrollEnabled={true}
          zoomEnabled={true}
          pitchEnabled={true}
          rotateEnabled={true}
          loadingEnabled={true}
          cameraZoomRange={{
            minCenterCoordinateDistance: 500,
            maxCenterCoordinateDistance: 15000,
            animated: true,
          }}
          ref={mapRef}
          >
            <UrlTile
            urlTemplate='http://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
            maximumZ={1900}
            flipY={false}
            offlineMode={true}
            />

          {/* all venue markers */}
          {/* {
          Object.keys(venues).map((venue,index) => (
            venues[venue].location != undefined ? 
            <Marker coordinate={{latitude: venues[venue].location.y, longitude: venues[venue].location.x}} />
            : <Marker />
          ))
          } */}
          
          {origin != '' ? <Marker coordinate={{latitude: venues[origin].location.y, longitude: venues[origin].location.x}}/> : <Marker />}
          {dest != '' ? <Marker coordinate={{latitude: venues[dest].location.y, longitude: venues[dest].location.x}}/> : <Marker />}
          {(origin != '' && dest != '') ? <MapViewDirections
            origin={{latitude: venues[origin].location.y, longitude: venues[origin].location.x}}
            destination={{latitude: venues[dest].location.y, longitude: venues[dest].location.x}}
            apikey='AIzaSyB2q70gqjArHkUR9DqiRZTHHdDarrktG5Q'
            strokeColor='red'
            strokeWidth={4}
            mode='WALKING'
          /> : <Marker />}

          </MapView>
          <View style={styles.overlayContainer}>
              <SelectDropdown
              data={data}
              search={true}
              onSelect={(selectedItem, index) => {
                setOrigin(selectedItem.venue);
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={styles.dropdownButtonStyle}>
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {(selectedItem && selectedItem.venue) || 'Origin'}
                    </Text>
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                    <Text style={styles.dropdownItemTxtStyle}>{item.venue}</Text>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={styles.dropdownMenuStyle}
            />
            <TouchableOpacity style={styles.goButton} onPress={goHandler}>
              <Text style={styles.goText}>GO</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.overlayContainerDest}>
              <SelectDropdown
              data={data}
              search={true}
              onSelect={(selectedItem, index) => {
                setDest(selectedItem.venue);
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={styles.dropdownButtonStyle}>
                    <Text style={styles.dropdownButtonTxtStyle}>
                      {(selectedItem && selectedItem.venue) || 'Destination'}
                    </Text>
                  </View>
                );
              }}
              renderItem={(item, index, isSelected) => {
                return (
                  <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                    <Text style={styles.dropdownItemTxtStyle}>{item.venue}</Text>
                  </View>
                );
              }}
              showsVerticalScrollIndicator={false}
              dropdownStyle={styles.dropdownMenuStyle}
            />
            
            
          </View>
      </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    text: {
        fontSize: 20,
        margin: 10
    },
    map: {
      borderRadius: 25,
      marginTop: 10,
      borderColor: "black",
      borderWidth: 1,
      width: '95%',
      height: '95%'
    },
    overlayContainer: {
      flex: 1,
      position: 'absolute',
      top: '3%',
      height: ScreenHeight * 0.15,
      width: ScreenWidth * 0.85,
      flexDirection: "row"
    },
    overlayContainerDest: {
      flex: 1,
      position: 'absolute',
      top: '12%',
      height: ScreenHeight * 0.15,
      width: ScreenWidth * 0.85,
      flexDirection: "row"
    },
    textInputBox: {
      height: 45,
      width: '100%',
      backgroundColor: "white",
      borderRadius: 15,
      padding: 10,
      marginTop: 10,
      borderColor: "black",
      borderWidth: 1
    },
    dropdown: {
      flex: 1,
      backgroundColor: "gray",
      zIndex: 10,
      position: "absolute",
      height: 300,
      width: ScreenWidth * 0.6,
      top: '45%',
      borderRadius: 10
    },
    dropdownButtonStyle: {
      width: ScreenWidth * 0.6,
      height: 50,
      backgroundColor: '#E9ECEF',
      borderRadius: 12,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 12,
      borderColor: "black",
      borderWidth: 1
    },
    dropdownButtonTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      color: '#151E26',
    },
    dropdownButtonArrowStyle: {
      fontSize: 28,
    },
    dropdownButtonIconStyle: {
      fontSize: 28,
      marginRight: 8,
    },
    dropdownMenuStyle: {
      backgroundColor: '#E9ECEF',
      borderRadius: 8,
      borderColor: "black",
      borderWidth: 1
    },
    dropdownItemStyle: {
      width: '100%',
      flexDirection: 'row',
      paddingHorizontal: 12,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      color: '#151E26',
    },
    dropdownItemIconStyle: {
      fontSize: 28,
      marginRight: 8,
    },
    goButton: {
      width: 80,
      height: 80,
      top: '12%',
      backgroundColor: '#8bbc68',
      borderRadius: 25,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 12,
      borderColor: "black",
      borderWidth: 2,
      marginLeft: 20
    },
    goText: {
      fontSize: 40,
      fontFamily: 'System',
      fontWeight: "bold"
    }
})
