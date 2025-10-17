import axios from 'axios';

// URL base del backend - funciona en local y producción
const API_URL = process.env.REACT_APP_API_URL || 'https://catalogo-marcela-backend.onrender.com/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token a cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============ AUTENTICACIÓN ============
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const registrarUsuario = async (nombre, email, password) => {
  const response = await api.post('/auth/register', { nombre, email, password });
  return response.data;
};

export const obtenerPerfil = async () => {
  const response = await api.get('/auth/perfil');
  return response.data;
};

// ============ CATEGORÍAS ============
export const obtenerCategorias = async () => {
  const response = await api.get('/categorias');
  return response.data;
};

export const obtenerCategoriaPorId = async (id) => {
  const response = await api.get(`/categorias/${id}`);
  return response.data;
};

export const crearCategoria = async (categoria) => {
  const response = await api.post('/categorias', categoria);
  return response.data;
};

export const actualizarCategoria = async (id, categoria) => {
  const response = await api.put(`/categorias/${id}`, categoria);
  return response.data;
};

export const eliminarCategoria = async (id) => {
  const response = await api.delete(`/categorias/${id}`);
  return response.data;
};

// ============ PRODUCTOS ============
export const obtenerProductos = async () => {
  const response = await api.get('/productos');
  return response.data;
};

export const obtenerProductosPorCategoria = async (categoriaId) => {
  const response = await api.get(`/productos/categoria/${categoriaId}`);
  return response.data;
};

export const obtenerProductoPorId = async (id) => {
  const response = await api.get(`/productos/${id}`);
  return response.data;
};

export const obtenerTodosLosProductos = async () => {
  const response = await api.get('/productos/admin/todos');
  return response.data;
};

export const crearProducto = async (producto) => {
  const response = await api.post('/productos', producto);
  return response.data;
};

export const actualizarProducto = async (id, producto) => {
  const response = await api.put(`/productos/${id}`, producto);
  return response.data;
};

export const eliminarProducto = async (id) => {
  const response = await api.delete(`/productos/${id}`);
  return response.data;
};

export const cambiarVisibilidad = async (id) => {
  const response = await api.patch(`/productos/${id}/visibilidad`);
  return response.data;
};

// ============ UPLOAD ============
export const subirImagen = async (file) => {
  const formData = new FormData();
  formData.append('imagen', file);
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export default api;