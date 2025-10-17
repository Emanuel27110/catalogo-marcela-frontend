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
        <h1>Catálogo Marcela</h1>
        <p>Seleccioná una categoría para ver los productos</p>
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
              <div className="categoria-icono">📦</div>
              <h2>{categoria.nombre}</h2>
              {categoria.descripcion && (
                <p>{categoria.descripcion}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;