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
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Transaksi = ({route}) => {
  const {id} = route.params;
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [transaksiData, setTransaksiData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [idobat, setIdobat] = useState('');
  const [idrak, setIdrak] = useState('');
  const [rakData, setRakData] = useState([]);
  const [jumlah, setJumlah] = useState('');
  const [masuk, setMasuk] = useState('');
  const [kadaluarsa, setKadaluarsa] = useState('');
  const [openMasuk, setOpenMasuk] = useState(false);
  const [openKadaluarsa, setOpenKadaluarsa] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTransaksiId, setEditTransaksiId] = useState(null);
  const [editIdRak, setEditIdRak] = useState('');
  const [editjumlah, editsetJumlah] = useState('');
  const [editmasuk, editsetMasuk] = useState('');
  const [editkadaluarsa, editsetKadaluarsa] = useState('');
  const [editidobat, editsetIdobat] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const getUserData = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUserRole(parsedUser.role); // Set role user
      }
    };
    getUserData();

    fetch(`https://monitoring.dipalji.com/api/obat/transaksi/${id}`)
      .then(response => response.json())
      .then(data => {
        console.log('Data dari API:', data);
        setTransaksiData(data.transaksi || []); 
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching obat data:', error);
        setLoading(false);
      });

    fetch('https://monitoring.dipalji.com/api/rak')
      .then(response => response.json())
      .then(data => {
        setRakData(data.data || []);
      })
      .catch(error => {
        console.error('Error fetching rak data:', error);
      });
  }, [id]);

  const handleAddObat = () => {
    if (!idrak || !jumlah || !masuk || !kadaluarsa) {
      Alert.alert('Error', 'Semua field harus diisi!');
      return;
    }

    const newObat = {
      idrak: idrak,
      idobat: id,
      jumlah: jumlah,
      masuk: masuk,
      kadaluarsa: kadaluarsa,
    };
    console.log('Data yang dikirim:', newObat);

    fetch('https://monitoring.dipalji.com/api/tambahtransaksi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newObat),
    })
      .then(response => response.json()) 
      .then(data => {
        try {

          if (data.success) {
            const obatBaru = {
              id: data.data.id,
              rak: data.data.rak,
              obat: data.data.obat,
              jumlah: data.data.jumlah,
              masuk: data.data.masuk,
              kadaluarsa: data.data.kadaluarsa,
            };

            setTransaksiData(prevData => [...prevData, obatBaru]);
            setModalVisible(false);
            setIdrak('');
            setIdobat('');
            setJumlah('');
            setMasuk('');
            setKadaluarsa('');
            Alert.alert('Success', 'Obat berhasil ditambahkan!');
          } else {
            Alert.alert('Error', data.message || 'Gagal menambahkan obat!');
          }
        } catch (e) {
          console.error('Gagal parsing JSON:', e.message);
          Alert.alert('Error', 'Respons bukan JSON. Cek console log.');
        }
      })
      .catch(error => {
        console.error('Error saat mengirim data:', error);
        Alert.alert('Error', 'Terjadi kesalahan saat mengirim data!');
      });
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || kadaluarsa;
    setOpenKadaluarsa(false);
    if (event.type === 'set') {
      setKadaluarsa(currentDate.toISOString().split('T')[0]);
    }
  };
  const onDateChange2 = (event, selectedDate) => {
    const currentDate = selectedDate || masuk;
    setOpenMasuk(false);
    if (event.type === 'set') {
      setMasuk(currentDate.toISOString().split('T')[0]);
    }
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
            fetch(`https://monitoring.dipalji.com/api/hapustransaksi/${id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .then(response => response.json())
              .then(data => {
                console.log('Response dari API:', data);
                if (data.success) {
                  setTransaksiData(prevData =>
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

  const openEditModal = item => {
    setEditTransaksiId(item.id);
    editsetIdobat(id);
    editsetJumlah(item.jumlah.toString());
    editsetKadaluarsa(item.kadaluarsa);
    editsetMasuk(item.masuk);
    setEditIdRak(rakData.find(rak => rak.nama_rak === item.rak)?.id || '');
    setEditModalVisible(true);
  };

  const handleUpdateObat = () => {
    if (!editjumlah || !editkadaluarsa || !editmasuk || !editIdRak) {
      Alert.alert('Error', 'Semua field harus diisi!');
      return;
    }

    const updatetransaksi = {
      idrak: editIdRak,
      idobat: id,
      jumlah: editjumlah,
      masuk: new Date(editmasuk).toISOString().split('T')[0],
      kadaluarsa: new Date(editkadaluarsa).toISOString().split('T')[0],
    };
    console.log('Data yang dikirim:', updatetransaksi);

    fetch(`https://monitoring.dipalji.com/api/edittransaksi/${editTransaksiId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatetransaksi),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Data yang ditambah:', data);
        if (data.success) {
          const updatedData = transaksiData.map(item =>
            item.id === editTransaksiId
              ? {
                  ...item,
                  obat: data.data.obat,
                  jumlah: data.data.jumlah,
                  kadaluarsa: data.data.kadaluarsa,
                  rak: data.data.rak,
                  masuk: data.data.masuk,
                }
              : item,
          );
          setTransaksiData(updatedData);
          setEditModalVisible(false);
          Alert.alert('Success', 'Transaksi berhasil diperbarui!');
        } else {
          Alert.alert('Error', data.message || 'Gagal memperbarui Transaksi!');
        }
      })
      .catch(error => {
        console.error('Error updating obat:', error);
        Alert.alert('Error', 'Terjadi kesalahan saat memperbarui Transaksi!');
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
      {userRole === 'admin' && (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.addButton}>
          <Text style={styles.addButtonText}>Tambah Obat</Text>
        </TouchableOpacity>
      )}

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
                  <Text>Jumlah: {item.jumlah}</Text>
                  <Text>Masuk: {item.masuk}</Text>
                  <Text>Kadaluarsa: {item.kadaluarsa}</Text>
                </View>
                {userRole === 'admin' && (
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
                )}
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
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={idrak}
                  onValueChange={itemValue => setIdrak(itemValue)}
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
              </View>
              <TextInput
                style={styles.input}
                placeholder="Jumlah"
                value={jumlah}
                onChangeText={setJumlah}
                keyboardType="numeric"
              />

              <TouchableOpacity
                onPress={() => setOpenMasuk(true)}
                style={styles.inputDate}>
                <Text
                  style={masuk ? styles.dateSelected : styles.datePlaceholder}>
                  {masuk || 'Tanggal Masuk'}
                </Text>
              </TouchableOpacity>
              {openMasuk && (
                <DateTimePicker
                  value={masuk ? new Date(masuk) : new Date()}
                  mode="date"
                  display="default"
                  onChange={onDateChange2}
                />
              )}

              <TouchableOpacity
                onPress={() => setOpenKadaluarsa(true)}
                style={styles.inputDate}>
                <Text
                  style={
                    kadaluarsa ? styles.dateSelected : styles.datePlaceholder
                  }>
                  {kadaluarsa || 'Tanggal Kadaluarsa'}
                </Text>
              </TouchableOpacity>
              {openKadaluarsa && (
                <DateTimePicker
                  value={kadaluarsa ? new Date(kadaluarsa) : new Date()}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}

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
              <Text style={styles.modalTitle}>Tambah Obat</Text>
              <View style={styles.pickerContainer}>
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
              </View>
              <TextInput
                style={styles.input}
                placeholder="Jumlah"
                value={editjumlah}
                onChangeText={editsetJumlah}
                keyboardType="numeric"
              />

              <TouchableOpacity
                onPress={() => setOpenMasuk(true)}
                style={styles.inputDate}>
                <Text
                  style={
                    editmasuk ? styles.dateSelected : styles.datePlaceholder
                  }>
                  {editmasuk || 'Tanggal Masuk'}
                </Text>
              </TouchableOpacity>
              {openMasuk && (
                <DateTimePicker
                  value={editmasuk ? new Date(editmasuk) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    if (event.type === 'set' && selectedDate) {
                      const formattedDate = selectedDate
                        .toISOString()
                        .split('T')[0];
                      editsetMasuk(formattedDate);
                    }
                    setOpenMasuk(false);
                  }}
                />
              )}

              <TouchableOpacity
                onPress={() => setOpenKadaluarsa(true)}
                style={styles.inputDate}>
                <Text
                  style={
                    editkadaluarsa
                      ? styles.dateSelected
                      : styles.datePlaceholder
                  }>
                  {editkadaluarsa || 'Tanggal Kadaluarsa'}
                </Text>
              </TouchableOpacity>
              {openKadaluarsa && (
                <DateTimePicker
                  value={editkadaluarsa ? new Date(editkadaluarsa) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    if (event.type === 'set' && selectedDate) {
                      const formattedDate = selectedDate
                        .toISOString()
                        .split('T')[0];
                      editsetKadaluarsa(formattedDate);
                    }
                    setOpenKadaluarsa(false);
                  }}
                />
              )}

              <Button
                mode="contained"
                onPress={handleUpdateObat}
                style={styles.submitButton}>
                Simpan
              </Button>
              <Button mode="text" onPress={() => setEditModalVisible(false)}>
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
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 15,
  },
  inputDate: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    paddingTop: 15,
    paddingBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    color: 'grey',
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: '#ff3952', // Adjust the color as needed
  },
  datePlaceholder: {
    color: 'grey',
  },
});

export default Transaksi;
