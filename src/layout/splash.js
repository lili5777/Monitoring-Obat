import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image, ActivityIndicator} from 'react-native';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000); // 3 detik

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../img/logo.png')} style={styles.logo} />
      {/* <ActivityIndicator size="large" color="#fff" /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff3952',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
});

export default SplashScreen;
