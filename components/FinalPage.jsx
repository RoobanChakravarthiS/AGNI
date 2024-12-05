import React from 'react';
import { StyleSheet, Text, View, Button, FlatList, Image, Linking } from 'react-native';

const FinalPage = ({ navigation, route }) => {
  const data = route.params;
  const dataArray = Object.entries(data).map(([key, value]) => ({
    key, // Norm description
    value, // Response (Yes/No)
    media: value.media, // Media URL or file (photo/video)
    remark: value.remark, // Remark associated with the norm
  }));

  const openMedia = (media) => {
    if (media) {
      // Handle opening media (photo or video)
      Linking.openURL(media.uri); // Open media URL (could be a photo/video file)
    } else {
      alert("No media attached.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inspection Summary</Text>

      {/* FlatList for displaying the norms */}
      <FlatList
        data={dataArray}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.normText}>{item.key}</Text>
            <Text
              style={[
                styles.responseText,
                item.value === 'Yes' ? styles.yesText : styles.noText,
              ]}
            >
              {item.value}
            </Text>

            {/* Display the remark if it exists */}
            {item.remark && (
              <View style={styles.remarkContainer}>
                <Text style={styles.remarkTitle}>Remark:</Text>
                <Text style={styles.remarkText}>{item.remark}</Text>
              </View>
            )}

            {/* Button to view media (photo/video) */}
            {item.media && (
              <Button
                title="View Media"
                onPress={() => openMedia(item.media)}
                color="#ff8400"
              />
            )}
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />

      {/* Recommendation Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Recommend"
          onPress={() => {
            // Add your "Recommend" action here
            console.log('Recommended');
          }}
          color="#ff8400"
        />
        <Button
          title="Not Recommended"
          onPress={() => {
            // Add your "Not Recommended" action here
            console.log('Not Recommended');
          }}
          style={styles.Button}
          color="#2b2e36"
        />
      </View>
    </View>
  );
};

export default FinalPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2b2e36',
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
    color: '#2b2e36',
  },
  responseText: {
    fontSize: 16,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    color: '#2b2e36',
  },
  remarkText: {
    fontSize: 14,
    color: '#2b2e36',
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    borderRadius: 5,
  },
});
