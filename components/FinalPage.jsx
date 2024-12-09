import axios from 'axios';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Modal } from 'react-native-paper';
import Video from 'react-native-video';

const FinalPage = ({ navigation, route }) => {
  const data = route.params || {};
  console.log(data);

  // State to hold the remarks
  const [remarks, setRemarks] = useState({});
  const [visibleMedia, setVisibleMedia] = useState({}); // To control the media visibility
  const [visibleRemarkInput, setVisibleRemarkInput] = useState({}); // To control the visibility of the remark input field
  const [recommendation, setRecommendation] = useState(''); // To store final recommendation
  const [isVisible,setIsVisible] = useState(false)
  const [secretCode, setSecretCode]  = useState()
  const [error, setError] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const url =`http://192.168.3.154:1111`
  // Convert object to array format for FlatList
  const dataArray = Object.entries(data).map(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      return {
        key, // Norm description
        value: Object.values(value).filter((v) => typeof v === 'string').join('') || 'N/A', // Concatenate string responses (if any)
        photo: value.Photo || null, // Extract Photo (if available)
        video: value.video || null, // Extract Video (if available)
      };
    } else {
      return {
        key, // Norm description
        value: value || 'N/A', // Response (Yes/No or N/A)
        media: null, // No media for primitive values
        remark: '', // No remark for primitive values
      };
    }
  });

  // Handle Show Media button
  const toggleMediaVisibility = (key) => {
    setVisibleMedia((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Handle Add Remark button
  const toggleRemarkInputVisibility = (key) => {
    setVisibleRemarkInput((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Save remark for a specific key
  const handleSaveRemark = (key, text) => {
    setRemarks((prev) => ({
      ...prev,
      [key]: text,
    }));
    toggleRemarkInputVisibility(key); // Close the remark input after saving
  };

  // Handle Recommend/Don't Recommend buttons (Final Submit)
  const handleRecommendation = (recommendationType) => {
    setRecommendation(recommendationType);
  };

  const closeModal = () =>{
    setIsVisible(false)
  }

  // Handle Close Case button (Finalize and navigate back)
  const handleCloseCase = () => {
    setIsVisible(true)
    // navigation.navigate('lottie');
  };


  const checkCode = () =>{
    const code = EncryptedStorage.getItem('code')
    if(secretCode === code){
      handleSubmitCase()
    }
    else{
      Alert.alert('Wrong credentials')
    }
  }
  const handleSubmitCase = async()=>{
    const res = await axios.post(`${url}/`)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inspection Summary</Text>

      {/* Render the list of norms */}
      <FlatList
        data={dataArray}
        keyExtractor={(item, index) => `${item.key}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.normText}>{item.key}</Text>
            <Text
              style={[styles.responseText, item.value === 'Yes' ? styles.yesText : styles.noText]}
            >
              {item.value}
            </Text>

            {/* Display remark if available */}
            {remarks[item.key] ? (
              <View style={styles.remarkContainer}>
                <Text style={styles.remarkTitle}>Remark:</Text>
                <Text style={styles.remarkText}>{remarks[item.key]}</Text>
              </View>
            ) : null}

            {/* Show Media Button */}
            {(item.photo || item.video) && (
              <TouchableOpacity
                style={styles.mediaButton}
                onPress={() => toggleMediaVisibility(item.key)}
              >
                <Text style={styles.mediaButtonText}>
                  {visibleMedia[item.key] ? 'Hide Media' : 'Show Media'}
                </Text>
              </TouchableOpacity>
            )}

            {/* Display media (image or video) if it's visible */}
            {visibleMedia[item.key] && (
              <View style={styles.mediaContainer}>
                {item.photo && (
                  <Image
                    source={{ uri: item.photo.uri }} // Show image from uri
                    style={styles.mediaThumbnail}
                    resizeMode="cover"
                  />
                )}
                {item.video && (
                  <Video
                    source={{ uri: item.video.uri }} // Show video from uri
                    style={styles.mediaThumbnail}
                    resizeMode="cover"
                    controls // Add controls for the video player
                  />
                )}
              </View>
            )}

            {/* Add Remark Button */}
            <TouchableOpacity
              style={styles.addRemarkButton}
              onPress={() => toggleRemarkInputVisibility(item.key)}
            >
              <Text style={styles.addRemarkText}>Add Remark</Text>
            </TouchableOpacity>

            {/* Collapsible Remark Input Field */}
            {visibleRemarkInput[item.key] && (
              <View style={styles.remarkInputContainer}>
                <TextInput
                  style={styles.remarkInput}
                  placeholder="Enter your remark"
                  multiline
                  onChangeText={(text) => handleSaveRemark(item.key, text)}
                  value={remarks[item.key] || ''}
                />
                <TouchableOpacity
                  style={styles.saveRemarkButton}
                  onPress={() => handleSaveRemark(item.key, remarks[item.key])}
                >
                  <Text style={styles.saveRemarkText}>Save Remark</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />

      {/* Recommend / Don't Recommend Buttons (Submit) */}
      <View style={styles.recommendationContainer}>
        <TouchableOpacity
          style={[styles.recommendButton, recommendation === 'recommend' && styles.selectedButton]}
          onPress={() => handleRecommendation('recommend')}
        >
          <Text style={styles.buttonText}>Recommend</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.recommendButton, recommendation === 'dontRecommend' && styles.selectedButton]}
          onPress={() => handleRecommendation('dontRecommend')}
        >
          <Text style={styles.buttonText}>Don't Recommend</Text>
        </TouchableOpacity>
      </View>

      {/* Display the final recommendation status */}
      {recommendation && (
        <View style={styles.finalRecommendationContainer}>
          <Text style={styles.finalRecommendationText}>
            Final Recommendation: {recommendation === 'recommend' ? 'Recommend' : 'Don\'t Recommend'}
          </Text>
        </View>
      )}

      {/* Close Case Button */}
      <TouchableOpacity
        style={styles.closeCaseButton}
        onPress={handleCloseCase}
      >
        <Text style={styles.buttonText}>Submit Report</Text>
      </TouchableOpacity>
      <Modal
          visible={isVisible}
          onDismiss={closeModal}
          contentContainerStyle={styles.modalstyles}
        >
          <View style={styles.container}>
      <Text style={styles.label}>Enter the Secret Code</Text>
      <TextInput
        label="Secret Code"
        value={code}
        mode="flat"
        style={[
          styles.textInput,
          focusedField === 'code' && styles.focusedTextInput,
          error && styles.errorInput, // Apply error styling if there's an error
        ]}
        theme={{
          colors: {
            primary: '#ff8400',
            placeholder: '#bfbfbf',
            text: '#2b2e36',
            background: 'transparent',
          },
        }}
        onFocus={() => setFocusedField('code')}
        onBlur={() => setFocusedField(null)}
        onChangeText={text => setSecretCode(text)}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button
        mode="contained"
        onPress={checkCode}
        style={styles.submitButton}
        labelStyle={styles.buttonLabel}>
        Submit
      </Button>
    </View>
      </Modal>

    </View>
  );
};

export default FinalPage;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'DMSans Bold',
    color: '#2b2e36',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  normText: {
    fontSize: 16,
    fontFamily: 'DM Sans Regular',
    color: '#2b2e36',
    marginBottom: 5,
  },
  responseText: {
    fontSize: 16,
    fontFamily: 'DMSans Bold',
  },
  yesText: {
    color: 'green',
  },
  noText: {
    color: 'red',
  },
  remarkContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  remarkTitle: {
    fontSize: 14,
    fontFamily: 'DMSans Bold',
    color: '#2b2e36',
  },
  remarkText: {
    fontSize: 14,
    fontFamily: 'DMSans Regular',
    color: '#2b2e36',
    marginTop: 5,
  },
  mediaButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ff8400',
    borderRadius: 5,
    alignItems: 'center',
  },
  mediaButtonText: {
    color: '#fff',
    fontFamily: 'DMSans Bold',
    fontSize: 14,
  },
  mediaContainer: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaThumbnail: {
    width: 300,
    height: 200,
    borderRadius: 10,
  },
  addRemarkButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#2b2e36',
    borderRadius: 5,
    alignItems: 'center',
  },
  addRemarkText: {
    color: '#fff',
    fontFamily: 'DMSans Bold',
    fontSize: 14,
  },
  remarkInputContainer: {
    marginTop: 10,
  },
  remarkInput: {
    height: 100,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    fontFamily: 'DM Sans Regular',
    color: '#2b2e36',
    fontSize: 14,
    textAlignVertical: 'top',
  },
  saveRemarkButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ff8400',
    borderRadius: 5,
    alignItems: 'center',
  },
  saveRemarkText: {
    color: '#fff',
    fontFamily: 'DMSans Bold',
    fontSize: 14,
  },
  recommendationContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recommendButton: {
    padding: 10,
    backgroundColor: '#2b2e36',
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#ff8400',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'DMSans Bold',
    fontSize: 14,
  },
  finalRecommendationContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
  },
  finalRecommendationText: {
    fontSize: 16,
    fontFamily: 'DMSans Bold',
    color: '#2b2e36',
  },
  closeCaseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ff8400',
    borderRadius: 5,
    alignItems: 'center',
  },
});
