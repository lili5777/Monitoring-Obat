import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, Button} from 'react-native-paper';

const Transaksi = ({route}) => {
  const {id} = route.params;
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [transaksiData, setTransaksiData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [idobat, setIdobat] = useState('');
  const [idrak, setIdrak] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [masuk, setMasuk] = useState('');
  const [kadaluarsa, setKadaluarsa] = useState('');

  useEffect(() => {
    fetch(`http://10.0.2.2:8000/api/obat/transaksi/${id}`)
      .then(response => response.json())
      .then(data => {
        console.log('Data dari API:', data);
        setTransaksiData(data.transaksi || []); // Pastikan key-nya 'transaksi'
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching obat data:', error);
        setLoading(false);
      });
  }, [id]);

  const handleAddObat = () => {
    if (!idrak || !jumlah || !masuk || !kadaluarsa) {
      Alert.alert('Error', 'Semua field harus diisi!');
      return;
    }

    const newObat = {
      idrak: idrak,
      idobat: idobat,
      jumlah: jumlah,
      masuk: masuk,
      kadaluarsa: kadaluarsa,
    };

    fetch('http://10.0.2.2:8000/api/tambahtransaksi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newObat),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const obatBaru = {
            idrak: data.data.idrak,
            idobat: data.data.idobat,
            jumlah: data.data.jumlah,
            masuk: data.data.masuk,
            kadaluarsa: data.data.kadaluarsa,
          };
          // totoal
          setKadaluarsa(data.kadaluarsa || []);
          setTransaksiData(prevData => [...prevData, obatBaru]);
          setModalVisible(false);
          setIdrak('');
          setIdobat('');
          setJumlah('');
          setMasuk('');
          Alert.alert('Success', 'Obat berhasil ditambahkan!');
        } else {
          Alert.alert('Error', data.message || 'Gagal menambahkan obat!');
        }
      })
      .catch(error => {
        console.error('Error adding obat:', error);
        Alert.alert('Error', 'Terjadi kesalahan saat menambahkan obat!');
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <View>
          <Image source={require('../img/obat.png')} style={styles.obat} />
        </View>
        <View style={{justifyContent: 'center', marginLeft: 10, gap: 5}}>
          <Text style={{color: '#ffff'}}>
            Jenis Obat : <Text style={{fontWeight: '600'}}>A</Text>
          </Text>
          <Text style={{color: '#ffff'}}>
            Total Obat : <Text style={{fontWeight: '600'}}>S</Text>
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.addButton}>
        <Text style={styles.addButtonText}>Tambah Obat</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator animating={true} size="large" color="#ffff" />
      ) : (
        <FlatList
          data={transaksiData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TouchableOpacity>
              <View style={styles.listt}>
                <View style={styles.tekss}>
                  <Text style={styles.cardTitle}>Rak : {item.rak}</Text>
                  <Text style={styles.cardSubtitle}>Obat : {item.obat}</Text>
                </View>
                <View style={styles.buttons}>
                  <TouchableOpacity
                    // onPress={() => openEditModal(item)}
                    style={styles.buttonn}>
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    // onPress={() => handleDeleteObat(item.id)}
                    style={[styles.buttonn, {backgroundColor: '#dc3545'}]}>
                    <Text style={styles.buttonText}>Hapus</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate('Obat')}
        style={styles.logoutButton}>
        <Text style={styles.buttonLabel}>Kembali ke Obat</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <KeyboardAvoidingView>
              <Text style={styles.modalTitle}>Tambah Obat</Text>
              <TextInput
                style={styles.input}
                placeholder="Kode Obat"
                value={idrak}
                onChangeText={setIdrak}
              />
              <TextInput
                style={styles.input}
                placeholder="Nama Obat"
                value={idobat}
                onChangeText={setIdobat}
              />
              <Button
                mode="contained"
                onPress={handleAddObat}
                style={styles.submitButton}>
                Simpan
              </Button>
              <Button mode="text" onPress={() => setModalVisible(false)}>
                Batal
              </Button>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>

      {/* <Modal
                animationType="slide"
                transparent={true}
                visible={editModalVisible}
                onRequestClose={() => setEditModalVisible(false)}>
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <KeyboardAvoidingView>
                      <Text style={styles.modalTitle}>Edit Obat</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Nama Obat"
                        value={editNamaObat}
                        onChangeText={setEditNamaObat}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Kode"
                        value={editKodeObat}
                        onChangeText={setEditKodeObat}
                        keyboardType="numeric"
                      />
                      <Button
                        mode="contained"
                        onPress={handleUpdateObat}
                        style={styles.submitButton}>
                        Simpan Perubahan
                      </Button>
                      <Button mode="text" onPress={() => setEditModalVisible(false)}>
                        Batal
                      </Button>
                    </KeyboardAvoidingView>
                  </View>
                </View>
              </Modal> */}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#ffe5e5',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tekss: {
    flex: 0.7,
  },
  buttons: {
    flexDirection: 'row',
    flex: 0.3,
    justifyContent: 'flex-end',
  },
  buttonn: {
    marginHorizontal: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#007bff',
    borderRadius: 5,
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  addButtonText: {
    color: '#ff3952',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%', // Adjust the width as needed
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: '#ff3952', // Adjust the color as needed
  },
});

export default Transaksi;
