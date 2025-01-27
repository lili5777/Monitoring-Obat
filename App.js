import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from './src/layout/splash';
import Login from './src/layout/login';
import Home from './src/layout/home';
import Rak from './src/layout/rak';

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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
