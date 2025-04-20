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

const Obat = () => {
  const [obatData, setObatData] = useState([]);
  const [obatTotal, setObatTotal] = useState([]);
  const [obatJumlah, setObatJumlah] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [namaObat, setNamaObat] = useState('');
  const [kodeObat, setKodeObat] = useState('');
  const navigation = useNavigation();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editObatId, setEditObatId] = useState(null);
  const [editNamaObat, setEditNamaObat] = useState('');
  const [editKodeObat, setEditKodeObat] = useState('');

  useEffect(() => {
    fetch('https://monitoring.dipalji.com/api/obat')
      .then(response => response.json())
      .then(data => {
        setObatData(data.obat || []);
        setObatTotal(data.total || []);
        setObatJumlah(data.jum || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching obat data:', error);
        setLoading(false);
      });
  }, []);

  const handleAddObat = () => {
    if (!namaObat || !kodeObat) {
      Alert.alert('Error', 'Semua field harus diisi!');
      return;
    }

    const newObat = {
      nama_obat: namaObat,
      kode: kodeObat,
    };

    fetch('https://monitoring.dipalji.com/api/storeobat', {
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
            id: data.data.id,
            nama_obat: data.data.nama_obat,
            kode: data.data.kode,
          };
          setObatTotal(data.total || []);
          setObatJumlah(data.jum || []);
          setObatData(prevData => [...prevData, obatBaru]);
          setModalVisible(false);
          setNamaObat('');
          setKodeObat('');
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

  const openEditModal = item => {
    setEditObatId(item.id);
    setEditNamaObat(item.nama_obat);
    setEditKodeObat(item.kode);
    setEditModalVisible(true);
  };

  const handleUpdateObat = () => {
    if (!editNamaObat || !editKodeObat) {
      Alert.alert('Error', 'Semua field harus diisi!');
      return;
    }

    const updatedObat = {
      nama_obat: editNamaObat,
      kode: editKodeObat,
    };

    fetch(`https://monitoring.dipalji.com/api/updateobat/${editObatId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedObat),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const updatedData = obatData.map(item =>
            item.id === editObatId
              ? {
                  ...item,
                  nama: data.data.nama_obat,
                  kode: data.data.kode,
                }
              : item,
          );
          setObatData(updatedData);
          setEditModalVisible(false);
          Alert.alert('Success', 'Obat berhasil diperbarui!');
        } else {
          Alert.alert('Error', data.message || 'Gagal memperbarui obat!');
        }
      })
      .catch(error => {
        console.error('Error updating obat:', error);
        Alert.alert('Error', 'Terjadi kesalahan saat memperbarui obat!');
      });
  };

  const handleDeleteObat = id => {
    Alert.alert(
      'Konfirmasi Hapus',
      'Apakah Anda yakin ingin menghapus obat ini?',
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            fetch(`https://monitoring.dipalji.com/api/deleteobat/${id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .then(response => response.json())
              .then(data => {
                if (data.success) {
                  setObatData(prevData =>
                    prevData.filter(item => item.id !== id),
                  );
                  setObatTotal(data.total || []);
                  setObatJumlah(data.jum || []);
                  Alert.alert('Success', 'Obat berhasil dihapus!');
                } else {
                  Alert.alert('Error', data.message || 'Gagal menghapus obat!');
                }
              })
              .catch(error => {
                console.error('Error deleting obat:', error);
                Alert.alert('Error', 'Terjadi kesalahan saat menghapus obat!');
              });
          },
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <View>
          <Image source={require('../img/obat.png')} style={styles.obat} />
        </View>
        <View style={{justifyContent: 'center', marginLeft: 10, gap: 5}}>
          <Text style={{color: '#ffff'}}>
            Jenis Obat : <Text style={{fontWeight: '600'}}>{obatTotal}</Text>
          </Text>
          <Text style={{color: '#ffff'}}>
            Total Obat : <Text style={{fontWeight: '600'}}>{obatJumlah}</Text>
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
          data={obatData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Transaksi', {id: item.id})}>
              <View style={styles.listt}>
                <View style={styles.tekss}>
                  <Text style={styles.cardTitle}>Kode : {item.kode}</Text>
                  <Text style={styles.cardSubtitle}>
                    Nama : {item.nama_obat}
                  </Text>
                </View>
                <View style={styles.buttons}>
                  <TouchableOpacity
                    onPress={() => openEditModal(item)}
                    style={styles.buttonn}>
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteObat(item.id)}
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
        onPress={() => navigation.navigate('Home')}
        style={styles.logoutButton}>
        <Text style={styles.buttonLabel}>Kembali ke Home</Text>
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
                value={kodeObat}
                onChangeText={setKodeObat}
              />
              <TextInput
                style={styles.input}
                placeholder="Nama Obat"
                value={namaObat}
                onChangeText={setNamaObat}
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

      <Modal
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
      </Modal>
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

export default Obat;
