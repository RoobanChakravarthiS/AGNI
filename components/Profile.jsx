import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Modal,
  Pressable,
} from 'react-native';
import {Avatar, Card} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import {Button} from 'react-native-paper';
const {width} = Dimensions.get('window');

const Profile = () => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [photoType, setPhotoType] = useState(null); // "profile" or "cover"

  const handleImagePick = () => {
    launchImageLibrary({mediaType: 'photo', quality: 1}, response => {
      if (!response.didCancel && !response.errorCode) {
        if (photoType === 'profile') {
          setProfilePhoto(response.assets[0].uri); // Set the selected profile photo
        } else if (photoType === 'cover') {
          setCoverPhoto(response.assets[0].uri); // Set the selected cover photo
        }
      }
      setModalVisible(false);
    });
  };

  const handlePhotoPress = type => {
    setPhotoType(type); // Set the type to either 'profile' or 'cover'
    setModalVisible(true); // Show the modal
  };

  const handleHistoryPress = () => {
    alert('Showing full history');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Header with Cover Image */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handlePhotoPress('cover')}>
          <ImageBackground
            source={
              coverPhoto
                ? {uri: coverPhoto}
                : {uri: 'https://via.placeholder.com/800x200'}
            }
            style={styles.coverImage}
            imageStyle={{borderTopLeftRadius: 8, borderTopRightRadius: 8}}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handlePhotoPress('profile')}
          style={styles.avatarWrapper}>
          <Avatar.Image
            size={120}
            source={
              profilePhoto
                ? {uri: profilePhoto}
                : {uri: 'https://via.placeholder.com/120'}
            }
            style={styles.avatar}
          />
        </TouchableOpacity>

        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.title}>Fire Safety Inspector</Text>
        <Text style={styles.station}>Station: Downtown Fire Station</Text>
      </View>

      {/* Bio Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.text}>
            Experienced Fire Safety Inspector with over 10 years of field
            expertise. Certified in advanced safety management, dedicated to
            ensuring fire prevention.
          </Text>
        </Card.Content>
      </Card>

      {/* Achievements Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <Text style={styles.text}>🏆 Fire Safety Excellence Award 2023</Text>
          <Text style={styles.text}>
            📜 Advanced Fire Safety Management Certification
          </Text>
        </Card.Content>
      </Card>

      {/* Work Rating */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Work Rating</Text>
          <Text style={styles.text}>
            ⭐ Rating: 4.8 / 5 (Based on 50+ inspections)
          </Text>
        </Card.Content>
      </Card>

      {/* Inspection History */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Inspection History</Text>
          <Text style={styles.text}>📝 ABC Building Inspection - Oct 2024</Text>
          <Text style={styles.text}>
            📝 XYZ Building Inspection - Sept 2024
          </Text>
          <Text style={styles.text}>📝 50+ inspections completed</Text>
        </Card.Content>
        <Button
          mode="contained"
          textColor="#FFFFFF"
          onPress={() => console.log('show')}
          style={styles.showHistoryButton}>
          <Text style={styles.showHistoryButtonText}>Show Full History</Text>
        </Button>
      </Card>

      {/* Modal for Image Options */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select an option</Text>
            <TouchableOpacity
              onPress={handleImagePick}
              style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Edit Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}>
              <Text style={styles.modalButtonText}>View Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f8f8',
    // padding: 20,
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  header: {
    backgroundColor: '#fff',
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 20,
  },
  coverImage: {
    width: width,
    height: 200,
    backgroundColor: '#d0d0d0', // Placeholder for cover photo
  },
  avatar: {
    // borderWidth: 4,
    borderColor: '#bfbfbf',
    marginTop: -60,
  },
  name: {
    fontFamily: 'DMSans Bold',
    fontSize: 32,
    color: '#2b2e36',
    marginTop: 10,
  },
  title: {
    fontFamily: 'DM Sans Regular',
    fontSize: 20,
    color: '#6c6c6c',
    marginTop: 5,
  },
  station: {
    fontFamily: 'DM Sans Regular',
    fontSize: 14,
    color: '#6c6c6c',
    marginTop: 5,
  },
  card: {
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 20,
    shadowColor: '#2b2e36',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 8,
    elevation: 8,
  },
  sectionTitle: {
    fontFamily: 'DMSans Bold',
    fontSize: 24,
    color: '#2b2e36',
    marginBottom: 10,
  },
  text: {
    fontFamily: 'DM Sans Regular',
    fontSize: 16,
    color: '#6c6c6c',
    marginBottom: 6,
  },
  showHistoryButton: {
    marginTop: 15,
    backgroundColor: '#ff8400',
    borderRadius: 3,
    alignItems: 'center',
  },
  showHistoryButtonText: {
    fontFamily: 'DMSans Bold',
    color: '#fff',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'DMSans Bold',
    fontSize: 18,
    color: '#2b2e36',
    marginBottom: 20,
  },
  modalButton: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#ff8400',
    borderRadius: 30,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#2b2e36',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 8,
    elevation: 8,
  },
  modalButtonText: {
    fontFamily: 'DMSans Bold',
    color: '#fff',
    fontSize: 16,
  },
  
});

export default Profile;
