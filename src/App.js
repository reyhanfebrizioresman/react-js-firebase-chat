import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
    apiKey: "AIzaSyBpoFzKY46DWxsmTLbRGaCZrSej7_fvgk4",
    authDomain: "unichat-114b0.firebaseapp.com",
    projectId: "unichat-114b0",
    storageBucket: "unichat-114b0.appspot.com",
    messagingSenderId: "1041330450912",
    appId: "1:1041330450912:web:fc33de0a93dcc083ba3b85"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

function App() {

  const [ user ] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn(){

  const signInWithGoogle = () => {
      const provider =  new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
  } 

  return (
    <button onClick={signInWithGoogle}>Sign in With Google</button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>SignOut</button>
  )
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>🕊️</button>

    </form>
  </>)
}

function ChatMessage(props){
  const { text,uid,photoURL } = props.message;
  const messagesClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  
  return (
  <div className={`message ${messagesClass}`}>
    <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
    <p>{text}</p>
  </div>
  )
}

export default App;
