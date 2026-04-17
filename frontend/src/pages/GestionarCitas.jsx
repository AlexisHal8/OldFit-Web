import React, { useState, useEffect } from 'react';

const GestionarCitas = ({ user }) => {
  const [pacientes, setPacientes] = useState([]);
  const [citas, setCitas] = useState([]);
  
  // Estado para el formulario de nueva cita
  const [form, setForm] = useState({
    id_cliente: '',
    dia: '',
    hora: '',
    razon: ''
  });

  // Cargar pacientes y citas al montar el componente
  useEffect(() => {
    if (user?.id) {
      cargarPacientes();
      cargarCitas();
    }
  }, [user.id]);

  const cargarPacientes = async () => {
    const res = await fetch(`https://backendoldfit-production.up.railway.app/api/geriatra/${user.id}/pacientes`);
    const data = await res.json();
    setPacientes(data);
  };

  const cargarCitas = async () => {
    const res = await fetch(`https://backendoldfit-production.up.railway.app/api/geriatra/${user.id}/citas`);
    const data = await res.json();
    setCitas(data);
  };

  const handleAgendar = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://backendoldfit-production.up.railway.app/api/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, id_geriatra: user.id })
      });

      if (response.ok) {
        alert("Cita agendada exitosamente");
        // Limpiamos el formulario y recargamos la lista
        setForm({ id_cliente: '', dia: '', hora: '', razon: '' });
        cargarCitas();
      }
    } catch (error) {
      console.error("Error al agendar:", error);
    }
  };

  const handleCancelar = async (id_cita) => {
    if (window.confirm("¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.")) {
      await fetch(`https://backendoldfit-production.up.railway.app/api/citas/${id_cita}`, { method: 'DELETE' });
      // Filtramos la cita eliminada de la vista sin recargar la base de datos
      setCitas(citas.filter(cita => cita.id_cita !== id_cita));
    }
  };

  // Función para darle un formato bonito a la fecha que llega de Postgres
  const formatearFecha = (fechaString) => {
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(fechaString).toLocaleDateString('es-MX', opciones);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <h2 className="text-3xl font-bold mb-2 text-indigo-800">Agenda Médica</h2>
      <p className="text-gray-500 mb-8">Módulo GC6: Creación, consulta y cancelación de eventos.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: Formulario para Agendar */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-700 border-b pb-3 mb-4">Agendar Nueva Cita</h3>
          <form onSubmit={handleAgendar} className="space-y-4">
            
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Paciente:</label>
              <select 
                required
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                value={form.id_cliente}
                onChange={(e) => setForm({...form, id_cliente: e.target.value})}
              >
                <option value="">Seleccione un paciente</option>
                {pacientes.map(p => (
                  <option key={p.id_cliente} value={p.id_cliente}>{p.nombre} {p.apellidop}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col w-1/2">
                <label className="text-sm font-semibold text-gray-600 mb-1">Día:</label>
                <input 
                  type="date" required 
                  className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                  value={form.dia}
                  onChange={(e) => setForm({...form, dia: e.target.value})}
                />
              </div>
              <div className="flex flex-col w-1/2">
                <label className="text-sm font-semibold text-gray-600 mb-1">Hora:</label>
                <input 
                  type="time" required 
                  className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                  value={form.hora}
                  onChange={(e) => setForm({...form, hora: e.target.value})}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1">Razón de la cita:</label>
              <textarea 
                required rows="3"
                placeholder="Ej. Revisión mensual de presión arterial..."
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                value={form.razon}
                onChange={(e) => setForm({...form, razon: e.target.value})}
              />
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded transition shadow-md">
              Confirmar Cita
            </button>
          </form>
        </div>

        {/* COLUMNA DERECHA: Lista de Citas Programadas */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-700 border-b pb-3 mb-4">Citas Programadas</h3>
          
          <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
            {citas.length === 0 ? (
              <p className="text-gray-400 text-center py-10 italic">No hay citas registradas en la agenda.</p>
            ) : (
              citas.map(cita => (
                <div key={cita.id_cita} className="flex justify-between items-center p-4 border border-gray-100 bg-gray-50 rounded-lg hover:shadow-md transition">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">{cita.nombre} {cita.apellidop}</h4>
                    {/* capitalize pone la primera letra del día en mayúscula */}
                    <p className="text-indigo-600 font-semibold text-sm capitalize">
                      {formatearFecha(cita.fecha)}
                    </p>
                    <p className="text-gray-600 mt-1 text-sm">{cita.razon}</p>
                  </div>
                  
                  <button 
                    onClick={() => handleCancelar(cita.id_cita)}
                    className="ml-4 px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded shadow-sm transition font-semibold text-sm"
                  >
                    Cancelar Cita
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GestionarCitas;