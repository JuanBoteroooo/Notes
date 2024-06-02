import React, { useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Notes from './components/Notes';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  return (
    <div className='container'>
      <h2>Notas</h2>
      <nav>
        {!isAuthenticated ? (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Log in</Link>
          </>
        ) : (
          <span>Bienvenido, {username}...</span>
        )}
      </nav>
      <Routes>
        <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />} />
        <Route 
          path="/notes" 
          element={isAuthenticated ? <Notes username={username} setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} 
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default App;
