import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from '@react-native-community/geolocation';

const Map = () => {
  const [origin, setOrigin] = useState({
    latitude: null,
    longitude: null,
  });
  const destination = {latitude: 10.931908, longitude: 76.949716};
  const GOOGLE_MAPS_APIKEY = 'AIzaSyCyZYuKJc4YREy3ppZxlnODX_HL7sJlAbk';

  useEffect(() => {
    Geolocation.getCurrentPosition(info =>
      setOrigin({
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
      }),
    );
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        
        {/* Custom Marker 1 */}
        <Marker coordinate={{latitude: origin.latitude, longitude: origin.longitude}}>
          <Image
            source={require('../assets/firefighter.png')}
            style={{ width: 30, height: 50}} // Adjust the size here
          />
        </Marker>

        {/* Custom Marker 2 */}
        <Marker coordinate={{latitude: destination.latitude, longitude: destination.longitude}}>
          <Image
            source={require('../assets/location.png')}
            style={{ width: 40, height: 40 }} // Adjust the size here
          />
        </Marker>

        {/* Directions */}
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={5}
          strokeColor="red"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default Map;
