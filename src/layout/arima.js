import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Arima = () => {
  const navigation = useNavigation();
  const hendlePrediksi = async () => {
    navigation.navigate('Prediksi'); // Arahkan ke halaman login
  };

  const [loading, setLoading] = useState(true);
  const [obatKadaluarsa, setObatKadaluarsa] = useState([]);

  useEffect(() => {
    fetch('https://monitoring.dipalji.com/api/kadaluarsa') // Ganti dengan URL backend kamu
      .then(response => response.json())
      .then(json => {
        // Pastikan respons sesuai: [{ bulan: "September 2025", total: 30 }, ...]
        const formatted = json.map((item, index) => ({
          id: index + 1,
          exp: item.bulan, // bulan dari API
          total: item.total, // total dari API
        }));
        setObatKadaluarsa(formatted);
        setLoading(false);
      })
      .catch(error => {
        console.error('Gagal ambil data:', error);
        setLoading(false);
      });
  }, []);

  const totalObatSemua = obatKadaluarsa.reduce(
    (acc, curr) => acc + curr.total,
    0,
  );

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Image source={require('../img/profile.png')} style={styles.obat} />
        <View style={{justifyContent: 'center', marginLeft: 10, gap: 5}}>
          <Text style={{color: '#fff'}}>
            Total Obat Kadaluarsa:{' '}
            <Text style={{fontWeight: '600'}}>{totalObatSemua}</Text>
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={hendlePrediksi}>
        <Text style={styles.addButtonText}>Tekan Untuk Prediksi</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#ff3952" />
      ) : (
        <FlatList
          data={obatKadaluarsa}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.listt}>
              <Text style={styles.cardTitle}>Kadaluarsa: {item.exp}</Text>
              <Text style={styles.cardSubtitle}>Total: {item.total}</Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={styles.logoutButton}>
        <Text style={styles.buttonLabel}>Kembali ke Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  addButton: {
    backgroundColor: '#ffe5e5',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: '#ff3952',
    fontWeight: 'bold',
    fontSize: 16,
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
  listt: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
  },
});

export default Arima;
