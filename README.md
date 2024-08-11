## Introduction
Team Members: Winston Lau Kai Hao, Tan Xin Quan

Hello world! In this README we explain the ins and outs of our project, why we did certain things, how we did it, some demonstrations, and also the challenges faced throughout the project. Our team wanted to build a project that sets itself apart, one that provides a solution, and most importantly one that would greatly benefit the university lives of fellow NUS students. 

Through the last few months our team has gone through blood, sweat and tears, from having 0 knowledge of mobile app development, to creating a very useful and fully functional working app that we are really proud to call our own. We hope that after reading our README you would have a greater understanding of our app and maybe even have learnt something from us! 

[Video Demonstration](https://drive.google.com/file/d/1hFRI9LgLCohq752xgF7P7TWgaDT9SkHf/view?usp=sharing)

[NextClass Poster](https://drive.google.com/file/d/1--D34q7PsmaiiQLXXZQnr39CBNHBSjh8/view?usp=sharing)

**Deployed Project Link:**
Instructions for iOS devices:
  1. Download Expo Go on the Appstore
  2. Create an Expo Go account
  3. Scan the QR code / follow the link

<img width="214" alt="[image](https://expo.dev/preview/update?message=milestone3%20update%2026072024&updateRuntimeVersion=1.0.0&createdAt=2024-07-26T12%3A16%3A22.232Z&slug=exp&projectId=0b82a29e-16bb-4d60-a1bf-4b8dc6895af2&group=7d3df417-f14c-4543-8934-dbdd1ddebce7)" src="https://github.com/user-attachments/assets/5f318b6d-da44-4ddc-8c00-02b4339d378b">


## Motivation
During our first year at NUS, we often found ourselves struggling to adapt to the fast-paced university life. The transition from high school to university was a significant shift, marked by a steep learning curve. We had to quickly learn to juggle a multitude of tasks, including managing our academic workload, participating in various extracurricular activities, and attending numerous classes and events. This balancing act often felt overwhelming, especially during the initial months when everything was new and unfamiliar.

Navigating the sprawling campus added another layer of complexity to our experience. With its many buildings and facilities, it sometimes felt like a maze. Finding the right lecture hall or tutorial room could be a challenge, particularly when we were running late or had back-to-back classes in different parts of the campus.

There are already apps and websites to help with information and university life, such as NUSMods or Univus. But it is a hassle to switch between all these apps just to get all our necessary information. Thus, we want to create an all in one app that differs from the rest, by consolidating all the important information that we need, coupled with useful features to make our university lives better.

## Aim
We want to give NUS students a **one stop mobile application** that serves their university needs such as **organisation and planning** with our reminders and timetable feature, **specialised directions** with our NUS mapping feature that can map routes in between and through buildings, and last but not least, a **personal AI assistant** that can provide users with valuable information such as the nearest toilets, or module data from NUSMods. We aim to **streamline the daily routines** of NUS students, making their academic and campus life more organised and less stressful.

## User Stories
- As a student who wants to stay organised with a busy schedule, I want to be able to add and customise reminders for each class on my timetable. 	

- As a student who wants to take note of important reminders, I want to receive timely notifications for when my reminders are due.

- As a student always rushing between classes and venues, I need a quick and efficient way to find my next destination on campus. I want directions that are specific, showing me shortcuts that saves time! 					
- As a student trying to keep track of my hectic schedule, I need an easy way to view my classes and know when and where my next class is.

- As a student who values convenience, I want to be able to access valuable information like module information, or even where the nearest toilets are, all within one app.

- As a user who has different preferences for how my app looks, I want to be able to customise the style of my app (home card, darkmode).

# Features Overview
## 1\. User Authentication
- Allows users to sign up, login and manage their accounts securely
- A user account is required to use the NextClass app
- Users can create an account by providing an email and password
- Users can ensure that their information is consistent throughout all devices

**Screenshots**

<p align="center">
<img width="614" alt="image" src="https://github.com/user-attachments/assets/adef28bf-a6da-42dc-b35a-04c5f1cbfcc3">
</p>

<p align="center">
<img width="300" alt="image" src="https://github.com/user-attachments/assets/6afaf345-f3c8-4ed8-b69b-fa7ddf510b27">
<img width="300" alt="image" src="https://github.com/user-attachments/assets/918272c3-1f35-4eb8-8365-8929d78b7c26">
</p>

**Implementation**

We used Firebase Authentication, which provides a secure and reliable way to manage user authentication. Firebase Authentication handles complex security issues, such as password hashing and secure storage, ensuring that user credentials are protected.

When a user tries to log in, Firebase Authentication verifies the credentials and grants access to the application. Successful login redirects the user to the home screen, while failed login attempts provide appropriate error messages.

## 2\. NUSMods timetable integration
- Allows students to import their timetable from NUSMods and view/manage their timetable directly within NextClass.
- Users are able to click and interact with their classes on the timetable and get navigation directions from their current location to the class location.
- Users can set reminders for each module in the timetable from the timetable screen
- Users can delete the current timetable which automatically deletes the old timetable from firebase, allowing users to import a new timetable.

**Screenshots**

<p align="center">
<img width="609" alt="image" src="https://github.com/user-attachments/assets/64b7041b-68ed-433b-b644-8ed4b91190fe">
<img width="305" alt="image" src="https://github.com/user-attachments/assets/c9e43f61-ff2c-4206-a567-2ab5146a4b6c">
</p>

**Implementation**

The NUSMods URL that users are prompted to enter is broken apart into module codes and time slot code by parsing the string.

Yup validation is utilised to ensure that the user inputs a valid NUSMods URL.
```
An example of NUSMods timetable URL:
https://nusmods.com/timetable/sem-1/share?BT2101=LEC:1,TUT:2&CFG1002=&CS2040=LAB:4C,TUT:14,LEC:1&GEC1044=TUT:D2,LEC:1&IS3103=REC:G03,LEC:1&ST2334=TUT:5,LEC:1
```
From the URL we can see that each module is separated by a ‘&’ character, and the module data follows each code: LEC:1,TUT:2. We thus parse the url string and keep the module lesson data as constants first. We then use the NUSMods API to fetch more module data, such as the venue and the timeslot.


<img width="800" alt="image" src="https://github.com/user-attachments/assets/0a4e8fc4-5ffd-4b87-90fa-4c2c6bf54e44">

_Fetching data from NUSMods API_

The API provides a lot of other useful information in JSON format such as a description of the module. We will be using this data in another feature (our personal AI assistant chatbot)

<img width="400" alt="image" src="https://github.com/user-attachments/assets/2029ecdc-ccaa-48ad-88ec-714d87435e53">

_Example of a `timetableData` in Firestore_

Firebase Storage is then used to store the timetable data (venue, timing) fetched from NUSMods and link them to the user who imported the timetable.
The timetable data that the user imported will be saved under the user in Firebase Storage. We ensured that most if not all of our data is stored on firebase instead of async storage so that users can access their data even if they use a different device.
Our timetable is generated using the react native timetable package, and all we need to do is pass in the correct arguments and parameters.

<img width="600" alt="image" src="https://github.com/user-attachments/assets/1ed07aac-f528-4b10-b565-ab3fced7572a">

_React Native Firebase package code_


**Challenges faced and thoughts when implementing**
This was our first feature we worked on for this project, and thus also our first time dealing with API calls and packages in our code. We started trying to build and style our own timetable but we found the react native package that could do it for us with a few lines of code. We also experimented with the NUSMods API and it was quite easily implemented.

When we first started working on the timetable we stored our timetable data in async storage. However we decided to change it as async storage does not allow users to keep their data if they change devices. Following this change, we kept with using firebase storage instead of async for all other features in our app.


## 3\. Reminders for each module

- Students can set due dates and reminders for various module-related tasks such as assignments, exams, and important deadlines.
- The reminder feature allows for easy tracking of all academic responsibilities within the app.
- Users have the ability to mark reminders as completed, ensuring a clear and updated overview of pending tasks.
- Reminders are arranged in order of due date and those that have passed their due date will turn red in colour, allowing users to easily track and view their reminders.
- Reminders can be edited at any time, allowing for changes in due dates, task descriptions, or other relevant details.
- Reminders are accessible from multiple screens within the application, including the timetable screen, and home screen, providing convenience and ensuring students are always aware of their upcoming tasks.
- Together with the push notifications (Feature 4), reminders become even more effective, notifying students of due dates and important deadlines in real-time, helping them stay organised and on track.

**Screenshots**

<p align="center">
<img width="300" alt="image" src="https://github.com/user-attachments/assets/f5119a56-c953-475c-9bc6-18b2298d638e">
<img width="300" alt="image" src="https://github.com/user-attachments/assets/d485d926-eb68-4ba8-9626-a753f862241a">
<img width="600" alt="image" src="https://github.com/user-attachments/assets/2f8504e4-7e83-4369-a344-2a8d5715389b">
<img width="300" alt="image" src="https://github.com/user-attachments/assets/86d4af80-be6d-442f-8df8-dccbfbc73e2f">
<img width="600" alt="image" src="https://github.com/user-attachments/assets/4f9759f9-08fe-4b3f-a67a-a0c48266457a">
</p>

**Implementation:**

Whenever a reminder is created, updated or deleted through the app user interface, our backend Firebase Storage updates accordingly, which includes every reminder data that is linked to each user. (See ER Diagram)

We update the reminders collection under each user storage in firebase with all the information needed.

In the respective screens such as home screen, or the reminders display page, we display the data by fetching the data from the same collection in firebase.
We order the reminders by their due date.

<img width="1200" alt="image" src="https://github.com/user-attachments/assets/b69f3279-3880-42d3-aa2f-9e6104563577">

_Fetching the reminder data from firebase_


<img width="500" alt="image" src="https://github.com/user-attachments/assets/eb0615a7-3f73-468a-b0b8-a57c0b27c7b6">

_Example of a reminder doc on Firebase_


**Challenges faced and thoughts on implementations:**

One of the first significant challenges we encountered was choosing the right platform for our database. We considered several options, including Supabase and Google Firebase, each with its own set of advantages and limitations. After much research and comparison, we ended up choosing Google Firebase for our database storage mainly due to its flexible pricing plans and variety of features that we may plan to utilise. We learnt a lot through the process of reading documentations, and trying out to link Firebase to our project.

During the development process, we realised that users might want to view reminders they have completed in the past. To accommodate this, we added a ‘Completed Reminders’ screen, which was not part of our initial plan. This feature required additional logic to filter and display completed reminders separately from pending ones, ensuring a clear and organised user experience.


## 4\. Shortest footpath map navigation and directions

- Offers a specialised shortcut navigation feature that identifies the shortest walking paths across the NUS campus, including through buildings.
- Provides turn-by-turn directions to help students quickly and efficiently reach their destinations.
- Provides users with the option of navigation via foot or private vehicle.
- Shows pin markers of NUS bus stops, carparks, and locations of user’s classes on the map.
- Allows users to get real-time bus arrival timing at every bus stop.

**Screenshots**

<p align="center">
<img width="600" alt="image" src="https://github.com/user-attachments/assets/37ed995a-5a8e-429e-962e-e0cfc34da263">
<img width="600" alt="image" src="https://github.com/user-attachments/assets/f422f198-14d8-468b-adc6-7b19cbc55a0a">
<img width="300" alt="image" src="https://github.com/user-attachments/assets/01718f5f-c710-4e66-96a7-fc5b01f4807e">
</p>

**Implementation:**

We used OpenStreetMap, an open-source mapping platform, to manually mark and update indoor routes within buildings on the NUS Kent Ridge campus. This involved adding detailed path information that is not typically available in Google Maps, such as corridors, stairways, and indoor walkways.

Once the data in Openstreetmap is published and updated, Graphhopper API uses the updated Openstreetmap, and is used to fetch the shortest path navigation routing information, given the startpoint and endpoint.
This information is then passed back to react native, where polylines of the navigation route will be plotted on the map interface.
Detailed turn-by-turn directions were provided to guide users along the shortest path, enhancing the overall navigation experience.

We also integrated the NUS NextBus API to gather real-time bus arrival information. This data was then displayed through the app's map user interface, allowing users to conveniently view real-time bus timings at various stops directly on the map.

<p align="center">
<img width="1045" alt="image" src="https://github.com/user-attachments/assets/ccb67e29-c900-4be7-8d4b-a248a7ec4098">
</p>

_Google Maps, Apple Maps, NextClass side-by-side comparison of navigation from NUS AS6 to COM3/4_


**Challenges faced and thoughts on implementations:**

A huge challenge faced while working on this feature is that there was no plausible way for Google Maps API to return a modified indoor path given an origin and destination location. We seeked for many alternative solutions and ended up using Graphhopper API and Openstreetmap and made it possible. We marked on Openstreetmap every indoor route within buildings that is walkable in NUS Kent Ridge campus.

The process of marking every walkable indoor route within NUS was another challenge as it requires significant manual effort. Furthermore, the map data needs to be updated with the latest campus changes. For example, the SoC COM4 building is relatively new and is not shown on Google Maps yet.

The late addition of the ability to navigate to and from the user’s current location presented a significant challenge, as a large amount of the code had to be modified to accommodate this addition. This was mainly due to the lack of detailed planning at the start.

**Limitations:**

While the map navigation system efficiently provides shortcut walking routes through buildings within NUS, it does not include routes that incorporate the use of the NUS Internal Shuttle Bus (ISB). The system exclusively offers walking directions from one location to another, without considering the option of using the NUS ISB.

This was mainly not implemented due to time constraints, as well as the underestimated complexity of implementing the feature.


## 5\. Push notifications

- Keeps students updated and ensures that students receive timely alerts to stay on top of their academic commitments.
- Users are able to set the exact time that they want to be notified.

**Screenshots**

<p align="center">
<img width="414" alt="image" src="https://github.com/user-attachments/assets/ef736c5d-83b3-4685-8b75-20eb173b4ff3">
</p>

**Implementation:**

Expo-notifications is utilised to enable push notification from our app to the user’s physical device.

A lot of complex code was needed.

The `registerForPushNotificationsAsync` function requests for the device’s permission to receive push notifications. Once permission is granted, the function retrieves the Expo push token for the device. This token is essential for sending notifications to the specific device.

The function also includes logic to notify users that using a virtual device simulator, such as an Android Emulator or iOS Simulator, will not allow them to receive notifications.

Other approaches such as using Firebase Cloud Messaging were not ideal as they require a Paid Apple Developer Account to enable push notifications on iOS devices.

**Challenges faced and thoughts on implementation:**

We initially wanted to create widgets that can enable users to interact and see quick actions from their home screen, but that also requires a paid Apple Developer Account thus we could not go through with it.

We struggled with implementing the code for push notifications at first as it was very confusing and hard to interpret as we had to deal with new concepts such as tokens.

<img width="687" alt="image" src="https://github.com/user-attachments/assets/d7043d5f-8e4d-46b3-8ea0-724d0e37fbe0">

_Getting the token for push notification_

The code attempts to retrieve the projectId from the app's configuration. If the projectId is not found, it throws an error. It then attempts to get the Expo push token using the projectId. If successful, it logs the token to the console. If an error occurs during this process, the error is stored in the token variable.


## 6\. AI Personalised Chatbot Assistant

- Allow users to interact with the AI Chatbot to ask questions like the nearest toilet or amenity, and get personalised responses.
- The chatbot will act as a virtual assistant within the NextClass application, providing personalised responses based on user queries.
- Some responses provided by the chatbot are interactive and allow users to click and navigate to other screens within the app conveniently.
- The chatbot provides extra features such as finding an available unoccupied venue for users.
- Example queries that the chatbot can handle:
  - _Where is the nearest toilet?_
  - _What is the next bus timing at COM3 bus stop?_
  - _What is the time now?_
  - _When is my exam for CS2030S?_
  - _What is ST2334 about?_
  - _Are there any available venues for studying now?_

**Screenshots**

<p align="center">
<img width="300" alt="image" src="https://github.com/user-attachments/assets/840631c7-7fba-4b06-84ee-14da3d5b348d">
</p>

**Implementation:**

Rasa is used and the chatbot model is trained by configuring intents, entities, actions and responses.
The Rasa chatbot will be integrated to our app by interacting with the Rasa API to send user queries and receive responses.
The Rasa chatbot API server that requests and receives responses is hosted and kept running using Microsoft Azure’s Ubuntu VM instance.

The API URL for fetching is tunnelled using localtunnel from the Ubuntu VM’s localhost to a public URL.
Overpass API is utilised to fetch map data regarding amenities near the user’s location.
NUSMods API and NUS NextBus API are used to get information for real-time bus arrival timings, as well as venues and module information.

Rasa Folder Structure:
```
/rasa

  /actions
  
    \__init_\_.py
  
    actions.py
  
  /data
  
    nlu.yml
    
    stories.yml
    
    rules.yml
  
  /models
  
    model.tar.gz
  
  /tests
  
    test_stories.yml
  
  config.yml
  
  domain.yml
  
  endpoints.yml
  
  credentials.yml
```

`nlu.yml` contains intent examples for rasa chatbot to be trained.

`stories.yml` and `rules.yml` contains examples of possible chat interactions between the user and chatbot.

`action.py` contains the backend code for getting API requests and fetching responses for the chatbot.

<p align="center">
<img width="564" alt="image" src="https://github.com/user-attachments/assets/a64cc023-b74e-4f52-b0c8-688caf76881f">
</p>

_Intent examples in nlu.yml for training the rasa chatbot_

<p align="center">
<img width="573" alt="image" src="https://github.com/user-attachments/assets/33d371c1-582a-4c76-8a20-001af8a874df">
</p>

_Full list of intents, actions, entities in `domain.yml`_



**Challenges faced and thoughts on implementation:**

There were many challenges such as not being able to keep the Rasa chatbot server running 24/7 when it was running on a local machine. This was solved by using a variety of cloud services like Heroku, Google Cloud Platform, AWS Cloud Service. Microsoft Azure was chosen to host our chatbot server after comparing the pricing plans among those cloud services. We also found the training of the chatbot very manual as we had to define the intents, stories and the actions.

Apart from the challenges faced, this feature took a long time to be developed and worked on as we actually had other plans at first. Our first plan was to make a telegram channel scraping feature, where our app can display messages from telegram channels like the NUS Buffet Response Team, and link it to our mapping feature we specialised routes. We worked on this feature for a week, and got to scraping public telegram channels, however, channels like NUS Buffet Response Team or the lost and found groups were private and invite only (private invite link), and could not be scraped. This made our feature unusable and thus we decided to change our direction and come up with a new feature, which ended up being the chatbot.

**Limitations:**

Toilet locations are only available and accurate within NUS School of Computing.

Server might be down occasionally when inactive for a long period of time, since the server must be locally run. This also occurs when localtunnel server is down.

## 7\. User Profile Section

- Provides a section within the app for users to customise and personalise their user profile in the app.
- Enables users to customise the card colours in the homescreen.
- Allows users to change their display name, and password within the application.

**Screenshots**

<p align="center">
<img width="597" alt="image" src="https://github.com/user-attachments/assets/d6406578-aa21-4b62-ab5d-37eaf01abe1e">
</p>

**Implementation:**

Firebase Storage is used to change the user’s display name, password (updatePassword method), or delete the whole user profile. (See ER Diagram)
AsyncStorage is used for storing the user’s colour preferences for the class cards, which is then retrieved at _home.js_ and _allClasses.js_.

<img width="500" alt="image" src="https://github.com/user-attachments/assets/7476e8d5-3e4c-400c-ba8c-0dba28cacade">

_Using AsyncStorage to store user’s colour preferences_



## 8\. User Suggestion Section

- Enables users to submit feedback and suggestions for new features, improvements, or new shortcut routes for navigation.
- Easily able to view all feedback through our ‘feedback’ collection on firebase storage.
- We are able to constantly upgrade our app when users provide us with useful feedback.

**Screenshots**

<p align="center">
<img width="607" alt="image" src="https://github.com/user-attachments/assets/79d9ca6c-1d21-4038-8dc9-51bac773169c">
</p>

**Implementation:**

Firebase Storage is used to store user feedback entered by a specific user through our app user interface, for developers to view through Cloud Firestore. (See ER Diagram)

<img width="1182" alt="image" src="https://github.com/user-attachments/assets/9c55cb78-ff4a-45c0-b7ef-cdc9e53506df">

_Viewing user feedbacks from Cloud Firestore_

## 9\. Dark Mode 😎

- Provides users with the option to switch between Light and Dark modes, enhancing usability and user experience based on their preferences.
- Allows users to choose a theme that is comfortable for their eyes, particularly useful in low-light environments or for prolonged usage of the application
- Dark mode also reduces eye strain and makes it easier to read content in low-light conditions.

**Screenshots**

<p align="center">
<img width="600" alt="image" src="https://github.com/user-attachments/assets/e1a8f0fb-cab4-4650-b9c3-5b8ff897e9f6">
<img width="598" alt="image" src="https://github.com/user-attachments/assets/dda5e383-7e62-4305-9576-ac183f832973">
<img width="600" alt="image" src="https://github.com/user-attachments/assets/2439c88c-cfb5-4edf-95f4-d7a9c0920b1a">
<img width="300" alt="image" src="https://github.com/user-attachments/assets/ede39855-572b-4621-b2e3-8598ea6ad163">
</p>

**Implementation:**

React’s useContext hook was used to set the global dark mode variable. We also used animation styles to smoothen the transition between light and dark mode. We then incorporated async storage to save the user’s dark mode value so that when the user exits the app and returns, the style would be consistent.


<img width="419" alt="image" src="https://github.com/user-attachments/assets/c62d0d84-02c0-41c6-9e4b-7fed4da55771">

_Animation for dark mode styling_

We tried and tested different colour schemes, to see which set of colours suits best for our users. Different styling methods were used to customise and change the colour of the entire user interface.

User feedback from developers and beta testers was also collected to ensure that the chosen colour schemes provided the best readability and user experience. We also made the changing of the styles smooth using animation.

**Challenges faced and thoughts on implementation:**

We had to create a brand new stylesheet for each page and the process was very manual. Choosing appropriate colours was also a challenge as some colours don't work well with each other.


# Implementation Diagrams
## Overview
![image](https://github.com/user-attachments/assets/e9a5335a-a83a-453b-8ab0-4bbe1e029706)

## ER Diagram
![Database ER diagram (crow's foot) updated](https://github.com/user-attachments/assets/58264e1c-cd7b-44ee-afa1-ed50b03d4e90)

## Activity Diagram
![activity diagram](https://github.com/user-attachments/assets/88c5943d-ae1f-4d91-a715-47f4af726844)

# Testing
## Developers Testing
During the development process of NextClass, our developers conducted extensive testing to identify and resolve critical issues. By simulating different scenarios and use cases, we were able to catch and fix critical bugs, optimise performance, and enhance the overall stability and reliability of the application.

## Beta User Testing
We have selected a group of students from NUS to use NextClass in their everyday academic activities. This group of beta testers provided invaluable feedback on the app's usability, functionality, and overall user experience. Testing in a natural work setting allowed us to observe how the app performed in real-world conditions and gather insights on how to further improve the app. The feedback from these beta testers helped us to identify any remaining issues, understand user needs better, and make necessary adjustments to NextClass.

<img width="600" alt="image" src="https://github.com/user-attachments/assets/2379c8e8-537d-4775-b53b-8bab727e0d38">


## Automated Testing Using Jest
By utilising Jest in our testing workflow, we can automate the execution of various tests, including unit tests, integration tests, and snapshot tests. We included system testing (load/stress testing) to ensure that our input fields can handle different types of inputs such as inputs up to 5000 characters, as well as special characters.

<img width="600" alt="image" src="https://github.com/user-attachments/assets/f8ee3ee6-bd30-47f4-9fa5-cb6f3a26749d">
<br>
<img width="300" alt="image" src="https://github.com/user-attachments/assets/04e4d7d2-8056-4b61-a1e9-ff10e9f35951">

_Result of running all 13 Jest test cases_


## Automated UI Testing using Maestro
Using Maestro, we automated the UI testing process through the creation of test cases and scripts, eliminating the need for manual testing of elements. Each test file contains a series of steps that the automated UI tester follows and interacts with. Upon completion of the testing process, Maestro generates a report detailing which test cases passed or failed, allowing us to identify and address any issues that arise.

<img width="1000" alt="image" src="https://github.com/user-attachments/assets/1a5544d5-aa4e-4272-ad19-559626e5bcc4">

_Example of a test result from running `timetableTest.yaml`_

# Acknowledgements
\- Lucidspark (for ER Diagram)

<https://lucidspark.com/>

\- NUSMods API Github (for NUS venues)

<https://github.com/nusmodifications/nusmods-api>

\- NUS NextBus API Github

<https://github.com/SuibianP/nus-nextbus-new-api>

\- React Native Apple Card Views (for Card component)

<https://github.com/WrathChaos/react-native-apple-card-views>
