import React, {useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';

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

  const handleLogin = () => {
    if (username.trim() === '' || password.trim() === '') {
      setErrors({
        username: username.trim() === '',
        password: password.trim() === '',
      });
    } else {
      setErrors({username: false, password: false});
      navigation.navigate('BottomTab'); // Navigate only if no errors
    }
  };

  return (
    <View style={styles.container}>
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
              errors.password && styles.errorInput, // Apply error styling
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
