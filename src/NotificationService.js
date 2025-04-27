import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Platform} from 'react-native';

class NotificationService {
  constructor() {
    this.configure();
    this.createDefaultChannels();
  }

  configure = () => {
    // Konfigurasi untuk React Native Push Notification
    PushNotification.configure({
      // (opsional) Dipanggil ketika token berubah
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },

      // (diperlukan) Dipanggil ketika notifikasi diterima atau dibuka
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);

        // Proses notifikasi

        // (diperlukan) Untuk iOS
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (opsional) Dipanggil ketika aksi notifikasi dipilih
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },

      // (opsional) Dipanggil saat pengguna menolak izin
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Biarkan memunculkan notifikasi ketika aplikasi sedang terbuka (default: true)
      popInitialNotification: true,
      // Perbaikan: requestPermissions yang diduplikasi
      requestPermissions: Platform.OS === 'ios',
    });
  };

  createDefaultChannels() {
    // Channel untuk Android
    PushNotification.createChannel(
      {
        channelId: 'default-channel-id', // (diperlukan)
        channelName: 'Default channel', // (diperlukan)
        channelDescription: 'Default channel for notifications', // (opsional) deskripsi
        playSound: true, // (opsional) apakah memainkan suara? default: true
        soundName: 'default', // (opsional) Sound untuk memainkan notifikasi. default: 'default'
        importance: 4, // (opsional) default: 4. Int value 0-4 menandakan pentingnya
        vibrate: true, // (opsional) default: true. Buat perangkat bergetar saat menerima notifikasi
      },
      created => console.log(`Channel created: ${created}`), // (opsional) callback saat channel dibuat
    );
  }

  // Fungsi untuk membuat notifikasi lokal
  localNotification(title, message, data = {}) {
    PushNotification.localNotification({
      channelId: 'default-channel-id',
      title: title,
      message: message,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      vibrate: true,
      vibration: 300,
      data: data,
    });
  }

  // Fungsi untuk notifikasi terjadwal
  scheduleNotification(title, message, date, data = {}) {
    PushNotification.localNotificationSchedule({
      channelId: 'default-channel-id',
      title: title,
      message: message,
      date: date, // Date object untuk waktu notifikasi
      allowWhileIdle: true, // Penting untuk Android
      playSound: true,
      soundName: 'default',
      importance: 'high',
      vibrate: true,
      vibration: 300,
      data: data,
    });
  }

  // Fungsi untuk membatalkan semua notifikasi
  cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }

  // Membatalkan notifikasi berdasarkan ID
  cancelNotification(id) {
    PushNotification.cancelLocalNotifications({id: `${id}`});
  }

  // Mengatur badge untuk iOS
  setBadge(count) {
    PushNotification.setApplicationIconBadgeNumber(count);
  }

  // Mengatur ulang badge
  resetBadge() {
    if (Platform.OS === 'ios') {
      PushNotification.setApplicationIconBadgeNumber(0);
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;
