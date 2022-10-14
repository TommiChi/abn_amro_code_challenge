import { provider, getAuth, signInWithPopup, signOut, onAuthStateChanged } from './firebase';

export function login () {
  const auth = getAuth();

  return new Promise((resolve, reject) => {
    signInWithPopup(auth, provider)
    .then((result) => {
      const { user } = result;
      resolve(user);
    }).catch((error) => {
      reject(error);
    });
  });
}

export function logout () {
  const auth = getAuth();

  return signOut(auth);
}

export function initialize (callback: Function = () => {}) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    callback(user);
  }

  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user);
      callback(user);
    });  
  });
}

export function isLoggedIn () {
  const auth = getAuth();
  return !!auth.currentUser; 
}