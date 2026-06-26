import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from './supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications(email: string): Promise<string | null> {
  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('orders', {
      name: 'Поръчки',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#bd1105',
    });
    await Notifications.setNotificationChannelAsync('promos', {
      name: 'Промоции',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  try {
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

    // Save token to Supabase
    await supabase.from('push_tokens').upsert(
      { email, token, platform: Platform.OS, updated_at: new Date().toISOString() },
      { onConflict: 'email' }
    );

    return token;
  } catch {
    return null;
  }
}

export function useNotificationListeners(
  onNotification: (n: Notifications.Notification) => void,
  onResponse: (r: Notifications.NotificationResponse) => void
) {
  const sub1 = Notifications.addNotificationReceivedListener(onNotification);
  const sub2 = Notifications.addNotificationResponseReceivedListener(onResponse);
  return () => {
    sub1.remove();
    sub2.remove();
  };
}
