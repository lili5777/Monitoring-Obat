import React, {useState, useEffect} from 'react';
import {View, FlatList, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Card, ActivityIndicator} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

const Rak = () => {
  const [rakData, setRakData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetch('http://10.0.2.2:8000/api/rak') // Ganti dengan URL backend Anda
      .then(response => response.json())
      .then(data => {
        setRakData(data.data); // Ambil data rak dari response
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <LinearGradient colors={['#ff3952', '#ffff']} style={styles.container}>
      <Text style={styles.title}>Data Rak</Text>

      {loading ? (
        <ActivityIndicator animating={true} size="large" color="#ffff" />
      ) : (
        <FlatList
          data={rakData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.cardTitle}>Nama Rak: {item.nama_rak}</Text>
                <Text style={styles.cardSubtitle}>
                  Kapasitas: {item.kapasitas}
                </Text>
                <Text style={styles.cardSubtitle}>Terisi: {item.terisi}</Text>
                <Text style={styles.cardSubtitle}>Kosong: {item.kosong}</Text>
              </Card.Content>
            </Card>
          )}
        />
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={styles.button}>
        <Text style={styles.buttonLabel}>Kembali ke Home</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff', // Warna teks header sesuai tema
    textAlign: 'center',
  },
  card: {
    marginBottom: 15,
    backgroundColor: '#ffe5e5', // Warna latar belakang kartu sesuai tema
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderRadius: 12,
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff3952', // Warna judul sesuai tema
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#757575', // Warna deskripsi
  },
  button: {
    marginTop: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center', // Agar teks di tengah tombol
  },
  buttonLabel: {
    color: '#ff3952',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Rak;
