import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Alert, Dimensions, ImageBackground, TextInput, Text, Button, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import TimeTableView, { genTimeBlock } from 'react-native-timetable';
import { BlurView } from 'expo-blur';
import { ThemedButton } from "react-native-really-awesome-button";
import * as Yup from 'yup';
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig"; // import Firebase config
import { onAuthStateChanged } from 'firebase/auth';
import { setDoc, doc, getDoc, addDoc, collection } from 'firebase/firestore';

let actual_data = [];

const apiUrl = `https://api.nusmods.com/v2`;
const acadYear = '2023-2024';

const validationSchema = Yup.object().shape({
    timetableUrl: Yup.string()
        .matches(
            /^https:\/\/nusmods\.com\/timetable\/sem-\d(\/.*)?$/,
            'Invalid link, try again'
        )
});

export default function Timetable({ navigation }) {
    const [formUrl, setForm] = useState('');
    const [error, setError] = useState('');
    const [imported, setImported] = useState(false);
    const [openModal, setModal] = useState(false);
    const [currentEvt, setEvt] = useState(null);
    const [user, setUser] = useState(null); // State to store the current user

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            if (user) {
                setUser(user);
                loadData(user.uid);
            }
        });

        return () => unsubscribe();
    }, []);

    const loadData = async (uid) => {
        try {
            const docRef = doc(FIRESTORE_DB, "timetables", uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                actual_data = docSnap.data().timetableData;
                setImported(true);
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error('Error loading data from Firestore:', error);
        }
    };

    const optionHandler = async () => {
        setImported(false);
        actual_data = [];
        if (user) {
            await setDoc(doc(FIRESTORE_DB, "timetables", user.uid), {
                timetableData: actual_data,
            });
        }
    };

    const confirmImportNew = () => {
        Alert.alert(
            'Import new timetable',
            'Are you sure you want to remove the current timetable? Importing a new timetable will remove all your reminders!',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', style: 'destructive', onPress: optionHandler }
            ]
        );
    };

    const saveData = async () => {
        try {
            if (user) {
                await addDoc(collection(FIRESTORE_DB, "timetables"), {
                    timetableData: actual_data,
                    uid: user.uid,
                });
            }
        } catch (error) {
            console.error('Error saving data to Firestore:', error);
        }
    };

    useEffect(() => {
        if (imported) {
            navigation.setOptions({
                headerLeft: () => (
                    <TouchableOpacity
                        onPress={confirmImportNew}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Import New</Text>
                    </TouchableOpacity>
                ),
            });
        } else {
            navigation.setOptions({
                headerLeft: null,
            });
        }
    }, [imported]);

    const numOfDays = 5;
    const pivotDate = genTimeBlock('mon');

    const handleChange = (url) => {
        setForm(url);
    }

    const getData = (mod, sem) => {
        return fetch(`${apiUrl}/${acadYear}/modules/${mod}.json`)
            .then(res => res.json())
            .then(data => {
                const semesterData = data.semesterData;
                const finalData = semesterData.find(semester => semester.semester == sem);
                return finalData.timetable;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                throw error;
            });
    };

    const urlParser = async (url) => {
        url = url.slice(34);
        sem = url[0];
        mods = url.slice(8);
        modLst = mods.split('&');
        for (let i = 0; i < modLst.length; i++) {
            module = modLst[i].split('=');
            moduleCode = module[0];
            classDetails = module[1].split(',');
            try {
                const classData = await getData(moduleCode, sem);

                for (let j = 0; j < classDetails.length; j++) {
                    classLst = classDetails[j].split(':');
                    classType = classLst[0];
                    classNum = classLst[1];
                    if (classType == 'LAB') {
                        classType = 'Laboratory';
                    } else if (classType == 'LEC') {
                        classType = 'Lecture';
                    } else if (classType == 'TUT') {
                        classType = 'Tutorial';
                    } else if (classType == 'REC') {
                        classType = 'Recitation';
                    } else if (classType == 'WS') {
                        classType = 'Workshop';
                    } else if (classType == 'SEC') {
                        classType = 'Sectional Teaching';
                    }

                    classTiming = classData.find(x => x.lessonType == classType && x.classNo == classNum);

                    classDay = classTiming['day'];

                    if (classDay == 'Monday') {
                        classDay = 'MON';
                    } else if (classDay == 'Tuesday') {
                        classDay = 'TUE';
                    } else if (classDay == 'Wednesday') {
                        classDay = 'WED';
                    } else if (classDay == 'Thursday') {
                        classDay = 'THU';
                    } else if (classDay == 'Friday') {
                        classDay = 'FRI';
                    }

                    classStart = classTiming['startTime'];
                    classStartHour = classStart[0] == '0' ? classStart.slice(1, 2) : classStart.slice(0, 2);
                    classStartMin = classStart[2] == '0' ? classStart.slice(3) : classStart.slice(2);

                    classEnd = classTiming['endTime'];
                    classEndHour = classEnd[0] == '0' ? classEnd.slice(1, 2) : classEnd.slice(0, 2);
                    classEndMin = classEnd[2] == '0' ? classEnd.slice(3) : classEnd.slice(2);

                    classVenue = classTiming['venue'];

                    classWeeks = classTiming['weeks'];

                    if (classWeeks.length > 6) {
                        classWeeks = 'Weeks: ' + classWeeks[0] + '-' + classWeeks[classWeeks.length - 1];
                    } else {
                        finalString = 'Weeks: \n';
                        for (let k = 0; k < classWeeks.length; k++) {
                            finalString += classWeeks[k] + ' ';
                        }
                        classWeeks = finalString;
                    }

                    actual_data.push({
                        title: moduleCode,
                        startTime: genTimeBlock(classDay, classStartHour, classStartMin),
                        endTime: genTimeBlock(classDay, classEndHour, classEndMin),
                        location: classVenue,
                        extra_descriptions: [classType, '[' + classNum + ']', classWeeks],
                    })
                }

            } catch (error) {
                console.error(`Error fetching data for module ${moduleCode}:`, error);
            }
        }
        setImported(true);
        saveData();
    }

    const handleSubmit = () => {
        validationSchema
            .validate({ timetableUrl: formUrl })
            .then(() => {
                urlParser(formUrl);
                setForm('');
            })
            .catch((err) => {
                setError(err.message);
            });
        setForm('');
        setError('');
    }

    const renderModal = () => {
      if (!currentEvt) return null;
  
      start = new Date(currentEvt.startTime);
      startHour = start.getHours();
      startMin = start.getMinutes() == 0 ? '00' : start.getMinutes();
      end = new Date(currentEvt.endTime);
      endHour = end.getHours();
      endMin = (end.getMinutes() == 0) ? '00' : end.getMinutes();
  
      return (
          <Modal
              visible={openModal}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setModal(false)}
          >
              <TouchableWithoutFeedback onPress={() => setModal(false)}>
                  <View style={styles.modalOverlay}>
                      <TouchableWithoutFeedback onPress={() => {}}>
                          <View style={styles.modalContent}>
                              <TouchableOpacity style={styles.closeButton} onPress={() => setModal(false)}>
                                  <Text style={styles.closeButtonText}>X</Text>
                              </TouchableOpacity>
                              <Text>
                                  {`Module: ${currentEvt.title}\n
                                  ${currentEvt.extra_descriptions.join(" ")}\n
                                  Time: ${startHour}:${startMin} - ${endHour}:${endMin}\n
                                  Venue: ${currentEvt.location}\n`}
                              </Text>
                              <View style={styles.buttonGroup}>
                                  <Button title="Reminders" onPress={() => {
                                      navigation.navigate('Reminder', {
                                          moduleCode: currentEvt.title,
                                          screenTitle: currentEvt.title
                                      }); setModal(false)
                                  }} />
                                  <Button title="Get Route" onPress={() => { navigation.navigate('Map'); setModal(false) }} />
                              </View>
                          </View>
                      </TouchableWithoutFeedback>
                  </View>
              </TouchableWithoutFeedback>
          </Modal>
      )
  }
  
    const onEventPress = (evt) => {
        setEvt(evt);
        setModal(true);
    };

    return imported ? (
        <TouchableWithoutFeedback onPress={() => setModal(false)}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <TimeTableView
                        events={actual_data}
                        pivotTime={8}
                        pivotEndTime={19}
                        pivotDate={pivotDate}
                        nDays={numOfDays}
                        onEventPress={onEventPress}
                        headerStyle={styles.headerStyle}
                        formatDateHeader="dddd"
                        locale="en"
                    />
                    {renderModal()}
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    ) :
        (<SafeAreaView style={styles.blurContainer}>
            <ImageBackground style={styles.image} resizeMode="contain" source={require('../assets/temptimetable1.jpg')} />
            <BlurView
                style={styles.absolute}
                blurType="xlight"
                blurAmount={1}
            />
            <Text style={styles.text}>
                Paste your NUSMods timetable link!
            </Text>
            <TextInput
                style={styles.input}
                placeholder="https://nusmods.com/timetable/sem-....."
                placeholderTextColor="#9E9E9E"
                onChangeText={handleChange}
                value={formUrl}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <View style={styles.importButton}>
                <ThemedButton
                    name="rick"
                    type="secondary"
                    raiseLevel={2}
                    onPress={handleSubmit}
                >Import</ThemedButton>
            </View>
        </SafeAreaView>);
}

const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: '#FFB052'
    },
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    blurContainer: {
        flex: 1,
        backgroundColor: '#F8F8F8',
        alignItems: 'center'
    },
    image: {
        marginTop: -85,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    text: {
        top: '37%',
        height: 20,
        position: 'absolute'
    },
    input: {
        width: '80%',
        height: 40,
        borderWidth: 2,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: '#F0F0F0',
        position: 'absolute',
        top: '40%',
    },
    importButton: {
        top: '50%',
        position: 'absolute'
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        position: 'absolute',
        top: '47%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    button: {
        fontSize: 10,
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
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    buttonGroup: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    }
});
