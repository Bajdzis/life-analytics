import React, { useState } from 'react';
import logo from './logo.svg';
import * as firebase from 'firebase';
import './App.css';
const firebaseConfig = {
  apiKey: "AIzaSyCwFE6p8DLMvd3M-Ldbo2S8W_jc7lVmHI8",
  authDomain: "auto-time-72f2c.firebaseapp.com",
  databaseURL: "https://auto-time-72f2c.firebaseio.com",
  projectId: "auto-time-72f2c",
  storageBucket: "auto-time-72f2c.appspot.com",
  messagingSenderId: "638291778659",
  appId: "1:638291778659:web:397976f40b3296fa696c56",
  measurementId: "G-TNEBFMLF64"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
firebaseApp.analytics();
function App() {
  const [user, setUser] = useState<firebase.auth.UserCredential | null>(null);
  const onClick =  () => {
    firebaseApp.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
    // firebaseApp.auth().signInWithPopup(new firebase.auth.EmailAuthProvider())
    .then((user) => {setUser(user); }).catch(() => setUser(null));
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        Hi, {user&& user.user && user.user.displayName} !
        <button onClick={onClick}>aaaaa</button>
      </header>
    </div>
  );
}

export default App;
