import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';

// Request Notification Permissions
const requestPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
};

// Get FCM Token
const getToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    await EncryptedStorage.setItem('fcmToken', token); // Save token for backend
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
};

// Handle Notifications
const handleNotifications = () => {
  // Foreground notification handling
  messaging().onMessage(async (remoteMessage) => {
    Alert.alert('New Notification', remoteMessage.notification.body);
  });

  // Background/Terminated notification handling
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Notification received in the background:', remoteMessage);
  });
};

// Initialize Notifications
const setupNotifications = async () => {
  await requestPermission();
  const token = await getToken();
  handleNotifications();
};

export default setupNotifications;
