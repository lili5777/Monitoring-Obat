import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <LinearGradient colors={['#ff3952', '#ff6a6a']} style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../img/ilustrasi.png')} style={styles.logo} />
      </View>
      <Text style={styles.headerText}>Welcome Back</Text>
      <Text style={styles.subText}>Login to your account</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#fff"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#fff"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Don’t have an account? <Text style={styles.signupText}>Sign up</Text>
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 100,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'sans-serif-medium',
    marginTop: 10,
  },
  subText: {
    fontSize: 16,
    color: '#ffe5e5',
    marginBottom: 30,
    fontFamily: 'sans-serif-light',
  },
  inputContainer: {
    width: '85%',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
    fontFamily: 'sans-serif',
  },
  loginButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 25,
    width: '85%',
    alignItems: 'center',
    marginTop: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  loginButtonText: {
    color: '#ff3952',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'sans-serif-medium',
  },
  footerText: {
    fontSize: 14,
    color: '#ffe5e5',
    marginTop: 20,
    fontFamily: 'sans-serif-light',
  },
  signupText: {
    color: '#fff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default Login;
