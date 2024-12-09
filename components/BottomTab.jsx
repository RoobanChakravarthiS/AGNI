import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './Home'; // Ensure this points to your Home component
import ProfileScreen from './Profile'; // Ensure this points to your Profile component
import ScanScreen from './Scan'; // Ensure this points to your Scan component
import {Button} from 'react-native-paper';
// Import image assets
import HomeIcon from '../assets/to-do.png';
import ProfileIcon from '../assets/user.png';
import ScanIcon from '../assets/qr-scan.png';
import { sendNotification } from '../index';
const Tab = createBottomTabNavigator();

const BottomTab = () => {
  const handleNotificationpress =()=>{
    console.log('Notification pressed');
    sendNotification();
  }
  return (
    <Tab.Navigator initialRouteName='Home'
      screenOptions={({route}) => ({
        tabBarStyle: styles.tabBarStyle,
        tabBarActiveTintColor: '#ff8400', // Active icon color
        tabBarInactiveTintColor: '#3e3e3e', // Inactive icon color
        tabBarPressColor: '#ff8400',
        headerShown: true, // Hides the header bar
        animation: 'shift',
        tabBarIcon: ({focused}) => {
          let iconSource;

          // Define icons for each route
          if (route.name === 'Home') {
            iconSource = HomeIcon;
          } else if (route.name === 'Scan') {
            iconSource = ScanIcon;
          } else if (route.name === 'Profile') {
            iconSource = ProfileIcon;
          }

          // Return image for tab icon
          return (
            <Image
              source={iconSource} 
              style={[
                styles.icon,
                {tintColor: focused ? '#ff8400' : '#3e3e3e'},
              ]}
            />
          );
        },
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: 'Inspection',
          headerTitleStyle: {fontFamily: 'DMSans ExtraBold'}, // Correct way to set title
          headerRight: () => (
            <Button onPress={()=>handleNotificationpress()}>
              <Image
                source={require('../assets/notifications.png')}
                style={{width: 24, height: 24}}
              />
            </Button>
          ),
        }}
      />

      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarLabel: '', // Hide the label for the middle tab
          tabBarIcon: ({focused}) => (
            <View
              style={[
                styles.scanButtonContainer,
                focused && styles.scanButtonFocused,
              ]}>
              <Image
                source={ScanIcon}
                style={[
                  styles.scanIcon,
                  {tintColor: focused ? '#fff' : '#ff8400'},
                ]}
              />
            </View>
          ),
          tabBarPressColor: '#ffeecc', // Custom ripple color for this specific tab
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={ProfileIcon}
              style={[
                styles.icon,
                {tintColor: focused ? '#ff8400' : '#3e3e3e'},
              ]}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 65, // Adjust height of the tab bar
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    position: 'absolute', // Floating effect
    left: 0,
    right: 0,
    bottom: 0,
  },
  icon: {
    width: 24, // Set the width of the icons
    height: 24, // Set the height of the icons
  },
  scanButtonContainer: {
    width: 60,
    height: 60,
    borderRadius: 30, // Circular button
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // Raise the button above the tab bar
    elevation: 5,
  },
  scanButtonFocused: {
    backgroundColor: '#ff8400',
    shadowColor: '#ff8400',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  scanIcon: {
    width: 30, // Adjust the size of the Scan icon
    height: 30,
  },
});
