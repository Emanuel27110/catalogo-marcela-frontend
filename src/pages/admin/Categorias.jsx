import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  obtenerCategorias, 
  crearCategoria, 
  actualizarCategoria, 
  eliminarCategoria 
} from '../../services/api';
import './Categorias.css';

const Categorias = () => {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState(null);
  
  // Formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [orden, setOrden] = useState(0);
  const [error, setError] = useState('');

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
      setCargando(false);
    }
  };

  const abrirModal = (categoria = null) => {
    if (categoria) {
      setEditando(categoria);
      setNombre(categoria.nombre);
      setDescripcion(categoria.descripcion || '');
      setOrden(categoria.orden || 0);
    } else {
      setEditando(null);
      setNombre('');
      setDescripcion('');
      setOrden(0);
    }
    setError('');
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setEditando(null);
    setNombre('');
    setDescripcion('');
    setOrden(0);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    try {
      const categoriaData = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        orden: parseInt(orden)
      };

      if (editando) {
        await actualizarCategoria(editando._id, categoriaData);
      } else {
        await crearCategoria(categoriaData);
      }

      await cargarCategorias();
      cerrarModal();
    } catch (error) {
      setError(error.response?.data?.mensaje || 'Error al guardar categoría');
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (window.confirm(`¿Estás segura de eliminar la categoría "${nombre}"?`)) {
      try {
        await eliminarCategoria(id);
        await cargarCategorias();
      } catch (error) {
        alert('Error al eliminar categoría: ' + (error.response?.data?.mensaje || 'Error desconocido'));
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (cargando) {
    return <div className="loading-admin">Cargando categorías...</div>;
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <h1>📦 Gestión de Categorías</h1>
          <div className="header-actions">
            <span className="usuario-nombre">👋 {usuario?.nombre}</span>
            <button onClick={handleLogout} className="btn-logout">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Navegación */}
      <nav className="admin-nav">
        <button onClick={() => navigate('/admin')} className="nav-btn">
          🏠 Dashboard
        </button>
        <button className="nav-btn active">
          📦 Categorías
        </button>
        <button onClick={() => navigate('/admin/productos')} className="nav-btn">
          🛍️ Productos
        </button>
      </nav>

      {/* Contenido */}
      <main className="admin-main">
        <div className="admin-toolbar">
          <h2>Categorías ({categorias.length})</h2>
          <button onClick={() => abrirModal()} className="btn-primary">
            + Nueva Categoría
          </button>
        </div>

        {categorias.length === 0 ? (
          <div className="empty-state">
            <p>📦 No hay categorías creadas</p>
            <button onClick={() => abrirModal()} className="btn-primary">
              Crear primera categoría
            </button>
          </div>
        ) : (
          <div className="categorias-list">
            {categorias.map((categoria) => (
              <div key={categoria._id} className="categoria-item">
                <div className="categoria-info">
                  <h3>{categoria.nombre}</h3>
                  {categoria.descripcion && <p>{categoria.descripcion}</p>}
                  <span className="categoria-orden">Orden: {categoria.orden}</span>
                </div>
                <div className="categoria-actions">
                  <button 
                    onClick={() => abrirModal(categoria)}
                    className="btn-edit"
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    onClick={() => handleEliminar(categoria._id, categoria.nombre)}
                    className="btn-delete"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {mostrarModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editando ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
            
            <form onSubmit={handleSubmit}>
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Remeras, Pantalones, Accesorios"
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Descripción opcional de la categoría"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Orden</label>
                <input
                  type="number"
                  value={orden}
                  onChange={(e) => setOrden(e.target.value)}
                  placeholder="0"
                />
                <small>Define el orden de aparición (menor número = primero)</small>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={cerrarModal} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  {editando ? 'Guardar Cambios' : 'Crear Categoría'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categorias;