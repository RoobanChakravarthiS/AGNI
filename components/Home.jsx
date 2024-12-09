import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Avatar, Button, Card, Text, Divider} from 'react-native-paper';
import Calendar from 'react-native-calendars/src/calendar';
import {PermissionsAndroid} from 'react-native';
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import Toast from 'react-native-toast-message';
import {tokens} from 'react-native-paper/lib/typescript/styles/themes/v3/tokens';
import LottieView from 'lottie-react-native';
const LeftContent = props => (
  <Avatar.Image
    {...props}
    size={40}
    source={require('../assets/user.png')}
    style={{backgroundColor: '#bfbfbf'}}
  />
);
const Home = ({navigation}) => {
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState();
  const getUser = async () => {
    const code = await EncryptedStorage.getItem('code');
    if (!code) {
      navigation.navigate('code');
    }
    try {
      // Retrieve session token and userId
      const token = await EncryptedStorage.getItem('session_token');
      const userId = await EncryptedStorage.getItem('userid');
      const code = await EncryptedStorage.getItem('code');
      // If no token, navigate to Login and stop further execution
      if (!token) {
        navigation.navigate('login');
        return;
      }

      // Verify token with the backend
      const authResponse = await axios.get(
        `https://sih-backend-zeta.vercel.app/auth`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );

      if (authResponse.status === 200) {
        // Fetch user data
        try {
          const userResponse = await axios.get(
            `http://192.168.3.154:1111/user/${userId}`,
            {
              headers: {Authorization: `Bearer ${token}`},
            },
          );

          if (userResponse.status === 200) {
            setUserData(userResponse.data); // Update user data state
            setEvents(userResponse.data);
            setLoading(false);
            console.log('events', events);
          }
        } catch (userError) {
          // Handle errors during user data fetching
          if (userError.response?.status === 404) {
            Toast.show({
              type: 'error',
              text1: 'Fetching User Details Failed',
              text2: 'Application not found.',
            });
          } else {
            console.log(userError);
            Toast.show({
              type: 'error',
              text1: 'Error Fetching User Details',
              text2: 'Please check your Internet connection.',
            });
          }
        }
      }
    } catch (authError) {
      console.error('Error during authentication:', authError);
      Toast.show({
        type: 'error',
        text1: 'Authentication Failed',
        text2: 'Please check your Internet connection.',
      });
    }
    
  };


  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  useEffect(() => {
    // Fetch user data and events
    getUser();
  }, []);
  
  useEffect(() => {
    if (events) {
      console.log('Events Updated:', events);
      handleFiltering();
    }
  }, [events]); // Run only when `events` updates
  
  useEffect(() => {
    console.log('Selected Date Updated:', selectedDate);
    if (events) {
      handleFiltering();
    }
  }, [selectedDate]); // Run only when `selectedDate` updates
  
  const handleFiltering = () => {
    console.log('Filtering with Events:', events);
    console.log('Selected Date:', selectedDate);
  
    const dateEvents = events.filter(event => {
      const eventDate = String(event.inspection_date);
      const selected = String(selectedDate);
      console.log(
        'Event Date:',
        eventDate,
        'Selected Date:',
        selected,
        'Match:',
        eventDate === selected,
      );
      return eventDate === selected;
    });
  
    setFilteredEvents(dateEvents);
    console.log('Filtered Events:', dateEvents);
  
    const datesWithEvents = events.reduce((acc, event) => {
      acc[event.inspection_date] = {marked: true, dotColor: '#ff8400'};
      return acc;
    }, {});
  
    setMarkedDates({
      ...datesWithEvents,
      [selectedDate]: {
        selected: true,
        selectedColor: '#ff8400',
        selectedTextColor: '#FFFFFF',
        marked: true,
        dotColor: '#ff8400',
      },
    });
  };
  

  const handleDetails = data => {
    console.log('details passed',data)
    navigation.navigate('details', data);
  };

  const renderEventItem = ({item}) => {
    return (
      <Card style={styles.card}>
        <Card.Title
          title={
            item.formdata['Application Details'][
              'Building and address details'
            ]['Building Name']
          }
          subtitle={`${item.formdata['Application Details']['Building and address details']['Door / Flat No.']}, ${item.formdata['Application Details']['Building and address details']['Street No. / Name']}, ${item.formdata['Application Details']['Building and address details']['Revenue Village']}`}
          left={LeftContent}
          titleStyle={styles.cardTitle}
          subtitleStyle={styles.cardSubtitle}
        />
        <Card.Content>
          <Text style={styles.statusText}>
            Type:{' '}
            {
              item.formdata['Application Details']['General Particulars'][
                'Type of Occupancy'
              ]
            }
          </Text>
          <Text style={styles.statusText}>
            Applicant:{' '}
            {
              item.formdata['Application Details'][
                'Building and address details'
              ]['Applicant Name']
            }
          </Text>
          <Text style={styles.remarkText}>
            Contact:{' '}
            {
              item.formdata['Application Details']['Contact Details'][
                'Mobile Number'
              ]
            }
          </Text>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <Button
            mode="contained"
            textColor="#FFFFFF"
            onPress={() => navigation.navigate('maps', item.location)}
            style={styles.okButton}>
            <Text style={styles.okbuttonText}>Directions</Text>
          </Button>
          <Button
            mode="eleveated"
            textColor="#2b2e36"
            onPress={() => handleDetails(item)}
            style={styles.detailsButton}>
            <Text style={styles.buttonText}>View Details</Text>
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          arrowColor: '#ff8400',
          todayTextColor: '#F4A300',
          textSectionTitleColor: '#333333',
          dayTextColor: '#333333',
          monthTextColor: '#2b2e36',
          dotColor: '#ff8400',
          selectedDotColor: '#FFFFFF',
        }}
        style={styles.calendar}
      />
      <Divider style={styles.divider} />
      {!loading ? (
        <>
          <Text style={styles.heading}>
            {filteredEvents.length > 0
              ? 'Scheduled Inspections'
              : 'No inspections for this date'}
          </Text>
          <FlatList
            data={filteredEvents}
            renderItem={renderEventItem}
            keyExtractor={item => item.id}
            contentContainerStyle={[
              styles.flatListContainer,
              filteredEvents.length === 0 && styles.emptyFlatList,
            ]}
            ListEmptyComponent={
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>
                  No inspections scheduled for this date.
                </Text>
              </View>
            }
          />
        </>
      ) : (
        <LottieView source={require('../assets/loading.json')} autoPlay loop style={styles.lottieView}/>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 14,
    fontFamily: 'DMSans Bold',
    color: '#2b2e36',
  },
  okbuttonText: {
    fontSize: 14,
    fontFamily: 'DMSans Bold',
    color: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2b2e36',
    marginTop: 15,
    marginBottom:15,
    marginLeft:4
  },
  divider: {
    height: 1,
    backgroundColor: '#bfbfbf',
    marginTop: 20,
  },
  lottieView: {
  width: '90%', // Adjust to your needs
  height: 350, // Adjust to your needs
  // alignSelf: 'center', // Center horizontally
  // marginVertical: 20, // Add vertical spacing
},

  card: {
    marginVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    elevation: 5,
    paddingVertical: 10,
  },
  cardTitle: {
    fontSize: 18,
    color: '#2b2e36',
    fontFamily: 'DMSans Bold',
  },
  cardSubtitle: {
    fontSize: 15,
    color: '#bfbfbf',
    fontFamily: 'DMSans Bold',
  },
  statusText: {
    fontSize: 15,
    color: '#2b2e36',
    fontFamily: 'DMSans Regular',
  },
  remarkText: {
    fontSize: 13,
    color: '#2b2e36',
    fontFamily: 'DM Sans Regular',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  okButton: {
    backgroundColor: '#ff8400',
    borderRadius: 4,
    color: '#fff',
    fontFamily: 'DM Sans Bold',
    // paddingVertical: 5,
  },
  detailsButton: {
    // width: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  flatListContainer: {
    // paddingBottom: 10, // Add vertical padding
    paddingHorizontal: 5, // Add horizontal padding
    backgroundColor: '#FFFFFF',
    paddingBottom: 150, // Set background color
  },
  emptyFlatList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0', // Light gray background for empty state
  },
  calendar: {
    height: 300, // Set your desired height here
    // marginBottom: 20, // Optional: add margin for spacing
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'DMSans-Regular',
    color: '#bfbfbf',
    textAlign: 'center',
  },
});

export default Home;
