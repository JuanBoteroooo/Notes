import React from 'react';
import { Link } from 'react-router-dom';

const App = () => {
  return (
    <div className="container">
      <h2>Bienvenido a la Aplicación de Notas</h2>
      <nav>
        <Link to="/login">Log in</Link>
        <Link to="/signup">Sign up</Link>
      </nav>
    </div>
  );
};

export default App;
