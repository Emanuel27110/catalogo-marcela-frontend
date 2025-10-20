import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerCategorias } from '../services/api';
import './Home.css';

const Home = () => {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const data = await obtenerCategorias();
      setCategorias(data);
      setCargando(false);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setError('Error al cargar las categorías');
      setCargando(false);
    }
  };

  const irACategoria = (id) => {
    navigate(`/categoria/${id}`);
  };

  if (cargando) {
    return (
      <div className="home-container">
        <div className="loading">Cargando categorías...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <img src="/logo.jpg" alt="Jazmin Joyas" className="logo-home" />
        <p className="frase-header">✨ Todo el año junto a vos ✨</p>
        <button 
          onClick={() => navigate('/login')} 
          className="btn-admin-access"
        >
          🔐 Acceso Admin
        </button>
      </header>

      {categorias.length === 0 ? (
        <div className="sin-categorias">
          <p>No hay categorías disponibles</p>
        </div>
      ) : (
        <div className="categorias-grid">
          {categorias.map((categoria) => (
            <div 
              key={categoria._id} 
              className="categoria-card"
              onClick={() => irACategoria(categoria._id)}
            >
              <div className="categoria-icono">💎</div>
              <h2>{categoria.nombre}</h2>
              {categoria.descripcion && (
                <p>{categoria.descripcion}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/logo.jpg" alt="Jazmin Joyas" />
          </div>
          
          <div className="footer-info">
            <h3>Contacto</h3>
            <div className="footer-links">
              <a href="https://www.facebook.com/jazmin.joyas.7" target="_blank" rel="noopener noreferrer" className="footer-link">
                📘 Facebook: jazmin joyas
              </a>
              <a href="https://www.instagram.com/jazminjoyasyalgomas/" target="_blank" rel="noopener noreferrer" className="footer-link">
                📸 Instagram: jazmin joyas
              </a>
              <a href="https://wa.me/5493814748051" target="_blank" rel="noopener noreferrer" className="footer-link">
                📱 WhatsApp: 3814 74-8051
              </a>
            </div>
          </div>

          <div className="footer-frase">
            <p>✨ Todo el año junto a vos ✨</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Jazmin joyas y algo mas... - Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;