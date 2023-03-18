import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { collection, doc, getDocs, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from './firebase';


function defaultReact() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const handleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  const handleAddEntry = () => {
    const db = setupDBCalls();

    const entry = {
      name: "Los Angeles",
      state: "CA",
      date: new Date(),
      country: "USA",
      cities: [1, 2, 3]
    }

    setDoc(db, entry).then(() => {
      console.log("Entry added:", entry)
    });
  };

  const handleGetEntry = () => {
    const db = setupDBCalls();
    
    getDoc(db)
    .then((querySnapshot)=>{
      console.log("Get entry:", querySnapshot.data())
    })
  };

  const setupDBCalls = () => {
    const user = auth.currentUser;
  
    if (!user) {
      throw new Error('User not authenticated');
    }

    const firestoreConverter = {
      toFirestore: (entry) => {
        entry.uid = user.uid;
        return entry;
      },
      fromFirestore: (snapshot, options) => {
        return snapshot.data(options);
      }
    };
    
    return doc(db, 'users', user.uid).withConverter(firestoreConverter)
  };

  return (
    <div>
      <h1>Welcome to INAB</h1>
      {user ? (
        <div>
          <p>Signed in as {user.displayName}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <button onClick={handleSignIn}>Sign In with Google</button>
      )}
      <button onClick={handleAddEntry} style={{ padding: '8px 16px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Add Entry
      </button>
      <button onClick={handleGetEntry} style={{ padding: '8px 16px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Get Entry
      </button>
    </div>
  );
}

export default App;
