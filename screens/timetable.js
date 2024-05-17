import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Alert, Dimensions, ImageBackground, TextInput, Text, Button } from 'react-native';
import TimeTableView, { genTimeBlock } from 'react-native-timetable';
import { BlurView } from 'expo-blur';
import { ThemedButton } from "react-native-really-awesome-button";
import * as Yup from 'yup';
import { setAnalyticsCollectionEnabled } from 'firebase/analytics';

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

export default function Timetable({navigation}) {
    const [formUrl, setForm] = useState('');
    const [error, setError] = useState('');
    const [imported, setImported] = useState(false);

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

                moduleCode == 'HSI1000' ? console.log(classData) : null;

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
                    classStartHour = classStart[0] == '0' ? classStart.slice(1,2) : classStart.slice(0,2);
                    classStartMin = classStart[2] == '0' ? classStart.slice(3) : classStart.slice(2);

                    classEnd = classTiming['endTime'];
                    classEndHour = classEnd[0] == '0' ? classEnd.slice(1,2) : classEnd.slice(0,2);
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
                        extra_descriptions: [classType, '['+classNum+']', classWeeks], 
                    })
                }

            } catch (error) {
                console.error(`Error fetching data for module ${moduleCode}:`, error);
            }
        }
        setImported(true);
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

  const onEventPress = (evt) => {
    navigation.navigate("Reminder", {moduleCode: evt.title});
    Alert.alert("Event Pressed", JSON.stringify(evt));
  };

  return imported ? (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <TimeTableView
          events={ actual_data }
          pivotTime={8}
          pivotEndTime={19}
          pivotDate={pivotDate}
          nDays={numOfDays}
          onEventPress={onEventPress}
          headerStyle={styles.headerStyle}
          formatDateHeader="dddd"
          locale="en"
        />
      </View>
    </SafeAreaView>
  ) : 
  ( <SafeAreaView style={styles.blurContainer}> 
          <ImageBackground style={styles.image} resizeMode="contain"  source={require('../assets/temptimetable1.jpg')} />
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
            <View style={styles.button}>
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
  button: {
    top: '50%',
    position: 'absolute'
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    position: 'absolute',
    top: '47%',
  },
});
