import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import data from './norms.json';
import Collapsible from 'react-native-collapsible';
import {Button, Card, Modal} from 'react-native-paper';

const Norms = ({navigation,route}) => {
  const code = 'RES-123456';
  const [norms, setNorms] = useState([]);
  const [collapsedState, setCollapsedState] = useState({}); // Tracks collapsible state
  const [userResponses, setUserResponses] = useState({}); // Tracks user responses (Yes/No)
  const [allCompleted, setAllCompleted] = useState(false); // Tracks if all fields are done
  const height = 15;
  const [isVisible,setIsVisible] = useState(false)
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

  const fetchNorms = () => {
    const buildingData = data[code.substring(0, 3)];
    if (buildingData) {
      const categoryIndex = findCategory(code.substring(0, 3));
      const req = Object.entries(buildingData.categories[categoryIndex].norms);
      setNorms(req);

      // Initialize collapsed state for all items
      const initialCollapsedState = req.reduce((acc, _, index) => {
        acc[`parent-${index}`] = true; // Initially collapsed
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

  const complete = ()=>{
    setIsVisible(!isVisible)

  }

  // Check if all responses are filled (Yes/No)
  useEffect(() => {
    const allAnswered =
      norms.length > 0 && Object.keys(userResponses).length >= norms.length;
    setAllCompleted(allAnswered);
    console.log(allCompleted , "allcompleted")
  }, [userResponses, norms]);

  const toggleCollapse = key => {
    setCollapsedState(prevState => ({
      ...prevState,
      [key]: !prevState[key], // Toggle the state of the selected item
    }));
  };

  // Render nested objects as a FlatList
  const renderObjectItem = ({item, index, parentKey}) => {
    const key = `${parentKey}-child-${index}`; // Unique key for child collapsible
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

        {/* Collapsible Section */}
        <Collapsible collapsed={collapsedState[key]}>
          <Card style={styles.Collapsedcard}>
            <Card.Actions style={styles.cardActions}>
              <Button style={styles.iconButton}>
                <Image
                  source={require('../assets/circle-microphone.png')}
                  style={styles.icon}
                />
              </Button>
              <Button style={styles.iconButton}>
                <Image
                  source={require('../assets/picture.png')}
                  style={styles.icon}
                />
              </Button>
              <Button style={styles.iconButton}>
                <Image
                  source={require('../assets/screen-play.png')}
                  style={styles.icon}
                />
              </Button>
            </Card.Actions>
          </Card>
        </Collapsible>
      </View>
    );
  };

  // Render nested objects if the value is an object
  const renderObject = (obj, parentIndex) => {
    const arr = Object.entries(obj);

    return (
      <FlatList
        data={arr}
        keyExtractor={(_, index) => `${parentIndex}-${index}`} // Unique key for nested items
        renderItem={({item, index}) =>
          renderObjectItem({item, index, parentKey: `parent-${parentIndex}`})
        }
      />
    );
  };

  // Main render for each item (parent or string)
  const renderItem = ({item, index}) => {
    const key = `parent-${index}`; // Unique key for parent collapsibles
    return typeof item[1] === 'string' ? (
      <View style={styles.cardContainer}>
        {/* Parent Card */}
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
          {/* Button Actions */}
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

        {/* Collapsible Section */}
        <Collapsible collapsed={collapsedState[key]}>
          <Card style={styles.Collapsedcard}>
            {/* Icon Actions */}
            <Card.Actions style={styles.cardActions}>
              <Button style={styles.iconButton}>
                <Image
                  source={require('../assets/circle-microphone.png')}
                  style={styles.icon}
                />
              </Button>
              <Button style={styles.iconButton}>
                <Image
                  source={require('../assets/picture.png')}
                  style={styles.icon}
                />
              </Button>
              <Button style={styles.iconButton}>
                <Image
                  source={require('../assets/screen-play.png')}
                  style={styles.icon}
                />
              </Button>
            </Card.Actions>
          </Card>
        </Collapsible>
      </View>
    ) : (
      <>
        {/* Parent Title */}
        <Text style={styles.itemTitle}>{item[0]}</Text>
        {renderObject(item[1], index)} {/* Render nested objects */}
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
          onPress={()=>setIsVisible(true)}
          disabled={!allCompleted}>
          
          <Text style={styles.buttonText}>End Inspection</Text>
        </Button>
      </View>
      <Modal
      visible={isVisible}
      onDismiss={complete}
      contentContainerStyle={styles.modalContent}
      
    >
      <Text style={styles.modalTitle}>End Inspection</Text>

      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('final',userResponses)}
          style={[styles.button, styles.endButton]}
        >
          <Text style={styles.buttonText}>End </Text>
        </Button>
        <Button 
          mode="outlined" 
          onPress={() => complete()}
          style={[styles.button, styles.cancelButton]}
        >
          <Text style={styles.cancelbuttonText}>Cancel</Text>
        </Button>
      </View>
    </Modal>
    </View>
  );
};

export default Norms;

const styles = StyleSheet.create({
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
    fontFamily:'DMSans Bold',
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
    justifyContent:'center'
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
