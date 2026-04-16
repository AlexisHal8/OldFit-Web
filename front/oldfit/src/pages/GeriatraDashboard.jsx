import React, { useState, useEffect } from 'react';
import GestionarRecetas from './GestionarRecetas';
import GestionarCitas from './GestionarCitas'; 
import ChatPage from './ChatPage';
import { useAuthStore } from '../store/useAuthStore';

const GeriatraDashboard = ({ user, onLogout }) => {
  // 2. Estado para controlar qué "pestaña" estamos viendo (por defecto 'resumen')
  const [vistaActiva, setVistaActiva] = useState('resumen');
  
  const [resumen, setResumen] = useState({ citasProgramadas: 0, citasDetalle: [], mensajesSinLeer: 0 });
  const [loading, setLoading] = useState(true);
  const { checkAuth } = useAuthStore();

  // Carga de datos para el Resumen (Se mantiene igual)
  useEffect(() => {
    checkAuth();
    const fetchResumen = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/geriatra/${user.id}/resumen`);
        if (response.ok) {
          const data = await response.json();
          setResumen(data);
        }
      } catch (error) {
        console.error("Error cargando el dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchResumen();
  }, [user.id]);

  // 3. Función clave: Renderiza el contenido dependiendo de la pestaña activa
  const renderizarContenido = () => {
    if (vistaActiva === 'recetas') {
      // Le pasamos el 'user' para que el componente sepa qué médico está creando la receta
      return <GestionarRecetas user={user} />; 
    }
    if (vistaActiva === 'citas') return <GestionarCitas user={user} />;


    if (vistaActiva === 'chat') {
      return (
        <div className="w-full flex justify-center bg-transparent">
          <ChatPage />
        </div>
      );
    }

    // Si no es 'recetas', mostramos el 'resumen' original
    return (
      <>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Resumen General</h2>
        
        {/* Tarjetas Superiores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div 
  onClick={() => setVistaActiva('citas')} 
  className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-200 hover:shadow-md hover:bg-blue-100 transition cursor-pointer group"
>
  <h3 className="text-lg font-bold text-blue-800 group-hover:text-blue-900">Gestionar Citas</h3>
  <p className="text-sm text-blue-600 mt-1">Módulo GC6</p>
  <div className="mt-4 text-3xl font-bold text-gray-800">
    {loading ? '...' : resumen.citasProgramadas}
  </div>
  <p className="text-xs text-gray-400 mt-1">Citas programadas para hoy</p>
</div>

          <div 
            onClick={() => setVistaActiva('recetas')} // Clic en la tarjeta también cambia la pestaña
            className="bg-emerald-50 p-6 rounded-xl shadow-sm border border-emerald-200 hover:shadow-md hover:bg-emerald-100 transition cursor-pointer group"
          >
            <h3 className="text-lg font-bold text-emerald-800">Recetas Médicas</h3>
            <p className="text-sm text-emerald-600 mt-1">Módulo RW4</p>
            <div className="mt-4 text-sm font-medium text-emerald-900">Asignar o modificar medicamentos.</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer group">
            <h3 className="text-lg font-bold text-blue-700">Reportes</h3>
            <p className="text-sm text-gray-500 mt-1">Módulo RW3</p>
            <div className="mt-4 text-sm font-medium text-gray-700">Ver evolución del paciente.</div>
          </div>

          <div 
  onClick={() => setVistaActiva('chat')} // <--- 3. EL EVENTO CLIC
  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:bg-orange-50 transition cursor-pointer group"
>
  <h3 className="text-lg font-bold text-orange-600 group-hover:text-orange-700">Chats</h3>
  <p className="text-sm text-gray-500 mt-1">Módulo RW2</p>
  <div className="mt-4 flex items-center gap-2">
    <span className="flex h-3 w-3 relative">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
    </span>
    <span className="text-sm font-bold text-gray-800">
      {resumen.mensajesSinLeer} mensajes nuevos
    </span>
  </div>
</div>
        </div>

        {/* Lista de Citas del Día */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">Próximas Citas (Hoy)</h3>
          {loading ? (
            <p className="text-gray-500">Cargando agenda...</p>
          ) : resumen.citasDetalle.length > 0 ? (
            <ul className="space-y-3">
              {resumen.citasDetalle.map((cita) => (
                <li key={cita.id_cita} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded border border-transparent hover:border-gray-200 transition">
                  <div>
                    <p className="font-bold text-gray-800">{cita.nombre_paciente}</p>
                    <p className="text-sm text-gray-500">{cita.razon}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {cita.hora.substring(0, 5)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">No tienes citas programadas para el día de hoy.</p>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Header Principal */}
      <header className="bg-emerald-700 text-white p-4 flex justify-between items-center shadow-md z-10">
        <h1 className="text-2xl font-bold">Old-Fit | Portal Médico</h1>
        <div className="flex items-center gap-4">
          <span>Dr(a). <span className="font-semibold capitalize">{user?.nombre}</span></span>
          <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm transition">
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* 4. Menú de Pestañas (Sub-navbar) */}
      <nav className="bg-white shadow-sm border-b border-gray-200 px-6 md:px-8">
        <div className="flex space-x-6 overflow-x-auto">
          <button
            onClick={() => setVistaActiva('resumen')}
            className={`py-4 border-b-2 font-bold text-sm transition-colors whitespace-nowrap ${
              vistaActiva === 'resumen' 
                ? 'border-emerald-600 text-emerald-700' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Resumen General
          </button>
         

          {/* Aquí podremos agregar más botones para Citas, Reportes, Chats, etc. */}
        </div>
      </nav>

      {/* Contenedor Principal donde se inyecta la pestaña activa */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        {renderizarContenido()}
      </main>
    </div>
  );
};

export default GeriatraDashboard;