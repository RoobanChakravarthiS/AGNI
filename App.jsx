import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import BottomTab from './components/BottomTab';
import MapScreen from './components/Map';
import Details from './components/Details';
import Scan from './components/Scan';
import PushNotification from 'react-native-push-notification';
import Norms from './components/Norms';
import FinalPage from './components/FinalPage';
import LottiePage from './components/complete';
const Stack = createNativeStackNavigator();

const App = () => {
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const getToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
    } catch (error) {
      console.log('Error getting FCM token:', error);
    }
  };

  const createNotificationChannel = async () => {
    try {
      PushNotification.createChannel(
        {
          channelId: "default-channel", // (required)
          channelName: "Default Channel", // (required)
          channelDescription: "A default channel", // (optional)
          soundName: 'default', // (optional)
          importance: PushNotification.Importance.HIGH, // Correct priority level
          vibrate: true, // (optional)
        },
        (created) => console.log(`createChannel returned '${created}'`)
      );
      console.log('Notification channel created');
    } catch (error) {
      console.log('Error creating notification channel:', error);
    }
  };

  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission granted');
      } else {
        console.log('Notification permission denied');
      }
    }
  };

  useEffect(() => {
    requestUserPermission();
    getToken();
    createNotificationChannel();
    requestNotificationPermission();

    // Foreground message handler
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('Message received in foreground:', remoteMessage);
      await notifee.displayNotification({
        title: remoteMessage.notification?.title || 'No Title',
        body: remoteMessage.notification?.body || 'No Body',
        android: {
          channelId: 'default',
        },
      });
    });

    // Background message handler
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message received in background:', remoteMessage);
    });

    return unsubscribe; // Cleanup listener
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="BottomTab" component={BottomTab} />
          <Stack.Screen name="maps" component={MapScreen} />
          <Stack.Screen name="details" component={Details} />
          <Stack.Screen name="Scan" component={Scan} />
          <Stack.Screen name='norms' component={Norms} />
          <Stack.Screen name='final' component={FinalPage} />
          <Stack.Screen name='lottie' component={LottiePage} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
