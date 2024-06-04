import React, {useState, useEffect, useRef, useMemo } from 'react';
import { Text, View, StyleSheet, Button, TextInput, ScrollView, TouchableOpacity, Modal, Alert, Image, TouchableWithoutFeedback } from 'react-native';
import MapView, { UrlTile, Marker, Polyline, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import SelectDropdown from 'react-native-select-dropdown';
import GHUtil from '../utils/GHUtil';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import { AntDesign } from '@expo/vector-icons';
import { ThemedButton } from "react-native-really-awesome-button";
import { FontAwesome5, Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RadioGroup from 'react-native-radio-buttons-group';



export default function Map({ navigation, route }) {
  const { destVenue } = route.params;
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef();
  const venues = require('../assets/venues.json');
  const [origin, setOrigin] = useState("");
  console.log(destVenue)
  const [dest, setDest] = useState(!destVenue.startsWith("E-Learn") && Object.keys(venues).includes(destVenue) ? destVenue : "");
  useEffect(() => {
    setDest(!destVenue.startsWith("E-Learn") && Object.keys(venues).includes(destVenue) ? destVenue : "");
  }, [destVenue]);
  const [mode, setMode] = useState('1');
  const [polylinesLoaded, setPolylinesLoaded] = useState(false);
  const [polylinesD, setPolylinesD] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [instructions, setInstructions] = useState([]);
  const [tempLat, setTempLat] = useState(0);
  const [tempLong, setTempLong] = useState(0);
  const [goPressed, setGoPressed] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [totalDist, setTotalDist] = useState(0);
  const [openDirection, setOpenDirection] = useState(false);
  let firstHeading = firstHeading == 0 ? 0 : firstHeading;
  let polylines =[];


  // INITIAL_CAMERA position at NUS
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

  // console.log(Object.keys(venues));

  // const lt17 = {
  //   latitude: 1.2936062312700383,
  //   longitude: 103.77401107931558
  // }

  // const as6 = {
  //   latitude: 1.295361335555679,
  //   longitude: 103.77326160572798
  // }

  const radioButtons = useMemo(() => ([
    {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'Foot',
        value: 'footMode',
        size: 18,
        labelStyle: { fontSize: 18, color: 'black' },
    },
    {
        id: '2',
        label: 'Car',
        value: 'carMode',
        size: 18,
        labelStyle: { fontSize: 18, color: 'black' },
    }
]), []);
  
  useEffect(() => {
    const fetchData = async () => {
      const query = new URLSearchParams({
        key: 'c82f39fb-375e-4d61-b0cc-9f9dd9a8b142'
      }).toString();
      
      const resp = await fetch(
        `https://graphhopper.com/api/1/route?${query}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            profile: mode == 1 ? 'foot' : 'car',
            points: [
              [venues[origin].location.x, venues[origin].location.y],
              [venues[dest].location.x, venues[dest].location.y]
            ],
            snap_preventions: [
              'motorway',
              'ferry',
              'tunnel'
            ],
            details: ['road_class', 'surface', 'country'],
            debug: true,
            instructions: true,
            calc_points: true
          })
        });
  
      const GHdata = await resp.json();
      // console.log(GHdata.paths);
      await setInstructions(GHdata.paths[0].instructions);
      firstHeading = await GHdata.paths[0].instructions[0].heading;
      setTotalTime(GHdata.paths[0].time);
      setTotalDist(GHdata.paths[0].distance);

      const polylinesDecoded = GHUtil.prototype.decodePath(GHdata.paths[0].points);
      setPolylinesLoaded(polylinesDecoded.length > 0);
      setPolylinesD(polylinesDecoded);
    };
    if (venues[origin] != undefined && venues[dest] != undefined) {
      fetchData();
    }
  // console.log(polylines);
  }, [origin, dest]);

  if (polylinesLoaded) {
    for (let i = 0; i < polylinesD.length; i++) {
      polylines[i] = ({latitude: polylinesD[i][1], longitude: polylinesD[i][0]});
    }
  }

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

    // console.log(location);

    const goHandler = () => {
      origin != '' && dest != '' 
      ? mapRef.current.animateCamera({
        center: {latitude: venues[origin].location.y, longitude: venues[origin].location.x },
      heading: firstHeading, altitude: 200 }, {duration: 2000}) 
      : Alert.alert(`Please select both\n origin and destination`);
      setOpenDirection(true);
      setGoPressed(true);
    }

    const optionHandler = () => {
      console.log("Options clicked");
      setOpenModal(true);
    };

    const renderModal = () => {
      return (
        <Modal
        visible={openModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setOpenModal(false)}
        >
        <TouchableWithoutFeedback onPress={() => setOpenModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setOpenModal(false)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>Options</Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 18, marginVertical: 5}}>Mode: </Text>
            <RadioGroup 
            layout='row'
            radioButtons={radioButtons} 
            onPress={setMode}
            selectedId={mode}
        />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
      </Modal>
      )
    };

  
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
            minCenterCoordinateDistance: 300,
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
          {tempLat != 0 && tempLong != 0 ? <Marker 
          coordinate={{latitude: tempLat, longitude: tempLong}} 
          pinColor='gray'>
            <Image 
                source={require('../assets/map-marker-account-outline.png')} 
                style={{width: 30, height: 30, top: -15, tintColor: 'gray'}} />
          </Marker> : <Marker />}

          {origin != '' ? 
          <Marker 
          coordinate={{latitude: venues[origin].location.y, longitude: venues[origin].location.x}} 
          pinColor='#006ca5'>
            <Callout>
              <View>
              <Text>{origin}</Text>
              </View>
              </Callout>
          </Marker> : <Marker />}
          {dest != '' ? 
          <Marker 
          coordinate={{latitude: venues[dest].location.y, longitude: venues[dest].location.x}}
          pinColor='#9b111e'>
            <Callout>
              <View>
              <Text>{dest}</Text>
              </View>
              </Callout>
          </Marker> : <Marker />}
          {polylinesLoaded && polylines.length > 0 && goPressed ? <Polyline 
          coordinates={polylines} 
          strokeWidth={4} 
          strokeColor='#8F0000' /> : console.log("polylines not loaded")}
          </MapView>
          <View style={styles.overlayContainer}>
              <SelectDropdown
              data={data}
              search={true}
              disableAutoScroll={true}
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
             <ThemedButton
                name="rick"
                type="secondary"
                style={styles.goButton}
                height={45}
                width={80}
                raiseLevel={2}
                progress
                onPress={async (next) => {
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                  next();
                  goHandler();
                }}
              >
                GO
              </ThemedButton>
          </View>
          <View style={styles.overlayContainerDest}>
              <SelectDropdown
              data={data}
              search={true}
              disableAutoScroll={true}
              onSelect={(selectedItem, index) => {
                setDest(selectedItem.venue);
              }}
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View style={styles.dropdownButtonStyle}>
                    {dest == "" 
                    ? <Text style={styles.dropdownButtonDestTxtStyle}>
                      {(selectedItem && selectedItem.venue) || 'Destination'}
                    </Text> 
                    : <Text style={styles.dropdownButtonDestTxtStyle}>{dest}</Text>
                    }
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
            <ThemedButton
                name="rick"
                type="secondary"
                style={styles.optionButton}
                backgroundColor='#9AA0A6'
                borderColor='#d2d2d2'
                height={45}
                width={80}
                raiseLevel={0}
                textColor='black'
                textSize={12}
                paddingHorizontal={10}
                onPress={optionHandler}
              >
                OPTIONS
              </ThemedButton>
            {renderModal()}
          </View>
          {openDirection ?
          <View style={styles.carouselContainer}>
          <Carousel
                loop={false}
                width={ScreenWidth * 0.9}
                height={ScreenHeight * 0.2}
                data={instructions}
                scrollAnimationDuration={1000}
                withAnimation={{
                  type: "spring",
                  config: {
                    damping: 13,
                  },
                }}
                onSnapToItem={(index) => {mapRef.current.animateCamera({
                  center: {latitude: polylines[instructions[index].interval[0]].latitude, longitude: polylines[instructions[index].interval[0]].longitude },
                  heading: instructions[index].heading}, {duration: 500}); 
                  console.log("current coord", instructions[index].interval[0]);
                  setTempLat(polylines[instructions[index].interval[0]].latitude);
                  setTempLong(polylines[instructions[index].interval[0]].longitude);
                }}
                renderItem={({ index }) => (
                    <View style={styles.carouselItem}>
                      <TouchableOpacity onPress={() => setOpenDirection(false)} style={styles.closeButton}>
                          <Text style={styles.closeButtonText}>X</Text></TouchableOpacity>
                      <View style={styles.instructionContainer}>
                        { instructions[index].sign == 0 || instructions[index].sign == 7 || instructions[index].sign == -7 ?
                        <FontAwesome5 name="arrow-up" size={60} style={styles.directionSign} color="black" />
                        : instructions[index].sign == 1 ?
                        <Feather name="arrow-up-right" size={60} style={styles.directionSign} color="black" />
                        : instructions[index].sign == 2 || instructions[index].sign == 3 ?
                        <FontAwesome5 name="arrow-right" size={60} style={styles.directionSign} color="black" />
                        : instructions[index].sign == -1 ?
                        <Feather name="arrow-up-left" size={60} style={styles.directionSign} color="black" />
                        : instructions[index].sign == -2 || instructions[index].sign == -3 ?
                        <FontAwesome5 name="arrow-left" size={60} style={styles.directionSign} color="black" />
                        : instructions[index].sign == 4 ?
                        <MaterialCommunityIcons name="map-marker-check" size={60} style={styles.directionSign} color="black" />
                        : <FontAwesome5 name="arrow-up" size={60} style={styles.directionSign} color="black" />
                        }
                      <Text style={styles.distance}>{`${Math.trunc(instructions[index].distance)} m`}</Text>

                      </View>
                    
                    <View style={styles.instructionContainer}>
                        <Text style={styles.title}>{instructions[index].text}</Text>
                        {index == 0 ?
                        <Text style={styles.extraInstruction}>
                           {`Total Distance: ${Math.trunc(totalDist)} m\nTotal Time: ${Math.trunc(totalTime/60000)} min\n`
                      }
                        </Text> : <Text></Text>}
                        
                    </View> 
                        <Text style={styles.subtitle}>SWIPE FOR NEXT STEP</Text>
                        <AntDesign name="doubleright" style={styles.arrow} size={15} color="black" />  
                    </View>
                )}
            />
          </View>
          : <View></View>}
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
      borderRadius: 15,
      width: '100%',
      height: '100%'
    },
    overlayContainer: {
      flex: 1,
      position: 'absolute',
      top: '1%',
      left: '8%',
      height: ScreenHeight * 0.15,
      width: ScreenWidth * 0.6,
      flexDirection: "row"
    },
    overlayContainerDest: {
      flex: 1,
      position: 'absolute',
      top: '9%',
      left: '8%',
      height: ScreenHeight * 0.15,
      width: ScreenWidth * 0.6,
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
      height: 45,
      backgroundColor: 'white',
      borderRadius: 50,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      color: '#23395d',
    },
    dropdownButtonDestTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      color: '#6f0000',
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
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 12,
      marginLeft: 20,
      zIndex: 20
    },
    optionButton: {
      width: 80,
      height: 45,
      backgroundColor: '#9AA0A6',
      borderRadius: 25,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 1,
      marginLeft: 20,
      zIndex: 20
    },
    goText: {
      fontSize: 30,
      fontFamily: 'System',
      fontWeight: "bold",
    },
    optionText: {
      fontSize: 15,
      fontFamily: 'System',
      fontWeight: "bold",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '80%',
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      alignItems: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: '#ff5c5c', // Red close button
      borderRadius: 20,
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
  },
  closeButtonText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
  },
    buttonGroup: {
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    carouselContainer: {
      top: '70%', 
      position:'absolute',
      height: ScreenHeight * 0.25,
      width: ScreenWidth,
      justifyContent: 'center',
      alignItems: 'center',
    },
    carouselItem: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      padding: 20,
      backgroundColor:'#f0f0f0', 
      borderColor:'gray',
      borderWidth: 2,
      borderRadius: 20,
    },
    directionSign: {
      margin: 10,
    },
    title: {
      textAlign: 'center',
      width: 200,
      fontSize: 30,
      fontWeight: 'bold',
      fontFamily: 'System',
    },
    distance: {
      textAlign: 'center',
      fontSize: 30,
      fontWeight: 'bold',
      fontFamily: 'System'
    },
    instructionContainer: {
      marginRight: 20,
      justifyContent: 'center',
    },
    subtitle: {
      position: 'absolute',
      bottom: 5,
      right: 25,
      textAlign: 'right',
      fontSize: 15,
      fontStyle: 'italic',
      fontFamily: 'System'
    },
    arrow: {
      position: 'absolute',
      bottom: 5,
      right: 5,
    },
    extraInstruction: {
      fontSize: 20,
      fontFamily: 'System',
      textAlign: 'center',
      width: 200,
    }
})
