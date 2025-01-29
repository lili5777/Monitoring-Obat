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

    fetch('http://10.0.2.2:8000/api/rak')
      .then(response => response.json())
      .then(data => {
        setRakData(data.data || []);
      })
      .catch(error => {
        console.error('Error fetching rak data:', error);
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

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || kadaluarsa;
    setShowDatePicker(false); // Hide date picker after selection
    if (event.type === 'set') {
      setKadaluarsa(currentDate.toISOString().split('T')[0]); // Format to YYYY-MM-DD
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
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.cardTitle}>Nama Obat: {item.nama}</Text>
                <Text style={styles.cardSubtitle}>Jumlah: {item.jumlah}</Text>
                <Text style={styles.cardSubtitle}>
                  Kadaluarsa: {item.kadaluarsa}
                </Text>
                <Text style={styles.cardSubtitle}>Rak: {item.rak}</Text>
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  picker: {borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10},
  selectContainer: {margin: 10},
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
  addButtonText: {
    color: '#ff3952',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    marginBottom: 15,
    backgroundColor: '#ffe5e5',
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
    color: '#ff3952',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#757575',
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
    alignItems: 'center',
  },
  buttonLabel: {
    color: '#ff3952',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ff3952',
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    marginBottom: 15,
    paddingVertical: 5,
    fontSize: 16,
  },
  selectLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  selectItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  selectedItem: {
    color: '#ff3952',
    fontWeight: 'bold',
  },
  unselectedItem: {
    color: '#000000',
  },
  submitButton: {
    backgroundColor: '#ff3952',
    marginBottom: 10,
  },
});

export default Obat;
