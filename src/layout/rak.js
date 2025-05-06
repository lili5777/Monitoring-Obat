import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Button
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Card, ActivityIndicator} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

const Rak = () => {
  const [rakData, setRakData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [namaRak, setNamaRak] = useState('');
  const [kapasitas, setKapasitas] = useState('');
  const [editNamaRak, setEditNamaRak] = useState('');
  const [editKapasitas, setEditKapasitas] = useState('');
  const [editId, setEditId] = useState(null);

  const handleAddRak = () => {
    if (!namaRak || !kapasitas) {
      Alert.alert('Error', 'Semua field harus diisi!');
      return;
    }
    const newRak = {
      nama_rak: namaRak,
      kapasitas: kapasitas,
    };
    fetch('https://monitoring.dipalji.com/api/storerak', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRak),
    })
      .then(response => response.json())
            .then(data => {
              if (data.success) {
                const rakBaru = {
                  id: data.data.id,
                  nama_rak: data.data.nama_rak,
                  kapasitas: data.data.kapasitas,
                  terisi: data.data.terisi,
                  kosong: data.data.kosong,
                };
                setRakData(prevData => [...prevData, rakBaru]);
                setModalVisible(false);
                setNamaRak('');
                setKapasitas('');
                Alert.alert('Success', 'Rak berhasil ditambahkan!');
              } else {
                Alert.alert('Error', data.message || 'Gagal menambahkan Rak!');
              }
            })
            .catch(error => {
              console.error('Error adding obat:', error);
              Alert.alert('Error', 'Terjadi kesalahan saat menambahkan obat!');
            });
    // logika simpan rak baru
    setModalVisible(false);
  };

  const openEditModal = item => {
    setEditNamaRak(item.nama_rak);
    setEditKapasitas(item.kapasitas.toString());
    setEditId(item.id);
    setEditModalVisible(true);
  };

  const handleUpdateRak = () => {
    // logika update rak berdasarkan editId
    if (!editNamaRak || !editKapasitas) {
      Alert.alert('Error', 'Semua field harus diisi!');
      return;
    }
    const updatedRak = {
      nama_rak: editNamaRak,
      kapasitas: editKapasitas,
    };
    fetch(`https://monitoring.dipalji.com/api/updaterak/${editId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedRak),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const updatedData = rakData.map(item =>
            item.id === editId
              ? {
                  ...item,
                  nama_rak: data.data.nama_rak,
                  kapasitas: data.data.kapasitas,
                  terisi: data.data.terisi,
                  kosong: data.data.kosong,
                }
              : item,
          );
          setRakData(updatedData);
          setEditModalVisible(false);
          Alert.alert('Success', 'Rak berhasil diperbarui!');
        } else {
          Alert.alert('Error', data.message || 'Gagal memperbarui Rak!');
        }
      })
      .catch(error => {
        console.error('Error updating rak:', error);
        Alert.alert('Error', 'Terjadi kesalahan saat memperbarui rak!');
      });
    setEditModalVisible(false);
  };

  const handleDeleteRak = id => {
    Alert.alert(
          'Konfirmasi Hapus',
          'Apakah Anda yakin ingin menghapus rak ini?',
          [
            {
              text: 'Batal',
              style: 'cancel',
            },
            {
              text: 'Hapus',
              style: 'destructive',
              onPress: () => {
                fetch(`https://monitoring.dipalji.com/api/deleterak/${id}`, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                })
                  .then(response => response.json())
                  .then(data => {
                    if (data.success) {
                      setRakData(prevData =>
                        prevData.filter(item => item.id !== id),
                      );
                      Alert.alert('Success', 'Rak berhasil dihapus!');
                    } else {
                      Alert.alert('Error', data.message || 'Gagal menghapus Rak!');
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

  useEffect(() => {
    fetch('https://monitoring.dipalji.com/api/rak') // Ganti dengan URL backend Anda
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
    <View style={styles.container}>
      <View style={styles.head}>
        <View>
          <Image source={require('../img/manage3.png')} style={styles.icon} />
        </View>
        <View style={{justifyContent: 'center', marginLeft: 10, gap: 5}}>
          <Text style={{color: '#fff'}}>
            Jumlah Rak:{' '}
            <Text style={{fontWeight: '600'}}>{rakData.length}</Text>
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.addButton}>
        <Text style={styles.addButtonText}>Tambah Rak</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator animating={true} size="large" color="#fff" />
      ) : (
        <FlatList
          data={rakData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TouchableOpacity>
              <View style={styles.listItem}>
                <View style={styles.listText}>
                  <Text style={styles.cardTitle}>
                    Nama Rak: {item.nama_rak}
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    Kapasitas: {item.kapasitas}
                  </Text>
                  <Text style={styles.cardSubtitle}>Terisi: {item.terisi}</Text>
                  <Text style={styles.cardSubtitle}>Kosong: {item.kosong}</Text>
                </View>
                <View style={styles.buttons}>
                  <TouchableOpacity
                    onPress={() => openEditModal(item)}
                    style={styles.buttonAction}>
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteRak(item.id)}
                    style={[styles.buttonAction, {backgroundColor: '#dc3545'}]}>
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

      {/* MODAL TAMBAH */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tambah Rak</Text>
            <TextInput
              style={styles.input}
              placeholder="Nama Rak"
              value={namaRak}
              onChangeText={setNamaRak}
            />
            <TextInput
              style={styles.input}
              placeholder="Kapasitas"
              keyboardType="numeric"
              value={kapasitas}
              onChangeText={setKapasitas}
            />
            <TouchableOpacity
              onPress={handleAddRak}
              style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Simpan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL EDIT */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Rak</Text>
            <TextInput
              style={styles.input}
              placeholder="Nama Rak"
              value={editNamaRak}
              onChangeText={setEditNamaRak}
            />
            <TextInput
              style={styles.input}
              placeholder="Kapasitas"
              value={editKapasitas}
              onChangeText={setEditKapasitas}
              keyboardType="numeric"
            />
            <TouchableOpacity
              onPress={handleUpdateRak}
              style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Simpan Perubahan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setEditModalVisible(false)}
              style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );

};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    width: '85%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#ff3952',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  head: {
    flexDirection: 'row',
    backgroundColor: '#ff3952',
    padding: 20,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    marginBottom: 10,
  },
  icon: {
    width: 80,
    height: 80,
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
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listText: {
    flex: 0.7,
  },
  buttons: {
    flexDirection: 'row',
    flex: 0.3,
    justifyContent: 'flex-end',
  },
  buttonAction: {
    marginHorizontal: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },

  container: {
    flex: 1,
    padding: 20,
  },
  obat: {
    width: 80,
    height: 80,
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
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
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
    fontWeight: 'bold',
  },
});


export default Rak;
