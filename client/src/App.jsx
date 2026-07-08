import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
  const [config, setConfig] = useState({});

  const navigate = useNavigate();

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

  //Carichiamo la configurazione delle difficoltà
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const cfg = await API.getConfig();
        setConfig(Object.fromEntries(cfg.map(c => [c.key, c])));
      } catch (e) {
        console.error('Configurazione non disponibile:', e);
      }
    };
    loadConfig();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setUser(user);
      setMessage('');
    } catch (err) {
      setMessage(err);
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser({});
    setMessage('');
    navigate('/');
  };

  if (loading)
    return <Spinner animation='border' className='m-5' />;

  return (
    <Routes>
      <Route element={<MyNavbar loggedIn={loggedIn} user={user} onLogout={handleLogout} />}>
        <Route path='/' element={loggedIn ? <Navigate replace to='/dashboard' /> : <Home config={config} />} />
        <Route path='/login' element={loggedIn ? <Navigate replace to='/dashboard' /> : <Login onLogin={handleLogin} message={message} />} />
        <Route path='/dashboard' element={loggedIn ? <Dashboard user={user} config={config} /> : <Navigate replace to='/login' />} />
        <Route path='/game/:id' element={<GameBoard config={config} />} />
        <Route path='/stats' element={<Stats user={user} loggedIn={loggedIn} />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;