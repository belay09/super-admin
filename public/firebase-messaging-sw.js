importScripts("https://www.gstatic.com/firebasejs/8.2.7/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.7/firebase-messaging.js");

try {
  const firebaseConfig = {
    apiKey: "AIzaSyAZWWn2M9XlpBvQbx3sr5tzq5zC3s5upGA",
    authDomain: "sheger-gebeta-bcf20.firebaseapp.com",
    projectId: "sheger-gebeta-bcf20",
    storageBucket: "sheger-gebeta-bcf20.appspot.com",
    messagingSenderId: "1091086646551",
    appId: "1:1091086646551:web:b145c0e6be1c2c7bf80b52",
  };
  console.log("REGISTRATION STARTED");

  const app = firebase.initializeApp(firebaseConfig);
  app.messaging();
} catch (error) {
  console.log("error from -sw.js", error);
}