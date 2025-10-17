import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  obtenerTodosLosProductos,
  obtenerCategorias,
  crearProducto, 
  actualizarProducto, 
  eliminarProducto,
  cambiarVisibilidad,
  subirImagen
} from '../../services/api';
import './Productos.css';

const Productos = () => {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  
  // Formulario
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagen, setImagen] = useState('');
  const [archivoImagen, setArchivoImagen] = useState(null);
  const [talles, setTalles] = useState('');
  const [visible, setVisible] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [productosData, categoriasData] = await Promise.all([
        obtenerTodosLosProductos(),
        obtenerCategorias()
      ]);
      setProductos(productosData);
      setCategorias(categoriasData);
      setCargando(false);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setCargando(false);
    }
  };

  const abrirModal = (producto = null) => {
    if (producto) {
      setEditando(producto);
      setNombre(producto.nombre);
      setPrecio(producto.precio);
      setDescripcion(producto.descripcion || '');
      setCategoria(producto.categoria._id || producto.categoria);
      setImagen(producto.imagen || '');
      setTalles(producto.talles ? producto.talles.join(', ') : '');
      setVisible(producto.visible);
    } else {
      setEditando(null);
      setNombre('');
      setPrecio('');
      setDescripcion('');
      setCategoria('');
      setImagen('');
      setArchivoImagen(null);
      setTalles('');
      setVisible(true);
    }
    setError('');
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setEditando(null);
    setNombre('');
    setPrecio('');
    setDescripcion('');
    setCategoria('');
    setImagen('');
    setArchivoImagen(null);
    setTalles('');
    setVisible(true);
    setError('');
  };

  const handleImagenChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar los 5MB');
      return;
    }

    setArchivoImagen(file);
    setSubiendoImagen(true);
    
    try {
      const response = await subirImagen(file);
      setImagen(response.imagen);
      setError('');
    } catch (error) {
      setError('Error al subir imagen: ' + (error.response?.data?.mensaje || 'Error desconocido'));
    } finally {
      setSubiendoImagen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim() || !precio || !categoria) {
      setError('Nombre, precio y categoría son obligatorios');
      return;
    }

    try {
      // Procesar talles
      const tallesArray = talles
        .split(',')
        .map(t => t.trim())
        .filter(t => t !== '');

      const productoData = {
        nombre: nombre.trim(),
        precio: parseFloat(precio),
        descripcion: descripcion.trim(),
        categoria,
        imagen: imagen || '',
        talles: tallesArray,
        visible
      };

      if (editando) {
        await actualizarProducto(editando._id, productoData);
      } else {
        await crearProducto(productoData);
      }

      await cargarDatos();
      cerrarModal();
    } catch (error) {
      setError(error.response?.data?.mensaje || 'Error al guardar producto');
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (window.confirm(`¿Estás segura de eliminar el producto "${nombre}"?`)) {
      try {
        await eliminarProducto(id);
        await cargarDatos();
      } catch (error) {
        alert('Error al eliminar producto: ' + (error.response?.data?.mensaje || 'Error desconocido'));
      }
    }
  };

  const handleToggleVisibilidad = async (id) => {
    try {
      await cambiarVisibilidad(id);
      await cargarDatos();
    } catch (error) {
      alert('Error al cambiar visibilidad');
    }
  };

  const handleLogout = () => {
    logout();
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
    return <div className="loading-admin">Cargando productos...</div>;
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <h1>🛍️ Gestión de Productos</h1>
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
        <button onClick={() => navigate('/admin/categorias')} className="nav-btn">
          📦 Categorías
        </button>
        <button className="nav-btn active">
          🛍️ Productos
        </button>
      </nav>

      {/* Contenido */}
      <main className="admin-main">
        <div className="admin-toolbar">
          <h2>Productos ({productos.length})</h2>
          <button onClick={() => abrirModal()} className="btn-primary">
            + Nuevo Producto
          </button>
        </div>

        {productos.length === 0 ? (
          <div className="empty-state">
            <p>🛍️ No hay productos creados</p>
            <button onClick={() => abrirModal()} className="btn-primary">
              Crear primer producto
            </button>
          </div>
        ) : (
          <div className="productos-grid-admin">
            {productos.map((producto) => (
              <div key={producto._id} className="producto-card-admin">
                <div className="producto-imagen-admin">
                  {producto.imagen ? (
                    <img 
                      src={`http://localhost:5000${producto.imagen}`} 
                      alt={producto.nombre}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200?text=Sin+Imagen';
                      }}
                    />
                  ) : (
                    <div className="sin-imagen-admin">📷</div>
                  )}
                  {!producto.visible && (
                    <div className="badge-oculto">👁️ Oculto</div>
                  )}
                </div>

                <div className="producto-info-admin">
                  <h3>{producto.nombre}</h3>
                  <p className="producto-precio-admin">{formatearPrecio(producto.precio)}</p>
                  <p className="producto-categoria-admin">
                    📦 {producto.categoria?.nombre || 'Sin categoría'}
                  </p>
                  {producto.talles && producto.talles.length > 0 && (
                    <p className="producto-talles-admin">
                      Talles: {producto.talles.join(', ')}
                    </p>
                  )}
                </div>

                <div className="producto-actions-admin">
                  <button 
                    onClick={() => handleToggleVisibilidad(producto._id)}
                    className={producto.visible ? 'btn-ocultar' : 'btn-mostrar'}
                  >
                    {producto.visible ? '👁️ Ocultar' : '👁️ Mostrar'}
                  </button>
                  <button 
                    onClick={() => abrirModal(producto)}
                    className="btn-edit"
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    onClick={() => handleEliminar(producto._id, producto.nombre)}
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
          <div className="modal-content modal-producto" onClick={(e) => e.stopPropagation()}>
            <h2>{editando ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            
            <form onSubmit={handleSubmit}>
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Remera Oversize Negra"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Precio *</label>
                  <input
                    type="number"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    placeholder="15000"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label>Categoría *</label>
                  <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                    <option value="">Seleccionar...</option>
                    {categorias.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Descripción del producto"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Talles (opcional)</label>
                <input
                  type="text"
                  value={talles}
                  onChange={(e) => setTalles(e.target.value)}
                  placeholder="S, M, L, XL"
                />
                <small>Separar con comas. Dejar vacío si no aplica.</small>
              </div>

              <div className="form-group">
                <label>Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImagenChange}
                  disabled={subiendoImagen}
                />
                {subiendoImagen && <small>Subiendo imagen...</small>}
                {imagen && !subiendoImagen && (
                  <div className="imagen-preview">
                    <img src={`http://localhost:5000${imagen}`} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={visible}
                    onChange={(e) => setVisible(e.target.checked)}
                  />
                  <span>Producto visible en el catálogo</span>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={cerrarModal} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-save" disabled={subiendoImagen}>
                  {editando ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productos;