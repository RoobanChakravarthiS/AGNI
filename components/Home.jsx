import React, {useState, useEffect} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Avatar, Button, Card, Text, Divider} from 'react-native-paper';
import Calendar from 'react-native-calendars/src/calendar';

const LeftContent = props => (
  <Avatar.Image
    {...props}
    size={40}
    source={require('../assets/user.png')}
    style={{backgroundColor: '#bfbfbf'}}
  />
);
const Home = ({navigation}) => {
  const events = [
    {
      id: 'ABC123001',
      inspectionDate: '2024-12-02',
      assignedInspector: 'Inspector Rajesh Kumar',
      details: {
        ApplicationDetail: {
          ApplicantName: 'John Doe',
          BuildingName: 'City Towers',
          State: 'Delhi',
          District: 'New Delhi',
          Taluk: 'Connaught Place',
          RevenueVillage: 'Connaught Village',
          DoorNo: '123',
          StreetNo: '45',
          Pincode: '110001',
          Landline: '011-12345678',
          MobileNumber: '123-456-7890',
          Mail: 'john.doe@example.com',
          TypeOfOccupancy: 'Residential',
          ApproachRoadWidth: '10 meters',
          EntranceWidth: '2 meters',
          EntranceHeight: '3 meters',
          BuildingHeight: '30 meters',
          Setbacks: {
            North: '5 meters',
            South: '6 meters',
            East: '4 meters',
            West: '5 meters',
          },
        },
        FloorDetails: {},
        MeansOfEscape: {},
        LiftDetails: {},
        FireCompartmentationDetails: {},
        FireProtection: {},
        FirePump: {},
        WaterSupply: {},
        AdditionalFireDetails: {},
        Checklist: {},
      },
      buildingType: 'MSB',
      status: 'Scheduled',
      remark: 'Inspection confirmed',
    },
    {
      id: 'DEF123002',
      inspectionDate: '2024-12-02',
      assignedInspector: 'Inspector Priya Sharma',
      details: {
        ApplicationDetail: {
          ApplicantName: 'Alice Johnson',
          BuildingName: 'Oak Residences',
          State: 'Delhi',
          District: 'South Delhi',
          Taluk: 'Saket',
          RevenueVillage: 'Saket Village',
          DoorNo: '67',
          StreetNo: '89',
          Pincode: '110017',
          Landline: '011-23456789',
          MobileNumber: '234-567-8901',
          Mail: 'alice.johnson@example.com',
          TypeOfOccupancy: 'Commercial',
          ApproachRoadWidth: '12 meters',
          EntranceWidth: '2.5 meters',
          EntranceHeight: '3.2 meters',
          BuildingHeight: '25 meters',
          Setbacks: {
            North: '6 meters',
            South: '5 meters',
            East: '4.5 meters',
            West: '5.5 meters',
          },
        },
        FloorDetails: {},
        MeansOfEscape: {},
        LiftDetails: {},
        FireCompartmentationDetails: {},
        FireProtection: {},
        FirePump: {},
        WaterSupply: {},
        AdditionalFireDetails: {},
        Checklist: {},
      },
      buildingType: 'MSB',
      status: 'Scheduled',
      remark: 'Preliminary inspection scheduled',
    },
    {
      id: 'GHI123003',
      inspectionDate: '2024-12-03',
      assignedInspector: 'Inspector Sunil Verma',
      details: {
        ApplicationDetail: {
          ApplicantName: 'Jane Smith',
          BuildingName: 'Pineview Apartments',
          State: 'Delhi',
          District: 'South West Delhi',
          Taluk: 'Vasant Vihar',
          RevenueVillage: 'Vasant Village',
          DoorNo: '78',
          StreetNo: '12',
          Pincode: '110057',
          Landline: '011-34567890',
          MobileNumber: '345-678-9012',
          Mail: 'jane.smith@example.com',
          TypeOfOccupancy: 'Mixed-use',
          ApproachRoadWidth: '15 meters',
          EntranceWidth: '3 meters',
          EntranceHeight: '3.5 meters',
          BuildingHeight: '20 meters',
          Setbacks: {
            North: '4 meters',
            South: '5 meters',
            East: '6 meters',
            West: '3 meters',
          },
        },
        FloorDetails: {},
        MeansOfEscape: {},
        LiftDetails: {},
        FireCompartmentationDetails: {},
        FireProtection: {},
        FirePump: {},
        WaterSupply: {},
        AdditionalFireDetails: {},
        Checklist: {},
      },
      buildingType: 'MSB',
      status: 'Scheduled',
      remark: 'Initial inspection confirmed',
    },
    {
      id: 'JKL123004',
      inspectionDate: '2024-12-05',
      assignedInspector: 'Inspector Meera Singh',
      details: {
        ApplicationDetail: {
          ApplicantName: 'Michael Lee',
          BuildingName: 'Dwarka Heights',
          State: 'Delhi',
          District: 'South West Delhi',
          Taluk: 'Dwarka',
          RevenueVillage: 'Dwarka Village',
          DoorNo: '45',
          StreetNo: '67',
          Pincode: '110075',
          Landline: '011-45678901',
          MobileNumber: '456-789-0123',
          Mail: 'michael.lee@example.com',
          TypeOfOccupancy: 'Residential',
          ApproachRoadWidth: '9 meters',
          EntranceWidth: '2 meters',
          EntranceHeight: '3 meters',
          BuildingHeight: '40 meters',
          Setbacks: {
            North: '3 meters',
            South: '4 meters',
            East: '5 meters',
            West: '2 meters',
          },
        },
        FloorDetails: {},
        MeansOfEscape: {},
        LiftDetails: {},
        FireCompartmentationDetails: {},
        FireProtection: {},
        FirePump: {},
        WaterSupply: {},
        AdditionalFireDetails: {},
        Checklist: {},
      },
      buildingType: 'MSB',
      status: 'Scheduled',
      remark: 'Inspection scheduled',
    },
    {
      id: 'MNO123005',
      inspectionDate: '2024-12-06',
      assignedInspector: 'Inspector Ramesh Gupta',
      details: {
        ApplicationDetail: {
          ApplicantName: 'Sophia Patel',
          BuildingName: 'Lajpat Plaza',
          State: 'Delhi',
          District: 'South Delhi',
          Taluk: 'Lajpat Nagar',
          RevenueVillage: 'Lajpat Village',
          DoorNo: '89',
          StreetNo: '23',
          Pincode: '110024',
          Landline: '011-56789012',
          MobileNumber: '567-890-1234',
          Mail: 'sophia.patel@example.com',
          TypeOfOccupancy: 'Commercial',
          ApproachRoadWidth: '14 meters',
          EntranceWidth: '3 meters',
          EntranceHeight: '3.5 meters',
          BuildingHeight: '50 meters',
          Setbacks: {
            North: '6 meters',
            South: '5 meters',
            East: '7 meters',
            West: '4 meters',
          },
        },
        FloorDetails: {},
        MeansOfEscape: {},
        LiftDetails: {},
        FireCompartmentationDetails: {},
        FireProtection: {},
        FirePump: {},
        WaterSupply: {},
        AdditionalFireDetails: {},
        Checklist: {},
      },
      buildingType: 'MSB',
      status: 'Scheduled',
      remark: 'Inspection confirmed',
    },
  ];
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    const dateEvents = events.filter(
      event => event.inspectionDate === selectedDate,
    );
    setFilteredEvents(dateEvents);
    const datesWithEvents = events.reduce((acc, event) => {
      acc[event.inspectionDate] = {marked: true, dotColor: '#ff8400'};
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
  }, [selectedDate]);

  const handleDetails = data => {
    console.log(data.details.ApplicationDetail.Setbacks)
    navigation.navigate('details', data);
  };

  const renderEventItem = ({item}) => {
   console.log(item)
    return (
      <Card style={styles.card}>
        <Card.Title
          title={item.details.ApplicationDetail.BuildingName}
          subtitle={`${item.details.ApplicationDetail.DoorNo}, ${item.details.ApplicationDetail.StreetNo}, ${item.details.ApplicationDetail.RevenueVillage}`}
          left={LeftContent}
          titleStyle={styles.cardTitle}
          subtitleStyle={styles.cardSubtitle}
        />
        <Card.Content>
          <Text style={styles.statusText}>Type: {item.buildingType}</Text>
          <Text style={styles.statusText}>Applicant: {item.details.ApplicationDetail.ApplicantName}</Text>
          <Text style={styles.remarkText}>Contact: {item.details.ApplicationDetail.MobileNumber}</Text>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <Button
            mode="contained"
            textColor="#FFFFFF"
            onPress={() => navigation.navigate('Scan')}
            style={styles.okButton}>
            <Text style={styles.buttonText}>Start Inspection</Text>
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 14,
    fontFamily:'DMSans Bold',
    color: '#2b2e36',
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
    marginVertical: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#bfbfbf',
    marginVertical: 10,
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
    fontFamily:'DMSans Bold'
  },
  cardSubtitle: {
    fontSize: 15,
    color: '#bfbfbf',
    fontFamily:'DMSans Bold'
  },
  statusText: {
    fontSize: 15,
    color: '#2b2e36',
    fontFamily:'DMSans Bold'
  },
  remarkText: {
    fontSize: 13,
    color: '#2b2e36',
    fontFamily:'DM Sans Regular'
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  okButton: {
    backgroundColor: '#ff8400',
    borderRadius: 4,
    
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
        paddingVertical: 10, // Add vertical padding
        paddingHorizontal: 5, // Add horizontal padding
        backgroundColor: '#FFFFFF',
        paddingBottom:150, // Set background color
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
});

export default Home;
