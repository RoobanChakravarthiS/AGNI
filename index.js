/**
 * @format
 */
import PushNotification from "react-native-push-notification";
import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Create Notification Channel (only for Android)
PushNotification.createChannel(
    {
        channelId: 'test1', // Channel ID
        channelName: 'Test Channel', // Channel Name
        channelDescription: 'A channel to send test notifications', // Channel Description
        soundName: 'default', // Sound for notifications
        importance: 4, // Importance level (high)
        vibrate: true, // Vibration setting
    },
    (created) => console.log(`createChannel returned '${created}'`)
);

// Configure Push Notification
PushNotification.configure({
    onRegister: function (token) {
        console.log("TOKEN:", token);
    },
    onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
        // For Android, finish the notification (important for background notifications)
        notification.finish(PushNotification.FetchResult.NoData);
    },
    onAction: function (notification) {
        console.log("ACTION:", notification.action);
        console.log("NOTIFICATION:", notification);
    },
    onRegistrationError: function (err) {
        console.error(err.message, err);
    },
    permissions: {
        alert: true,
        badge: true,
        sound: true,
    },
    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios',
});

// Send Notification function
const sendNotification = () => {
    console.log('Started sending notification');
    PushNotification.localNotification({
        channelId: 'test1', // Make sure this matches the channel created above
        title: 'Test notification', // Notification Title
        message: 'idhu verum test notificataion thaan da ', // Notification Message
        playSound: true,
        soundName: 'default',
        importance: 'high', // Ensure high priority notifications
        visibility: 'public', // This makes the notification visible on the lock screen
        vibrate: true, // Enable vibration
        vibration: 300, // Set vibration pattern (optional)
    });
};

export { sendNotification };

AppRegistry.registerComponent(appName, () => App);
