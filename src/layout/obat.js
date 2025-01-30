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
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Card, ActivityIndicator, Button} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const Obat = () => {
  const [obatData, setObatData] = useState([]);
  const [rakData, setRakData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [namaObat, setNamaObat] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [kadaluarsa, setKadaluarsa] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [idRak, setIdRak] = useState('');
  const navigation = useNavigation();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editObatId, setEditObatId] = useState(null);
  const [editNamaObat, setEditNamaObat] = useState('');
  const [editJumlah, setEditJumlah] = useState('');
  const [editKadaluarsa, setEditKadaluarsa] = useState('');
  const [editIdRak, setEditIdRak] = useState('');

  useEffect(() => {
    fetch('http://10.0.2.2:8000/api/obat')
      .then(response => response.json())
      .then(data => {
        setObatData(data.obat || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching obat data:', error);
        setLoading(false);
      });
  }, []);

  const handleAddObat = () => {
    if (!namaObat || !jumlah || !kadaluarsa || !idRak) {
      Alert.alert('Error', 'Semua field harus diisi!');
      return;
    }

    const newObat = {
      nama_obat: namaObat,
      jumlah,
      kadaluarsa,
      id_rak: idRak,
    };

    fetch('http://10.0.2.2:8000/api/storeobat', {
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
            nama: data.data.nama,
            jumlah: data.data.jumlah,
            kadaluarsa: data.data.kadaluarsa,
            rak: data.data.rak,
          };
          setObatData(prevData => [...prevData, obatBaru]);
          setModalVisible(false);
          setNamaObat('');
          setJumlah('');
          setKadaluarsa('');
          setIdRak('');
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
    setEditNamaObat(item.nama);
    setEditJumlah(item.jumlah.toString());
    setEditKadaluarsa(item.kadaluarsa);
    setEditIdRak(rakData.find(rak => rak.nama_rak === item.rak)?.id || '');
    setEditModalVisible(true);
  };

  const handleUpdateObat = () => {
    if (!editNamaObat || !editJumlah || !editKadaluarsa || !editIdRak) {
      Alert.alert('Error', 'Semua field harus diisi!');
      return;
    }

    const updatedObat = {
      nama_obat: editNamaObat,
      jumlah: editJumlah,
      kadaluarsa: editKadaluarsa,
      id_rak: editIdRak,
    };

    fetch(`http://10.0.2.2:8000/api/updateobat/${editObatId}`, {
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
                  nama: data.data.nama,
                  jumlah: data.data.jumlah,
                  kadaluarsa: data.data.kadaluarsa,
                  rak: data.data.rak,
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
            fetch(`http://10.0.2.2:8000/api/deleteobat/${id}`, {
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

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || kadaluarsa;
    setShowDatePicker(false);
    if (event.type === 'set') {
      setKadaluarsa(currentDate.toISOString().split('T')[0]);
    }
  };

  return (
    <LinearGradient colors={['#ff3952', '#ffff']} style={styles.container}>
      <Text style={styles.title}>Data Obat</Text>

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
            <View style={styles.listt}>
              <View style={styles.tekss}>
                <Text style={styles.cardTitle}>Kode : {item.kode}</Text>
                <Text style={styles.cardSubtitle}>Nama : {item.nama_obat}</Text>
              </View>
              <View style={styles.buttons}>
                <TouchableOpacity
                  onPress={() => openEditModal(item)}
                  style={styles.button}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => openEditModal(item)}
                  style={[styles.button, {backgroundColor: '#dc3545'}]}>
                  <Text style={styles.buttonText}>Hapus</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={styles.button}>
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
                placeholder="Nama Obat"
                value={namaObat}
                onChangeText={setNamaObat}
              />
              <TextInput
                style={styles.input}
                placeholder="Jumlah"
                value={jumlah}
                onChangeText={setJumlah}
                keyboardType="numeric"
              />
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.inputDate}>
                <Text
                  style={
                    kadaluarsa ? styles.dateSelected : styles.datePlaceholder
                  }>
                  {kadaluarsa || 'Pilih Tanggal Kadaluarsa'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={kadaluarsa ? new Date(kadaluarsa) : new Date()}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
              <Picker
                selectedValue={idRak}
                onValueChange={itemValue => setIdRak(itemValue)}
                style={styles.picker}>
                <Picker.Item label="Pilih Rak" value="" />
                {rakData.map(rak => (
                  <Picker.Item
                    key={rak.id}
                    label={rak.nama_rak}
                    value={rak.id}
                  />
                ))}
              </Picker>
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
                placeholder="Jumlah"
                value={editJumlah}
                onChangeText={setEditJumlah}
                keyboardType="numeric"
              />
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.inputDate}>
                <Text
                  style={
                    editKadaluarsa
                      ? styles.dateSelected
                      : styles.datePlaceholder
                  }>
                  {editKadaluarsa || 'Pilih Tanggal Kadaluarsa'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={editKadaluarsa ? new Date(editKadaluarsa) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    const currentDate = selectedDate || editKadaluarsa;
                    setShowDatePicker(false);
                    if (event.type === 'set') {
                      setEditKadaluarsa(
                        currentDate.toISOString().split('T')[0],
                      );
                    }
                  }}
                />
              )}
              <Picker
                selectedValue={editIdRak}
                onValueChange={itemValue => setEditIdRak(itemValue)}
                style={styles.picker}>
                <Picker.Item label="Pilih Rak" value="" />
                {rakData.map(rak => (
                  <Picker.Item
                    key={rak.id}
                    label={rak.nama_rak}
                    value={rak.id}
                  />
                ))}
              </Picker>
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  // picker: {borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10},
  // selectContainer: {margin: 10},
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#ffffff',
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
  button: {
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
});

export default Obat;
