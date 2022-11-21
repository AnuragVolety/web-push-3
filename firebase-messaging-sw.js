// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    apiKey: "AIzaSyD1PQW26YUKNpXWMEpj60czm1ZMfCOPl0M",
    authDomain: "staging-bikayi.firebaseapp.com",
    databaseURL: "https://staging-bikayi-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "staging-bikayi",
    storageBucket: "staging-bikayi.appspot.com",
    messagingSenderId: "99091183732",
    appId: "1:99091183732:web:d8f4b5df42e8d313dcb921"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    console.log(
        "[firebase-messaging-sw.js] Received background message ",
        payload,
    );
    // Customize notification here
    const notificationTitle = "Background Message Title";
    const notificationOptions = {
        body: "Background Message body.",
        icon: "/itwonders-web-logo.png",
    };

    return self.registration.showNotification(
        notificationTitle,
        notificationOptions,
    );
});