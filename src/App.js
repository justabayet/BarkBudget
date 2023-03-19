import React, {useState, useEffect} from 'react';
import './App.css';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from './firebase';
import Transactions from './Components/transactions';
import ExpenseGraph from './Components/graph';
import { Button, Typography } from '@mui/material';
import { data } from './data';


function App() {
  const [user, setUser] = useState(null);
  const [database, setDatabase] = useState(null);
  const [transactions, setTransactions] = useState([]);

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

  useEffect(() => {
    if (user) {
      const firestoreConverter = {
        toFirestore: (entry) => {
          entry.uid = user.uid;
          return entry;
        },
        fromFirestore: (snapshot, options) => {
          return snapshot.data(options);
        }
      };
      
      const docRef = doc(db, 'users', user.uid).withConverter(firestoreConverter);
      setDatabase(docRef);
    }

  }, [user])

  const handleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  const handleAddEntry = () => {
    const newTransactions = [...transactions, transactions.length+1]
    const entry = {
      name: "Los Angeles",
      state: "CA",
      date: new Date(),
      country: "USA",
      cities: newTransactions
    }

    setDoc(database, entry);
    setTransactions(newTransactions)

  };

  const handleGetEntry = () => {
    getDoc(database)
    .then((querySnapshot)=>{
      console.log("Get entry:", querySnapshot.data())
      setTransactions(querySnapshot.data().cities)
    })
  };

  return  (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Typography variant="h4" style={{ marginRight: 20 }}>
          Welcome to INAB
        </Typography>
        {user ? (
          <div>
            <Typography variant="subtitle1" style={{ marginRight: 20 }}>
              Signed in as {user.displayName}
            </Typography>
            <Button variant="contained" color="secondary" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        ) : (
          <Button variant="contained" color="primary" onClick={handleSignIn}>
            Sign In with Google
          </Button>
        )}
      </div>
      <ExpenseGraph data={data}></ExpenseGraph>
      <div style={{ marginBottom: 20 }}>
        <Button variant="contained" color="primary" style={{ marginRight: 10 }} onClick={handleAddEntry}>
          Add Entry
        </Button>
        <Button variant="contained" color="primary" onClick={handleGetEntry}>
          Get Entry
        </Button>
      </div>
      <Transactions transactions={transactions}></Transactions>
    </div>
  );
}

export default App;
