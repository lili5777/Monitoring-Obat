import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from './src/layout/splash';
import Login from './src/layout/login';
import Home from './src/layout/home';
import Rak from './src/layout/rak';
import Profil from './src/layout/profil';
import Obat from './src/layout/obat';
import Riwayat from './src/layout/riwayat';
import Transaksi from './src/layout/transaksi';
import Arima from './src/layout/arima';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {/* Splash Screen */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        {/* Halaman Utama */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Rak" component={Rak} />
        <Stack.Screen name="Profil" component={Profil} />
        <Stack.Screen name="Obat" component={Obat} />
        <Stack.Screen name="Riwayat" component={Riwayat} />
        <Stack.Screen name="Transaksi" component={Transaksi} />
        <Stack.Screen name="Arima" component={Arima} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
