import React, {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
const Login = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({
    username: false,
    password: false,
  });
  const [isnumber, setIsNumber] = useState(false);
  const buttonColor = '#ff8400';

  const ToastConfig = {
    success: ({text1, text2}) => (
      <View style={[styles.toastContainer, styles.successToast]}>
        <Text style={styles.toastTitle}>{text1}</Text>
        {text2 ? <Text style={styles.toastMessage}>{text2}</Text> : null}
      </View>
    ),
    error: ({text1, text2}) => (
      <View style={[styles.toastContainer, styles.errorToast]}>
        <Text style={styles.toastTitle}>{text1}</Text>
        {text2 ? <Text style={styles.toastMessage}>{text2}</Text> : null}
      </View>
    ),
    info: ({text1, text2}) => (
      <View style={[styles.toastContainer, styles.infoToast]}>
        <Text style={styles.toastTitle}>{text1}</Text>
        {text2 ? <Text style={styles.toastMessage}>{text2}</Text> : null}
      </View>
    ),
  };

  const handleLogin = async () => {
    if (username.trim() === '' || password.trim() === '') {
      setErrors({
        username: username.trim() === '',
        password: password.trim() === '',
      });
      return;
    }
    setErrors({username: false, password: false});

    try {
      const res = await axios.post(`http://192.168.3.154:1703/login`, {
        username,
        password,
      });
      if (res.status === 200) {
        console.log(res.data);
        const {token, userid, officer_pin} = res.data;
        await EncryptedStorage.setItem('session_token', token);
        await EncryptedStorage.setItem('userid', userid);
        await EncryptedStorage.setItem('officer_pin', officer_pin);
        Toast.show({
          type: 'success',
          text1: 'Welcome!',
          text2: 'Login Successful 🎉',
        });
        // console.log('Login Successful:', { token, userid, officer_pin });
        setTimeout(() => navigation.navigate('BottomTab'), 2000);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Credentials',
          text2: 'Please check your username and password.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Oops!',
          text2: 'Something went wrong. Please try again.',
        });
      }
      console.error('Login Error:', error.message || error.response?.data);
    }
  };

  return (
    <View style={styles.container}>
    <Toast config={ToastConfig}/>
      <View style={styles.welcomeContainer}>
        <Image style={styles.logo} source={require('../assets/logo.jpg')} />
      </View>
      <View style={styles.form}>
        <Text variant="titleLarge" style={styles.title}>
          Login
        </Text>
        <View style={styles.fieldContainer}>
          <TextInput
            label={isnumber ? 'Mobile Number' : 'Username'}
            value={username}
            mode="flat"
            style={[
              styles.textInput,
              focusedField === 'username' && styles.focusedTextInput,
              errors.username && styles.errorInput, // Apply error styling
            ]}
            theme={{
              colors: {
                primary: '#ff8400',
                placeholder: '#bfbfbf',
                text: '#000000',
                background: 'transparent',
              },
            }}
            textColor="#2b2e36"
            onFocus={() => setFocusedField('username')}
            onBlur={() => setFocusedField(null)}
            onChangeText={text => setUsername(text)}
          />
          {errors.username && (
            <Text style={styles.errorText}>Username is required</Text>
          )}

          <TextInput
            label="Password"
            value={password}
            mode="flat"
            secureTextEntry
            style={[
              styles.textInput,
              focusedField === 'password' && styles.focusedTextInput,
              errors.password && styles.errorInput,
            ]}
            theme={{
              colors: {
                primary: '#ff8400',
                placeholder: '#2b2e36',
                text: '#2b2e36',
                background: 'transparent',
              },
            }}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            onChangeText={text => setPassword(text)}
            textColor="#2b2e36"
            right={<Image source={require('../assets/eye.png')} />}
          />
          {errors.password && (
            <Text style={styles.errorText}>Password is required</Text>
          )}
        </View>
        <View style={styles.actionContainer}>
          <Button
            mode="contained"
            style={[styles.button, {backgroundColor: buttonColor}]}
            textColor="#ffffff"
            labelStyle={styles.buttonText}
            onPress={handleLogin}>
            <Text style={{color: '#fff'}}>Confirm</Text>
          </Button>
          <Button
            mode="elevated"
            style={[styles.mobilebutton, {backgroundColor: '#ffffff'}]}
            textColor="#2b2e36"
            labelStyle={styles.buttonText}
            onPress={() => {
              setIsNumber(!isnumber);
            }}>
            <View style={styles.iconTextContainer}>
              <Image
                style={styles.icon}
                source={
                  isnumber
                    ? require('../assets/user.png')
                    : require('../assets/phone-call.png')
                }
              />
              <Text style={styles.buttonText}>
                {isnumber ? 'Login with Username' : 'Login with Mobile'}
              </Text>
            </View>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  toastContainer: {
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 10,
  },
  successToast: {
    backgroundColor: '#4CAF50', // Green for success
  },
  errorToast: {
    backgroundColor: '#F44336', // Red for error
  },
  infoToast: {
    backgroundColor: '#2196F3', // Blue for info
  },
  toastTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  toastMessage: {
    color: '#f5f5f5',
    fontSize: 14,
    fontWeight: '400',
  },
  welcomeContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  form: {
    width: '90%',
    gap: 20,
  },
  title: {
    color: '#2b2e36',
    fontFamily: 'DMSans ExtraBold',
    fontSize: 26,
  },
  fieldContainer: {
    width: '100%',
    marginBottom: 20,
  },
  textInput: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  focusedTextInput: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ff8400',
  },
  errorInput: {
    borderBottomWidth: 2,
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  mobilebutton: {
    width: '100%',
    borderRadius: 5,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2b2e36',
  },
  actionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 25,
  },
  button: {
    width: '100%',
    borderRadius: 5,
  },
  logo: {
    width: 180,
    height: 180,
  },
});
