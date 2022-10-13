import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAsqmTMKD1vIXW-4M-j3uWvzhH1xwFUJEY',
  authDomain: 'abn-amro-code-challenge.firebaseapp.com',
  projectId: 'abn-amro-code-challenge',
  storageBucket: 'abn-amro-code-challenge.appspot.com',
  messagingSenderId: '1085379261274',
  appId: '1:1085379261274:web:3ea13354aafec38b677963',
  measurementId: 'G-KFPL7BP40Y'
};

export const firebaseApp = initializeApp(firebaseConfig);
export const provider = new GoogleAuthProvider();
export { signInWithPopup, getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
