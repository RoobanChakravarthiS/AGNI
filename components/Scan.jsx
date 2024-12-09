import {StyleSheet, Text, View} from 'react-native';
import React, { useState } from 'react';
import {Alert} from 'react-native';
import {Camera, CameraType} from 'react-native-camera-kit';
const Scan = ({navigation}) => {
  const handleRead = (event)=>{
    const code = event.nativeEvent.codeStringValue
    navigation.navigate('norms',code)
    SetScanned(false)
  }
  const[scanned,SetScanned] = useState(true)
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.topText}>Scan User QR</Text>
      </View>
      <View style={styles.scannerContainer}>
        <Camera
          scanBarcode={scanned}
          onReadCode={event => handleRead(event)}
          laserColor="red"
          frameColor="white"
          style={{height:300}}
        />
      </View>
    </View>
  );
};

export default Scan;

const styles = StyleSheet.create({
  top: {
    
    justifyContent: 'center',
    alignItems: 'center',
  },
  topText: {
    fontSize: 20,
    fontFamily: 'DMSans ExtraBold',
  },
  container:{
    flex:1,
    // justifyContent:'center',
    alignItems:'center',

  },
  scannerContainer:{
    width:'90%',
    // height:'45%',
    backgroundColor:'white',

  }
});
