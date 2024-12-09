import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import messaging from '@react-native-firebase/messaging';
import BottomTab from './components/BottomTab';
import MapScreen from './components/Map';
import Details from './components/Details';
import Scan from './components/Scan';
import PushNotification from 'react-native-push-notification';
import Norms from './components/Norms';
import FinalPage from './components/FinalPage';
import LottiePage from './components/complete';
// import Toast from 'react-native-toast-message';
// import { ToastConfigoastConfig } from './components/Toastconfig.js';
// import { toastConfig } from './components/toastconfig';
import Login from './components/Login';
import Toast from 'react-native-toast-message';
import FillCode from './components/FillCode';
const Stack = createNativeStackNavigator();

const App = () => {
  const checkApplicationPermission = async()=>{
    if(Platform.OS === 'android'){
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission granted');
        } else {
          console.log('Notification permission denied');
        }
      }
      catch(error) {
        console.log(error);
      }

    }
  }

  const requestUserPermission = async()=>{
    const authStatus = await messaging().requestPermission();
    console.log('Authorization Status:',authStatus);
    return(
      authStatus ===messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus ===messaging.AuthorizationStatus.PROVISIONAL
    );
  }
  

  useEffect(()=>{
    checkApplicationPermission();
    if(requestUserPermission()){
      messaging()
        .getToken()
        .then(fcmToken =>{
          console.log('fcmToken:',fcmToken);
        })
    }
    else{
      console.log(' not Authorization Status');
    }


    messaging()
      .getInitialNotification()
      .then(async remoteMessage =>{
        if(remoteMessage){
          console.log('getInitialNotificaiton:' + 'notifications caused app to open from quit state')
          console.log(remoteMessage)
          Alert.alert('getInitialNotificaiton:' + 'notifications caused app to open from quit state')
        }

      })


    messaging()
      .onNotificationOpenedApp(async remoteMessage =>{
        if(remoteMessage){
          console.log('onNotificationOpendApp:' + 'notifications caused app to open from background state')
          console.log(remoteMessage)
          Alert.alert('onNotificationOpendApp:' + 'notifications caused app to open from background state')
        }

      })

    messaging().setBackgroundMessageHandler(async remoteMessage=>{
      console.log('Message handled in the background',remoteMessage)
    })

    const unsubscribe = messaging().onMessage(async remoteMessage=>{
      alert('A new FCM message has arrived')
      console.log('A new FCM message has arrived',JSON.stringify(remoteMessage))
    })


    // messaging().subscribeToTopic(TOPIC)
    // .then(()=>{
    //   console.log(`Topic:${TOPIC} Subscribed`)
    // })

    return()=>{
      unsubscribe
    }
  })



  
  return (
    <PaperProvider>
      <NavigationContainer>

        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name='login' component={Login} />
          <Stack.Screen name="BottomTab" component={BottomTab} />
          <Stack.Screen name='code' component={FillCode} />
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
