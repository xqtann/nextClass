import React, { useState, useEffect, useContext, useRef } from 'react';
import { Text, View, StyleSheet, Button, Alert, TouchableWithoutFeedback, TouchableOpacity, Modal, LayoutAnimation, Animated } from 'react-native';
import TextInput from "react-native-text-input-interactive";
import { ThemedButton } from 'react-native-really-awesome-button';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { getAuth, updatePassword, deleteUser, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsButton from '../components/SettingsButton';
import Toast from 'react-native-toast-message';
import DarkSettingsButton from '../components/DarkSettingsButton';
import { DarkModeContext } from '../DarkModeContext'; // Import the context

export default function Account({ navigation }) {
  const auth = getAuth();
  const user = auth.currentUser;
  const [storedUser, setStoredUser] = useState('');
  const [openModal, setModal] = useState(false);
  const [mode, setMode] = useState(0);
  const [newUsername, setNewUsername] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [feedback, setFeedback] = useState(null); 
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext); 

  const animationValue = useRef(new Animated.Value(darkMode ? 1 : 0)).current;

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user) {
          const userDoc = doc(FIRESTORE_DB, 'users', user.uid);
          const docSnapshot = await getDoc(userDoc);
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setStoredUser(userData.username);
          } else {
            console.log('No such document!');
          }
        }
      } catch (error) {
        console.error('Error loading data from Firestore:', error);
      }
    };
    loadData();
  }, [user]);

  useEffect(() => {
    Animated.timing(animationValue, {
      toValue: darkMode ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [darkMode]);

  const backgroundColor = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffffff', '#192734']
  });

  const textColor = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000000', '#e0e0e0']
  });

  const confirmDeleteUser = () => {
    Alert.alert(
      `Delete ${user.displayName}`,
      'Are you sure you want to \ndelete this user?\nThis action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => { deleteUser(user).then(() => {navigation.navigate("Login");})}}
      ]
    );
  };

  const newPasswordHandler = (newPassword) => {
    setNewPassword("");
    updatePassword(user, newPassword).then(() => console.log("Password updated")).catch((error) => console.error(error));
    showToast("Password updated!");
  }

  const newUsernameHandler = async (newUsername) => {
    try {
      setNewUsername("");
      await updateProfile(user, { displayName: newUsername });
      console.log("Username updated");
  
      const userDoc = doc(FIRESTORE_DB, 'users', user.uid);
      await updateDoc(userDoc, {
        username: newUsername
      });
      console.log("Firestore document updated");
  
      await FIREBASE_AUTH.signOut();
      navigation.navigate("Login");
  
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  const feedbackHandler = async (feedback) => {
    setFeedback("");
    try {
      await addDoc(collection(FIRESTORE_DB, "feedbacks"), { 
        userUid: user.uid,
        datetime: new Date(),
        feedback: feedback
        });
      console.log('Feedback successfully submitted!');
      showToast("Feedback submitted!");
    } catch (error) {
        console.log('Error saving data to Firestore:', error);
    }
  };

  const showToast = (info) => {
    Toast.show({
      type: 'success',
      text1: `${info}`,
    });
  }

  const handleToggleDarkMode = () => {
    const customAnimation = {
      duration: 500, // Duration in milliseconds
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    };
    LayoutAnimation.configureNext(customAnimation);

    toggleDarkMode();
  };

  const renderModal = () => {
    return (
      <Modal
        visible={openModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModal(false)} >
        <TouchableWithoutFeedback onPress={() => setModal(false)}>
          <View style={!darkMode ? styles.modalOverlay : stylesDark.modalOverlay}>
            <View style={!darkMode ? styles.modalContent : stylesDark.modalContent}>
              <TouchableOpacity style={!darkMode ? styles.closeButton : stylesDark.closeButton} onPress={() => setModal(false)}>
                <Text style={!darkMode ? styles.closeButtonText : stylesDark.closeButtonText}>X</Text>
              </TouchableOpacity>
              { mode == 1 ? 
              (<>
                <Text style={!darkMode ? styles.modalHeadText : stylesDark.modalHeadText}>Change Username</Text>
                <Text style={!darkMode ? styles.modalText : stylesDark.modalText}>Requires Re-Login</Text>
                <TextInput
                  textInputStyle={!darkMode ? styles.input : stylesDark.input}
                  placeholder="New username"
                  autoCapitalize="none"
                  onChangeText={(text) => setNewUsername(text)}
                  value={newUsername} />
              </>)
              : mode == 2 ? 
              (<>
                <Text style={!darkMode ? styles.modalHeadText : stylesDark.modalHeadText}>Change Password</Text>
                <TextInput
                  textInputStyle={!darkMode ? styles.input : stylesDark.input}
                  placeholder="New password"
                  secureTextEntry={true}
                  autoCapitalize="none"
                  onChangeText={(text) => setNewPassword(text)}
                  value={newPassword} />
              </>)
              : mode == 3 ? 
              (<>
                <Text style={!darkMode ? styles.modalHeadText : stylesDark.modalHeadText}>Feedback and Suggestions</Text> 
                <TextInput
                  textInputStyle={!darkMode ? styles.input : stylesDark.input}
                  placeholder="Suggestion"
                  autoCapitalize="none"
                  onChangeText={(text) => setFeedback(text)}
                  value={feedback} />
              </>)
              : "" }
              <View style={!darkMode ? styles.buttonGroup : stylesDark.buttonGroup}>
                <Button title="Cancel" onPress={() => {setModal(false)}} />
                <Button title="OK" onPress={() => {
                  setModal(false); 
                  newPassword ? newPasswordHandler(newPassword) : "";
                  newUsername ? newUsernameHandler(newUsername) : "";
                  feedback ? feedbackHandler(feedback) : "";}} />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  return (
    <Animated.View style={[styles.wrapper, { backgroundColor }]}>
      <View style={!darkMode ? styles.container : stylesDark.container}>
        <Animated.Text style={[styles.text, { color: textColor }]}>{user ? user.displayName : storedUser} </Animated.Text>
        {renderModal()}
        {!darkMode ? (
          <View style={styles.settings}>
            <SettingsButton icon={require('../assets/compare.png')} title="Light/Dark Mode" onPress={handleToggleDarkMode} />
            <SettingsButton icon={require('../assets/text-account.png')} title="Change Username" onPress={() => { setMode(1); setModal(true); }} />
            <SettingsButton icon={require('../assets/key.png')} title="Change Password" onPress={() => { setMode(2); setModal(true); }} />
            <SettingsButton icon={require('../assets/lightbulb.png')} title="Feedback and Suggestions" onPress={() => { setMode(3); setModal(true); }} />
            <SettingsButton textStyle={styles.btnTextDanger} icon={require('../assets/trash-can.png')} title="Delete Profile" onPress={confirmDeleteUser} />
          </View>
        ) : (
          <View style={styles.settings}>
            <DarkSettingsButton icon={require('../assets/compare.png')} title="Light/Dark Mode" onPress={handleToggleDarkMode} />
            <DarkSettingsButton icon={require('../assets/text-account.png')} title="Change Username" onPress={() => { setMode(1); setModal(true); }} />
            <DarkSettingsButton icon={require('../assets/key.png')} title="Change Password" onPress={() => { setMode(2); setModal(true); }} />
            <DarkSettingsButton icon={require('../assets/lightbulb.png')} title="Feedback and Suggestions" onPress={() => { setMode(3); setModal(true); }} />
            <DarkSettingsButton textStyle={!darkMode ? styles.btnTextDanger : stylesDark.btnTextDanger} icon={require('../assets/trash-can.png')} title="Delete Profile" onPress={confirmDeleteUser} />
          </View>
        )}
        {user || storedUser != '' ? (
          <ThemedButton name={darkMode ? 'bruce' : 'rick' } type="primary" style={styles.button } onPress={() => {
            FIREBASE_AUTH.signOut();
            navigation.navigate("Login");
          }}>
            LogOut
          </ThemedButton>
        ) : ""}
        <Toast
          position='top'
          topOffset={-20}
        />
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
      flex: 1,
      margin: 20,
  },
  text: {
      fontSize: 30,
      textAlign: "center",
      fontFamily: "System",
      fontWeight: 'bold',
  },
  modalHeadText: {
    fontSize: 20,
    textAlign: "right",
    fontFamily: "System",
    fontWeight: 'bold',
  },
  button: {
      marginTop: 10,
      alignSelf: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Slightly darker overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%', // Slightly wider modal
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20, // More rounded corners
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  modalText: {
      fontSize: 16,
      marginVertical: 10,
      textAlign: 'center',
      width: '60%'
  },
  input: {
      width: 300,
      margin: 10
  },
  settings: {
    marginTop: 20,
    flex: 1,
  },
  btnTextDanger: {
    fontSize: 17,
    fontFamily: "System",
    color: "#8b0000",
    fontWeight: "400"
  },
});

const stylesDark = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#192734',
  },
  container: {
    flex: 1,
    margin: 20,
  },
  text: {
    fontSize: 30,
    textAlign: "center",
    fontFamily: "System",
    fontWeight: 'bold',
    color: '#e0e0e0', // Primary text color
  },
  modalHeadText: {
    fontSize: 20,
    textAlign: "right",
    fontFamily: "System",
    fontWeight: 'bold',
    color: '#e0e0e0', // Primary text color
  },
  button: {
    marginTop: 10,
    alignSelf: "center",
    backgroundColor: '#333333', // Button background color
    color: '#ffffff', // Button text color
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)', // Darker overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    padding: 20,
    backgroundColor: '#1e1e1e', // Modal background color
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#bb86fc', // Highlight color for close button
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
  modalText: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
    width: '60%',
    color: '#e0e0e0', // Modal text color
  },
  input: {
    width: 300,
    backgroundColor: '#2c2c2c', // Input background color
    color: '#ffffff', // Input text color
    margin: 10
  },
  settings: {
    marginTop: 20,
    flex: 1,
    backgroundColor: '#121212', // Settings background color
  },
  btnTextDanger: {
    fontSize: 17,
    fontFamily: "System",
    color: "#cf6679", // Danger text color
    fontWeight: "400",
  },
});
