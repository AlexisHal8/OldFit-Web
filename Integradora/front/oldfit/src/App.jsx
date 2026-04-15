import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import GeriatraDashboard from './pages/GeriatraDashboard';
import PageTransition from './pages/PageTransition';
import VideoLoader from './pages/VideoLoader';

// ------------------------------------------------------------------
// COMPONENTE DE SEGURIDAD: Valida el token y el rol antes de renderizar
// ------------------------------------------------------------------
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('usuario'));

  // 1. Si no hay token o usuario, lo pateamos al Login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si la ruta exige un rol específico y el usuario no lo tiene
  if (allowedRole && user.rol !== allowedRole) {
    // Lo redirigimos a su panel correspondiente para evitar que quede atrapado
    const redirectPath = user.rol === 'administrador' ? '/admin' : '/medico';
    return <Navigate to={redirectPath} replace />;
  }

  // 3. Si todo está correcto, renderizamos la página (el componente hijo)
  return children;
};


// ------------------------------------------------------------------
// COMPONENTE PRINCIPAL (RUTAS)
// ------------------------------------------------------------------
function AppRoutes() {
  // 3. Creamos un estado maestro para controlar el video
  const [isAppLoading, setIsAppLoading] = useState(true);

  // 4. Simulamos un tiempo de carga de 2.5 segundos (2500 ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 3500); // <-- Cambia este número para que el video dure más o menos
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/login'; 
  };

  return (
    <>
      {/* 5. AnimatePresence permite hacer transiciones al "desmontar" componentes */}
      <AnimatePresence>
        {isAppLoading && <VideoLoader key="loader" />}
      </AnimatePresence>

      {/* Si la app sigue "cargando", ocultamos todo lo demás temporalmente */}
      {!isAppLoading && (
        <Router>
          <Routes>
            <Route path="/login" element={
              <PageTransition><Login /></PageTransition>
            } />

            <Route path="/admin" element={
              <ProtectedRoute allowedRole="administrador">
                <PageTransition>
                  <AdminDashboard user={JSON.parse(localStorage.getItem('usuario'))} onLogout={handleLogout} />
                </PageTransition>
              </ProtectedRoute>
            } />

            <Route path="/medico" element={
              <ProtectedRoute allowedRole="geriatra">
                <PageTransition>
                  <GeriatraDashboard user={JSON.parse(localStorage.getItem('usuario'))} onLogout={handleLogout} />
                </PageTransition>
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      )}
    </>
  );
}

export default AppRoutes;