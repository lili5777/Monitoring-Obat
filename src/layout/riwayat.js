import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Riwayat = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Text>INI RIWAYAT</Text>
      <Button title="Kembali" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

export default Riwayat;
