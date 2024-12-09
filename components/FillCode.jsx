import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Button, TextInput} from 'react-native-paper';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
const FillCode = ({navigation}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const url = `http://192.168.3.154:1111`;
  const updatePin = async () => {
      const user = await EncryptedStorage.getItem('userid');
    console.log(user)
    try {
      const res = await axios.put(`${url}/officer/updatepin/${user}`,{
        pin: code,
      });
      if (res.status === 200) {
        EncryptedStorage.setItem('code', code);

        navigation.navigate('BottomTab');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const validateCode = () => {
    if (code.trim().length < 6) {
      setError('Code must be at least 6 characters long');
    } else {
      setError(null);
      updatePin()
    }
  };

  return (
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
        onChangeText={text => setCode(text)}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button
        mode="contained"
        onPress={validateCode}
        style={styles.submitButton}
        labelStyle={styles.buttonLabel}>
        Submit
      </Button>
    </View>
  );
};

export default FillCode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    color: '#2b2e36',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
    fontSize: 16,
    color: '#2b2e36',
    marginBottom: 10,
  },
  focusedTextInput: {
    borderBottomColor: '#ff8400',
  },
  errorInput: {
    borderBottomColor: '#ff8400',
  },
  errorText: {
    color: '#ff8400',
    fontSize: 14,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#ff8400',
    marginTop: 20,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});
