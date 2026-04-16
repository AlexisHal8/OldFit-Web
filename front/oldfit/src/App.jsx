import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import GeriatraDashboard from './pages/GeriatraDashboard';
import DashboardReportes from "./pages/DashboardReportes";
import PageTransition from './pages/PageTransition';
import VideoLoader from './pages/VideoLoader';
import { useAuthStore } from "./store/useAuthStore";
// ------------------------------------------------------------------
// COMPONENTE DE SEGURIDAD: Valida el token y el rol antes de renderizar
// ------------------------------------------------------------------
const getUsuarioSeguro = () => {

  

  const usuario = localStorage.getItem('usuario');
  // Verifica que exista y que no sea la palabra "undefined"
  if (usuario && usuario !== "undefined") {
    return JSON.parse(usuario);
  }
  return null;
};

const ProtectedRoute = ({ children, allowedRole }) => {
  // Usamos la función segura que creamos en el paso anterior
  const usuario = getUsuarioSeguro(); 

  // Si no hay usuario guardado, o el rol no es el correcto, lo regresamos al login
  if (!usuario || usuario.rol !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  // Si todo está bien, le abrimos la puerta al Dashboard
  return children;
};

// ------------------------------------------------------------------
// COMPONENTE PRINCIPAL (RUTAS)
// ------------------------------------------------------------------
function AppRoutes() {
  // 3. Creamos un estado maestro para controlar el video
  const [isAppLoading, setIsAppLoading] = useState(true);
  const { authUser } = useAuthStore();

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
<AdminDashboard user={getUsuarioSeguro()} onLogout={handleLogout} />                </PageTransition>
              </ProtectedRoute>
            } />

            <Route path="/medico" element={
              <ProtectedRoute allowedRole="geriatra">
                <PageTransition>
                  <GeriatraDashboard user={getUsuarioSeguro()} onLogout={handleLogout} />
                </PageTransition>
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/login" replace />} />

            <Route 
        path="/reportes" 
        element={authUser?.rol === 'geriatra' || authUser?.rol === 'administrador' ? <DashboardReportes /> : <Navigate to="/login" />} 
      />
          </Routes>
        </Router>
      )}
    </>
  );
}

export default AppRoutes;