import React, { useState, useEffect } from 'react';
import * as firebase from 'firebase';

import { Stream } from './components/Stream/Stream';
import { LoginPage } from './components/LoginPage/LoginPage';
import { Button } from 'reactstrap';
import moment  from 'moment';
import { TrChoice } from './components/Translation/TrChoice';

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

export const firebaseApp = firebase.initializeApp(firebaseConfig);
firebaseApp.analytics();

export const firebaseDatabase = firebase.database();

function App() {

  const [user, setUser] = useState<firebase.User | null>(null);
  const [zoom, setZoom] = useState<[number, number]>([360,180]);
  const [loading, setLoading] = useState(true);
  const [streamsId, setStreamsId] = useState<string[]>([]);

  useEffect(() => {
    const handler = (e: WheelEvent) => {
      if(e.ctrlKey) {
        e.preventDefault();
        const leftPercent = e.clientX / window.innerWidth;
        const rightPercent = 1 - leftPercent;
        let speed = 60; //min
        if(e.deltaY < 0){
          speed = -speed;
        }
        let left =  zoom[0] - (speed * leftPercent);
        let right = zoom[1] - (speed * rightPercent);
        if(left < 0){
          left = 0;
        }
        if(right < 0){
          right = 0;
        }

        if(left + right > 1400){
          right = zoom[1];
          left =  zoom[0];
        }
        setZoom([left, right]);
      }
    };
    window.addEventListener('wheel', handler, { passive: false });
    return () => window.removeEventListener('wheel', handler);
  }, [zoom, setZoom]);

  const start = parseInt(moment().set('hour', 0).set('minute', 0).set('millisecond', 0).add(zoom[0],'minutes').format('X'), 10);
  const stop = parseInt(moment().set('hour', 23).set('minute', 59).set('millisecond', 0).subtract(zoom[1],'minutes').format('X'), 10);

  const singOut =  () => {
    firebaseApp.auth().signOut();
    setStreamsId([]);
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    const starCountRef = firebaseDatabase.ref(`users/${user.uid}`);
    starCountRef.on('value', function(snapshot) {
      const userData = snapshot.val();
      if (userData && userData.streams && Array.isArray(userData.streams)) {
        setStreamsId(userData.streams as string[]);
      } else {
        setStreamsId([]);
      }
    });

    return () => starCountRef.off('value');
  }, [user]);

  firebase.auth().onAuthStateChanged((user) => {
    setUser(user);
    setLoading(false);
  });
  
  if(loading === true) {
    return <>{"Loading"}</>;
  }
  if(user === null) {
    return <LoginPage />;
  }

  const createStream = () => {
    const newStreamKey = firebaseDatabase.ref().child('streams').push().key;
    const updates:{[key: string]: any} = {};

    updates['/streams/' + newStreamKey] = {
      name: prompt('Name of new stream'),
      uid: user.uid
    };
    updates['/users/' + user.uid + '/streams'] = [...streamsId, newStreamKey];

    return firebaseDatabase.ref().update(updates);
  }
  console.log(zoom)
  return (
    <div className="App">
      <header className="App-header">
      {moment(start,'X').format('HH:mm')}
      {moment(stop,'X').format('HH:mm')}
      <TrChoice />
        Hi, <strong>{user.displayName}</strong> !{' '}
        
  {user.photoURL && <img src={user.photoURL} alt={user.displayName || ''}/> }
<Button outline size="sm" color="secondary" onClick={singOut}>singOut</Button>
        
<br/>
<br/>
        <Button color="primary" onClick={() => createStream()}>Create new stream</Button>
        <h2>Twoje dane</h2>
        {streamsId.map(streamId => <Stream key={streamId} id={streamId} start={start} stop={stop}/>)}
      </header>
    </div>
  );
}

export default App;


