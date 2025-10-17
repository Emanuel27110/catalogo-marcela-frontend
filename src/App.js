import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Categoria from './pages/Categoria';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import Categorias from './pages/admin/Categorias';
import Productos from './pages/admin/Productos';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categoria/:id" element={<Categoria />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/categorias" 
              element={
                <ProtectedRoute>
                  <Categorias />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/productos" 
              element={
                <ProtectedRoute>
                  <Productos />
                </ProtectedRoute>
              } 
            />
            <Route path="/categoria/:id" element={<h1>Productos de Categoría</h1>} />
            <Route path="/login" element={<h1>Login</h1>} />
            <Route path="/admin" element={<h1>Panel Admin</h1>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;