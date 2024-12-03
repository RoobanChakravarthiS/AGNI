import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, StyleSheet, Image } from 'react-native';
import { 
  Provider as PaperProvider, 
  Button 
} from 'react-native-paper';
import Login from './components/Login';
import BottomTab from './components/BottomTab';
import MapScreen from './components/Map';
import Details from './components/Details';
import Scan from './components/Scan';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{
            headerShown: false,
            
          }}>
          {/* Uncomment the line below to enable Login screen */}
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="BottomTab" component={BottomTab} />
          <Stack.Screen name="maps" component={MapScreen} />
          <Stack.Screen name="details" component={Details} />
          <Stack.Screen name="Scan" component={Scan} />
          {/* Uncomment the line below to enable Details screen */}
          {/* <Stack.Screen name="Details" component={DetailsScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginVertical: 16,
  },
  button: {
    marginBottom: 16,
  },
  card: {
    marginTop: 16,
  },
});

export default App;
