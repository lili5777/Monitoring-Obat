import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Obat = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Text>INI OBAT</Text>
      <Button title="Kembali" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

export default Obat;
