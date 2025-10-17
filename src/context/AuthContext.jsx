import { createContext, useState, useEffect } from 'react';
import { login as loginAPI, obtenerPerfil } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Verificar si hay un usuario logueado al cargar la app
  useEffect(() => {
    verificarUsuario();
  }, []);

  const verificarUsuario = async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const data = await obtenerPerfil();
        setUsuario(data);
      } catch (error) {
        console.error('Error al verificar usuario:', error);
        localStorage.removeItem('token');
      }
    }
    
    setCargando(false);
  };

  const login = async (email, password) => {
    try {
      const data = await loginAPI(email, password);
      localStorage.setItem('token', data.token);
      setUsuario(data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        mensaje: error.response?.data?.mensaje || 'Error al iniciar sesión' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      login, 
      logout, 
      cargando 
    }}>
      {children}
    </AuthContext.Provider>
  );
};