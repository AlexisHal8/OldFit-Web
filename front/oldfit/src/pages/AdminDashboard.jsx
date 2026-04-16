import React, { useState } from 'react';
import AdministrarMedicos from './AdministrarMedicos'; // <-- Importamos el módulo CRUD

const AdminDashboard = ({ user, onLogout }) => {
  // Estado para controlar la pestaña activa ('resumen' o 'medicos')
  const [vistaActiva, setVistaActiva] = useState('resumen');

  const renderizarContenido = () => {
    // Si la pestaña es 'medicos', cargamos el módulo CRUD completo
    if (vistaActiva === 'medicos') {
      return <AdministrarMedicos />;
    }

    // Por defecto, mostramos el Resumen / Dashboard principal
    return (
      <>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Panel de Control Administrativo</h2>
          <p className="text-gray-500 mt-2">Bienvenido al centro de gestión de recursos de Old-Fit.</p>
        </div>

        {/* Tarjetas de acceso rápido */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Tarjeta para Gestionar Médicos (RW5) */}
          <div 
            onClick={() => setVistaActiva('medicos')}
            className="bg-blue-50 p-8 rounded-xl border border-blue-200 shadow-sm hover:shadow-md hover:bg-blue-100 transition cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-blue-800 group-hover:text-blue-900">Administrar Médicos</h3>
              <span className="bg-blue-200 text-blue-700 text-xs font-bold px-2 py-1 rounded">Módulo RW5</span>
            </div>
            <p className="text-blue-600 text-sm mb-4">Registro, bajas y actualización de cédulas profesionales del personal médico.</p>
            <span className="text-blue-700 font-bold text-sm group-hover:underline">Ir a gestión →</span>
          </div>

          {/* Tarjeta para Configuración (Simulada) */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm opacity-60">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Configuración del Sistema</h3>
            <p className="text-gray-500 text-sm">Gestión de roles y parámetros generales del servidor.</p>
          </div>

        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header Superior Azul */}
      <header className="bg-indigo-900 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold tracking-tight">Old-Fit | Admin</h1>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">Administrador</p>
            <p className="text-xs">{user?.nombre}</p>
          </div>
          <button 
            onClick={onLogout} 
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-bold transition shadow-sm text-white"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Navegación por Pestañas */}
      <nav className="bg-white border-b border-gray-200 px-8">
        <div className="flex space-x-8">
          <button
            onClick={() => setVistaActiva('resumen')}
            className={`py-4 border-b-2 font-bold text-sm transition-colors ${
              vistaActiva === 'resumen' 
                ? 'border-indigo-600 text-indigo-700' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Resumen General
          </button>
          
          <button
            onClick={() => setVistaActiva('medicos')}
            className={`py-4 border-b-2 font-bold text-sm transition-colors ${
              vistaActiva === 'medicos' 
                ? 'border-indigo-600 text-indigo-700' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Gestionar Médicos (RW5)
          </button>
        </div>
      </nav>

      {/* Área de Contenido */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {renderizarContenido()}
      </main>
    </div>
  );
};

export default AdminDashboard;