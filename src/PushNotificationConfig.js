// PushNotificationConfig.js
import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
  },
  popInitialNotification: true,
  requestPermissions: true,
});

PushNotification.createChannel(
  {
    channelId: 'obat-kadaluarsa',
    channelName: 'Notifikasi Obat Kadaluarsa',
    soundName: 'kadaluarsa.wav', // harus sama dengan nama file di res/raw
    importance: 4,
    vibrate: true,
  },
  created => console.log(`channel created: '${created}'`),
);
