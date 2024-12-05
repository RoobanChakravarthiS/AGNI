import {Alert, FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import data from './norms.json';
import Collapsible from 'react-native-collapsible';
import {Button, Card, Modal} from 'react-native-paper';
import {launchCamera} from 'react-native-image-picker';
import {TextInput} from 'react-native-paper';
const Norms = ({navigation, route}) => {
  const code = 'RES-123456';
  const [norms, setNorms] = useState([]);
  const [remarks, setRemarks] = useState({});
  const [collapsedState, setCollapsedState] = useState({});
  const [media, setMedia] = useState({});
  const [photo, setPhoto] = useState({});
  const [userResponses, setUserResponses] = useState({}); // Tracks user responses (Yes/No)
  const [allCompleted, setAllCompleted] = useState(false); // Tracks if all fields are done
  const height = 15;
  const [isVisible, setIsVisible] = useState(false);
  const [remarkCollapsedState, setRemarkCollapsedState] = useState({});

  const [remark, setRemark] = useState();
  const findCategory = type => {
    switch (type) {
      case 'RES':
        if (height < 15) return 0;
        if (height < 30) return 1;
        if (height < 45) return 2;
        if (height < 60) return 3;
        return 4;
      default:
        return 0;
    }
  };

  const handleImageUpload = key => {
    launchCamera({mediaType: 'photo'}, async response => {
      if (response.didCancel) {
        console.log('User cancelled media picker');
        Alert('Media selection was cancelled');
      } else if (response.errorMessage) {
        console.log(response.errorMessage);
        Alert('An error occurred, try again');
      } else if (response.assets) {
        const {uri, fileName, type} = response.assets[0];
        setPhoto(prevPhoto => {
          const newPhoto = {...prevPhoto, [key]: {uri, type, fileName}};
          // Update userResponses with the uploaded media
          setUserResponses(prevResponses => ({
            ...prevResponses,
            [key]: {...prevResponses[key], Photo: newPhoto[key]},
          }));
          return newPhoto;
        });
      }
    });
  };

  const handleMediaUpload = key => {
    launchCamera({mediaType: 'video'}, async response => {
      if (response.didCancel) {
        console.log('User cancelled media picker');
        Alert('Media selection was cancelled');
      } else if (response.errorMessage) {
        console.log(response.errorMessage);
        Alert('An error occurred, try again');
      } else if (response.assets) {
        const {uri, fileName, type} = response.assets[0];
        setMedia(prevMedia => {
          const newMedia = {...prevMedia, [key]: {uri, type, fileName}};
          // Update userResponses with the uploaded media
          setUserResponses(prevResponses => ({
            ...prevResponses,
            [key]: {...prevResponses[key], video: newMedia[key]},
          }));
          return newMedia;
        });
      }
    });
  };

  const toggleRemarkCollapse = key => {
    setRemarkCollapsedState(prevState => {
      const newState = {...prevState};
      newState[key] = !newState[key]; // Toggle the selected key for remarks
      return newState;
    });
  };

  // Handle remarks input and store in userResponses
  const handleRemark = (key, remark) => {
    setRemarks(prevRemarks => ({
      ...prevRemarks,
      [key]: remark,
    }));

    // Update userResponses with the submitted remark
    setUserResponses(prevResponses => ({
      ...prevResponses,
      [key]: {...prevResponses[key], remark: remark},
    }));
  };

  const fetchNorms = () => {
    const buildingData = data[code.substring(0, 3)];
    if (buildingData) {
      const categoryIndex = findCategory(code.substring(0, 3));
      const req = Object.entries(buildingData.categories[categoryIndex].norms);
      setNorms(req);

      // Initialize collapsed state for all items, including inner object keys
      const initialCollapsedState = req.reduce((acc, [key, value]) => {
        if (typeof value === 'object' && value !== null) {
          // If value is an object, initialize collapsed state for its keys
          Object.keys(value).forEach(innerKey => {
            acc[innerKey] = false; // Use a dot-separated key for uniqueness
          });
        } else {
          acc[key] = false; // For non-object values
        }
        return acc;
      }, {});
      setCollapsedState(initialCollapsedState);
    }
  };

  useEffect(() => {
    fetchNorms();
  }, []);

  // Handle Yes/No response and store it
  const handleResponse = (key, response) => {
    setUserResponses(prevState => {
      const newState = {
        ...prevState,
        [key]: response, // Save user response (Yes/No)
      };
      return newState;
    });
  };

  const complete = () => {
    setIsVisible(!isVisible);
  };

  // Check if all responses are filled (Yes/No)
  useEffect(() => {
    const allAnswered =
      norms.length > 0 && Object.keys(userResponses).length >= norms.length;
    setAllCompleted(allAnswered);
    console.log(allCompleted, 'allcompleted');
  }, [userResponses, norms]);

  const toggleCollapse = key => {
    setCollapsedState(prevState => {
      const newState = {...prevState};
      newState[key] = !newState[key]; // Toggle the selected key

      // Close other collapsible sections (optional)
      Object.keys(prevState).forEach(k => {
        if (k !== key) {
          newState[k] = false;
        }
      });

      return newState;
    });
  };

  const renderObjectItem = ({item, index, parentKey}) => {
    // console.log(item)
    const key = item[1]; // Unique key for child collapsible
    return (
      <View style={styles.cardContainer}>
        <Card
          style={[
            styles.card,
            userResponses[key] && userResponses[key] === 'Yes'
              ? styles.completedCardYes
              : userResponses[key] === 'No'
              ? styles.completedCardNo
              : {},
          ]}>
          <Card.Title title={item[0]} titleStyle={styles.cardTitle} />
          <Card.Content>
            <Text style={styles.cardText}>{item[1]}</Text>
          </Card.Content>
          <Card.Actions style={styles.cardActions}>
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                style={styles.buttonPrimary}
                onPress={() => handleResponse(key, 'Yes')}>
                <Text style={styles.buttonText}>Yes</Text>
              </Button>
              <Button
                mode="outlined"
                style={styles.buttonSecondary}
                onPress={() => handleResponse(key, 'No')}>
                <Text style={styles.buttonText}>No</Text>
              </Button>
              <Button
                mode="contained"
                style={styles.buttonPrimary}
                onPress={() => toggleCollapse(key)}>
                <Text style={styles.buttonText}>Proof</Text>
              </Button>
            </View>
          </Card.Actions>
        </Card>

        <Collapsible collapsed={collapsedState[key]}>
          <Card style={styles.Collapsedcard}>
            <Card.Actions style={styles.cardActions}>
              <Button
                style={styles.iconButton}
                onPress={key => handleImageUpload(key)}>
                <Image
                  source={require('../assets/picture.png')}
                  style={styles.icon}
                />
              </Button>
              <Button
                style={styles.iconButton}
                onPress={() => toggleRemarkCollapse(key)}>
                <Image
                  source={require('../assets/journal-alt.png')}
                  style={styles.icon}
                />
              </Button>

              <Button
                style={styles.iconButton}
                onPress={key => {
                  handleMediaUpload(key);
                }}>
                <Image
                  source={require('../assets/screen-play.png')}
                  style={styles.icon}
                />
              </Button>
            </Card.Actions>

            <Collapsible collapsed={remarkCollapsedState[key]}>
              <TextInput
                label="Remark"
                mode="flat"
                style={styles.textInput}
                onChangeText={text => handleRemark(key, text)}
                value={remarks[key]}
                theme={{
                  colors: {
                    primary: '#ff8400',
                    placeholder: '#2b2e36',
                    text: '#2b2e36',
                    background: 'transparent',
                  },
                }}
              />
            </Collapsible>
          </Card>
        </Collapsible>
      </View>
    );
  };

  const renderObject = (obj, parentIndex) => {
    const arr = Object.entries(obj);

    return (
      <FlatList
        data={arr}
        keyExtractor={(_, index) => `${parentIndex}-${index}`}
        renderItem={({item, index}) =>
          renderObjectItem({item, index, parentKey: `parent-${parentIndex}`})
        }
      />
    );
  };

  const renderItem = ({item, index}) => {
    const key = item[1];
    return typeof item[1] === 'string' ? (
      <View style={styles.cardContainer}>
        <Card
          style={[
            styles.card,
            userResponses[key] && userResponses[key] === 'Yes'
              ? styles.completedCardYes
              : userResponses[key] === 'No'
              ? styles.completedCardNo
              : {},
          ]}>
          <Card.Title title={item[0]} titleStyle={styles.cardTitle} />
          <Card.Content>
            <Text style={styles.cardText}>{item[1]}</Text>
          </Card.Content>

          <Card.Actions style={styles.cardActions}>
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                style={styles.buttonPrimary}
                onPress={() => handleResponse(key, 'Yes')}>
                <Text style={styles.buttonText}>Yes</Text>
              </Button>
              <Button
                mode="outlined"
                style={styles.buttonSecondary}
                onPress={() => handleResponse(key, 'No')}>
                <Text style={styles.buttonText}>No</Text>
              </Button>
              <Button
                mode="contained"
                style={styles.buttonPrimary}
                onPress={() => toggleCollapse(key)}>
                <Text style={styles.buttonText}>Proof</Text>
              </Button>
            </View>
          </Card.Actions>
        </Card>

        <Collapsible collapsed={collapsedState[key]}>
          <Card style={styles.Collapsedcard}>
            <Card.Actions style={styles.cardActions}>
              <Button
                style={styles.iconButton}
                onPress={key => handleImageUpload(key)}>
                <Image
                  source={require('../assets/picture.png')}
                  style={styles.icon}
                />
              </Button>
              <Button
                style={styles.iconButton}
                onPress={() => toggleRemarkCollapse(key)}>
                <Image
                  source={require('../assets/journal-alt.png')}
                  style={styles.icon}
                />
              </Button>

              <Button
                style={styles.iconButton}
                onPress={key => {
                  handleMediaUpload(key);
                }}>
                <Image
                  source={require('../assets/screen-play.png')}
                  style={styles.icon}
                />
              </Button>
            </Card.Actions>
            <Collapsible collapsed={remarkCollapsedState[key]}>
              <TextInput
                label="Remark"
                mode="flat"
                style={styles.textInput}
                onChangeText={text => handleRemark(key, text)}
                value={remarks[key]}
                theme={{
                  colors: {
                    primary: '#ff8400',
                    placeholder: '#2b2e36',
                    text: '#2b2e36',
                    background: 'transparent',
                  },
                }}
              />
            </Collapsible>
          </Card>
        </Collapsible>
      </View>
    ) : (
      <>
        <Text style={styles.itemTitle}>{item[0]}</Text>
        {renderObject(item[1], index)}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={norms}
        keyExtractor={(item, index) => index.toString()} // Unique key for each item
        renderItem={renderItem}
        contentContainerStyle={{alignItems: 'center'}} // Center align FlatList content
      />

      {/* End Inspection Button */}
      <View style={styles.endButtonContainer}>
        <Button
          mode="contained"
          style={[styles.endButton]}
          onPress={() => setIsVisible(true)}
          disabled={!allCompleted}>
          <Text style={styles.buttonText}>End Inspection</Text>
        </Button>
      </View>
      <Modal
        visible={isVisible}
        onDismiss={complete}
        contentContainerStyle={styles.modalContent}>
        <Text style={styles.modalTitle}>End Inspection</Text>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('final', userResponses)}
            style={[styles.button, styles.endButton]}>
            <Text style={styles.buttonText}>End </Text>
          </Button>
          <Button
            mode="outlined"
            onPress={() => complete()}
            style={[styles.button, styles.cancelButton]}>
            <Text style={styles.cancelbuttonText}>Cancel</Text>
          </Button>
        </View>
      </Modal>
    </View>
  );
};

export default Norms;

const styles = StyleSheet.create({
  textInput: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    // fontWeight: 'bold',
    fontFamily: 'DMSans Bold',
    color: '#2b2e36',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 20,
  },
  button: {
    // width: '40%',
    // paddingVertical: 8,
  },
  //   endButton: {
  //     backgroundColor: '#ff8400', // Orange color for 'End'
  //   },
  cancelButton: {
    backgroundColor: '#bfbfbf',
    // backgroundColor: '#ff8400',
    borderRadius: 5,
    // paddingVertical: 10,
    width: '90%', // Gray color for 'Cancel'
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  endButtonContainer: {
    // position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endButton: {
    backgroundColor: '#ff8400',
    borderRadius: 5,
    // paddingVertical: 10,
    width: '90%',
  },

  cardContainer: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    marginVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#2b2e36',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    padding: 15,
    width: '95%',
  },
  completedCardYes: {
    backgroundColor: '#edfcef',
  },
  completedCardNo: {
    backgroundColor: '#f7d4d4',
  },
  cardTitle: {
    fontFamily: 'DMSans ExtraBold',
    fontSize: 20,
    color: '#2b2e36',
  },
  cardText: {
    fontSize: 16,
    color: '#2b2e36',
    marginVertical: 10,
    fontFamily: 'DM Sans Regular',
  },
  buttonPrimary: {
    backgroundColor: '#ff8400',
    borderRadius: 5,
    // paddingVertical: 6,
    width: '90%',
  },
  buttonSecondary: {
    borderRadius: 5,
    backgroundColor: '#2b2e36',
    borderWidth: 1,
    width: '90%',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'DMSans Bold',
  },
  cancelbuttonText: {
    color: '#2b2e36',
    fontFamily: 'DMSans Bold',
  },
  iconButton: {
    marginHorizontal: 6,
    backgroundColor: '#bfbfbf',
    borderRadius: 8,
    paddingVertical: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  collapsedText: {
    fontSize: 14,
    color: '#2b2e36',
    marginTop: 10,
    fontFamily: 'DM Sans Regular',
  },
  Collapsedcard: {
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    elevation: 3,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  itemTitle: {
    fontSize: 22,
    fontFamily: 'DMSans ExtraBold',
    color: '#2b2e36',
    marginVertical: 12,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 10,
  },
});
