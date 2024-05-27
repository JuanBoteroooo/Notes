import React from 'react';
import { Link } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <h1>Bienvenido a la Aplicación de Notas</h1>
      <nav>
        <button><Link to="/login">Login</Link></button>
        <button><Link to="/signup">Signup</Link></button>
      </nav>
    </div>
  );
};

export default App;

