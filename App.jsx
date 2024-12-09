import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
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
