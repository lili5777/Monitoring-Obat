import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Prediksi = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [dataPrediksi, setDataPrediksi] = useState(null);

  useEffect(() => {
    fetch('https://monitoring.dipalji.com/api/prediksi')
      .then(response => response.json())
      .then(json => {
        setDataPrediksi(json);
        setLoading(false);
      })
      .catch(error => {
        console.error('Gagal memuat data prediksi:', error);
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Image source={require('../img/profile.png')} style={styles.obat} />
        <View style={{justifyContent: 'center', marginLeft: 10, gap: 5}}>
          <Text style={{color: '#fff'}}>Hasil Prediksi Obat Kadaluarsa Menggunakan Arima</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ff3952" />
      ) : (
        <View style={styles.cardContainer}>
          <View style={styles.bigCard}>
            <Text style={styles.cardSubtitle}>Hasil Prediksi Bulan</Text>
            <Text style={styles.cardSubtitle}>
              {dataPrediksi.bulan} akan ada :
            </Text>
            <Text style={styles.cardTitle}>{dataPrediksi.prediksi}</Text>
            <Text style={styles.cardSubtitle}>Obat yang kadaluarsa</Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate('Arima')}
        style={styles.logoutButton}>
        <Text style={styles.buttonLabel}>Kembali ke Obat Kadaluarsa</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  head: {
    flexDirection: 'row',
    backgroundColor: '#ff3952',
    padding: 20,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    marginBottom: 10,
  },
  obat: {
    width: 80,
    height: 80,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigCard: {
    width: '100%',
    backgroundColor: '#ff3952',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#fff',
  },
  logoutButton: {
    backgroundColor: '#ff3952',
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default Prediksi;
