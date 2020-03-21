import React from 'react';
import * as firebase from 'firebase';
import { firebaseApp } from '../../App';
import { Button } from 'reactstrap';
import { Tr } from '../Translation/Tr';


const singInWithGoogle =  () => {
  firebaseApp.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
};

const singInWithGithub =  () => {
  firebaseApp.auth().signInWithPopup(new firebase.auth.GithubAuthProvider())
};

export function LoginPage(){
  return <div style={{textAlign: 'center', padding:'160px 0'}}>
    <h1 className="display-3">Life analytics</h1>
    <p><Tr label="login.desc" /></p>
    <Button color="primary" onClick={singInWithGoogle}><Tr label="login.with.google" /></Button>
    {' '}
    <Button color="primary" onClick={singInWithGithub}><Tr label="login.with.github" /></Button>
  </div>
}