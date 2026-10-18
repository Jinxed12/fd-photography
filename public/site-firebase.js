import { getApps, initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';

const firebaseConfig = {
  apiKey: 'AIzaSyBKrxBqBGLKCrMkG2g_kQyLTYloUfrS1Gc',
  authDomain: 'fd-photography.firebaseapp.com',
  projectId: 'fd-photography',
  storageBucket: 'fd-photography.firebasestorage.app',
  messagingSenderId: '961538538012',
  appId: '1:961538538012:web:f60b0e32fa27b28f823dd9',
  measurementId: 'G-F07B26R2D9',
};
let firebaseAppPromise;

export function getFirebaseApp() {
  if (!firebaseAppPromise) {
    firebaseAppPromise = Promise.resolve(getApps()[0] || initializeApp(firebaseConfig));
  }

  return firebaseAppPromise;
}
