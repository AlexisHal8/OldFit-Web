import React, { useState, useEffect } from 'react';

const GestionarRecetas = ({ user }) => {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState('');
  const [recetas, setRecetas] = useState([]);
  
  // Estado para controlar si estamos creando o editando
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idRecetaEditando, setIdRecetaEditando] = useState(null);

  const estadoInicialForm = {
    nombre_medicamento: '',
    dosis: '',
    frecuencia_horas: '',
    duracion_dias: '',
    indicaciones: '',
    fecha_inicio: new Date().toISOString().split('T')[0]
  };
  const [form, setForm] = useState(estadoInicialForm);

  // Cargar lista de pacientes
  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:4000/api/geriatra/${user.id}/pacientes`)
        .then(res => res.json())
        .then(data => setPacientes(data))
        .catch(err => console.error(err));
    }
  }, [user.id]);

  // Cargar recetas del paciente
  const cargarRecetas = () => {
    if (pacienteSeleccionado) {
      fetch(`http://localhost:4000/api/recetas/paciente/${pacienteSeleccionado}`)
        .then(res => res.json())
        .then(data => setRecetas(data))
        .catch(err => console.error(err));
    } else {
        setRecetas([]);
    }
  };

  useEffect(() => {
    cargarRecetas();
    cancelarEdicion(); // Limpiamos el form si cambiamos de paciente
  }, [pacienteSeleccionado]);

  // Manejar el submit (Crear o Modificar)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. LÓGICA DE MODIFICACIÓN
    if (modoEdicion) {
        try {
            const response = await fetch(`http://localhost:4000/api/recetas/${idRecetaEditando}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(form)
            });
      
            if (response.ok) {
              alert("Receta modificada con éxito"); // RW4 - Paso 6
              cargarRecetas();
              cancelarEdicion();
            }
          } catch (error) {
              console.error("Error al modificar:", error);
          }
    } 
    // 2. LÓGICA DE CREACIÓN
    else {
        try {
            const response = await fetch('http://localhost:4000/api/recetas', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...form, id_paciente: pacienteSeleccionado, id_geriatra: user.id })
            });
      
            if (response.ok) {
              alert("Receta asignada con éxito");
              cargarRecetas();
              setForm(estadoInicialForm);
            }
          } catch (error) {
            console.error("Error al crear:", error);
          }
    }
  };

  // Preparar el formulario para editar
  const iniciarEdicion = (receta) => {
      setModoEdicion(true);
      setIdRecetaEditando(receta.id_medicamento);
      // Llenamos el form con los datos que traemos de la BD
      setForm({
          nombre_medicamento: receta.nombre_medicamento,
          dosis: receta.dosis,
          frecuencia_horas: receta.frecuencia_horas,
          duracion_dias: receta.duracion_dias || '', // Por si es null
          indicaciones: receta.indicaciones || ''
      });
  };

  // Botón para salir del modo edición
  const cancelarEdicion = () => {
      setModoEdicion(false);
      setIdRecetaEditando(null);
      setForm(estadoInicialForm);
  };

  // Eliminar
  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar esta receta de forma permanente?")) {
      await fetch(`http://localhost:4000/api/recetas/${id}`, { method: 'DELETE' });
      cargarRecetas();
      // Si eliminamos la receta que estábamos editando, salimos del modo edición
      if (idRecetaEditando === id) cancelarEdicion(); 
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      <h2 className="text-2xl font-bold mb-2 text-emerald-800">Gestionar Recetas Médicas</h2>
      <p className="text-gray-500 mb-6 text-sm">Módulo RW4: Asignación, modificación y control de medicamentos.</p>
      
      {/* Selector de Paciente */}
      <div className="mb-6 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
        <label className="block text-sm font-bold text-gray-700 mb-2">Seleccionar Paciente (Su cargo):</label>
        <select 
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 bg-gray-50"
          value={pacienteSeleccionado}
          onChange={(e) => setPacienteSeleccionado(e.target.value)}
        >
          <option value="">-- Seleccione un paciente de su lista --</option>
          {pacientes.map(p => (
            <option key={p.id_cliente} value={p.id_cliente}>{p.nombre} {p.apellidop}</option>
          ))}
        </select>
      </div>

      {pacienteSeleccionado && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className={`bg-white p-6 rounded-lg shadow-sm border transition-colors ${modoEdicion ? 'border-amber-400 bg-amber-50/30' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h3 className={`font-bold ${modoEdicion ? 'text-amber-700' : 'text-gray-700'}`}>
                    {modoEdicion ? '✏️ Editando Receta' : '➕ Asignar Nueva Receta'}
                </h3>
                {modoEdicion && (
                    <button type="button" onClick={cancelarEdicion} className="text-xs text-red-500 hover:text-red-700 font-bold">
                        Cancelar Edición
                    </button>
                )}
            </div>

            <div className="space-y-4">
                <input 
                    placeholder="Nombre del medicamento" required
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500" 
                    value={form.nombre_medicamento}
                    onChange={e => setForm({...form, nombre_medicamento: e.target.value})} 
                />
                
                <input 
                    placeholder="Dosis (ej: 500mg, 1 tableta)" required
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500" 
                    value={form.dosis}
                    onChange={e => setForm({...form, dosis: e.target.value})} 
                />
                <div>
    <label className="text-xs text-gray-500 mb-1 block">Fecha de Inicio:</label>
    <input 
        type="date" required
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500" 
        value={form.fecha_inicio}
        onChange={e => setForm({...form, fecha_inicio: e.target.value})} 
    />
</div>
                
                <div className="flex gap-4">
                    <div className="w-1/2">
                        <label className="text-xs text-gray-500 mb-1 block">Cada (Horas):</label>
                        <input 
                            type="number" min="1" max="72" required // <-- VALIDACIÓN: Evita números negativos y ceros
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500" 
                            value={form.frecuencia_horas}
                            onChange={e => setForm({...form, frecuencia_horas: e.target.value})} 
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="text-xs text-gray-500 mb-1 block">Por (Días):</label>
                        <input 
                            type="number" min="1" max="365" required // <-- VALIDACIÓN: Evita números negativos y ceros
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500" 
                            value={form.duracion_dias}
                            onChange={e => setForm({...form, duracion_dias: e.target.value})} 
                        />
                    </div>
                </div>
                
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Indicaciones especiales (opcional):</label>
                    <textarea 
                        rows="2"
                        placeholder="Ej. Tomar con alimentos..." 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500"
                        value={form.indicaciones}
                        onChange={e => setForm({...form, indicaciones: e.target.value})} 
                    />
                </div>

                <button 
                    type="submit" 
                    className={`w-full py-3 rounded text-white font-bold transition shadow-sm ${
                        modoEdicion ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                >
                    {modoEdicion ? 'Guardar Cambios' : 'Registrar Receta'}
                </button>
            </div>
          </form>

          {/* LISTA DE RECETAS */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 overflow-y-auto max-h-[600px]">
            <h3 className="font-bold border-b pb-3 mb-4 text-gray-700">Tratamientos Vigentes</h3>
            
            {recetas.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8 italic">Este paciente no tiene recetas activas.</p>
            ) : (
              <div className="space-y-3">
                {recetas.map(r => (
                    <div 
                        key={r.id_medicamento} 
                        className={`p-3 border rounded-lg transition-colors ${
                            idRecetaEditando === r.id_medicamento ? 'border-amber-400 bg-amber-50' : 'border-gray-100 hover:bg-gray-50'
                        }`}
                    >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-gray-800">{r.nombre_medicamento}</p>
                            <p className="text-xs font-semibold text-emerald-600 mt-1">{r.dosis}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Cada <strong>{r.frecuencia_horas}h</strong> durante <strong>{r.duracion_dias} días</strong>.
                            </p>
                            {r.indicaciones && <p className="text-xs text-gray-400 mt-1 italic border-l-2 pl-2">"{r.indicaciones}"</p>}
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-2">
                            <button 
                                onClick={() => iniciarEdicion(r)} 
                                className="text-xs font-bold text-amber-600 hover:text-amber-800"
                            >
                                Modificar
                            </button>
                            <button 
                                onClick={() => handleDelete(r.id_medicamento)} 
                                className="text-xs font-bold text-red-500 hover:text-red-700"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                    </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionarRecetas;