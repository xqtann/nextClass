import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert, TouchableWithoutFeedback, TouchableOpacity, Modal, Switch } from 'react-native';
import TextInput from "react-native-text-input-interactive";
import { ThemedButton } from 'react-native-really-awesome-button';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { getAuth, updatePassword, deleteUser, updateProfile } from "firebase/auth";
import { addDoc, collection } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsButton from '../components/SettingsButton';
import Toast from 'react-native-toast-message';

export default function Account({ navigation }) {

  const auth = getAuth();
  const user = auth.currentUser;
  const [storedUser, setStoredUser] = useState('');
  const [openModal, setModal] = useState(false);
  const [mode, setMode] = useState(0);
  const [newUsername, setNewUsername] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [feedback, setFeedback] = useState(null); 
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        console.log('Stored data:', storedUsername);
        if (storedUsername) {
          setStoredUser(storedUsername);
        } else {
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };
    loadData();
  }, []);

const confirmDeleteUser = () => {
  Alert.alert(
    `Delete ${user.displayName}`,
    'Are you sure you want to \ndelete this user?\nThis action cannot be undone.',
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { deleteUser(user).then(() => {navigation.navigate("Login"); AsyncStorage.removeItem("username");}).catch((error) => {console.error(error)})}}
    ]
  );
};

const newPasswordHandler = (newPassword) => {
  setNewPassword("");
  updatePassword(user, newPassword).then(() => console.log("Password updated")).catch((error) => console.error(error));
  showToast("Password updated!");
}
const newUsernameHandler = (newUsername) => {
  setNewUsername("");
  updateProfile(user, {displayName: newUsername}).then(() => console.log("Username updated")).catch((error) => console.error(error));
  FIREBASE_AUTH.signOut();
  navigation.navigate("Login"); 
  AsyncStorage.removeItem("username");
} 


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

  const renderModal = () => {
    return (
        <Modal
            visible={openModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setModal(false)} >
            <TouchableWithoutFeedback onPress={() => setModal(false)}>
                <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity style={styles.closeButton} onPress={() => setModal(false)}>
                                <Text style={styles.closeButtonText}>X</Text>
                            </TouchableOpacity>
                            { mode == 1 ? 
                            (<>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Change Username</Text>
                            <Text style={styles.modalText}>Requires Re-Login</Text>
                            <TextInput
                              textInputStyle={styles.input}
                              placeholder="New username"
                              autoCapitalize="none"
                              onChangeText={(text) => setNewUsername(text)}
                              value={newUsername} />
                            </>)
                            : mode == 2 ? 
                            (<>
                            <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>Change Password</Text>
                            <TextInput
                            textInputStyle={styles.input}
                            placeholder="New password"
                            secureTextEntry={true}
                            autoCapitalize="none"
                            onChangeText={(text) => setNewPassword(text)}
                            value={newPassword} />
                            </>)
                            : mode == 3 ? 
                            (<>
                            <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>Feedback and Suggestions</Text> 
                            <TextInput
                            textInputStyle={styles.input}
                            placeholder="Suggestion"
                            autoCapitalize="none"
                            onChangeText={(text) => setFeedback(text)}
                            value={feedback} />
                            </>)
                            : "" }
                            <View style={styles.buttonGroup}>
                                <Button title="Cancel" onPress={() => {setModal(false)}} />
                                <Button title="OK" onPress={() => {setModal(false); 
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
      <View style={!darkMode ? styles.container : stylesDark.container}>
        <Text style={!darkMode ? styles.text : stylesDark.text}>{user ? user.displayName : storedUser} </Text>
        {renderModal()}
        <View style={styles.settings}>
          <SettingsButton icon={require('../assets/compare.png')} title="Light/Dark Mode" onPress={()=>setDarkMode(!darkMode)}/>
          <SettingsButton icon={require('../assets/text-account.png')} title="Change Username" onPress={()=>{setMode(1); setModal(true)}}/>
          <SettingsButton icon={require('../assets/key.png')} title="Change Password" onPress={()=>{setMode(2); setModal(true)}}/>
          <SettingsButton icon={require('../assets/lightbulb.png')} title="Feedback and Suggestions" onPress={()=>{setMode(3); setModal(true)}}/>
          <SettingsButton textStyle={styles.btnTextDanger} icon={require('../assets/trash-can.png')} title="Delete Profile" onPress={()=>confirmDeleteUser()}/>
        </View>
        {user || storedUser != '' ? 
        <ThemedButton name="rick" type="primary" style={styles.button} onPress={() => {
          FIREBASE_AUTH.signOut(); 
          navigation.navigate("Login"); 
          AsyncStorage.removeItem("username")
          }}>
            LogOut
            </ThemedButton> : ""}
            <Toast 
            position='top'
            topOffset={-20}
            />
      </View>
    )
}

// AsyncStorage.removeItem("username");

const styles = StyleSheet.create({
  container: {
      flex: 1,
      margin: 20,
  },
  text: {
      fontSize: 30,
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
      width: 300
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
})


const stylesDark = StyleSheet.create({
  container: {
      flex: 1,
      margin: 20,
      backgroundColor: "#222222"
  },
  text: {
      fontSize: 30,
      textAlign: "right",
      fontFamily: "System",
      fontWeight: 'bold',
      color: "white"
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
      width: 300
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
})

