import React from 'react';
import { SafeAreaView, StyleSheet, View, Alert } from 'react-native';
import TimeTableView, { genTimeBlock } from 'react-native-timetable';

/*
if BT2102=LAB:03 split = and :
code = BT2102
lesson type if 'TUT' then Tutorial 
class number 03
find from module info
*/

const actual_data = [ // /{acadYear}/modules/{moduleCode}.json 
  {
    title: "MA1521", //module code
    startTime: genTimeBlock("MON", 9), // 0900
    endTime: genTimeBlock("MON", 10, 50), // 1100
    location: "COM1-0208", // venue
    extra_descriptions: ["Tutorial", "08"], // lesson type, class number
  },
];


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
      title: "Club Activity",
      startTime: genTimeBlock("FRI", 13, 30),
      endTime: genTimeBlock("FRI", 14, 50),
      location: "Activity Center",
    },
  ];

const timeTableLink = 'https://nusmods.com/timetable/sem-2/share?BT2102=LAB:03,LEC:1&CS2030=LAB:14G,REC:07,LEC:1&GEX1015=TUT:W6,LEC:1&HSI1000=WS:F6,LEC:1&IS1128=LEC:1&IS2218=LEC:1&MA1521=LEC:1,TUT:15'
const timeTableLink2 = 'https://nusmods.com/timetable/sem-1/share?BT1101=LAB:09A,TUT:04,LEC:1&CS1010A=REC:01,TUT:07A,LEC:1&IS1108=LEC:1,TUT:07&IS2101=SEC:G03&MA1522=TUT:3,LEC:2'
const userImported = false;

export default function Timetable() {
  const numOfDays = 5;
  const pivotDate = genTimeBlock('mon');

  const onEventPress = (evt) => {
    Alert.alert("Event Pressed", JSON.stringify(evt));
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <TimeTableView
          events={ userImported == true ? actual_data : temp_data }
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
  );
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#81E1B8'
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
});
