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
          <Text style={styles.sectionValue}>{data.details.ApplicationDetail.BuildingName}</Text>
        </View>

        {/* Applicant Information */}
        <View style={[styles.section, styles.mediumSection]}>
          <Text style={styles.sectionTitle}>Applicant Information</Text>
          <Text style={styles.sectionValue}>Name: {data.details.ApplicationDetail.ApplicantName}</Text>
          <Text style={styles.sectionValue}>Mobile: {data.details.ApplicationDetail.MobileNumber}</Text>
          <Text style={styles.sectionValue}>Email: {data.details.ApplicationDetail.Mail}</Text>
        </View>

        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          <Text style={styles.sectionValue}>{data.address}</Text>
          <Text style={styles.sectionValue}>
            State: {data.details.ApplicationDetail.State}, District: {data.details.ApplicationDetail.District}, Taluk: {data.details.ApplicationDetail.Taluk}, Pincode: {data.details.ApplicationDetail.Pincode}
          </Text>
        </View>

        {/* Building Details */}
        <View style={[styles.section, styles.mediumSection]}>
          <Text style={styles.sectionTitle}>Building Details</Text>
          <Text style={styles.sectionValue}>Type: {data.details.ApplicationDetail.TypeOfOccupancy}</Text>
          <Text style={styles.sectionValue}>Height: {data.details.ApplicationDetail.BuildingHeight}</Text>
          <Text style={styles.sectionValue}>Entrance Width: {data.details.ApplicationDetail.EntranceWidth}</Text>
          <Text style={styles.sectionValue}>Entrance Height: {data.details.ApplicationDetail.EntranceHeight}</Text>
          <Text style={styles.sectionValue}>Approach Road Width: {data.details.ApplicationDetail.ApproachRoadWidth}</Text>
        </View>

        {/* Setbacks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Setbacks</Text>
          <Text style={styles.sectionValue}>North: {data.details.ApplicationDetail.Setbacks.North}</Text>
          <Text style={styles.sectionValue}>South: {data.details.ApplicationDetail.Setbacks.South}</Text>
          <Text style={styles.sectionValue}>East: {data.details.ApplicationDetail.Setbacks.East}</Text>
          <Text style={styles.sectionValue}>West: {data.details.ApplicationDetail.Setbacks.West}</Text>
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
