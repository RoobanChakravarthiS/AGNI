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
import { Modal ,Button } from 'react-native-paper';
import Video from 'react-native-video';


const FinalPage = ({ navigation, route }) => {
  // const data = route.params || {};
  // console.log(data);
  const [data, setData] = useState(route.params || {});
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
  const dataArray = Object.entries(data)

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
    // Update the data for the specific key with the new remark
    setData(prevData => ({
      ...prevData,
      [key]: {
        ...prevData[key],
        remark: text, // Save the remark to the correct item
      },
    }));
  
    // Close the remark input
    // toggleRemarkInputVisibility(key);
  };
  
  const saveRemark = ()=>{
    setVisibleRemarkInput(!visibleRemarkInput)
  }

  // Handle Recommend/Don't Recommend buttons (Final Submit)
  const handleRecommendation = (recommendationType) => {
    setData(prevData => ({
      ...prevData,
      Recommendation:recommendationType
    }));
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


  const checkCode = async () =>{
    const code = await EncryptedStorage.getItem('code')
    if(secretCode === code){
      console.log(data)
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
        keyExtractor={(item, index) => `${item[0]}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.normText}>{item[0]}</Text>
            <Text
              style={[styles.responseText, item[1].availability === 'Yes' ? styles.yesText : styles.noText]}
            >
              {item[1].availability}
            </Text>

            {/* Show Media Button */}
            {(item[1].photo) && (
              <TouchableOpacity
                style={styles.mediaButton}
                onPress={() => toggleMediaVisibility(item[0])}
              >
                <Text style={styles.mediaButtonText}>
                  {visibleMedia[item[0]] ? 'Hide Media' : 'Show Media'}
                </Text>
              </TouchableOpacity>
            )}

            {/* Display media (image or video) if it's visible */}
            {visibleMedia[item[0]] && (
              <View style={styles.mediaContainer}>
                {item[1].photo && (
                  <Image
                    source={{ uri: item[1].photo.uri }} // Show image from uri
                    style={styles.mediaThumbnail}
                    resizeMode="cover"
                  />
                )}
              </View>
            )}

            {/* Add Remark Button */}
            <TouchableOpacity
              style={styles.addRemarkButton}
              onPress={() => toggleRemarkInputVisibility(item[0])}
            >
              <Text style={styles.addRemarkText}>Add Remark</Text>
            </TouchableOpacity>

            {/* Collapsible Remark Input Field */}
            {visibleRemarkInput[item[0]] && (
              <View style={styles.remarkInputContainer}>
                <TextInput
                  style={styles.remarkInput}
                  placeholder="Enter your remark"
                  multiline
                  onChangeText={(text) => handleSaveRemark(item[0], text)}
                  value={item[1].remark || ''}
                />
                <TouchableOpacity
                  style={styles.saveRemarkButton}
                  onPress={() => saveRemark()}
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
        value={secretCode}
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

  // Modal Container
  modalstyles: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    width: '80%',
    height:'50%',
    alignSelf: 'center',
    // marginTop: '30%',
    elevation: 10, // Adds shadow for a modern look
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },

  // Label Text
  label: {
    fontSize: 18,
    fontFamily: 'DMSans Bold',
    color: '#2b2e36',
    marginBottom: 15,
    textAlign: 'left', // Aligned to the left for clarity
  },

  // Text Input for Secret Code
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingLeft: 15,
    fontFamily: 'DM Sans Regular',
    fontSize: 16,
    color: '#2b2e36',
    backgroundColor: '#f8f8f8',
    marginBottom: 20,
    width: '100%',
  },

  // Focused Text Input
  focusedTextInput: {
    borderColor: '#ff8400', // Color when the input is focused
  },

  // Error Styling for Input
  errorInput: {
    borderColor: '#e74c3c', // Red border color for errors
  },

  // Error Text
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    fontFamily: 'DM Sans Regular',
    marginBottom: 10,
    textAlign: 'left',
  },

  // Submit Button Style
  submitButton: {
    backgroundColor: '#ff8400',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },

  // Button Text Style
  buttonLabel: {
    color: '#fff',
    fontFamily: 'DMSans Bold',
    fontSize: 16,
  },
});
