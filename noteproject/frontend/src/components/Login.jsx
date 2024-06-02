import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated, setUsername }) => {
  const [username, setUsernameInput] = useState(''); 
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/login', { username, password }, { withCredentials: true });
      console.log(res.data);
      setIsAuthenticated(true);
      setUsername(username);
      navigate('/notes');
    } catch (error) {
      alert("Usuario o contrasenia incorrecta")
      console.error(error);
    }
  };

  return (
    <div className="container-menu">
      <h2>Log in</h2>
      <form onSubmit={handleSubmit}>
        <label>Username</label>
        <input type="text" value={username} onChange={(e) => setUsernameInput(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Log in</button>
      </form>
    </div>
  );
};

export default Login;
