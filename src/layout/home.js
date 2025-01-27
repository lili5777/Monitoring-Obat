import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    fetchUser();
  }, []);

  const navigation = useNavigation();
  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.navigate('Login'); // Arahkan ke halaman login
  };
  const handleRak = async () => {
    navigation.navigate('Rak'); // Arahkan ke halaman login
  };
  const handleObat = async () => {
    navigation.navigate('Obat'); // Arahkan ke halaman login
  };
  const handleRiwayat = async () => {
    navigation.navigate('Riwayat'); // Arahkan ke halaman login
  };
  const handleProfil = async () => {
    navigation.navigate('Profil'); // Arahkan ke halaman login
  };

  return (
    <LinearGradient colors={['#ff3952', '#ffff']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi {user ? user.username : 'User'}!</Text>
        <Text style={styles.role}>You are an {user ? user.role : 'User'}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Welcome!</Text>
          <Text style={styles.cardText}>
            Manage your tasks and inventory with ease.
          </Text>
        </View>
        <Image
          source={require('../img/ilustrasi2.png')}
          style={styles.cardImage}
        />
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={handleObat}>
          <Image source={require('../img/obat.png')} style={styles.menuIcon} />
          <Text style={styles.menuText}>Obat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleRak}>
          <Image
            source={require('../img/manage3.png')}
            style={styles.menuIcon}
          />
          <Text style={styles.menuText}>Kelola Rak</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleRiwayat}>
          <Image
            source={require('../img/expire.png')}
            style={styles.menuIcon}
          />
          <Text style={styles.menuText}>Riwayat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleProfil}>
          <Image
            source={require('../img/profile.png')}
            style={styles.menuIcon}
          />
          <Text style={styles.menuText}>Profile</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  role: {
    fontSize: 14,
    color: '#ffe5e5',
    opacity: 0.8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff3952',
  },
  cardText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  cardImage: {
    width: 80,
    height: 80,
    marginLeft: 10,
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    backgroundColor: '#ffe5e5',
    borderRadius: 20,
    width: '45%',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  menuIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  menuText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff3952',
  },
  logoutButton: {
    backgroundColor: '#fff',
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
  logoutText: {
    color: '#ff3952',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Home;
