import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      {/* Header del Dashboard */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🎨 Panel de Administración</h1>
          <div className="header-actions">
            <span className="usuario-nombre">👋 {usuario?.nombre}</span>
            <button onClick={handleLogout} className="btn-logout">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Navegación lateral o superior */}
      <nav className="dashboard-nav">
        <Link to="/" className="nav-link">
          🏠 Ver Catálogo
        </Link>
        <Link to="/admin/categorias" className="nav-link">
          📦 Categorías
        </Link>
        <Link to="/admin/productos" className="nav-link">
          🛍️ Productos
        </Link>
      </nav>

      {/* Contenido principal */}
      <main className="dashboard-main">
        <div className="welcome-card">
          <h2>¡Bienvenida, {usuario?.nombre}! 👋</h2>
          <p>Desde acá podés gestionar todo tu catálogo</p>
        </div>

        <div className="dashboard-grid">
          <Link to="/admin/categorias" className="dashboard-card">
            <div className="card-icon">📦</div>
            <h3>Categorías</h3>
            <p>Crear, editar y eliminar categorías de productos</p>
            <span className="card-link">Gestionar →</span>
          </Link>

          <Link to="/admin/productos" className="dashboard-card">
            <div className="card-icon">🛍️</div>
            <h3>Productos</h3>
            <p>Agregar, modificar y ocultar productos del catálogo</p>
            <span className="card-link">Gestionar →</span>
          </Link>

          <Link to="/" className="dashboard-card">
            <div className="card-icon">👁️</div>
            <h3>Ver Catálogo</h3>
            <p>Mirá cómo ven tus clientes el catálogo</p>
            <span className="card-link">Ver →</span>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;