import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerProductosPorCategoria, obtenerCategoriaPorId } from '../services/api';
import './Categoria.css';

const Categoria = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      const [productosData, categoriaData] = await Promise.all([
        obtenerProductosPorCategoria(id),
        obtenerCategoriaPorId(id)
      ]);
      
      setProductos(productosData);
      setCategoria(categoriaData);
      setCargando(false);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los productos');
      setCargando(false);
    }
  };

  const volverAtras = () => {
    navigate('/');
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(precio);
  };

  if (cargando) {
    return (
      <div className="categoria-container">
        <div className="loading">Cargando productos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="categoria-container">
        <div className="error">{error}</div>
        <button onClick={volverAtras} className="btn-volver">Volver</button>
      </div>
    );
  }

  return (
    <div className="categoria-container">
      <header className="categoria-header">
        <button onClick={volverAtras} className="btn-volver">
          ← Volver
        </button>
        <h1>{categoria?.nombre}</h1>
        {categoria?.descripcion && <p>{categoria.descripcion}</p>}
      </header>

      {productos.length === 0 ? (
        <div className="sin-productos">
          <p>No hay productos disponibles en esta categoría</p>
          <button onClick={volverAtras} className="btn-volver-secondary">
            Volver al inicio
          </button>
        </div>
      ) : (
        <div className="productos-grid">
          {productos.map((producto) => (
            <div key={producto._id} className="producto-card">
              <div className="producto-imagen">
                {producto.imagen ? (
                  <img 
                    src={`http://localhost:5000${producto.imagen}`} 
                    alt={producto.nombre}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300?text=Sin+Imagen';
                    }}
                  />
                ) : (
                  <div className="sin-imagen">📷</div>
                )}
              </div>
              
              <div className="producto-info">
                <h3>{producto.nombre}</h3>
                
                {producto.descripcion && (
                  <p className="producto-descripcion">{producto.descripcion}</p>
                )}
                
                <p className="producto-precio">{formatearPrecio(producto.precio)}</p>
                
                {producto.talles && producto.talles.length > 0 && (
                  <div className="producto-talles">
                    <span className="talles-label">Talles:</span>
                    <div className="talles-lista">
                      {producto.talles.map((talle, index) => (
                        <span key={index} className="talle-badge">
                          {talle}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categoria;