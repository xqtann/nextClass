import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Alert, Dimensions, ImageBackground, TextInput, Text, Button } from 'react-native';
import TimeTableView, { genTimeBlock } from 'react-native-timetable';
import { BlurView } from 'expo-blur';
import { ThemedButton } from "react-native-really-awesome-button";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { setAnalyticsCollectionEnabled } from 'firebase/analytics';

/*
if BT2102=LAB:03 split = and :
code = BT2102
lesson type if 'TUT' then Tutorial 
class number 03
find from module info
*/

let actual_data = [];

const temp_data = [
    {
      title: "Math",
      startTime: genTimeBlock("MON", 9),
      endTime: genTimeBlock("MON", 10, 50),
      location: "Classroom 403",
      extra_descriptions: ["Kim", "Lee"],
    },
    {
      title: "Math",
      startTime: genTimeBlock("WED", 9),
      endTime: genTimeBlock("WED", 10, 50),
      location: "Classroom 403",
      extra_descriptions: ["Kim", "Lee"],
    },
    {
      title: "Physics",
      startTime: genTimeBlock("MON", 11),
      endTime: genTimeBlock("MON", 11, 50),
      location: "Lab 404",
      extra_descriptions: ["Einstein"],
    },
    {
      title: "Physics",
      startTime: genTimeBlock("WED", 11),
      endTime: genTimeBlock("WED", 11, 50),
      location: "Lab 404",
      extra_descriptions: ["Einstein"],
    },
    {
      title: "Mandarin",
      startTime: genTimeBlock("TUE", 9),
      endTime: genTimeBlock("TUE", 10, 50),
      location: "Language Center",
      extra_descriptions: ["Chen"],
    },
    {
      title: "Japanese",
      startTime: genTimeBlock("FRI", 9),
      endTime: genTimeBlock("FRI", 10, 50),
      location: "Language Center",
      extra_descriptions: ["Nakamura"],
    },
    {
      title: "Club Activity",
      startTime: genTimeBlock("THU", 9),
      endTime: genTimeBlock("THU", 10, 50),
      location: "Activity Center",
    },
    {
      title: "CS1010",
      startTime: genTimeBlock("FRI", 13, 30),
      endTime: genTimeBlock("FRI", 14, 50),
      location: "Activity Center",
    },
    {
        title: "BT2102",
        startTime: genTimeBlock("MON", 16, 30),
        endTime: genTimeBlock("MON", 18, 30),
        location: "Activity Center",
      },
    {
        title: "HSI1000",
        startTime: genTimeBlock("TUE", 15, 30),
        endTime: genTimeBlock("TUE", 17, 50),
        location: "Activity Center",
    },
    {
        title: "Club Activity",
        startTime: genTimeBlock("WED", 13, 30),
        endTime: genTimeBlock("WED", 16),
        location: "Activity Center",
      },
      {
        title: "GEX1000",
        startTime: genTimeBlock("MON", 12, 30),
        endTime: genTimeBlock("MON", 14, 50),
        location: "Activity Center",
      },
      {
        title: "CS2040",
        startTime: genTimeBlock("THU", 15),
        endTime: genTimeBlock("THU", 18),
        location: "Activity Center",
      },
];

const apiUrl = `https://api.nusmods.com/v2`;
const acadYear = '2022-2023';

const validationSchema = Yup.object().shape({
    timetableUrl: Yup.string()
      .matches(
        /^https:\/\/nusmods\.com\/timetable\/sem-\d(\/.*)?$/,
        'Invalid link, try again'
      )
});

const timeTableLink = 'https://nusmods.com/timetable/sem-2/share?BT2102=LAB:03,LEC:1&CS2030=LAB:14G,REC:07,LEC:1&GEX1015=TUT:W6,LEC:1&HSI1000=WS:F6,LEC:1&IS1128=LEC:1&IS2218=LEC:1&MA1521=LEC:1,TUT:15'
const timeTableLink2 = 'https://nusmods.com/timetable/sem-1/share?BT1101=LAB:09A,TUT:04,LEC:1&CS1010A=REC:01,TUT:07A,LEC:1&IS1108=LEC:1,TUT:07&IS2101=SEC:G03&MA1522=TUT:3,LEC:2'

export default function Timetable() {
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
    
    //["BT2102=LAB:03,LEC:1", "CS2030=LAB:14G,REC:07,LEC:1", "GEX1015=TUT:W6,LEC:1", "HSI1000=WS:F6,LEC:1", "IS1128=LEC:1", "IS2218=LEC:1", "MA1521=LEC:1,TUT:15"]

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
                    } else {
                        classType = 'Tutorial';
                    }

                    classTiming = classData.find(x => x.lessonType == classType && x.classNo == classNum);

                    classDay = classTiming['day'];

                    if (classDay = 'Monday') {
                        classDay = 'MON';
                    } else if (classDay = 'Tuesday') {
                        classDay = 'TUE';
                    } else if (classDay = 'Wednesday') {
                        classDay = 'WED';
                    } else if (classDay = 'Thursday') {
                        classDay = 'THU';
                    } else if (classDay = 'Friday') {
                        classDay = 'FRI';
                    } 

                    classStart = classTiming['startTime'];
                    classStartHour = classStart[0] == '0' ? classStart.slice(1,2) : classStart.slice(0,2);
                    classStartMin = classStart[2] == '0' ? classStart.slice(3) : classStart.slice(2);
                    classEnd = classTiming['endTime'];
                    classEndHour = classEnd[0] == '0' ? classEnd.slice(1,2) : classEnd.slice(0,2);
                    classEndMin = classEnd[2] == '0' ? classEnd.slice(3) : classEnd.slice(2);
                    classVenue = classTiming['venue'];
                    console.log('tes')
                

                    actual_data.push({
                        title: moduleCode, 
                        startTime: genTimeBlock(classDay, classStartHour, classStartMin),
                        endTime: genTimeBlock(classDay, classEndHour, classEndMin), 
                        location: classVenue, 
                        extra_descriptions: [classType, classNum], 
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
    backgroundColor: '#81E1B8'
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
