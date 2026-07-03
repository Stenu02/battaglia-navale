import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

import MyNavbar from './components/MyNavbar.jsx';
import Home from './components/Home.jsx';
import Login from './components/AuthComponents.jsx';
import Dashboard from './components/Dashboard.jsx';
import GameBoard from './components/GameBoard.jsx';
import Stats from './components/Stats.jsx';
import NotFound from './components/NotFound.jsx';

import API from "./API/API.js";


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
useEffect(() => {
  const checkAuth = async () => {
    try {
      const user = await API.getUserInfo();
      setLoggedIn(true);
      setUser(user);
    } catch { 
       // nessuna sessione attiva all'avvio
    } finally {
      setLoading(false);
    }
  };
  checkAuth();
}, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setUser(user);
      setMessage('');
    } catch(err) {
      setMessage(err);
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser({});
    setMessage('');
  };

  if (loading)
  return <Spinner animation='border' className='m-5' />;
  
  return (
    <Routes>
      <Route element={<MyNavbar loggedIn={loggedIn} user={user} onLogout={handleLogout} />}>
        
        <Route path='/'
          element={loggedIn ? <Navigate replace to='/dashboard' /> : <Home />}
        />
        
        <Route path='/login'
          element={loggedIn ? <Navigate replace to='/dashboard' /> : <Login onLogin={handleLogin} message={message} />}
        />
        
        <Route path='/dashboard'
          element={loggedIn ? <Dashboard user={user} /> : <Navigate replace to='/login' />}
        />
        
       <Route path='/game/:id' 
          element={<GameBoard />} 
       />
        
        <Route path='/stats'
          element={<Stats />}
        />
        
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;