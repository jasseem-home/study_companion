// Import necessary Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';  // Realtime Database
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';  // Authentication
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js';  // Optional

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAjEfnuDroA-EUDaEjH8io8I81PgP_vd6w",
  authDomain: "intelligent-2eb53.firebaseapp.com",
  projectId: "intelligent-2eb53",
  storageBucket: "intelligent-2eb53.appspot.com", // Corrected storageBucket URL
  messagingSenderId: "1062128284039",
  appId: "1:1062128284039:web:cc9448ec5ea746ecbf6322",
  measurementId: "G-WPS9WYGDM4",
  databaseURL: "https://intelligent-2eb53-default-rtdb.firebaseio.com/" // Link to Realtime Database
};

// Initialize Firebase app and services
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);  // Initialize the Realtime Database
const auth = getAuth(app);  // Initialize Firebase Authentication

// Export initialized services to be used elsewhere
export { app, database, auth, analytics };
