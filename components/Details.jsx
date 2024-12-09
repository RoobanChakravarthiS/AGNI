import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';

const Details = ({ route, navigation }) => {
  const data = route.params;


  // console.log(data)
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {/* Building Name */}
        <View style={[styles.section, styles.largeSection]}>
          <Text style={styles.sectionTitle}>Building Name</Text>
          <Text style={styles.sectionValue}>{data.formdata["Application Details"]["Building and address details"]["Building Name"]}</Text>
        </View>

        {/* Applicant Information */}
        <View style={[styles.section, styles.mediumSection]}>
          <Text style={styles.sectionTitle}>Applicant Information</Text>
          <Text style={styles.sectionValue}>Name: {data.formdata["Application Details"]["Building and address details"]["Applicant Name"]}</Text>
          <Text style={styles.sectionValue}>Mobile: {data.formdata["Application Details"]["Contact Details"]["Mobile Number"]}</Text>
          <Text style={styles.sectionValue}>Email: {data.formdata["Application Details"]["Contact Details"]["Email ID"]}</Text>
        </View>

        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          <Text style={styles.sectionValue}>{`${data.formdata["Application Details"]["Building and address details"]["Door / Flat No."]}, ${data.formdata["Application Details"]["Building and address details"]["Street No. / Name"]}, ${data.formdata["Application Details"]["Building and address details"]["Revenue Village"]}`}</Text>
          <Text style={styles.sectionValue}>
            State: {data.formdata["Application Details"]["Building and address details"].State}, District: {data.formdata["Application Details"]["Building and address details"].District}, Taluk: {data.formdata["Application Details"]["Building and address details"].Taluk}, Pincode: {data.formdata["Application Details"]["Building and address details"].Pincode}
          </Text>
        </View>

        {/* Building Details */}
        <View style={[styles.section, styles.mediumSection]}>
          <Text style={styles.sectionTitle}>Building Details</Text>
          <Text style={styles.sectionValue}>Type: {data.formdata["Application Details"]["General Particulars"]["Type of Occupancy"]}</Text>
          <Text style={styles.sectionValue}>Height: {data.formdata["Application Details"]["General Particulars"]["Height of the Building (m)"]}</Text>
          <Text style={styles.sectionValue}>Entrance Width: {data.formdata["Application Details"]["General Particulars"]["Entrance Width (m)"]}</Text>
          <Text style={styles.sectionValue}>Entrance Height: {data.formdata["Application Details"]["General Particulars"]["Entrance Height (m)"]}</Text>
          <Text style={styles.sectionValue}>Approach Road Width: {data.formdata["Application Details"]["General Particulars"]["Approach Road Width (m)"]}</Text>
        </View>

        {/* Setbacks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Setbacks</Text>
          <Text style={styles.sectionValue}>North: {data.formdata["Application Details"]["Set Back All Around the Building on Four Directions"]["North (m)"]}</Text>
          <Text style={styles.sectionValue}>South: {data.formdata["Application Details"]["Set Back All Around the Building on Four Directions"]["South (m)"]}</Text>
          <Text style={styles.sectionValue}>East: {data.formdata["Application Details"]["Set Back All Around the Building on Four Directions"]["East (m)"]}</Text>
          <Text style={styles.sectionValue}>West: {data.formdata["Application Details"]["Set Back All Around the Building on Four Directions"]["West (m)"]}</Text>
        </View>
      </View>

      {/* Floating Start Inspection Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => {
          // Start inspection logic
          navigation.navigate('Scan')
          alert('Inspection Started');
        }}
      >
        <Text style={styles.startButtonText}>Start Inspection</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    shadowColor: '#2b2e36',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  section: {
    marginBottom: 20,
  },
  largeSection: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  mediumSection: {
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontFamily: 'DMSans Bold',
    fontSize: 16,
    color: '#2b2e36',
    marginBottom: 8,
  },
  sectionValue: {
    fontFamily: 'DM Sans Regular',
    fontSize: 14,
    color: '#6e6e6e',
    marginBottom: 6,
  },
  startButton: {
    backgroundColor: '#ff8400',
    position: 'absolute',
    bottom: 30,
    right: 20,
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 25,
    shadowColor: '#2b2e36',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  startButtonText: {
    fontFamily: 'DMSans Bold',
    color: '#fff',
    fontSize: 16,
  },
});

export default Details;
