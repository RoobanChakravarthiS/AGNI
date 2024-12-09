import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Modal,
} from "react-native";
import { Avatar, Card } from "react-native-paper";
import { launchImageLibrary } from "react-native-image-picker";
import Toast from "react-native-toast-message";
import axios from "axios";
import EncryptedStorage from "react-native-encrypted-storage";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const Profile = () => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [photoType, setPhotoType] = useState(null); // "profile" or "cover"
  const [userData, setUserData] = useState(null);

  const getUser = useCallback(async () => {
    try {
      const userId = await EncryptedStorage.getItem("userid");
      const token = await EncryptedStorage.getItem("session_token");
      const userResponse = await axios.get(
        `http://192.168.3.154:1703/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (userResponse.status === 200) {
        setUserData(userResponse.data);
      }
    } catch (userError) {
      Toast.show({
        type: "error",
        text1: "Error Fetching User Details",
        text2: "Please check your Internet connection.",
      });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getUser();
      console.log('idhu schedule',userData)
    }, [getUser])
  );

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: "photo", quality: 1 }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        if (photoType === "profile") {
          setProfilePhoto(response.assets[0].uri); // Set the selected profile photo
        } else if (photoType === "cover") {
          setCoverPhoto(response.assets[0].uri); // Set the selected cover photo
        }
      }
      setModalVisible(false);
    });
  };

  const handlePhotoPress = (type) => {
    setPhotoType(type);
    setModalVisible(true);
  };

  const initials = userData?.username
    ? userData.username
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "NA";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cover Image */}
      <TouchableOpacity onPress={() => handlePhotoPress("cover")}>
        <ImageBackground
          source={
            coverPhoto
              ? { uri: coverPhoto }
              : { uri: "https://via.placeholder.com/800x200" }
          }
          style={styles.coverImage}
        />
      </TouchableOpacity>

      {/* Profile Image */}
      <TouchableOpacity
        onPress={() => handlePhotoPress("profile")}
        style={styles.avatarWrapper}
      >
        {profilePhoto ? (
          <Avatar.Image size={120} source={{ uri: profilePhoto }} />
        ) : (
          <Avatar.Text size={120} label={initials} style={styles.avatar} />
        )}
      </TouchableOpacity>

      {/* Username and User Type */}
      <Text style={styles.name}>{userData?.username || "John Doe"}</Text>
      <Text style={styles.title}>
        {userData?.user_type || "Inspector"}
      </Text>

      {/* About Me Section (Including Station, District, and Village) */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.text}>
            {`Inspector for ${userData?.officer_details?.district || "N/A"}, ${
              userData?.officer_details?.village || "N/A"
            }. Station: ${userData?.officer_details?.station || "N/A"}`}
          </Text>
        </Card.Content>
      </Card>

      {/* Officer History (ScheduleDetails) */}
      {userData?.scheduleDetails?.length > 0 && (
        <>
          <Text style={styles.historyTitle}>Officer History</Text>
          {userData.scheduleDetails.map((schedule, index) => (
            <Card key={index} style={styles.card}>
              <Card.Content>
                <Text style={styles.sectionTitle}>Schedule {index + 1}</Text>
                <Text style={styles.text}>Timestamp: {schedule.timestamp}</Text>
                <Text style={styles.text}>User ID: {schedule.user_id}</Text>
                <Text style={styles.text}>User Type: {schedule.user_type}</Text>
                <Text style={styles.text}>Username: {schedule.username}</Text>
              </Card.Content>
            </Card>
          ))}
        </>
      )}

      {/* Modal for Image Options */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select an option</Text>
            <TouchableOpacity onPress={handleImagePick} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Edit Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            >
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
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20, // Padding top for better scroll behavior
  },
  coverImage: {
    width: width,
    height: 200,
    backgroundColor: "#bfbfbf",
  },
  avatarWrapper: {
    alignSelf: "center",
    marginTop: -60,
  },
  avatar: {
    backgroundColor: "#ff8400",
  },
  name: {
    fontFamily: "DMSans-Bold",
    fontSize: 24,
    color: "#2b2e36",
    textAlign: "center",
    marginTop: 10,
  },
  title: {
    fontFamily: "DM Sans-Regular",
    fontSize: 18,
    color: "#bfbfbf",
    textAlign: "center",
  },
  card: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    elevation: 4,
  },
  sectionTitle: {
    fontFamily: "DMSans-Bold",
    fontSize: 18,
    color: "#2b2e36",
    marginBottom: 10,
  },
  text: {
    fontFamily: "DM Sans-Regular",
    fontSize: 16,
    color: "#2b2e36",
  },
  historyTitle: {
    fontFamily: "DMSans-Bold",
    fontSize: 20,
    color: "#2b2e36",
    marginTop: 20,
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontFamily: "DMSans-Bold",
    fontSize: 18,
    color: "#2b2e36",
    marginBottom: 20,
  },
  modalButton: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#ff8400",
    borderRadius: 6,
  },
  modalButtonText: {
    fontFamily: "DMSans-Bold",
    color: "#fff",
  },
});

export default Profile;
