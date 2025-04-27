import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Platform, PermissionsAndroid} from 'react-native';
import PushNotification, {Importance} from 'react-native-push-notification';

class Notifikasi {
  constructor() {
    this.notifikasiTerkirim = new Set(); // Untuk menyimpan ID notifikasi
    this.loadNotifikasiTerkirim(); // Memuat data dari penyimpanan
  }

  // Memuat data notifikasi yang sudah dikirim
  async loadNotifikasiTerkirim() {
    try {
      const saved = await AsyncStorage.getItem('notifikasi_terkirim');
      if (saved) {
        this.notifikasiTerkirim = new Set(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Gagal memuat notifikasi terkirim:', error);
    }
  }

  // Menyimpan data notifikasi yang sudah dikirim
  async saveNotifikasiTerkirim() {
    try {
      await AsyncStorage.setItem(
        'notifikasi_terkirim',
        JSON.stringify(Array.from(this.notifikasiTerkirim)),
      );
    } catch (error) {
      console.error('Gagal menyimpan notifikasi terkirim:', error);
    }
  }

  // Mengecek apakah notifikasi sudah dikirim
  sudahDikirim = idNotifikasi => {
    return this.notifikasiTerkirim.has(idNotifikasi);
  };

  // Menandai notifikasi sudah dikirim
  async tandaiTerkirim(idNotifikasi) {
    this.notifikasiTerkirim.add(idNotifikasi);
    await this.saveNotifikasiTerkirim();
  }

  // Mengirim notifikasi hanya jika belum pernah dikirim
  async kirimNotifikasiJikaBelum(channel, judul, pesan, idNotifikasi) {
    if (!this.sudahDikirim(idNotifikasi)) {
      this.kirimNotifikasi(channel, judul, pesan);
      await this.tandaiTerkirim(idNotifikasi);
      return true;
    }
    return false;
  }

  // Menjadwalkan notifikasi hanya jika belum pernah dikirim
  async jadwalkanNotifikasiJikaBelum(
    channel,
    judul,
    pesan,
    tanggal,
    idNotifikasi,
  ) {
    if (!this.sudahDikirim(idNotifikasi)) {
      this.jadwalkanNotifikasi(channel, judul, pesan, tanggal);
      await this.tandaiTerkirim(idNotifikasi);
      return true;
    }
    return false;
  }

  // Reset riwayat notifikasi (untuk testing)
  // async resetNotifikasiTerkirim() {
  //   this.notifikasiTerkirim = new Set();
  //   await AsyncStorage.removeItem('notifikasi_terkirim');
  //   console.log('History notifikasi terkirim telah direset');
  // }


  configure = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        const postGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        console.log('Izin POST_NOTIFICATIONS:', postGranted);
      } catch (err) {
        console.warn('Gagal meminta izin notifikasi:', err);
      }
    }

    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFIKASI:', notification);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFIKASI:', notification);
      },
      onRegistrationError: function (err) {
        console.error('Error registrasi:', err.message, err);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });
  };

  buatChannel = channel => {
    PushNotification.createChannel(
      {
        channelId: channel, // (wajib)
        channelName: 'Channel Saya', // (wajib)
        channelDescription: 'Channel untuk notifikasi kadaluarsa obat', // (opsional)
        playSound: true,
        soundName: 'kadaluarsa.mp3',
        importance: Importance.HIGH,
        vibrate: true,
        smallIcon: 'logo',
        largeIcon: 'logo',
      },
      created => console.log(`Channel dibuat: '${created}'`),
    );
  };

  kirimNotifikasi = (channel, judul, pesan) => {
    PushNotification.localNotification({
      channelId: channel,
      title: judul,
      message: pesan,
      playSound: true,
      soundName: 'kadaluarsa.mp3',
      smallIcon: 'logo',
      largeIcon: 'logo',
      allowWhileIdle: true,
    });
  };

  jadwalkanNotifikasi = (channel, judul, pesan, tanggalKadaluarsa) => {
    const targetDate = new Date(tanggalKadaluarsa).getTime();
    const sekarang = new Date().getTime();

    // Lewati jika tanggal kadaluarsa sudah lewat
    if (targetDate <= sekarang) {
      console.log('Notifikasi kadaluarsa dilewati - tanggal sudah lewat');
      return;
    }

    PushNotification.localNotificationSchedule({
      channelId: channel,
      title: judul,
      message: pesan,
      date: new Date(targetDate), // Waktu muncul notifikasi
      playSound: true,
      soundName: 'kadaluarsa.mp3',
      smallIcon: 'logo',
      largeIcon: 'logo',
      allowWhileIdle: true, // Tetap muncul saat device idle
    });

    console.log(
      `Notifikasi dijadwalkan untuk ${new Date(targetDate).toLocaleString()}`,
    );
  };
}

const notifikasi = new Notifikasi();
export default notifikasi;
