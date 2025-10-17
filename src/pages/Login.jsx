import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    // Validaciones básicas
    if (!email || !password) {
      setError('Por favor completá todos los campos');
      setCargando(false);
      return;
    }

    // Intentar login
    const resultado = await login(email, password);

    if (resultado.success) {
      navigate('/admin');
    } else {
      setError(resultado.mensaje);
      setCargando(false);
    }
  };

  const volverAlInicio = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🔐 Admin Login</h1>
          <p>Ingresá tus credenciales para acceder al panel</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              disabled={cargando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresá tu contraseña"
              disabled={cargando}
            />
          </div>

          <button 
            type="submit" 
            className="btn-login"
            disabled={cargando}
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <button 
          onClick={volverAlInicio} 
          className="btn-volver-login"
        >
          ← Volver al catálogo
        </button>
      </div>
    </div>
  );
};

export default Login;