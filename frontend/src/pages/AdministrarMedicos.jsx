import React, { useState, useEffect } from 'react';

const AdministrarMedicos = () => {
  const [medicos, setMedicos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nombre: '', apellidop: '', apellidom: '', correo: '', contrasena: '', cedula: '' });

  useEffect(() => { cargarMedicos(); }, []);

  const cargarMedicos = async () => {
    const res = await fetch('https://backendoldfit-production.up.railway.app/api/admin/geriatras');
    const data = await res.json();
    setMedicos(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editando ? `https://backendoldfit-production.up.railway.app/api/admin/geriatras/${editando}` : 'https://backendoldfit-production.up.railway.app/api/admin/geriatras';
    const method = editando ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    
    const result = await res.json();
    if (res.ok) {
      alert(result.message);
      setEditando(null);
      setForm({ nombre: '', apellidop: '', apellidom: '', correo: '', contrasena: '', cedula: '' });
      cargarMedicos();
    } else {
      alert(result.error);
    }
  };

  const medicosFiltrados = medicos.filter(m => 
    m.nombre.toLowerCase().includes(busqueda.toLowerCase()) || m.cedula.includes(busqueda)
  );

  return (
    <div className="space-y-8">
      {/* Formulario de Gestión */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold mb-4 text-blue-800">{editando ? 'Modificar Médico' : 'Registrar Nuevo Médico'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input placeholder="Nombre" required className="p-2 border rounded" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
          <input placeholder="Apellido Paterno" required className="p-2 border rounded" value={form.apellidop} onChange={e => setForm({...form, apellidop: e.target.value})} />
          <input placeholder="Apellido Materno" className="p-2 border rounded" value={form.apellidom} onChange={e => setForm({...form, apellidom: e.target.value})} />
          <input placeholder="Cédula Profesional" required className="p-2 border rounded" value={form.cedula} onChange={e => setForm({...form, cedula: e.target.value})} />
          <input placeholder="Correo" type="email" required className="p-2 border rounded" value={form.correo} onChange={e => setForm({...form, correo: e.target.value})} />
          {!editando && <input placeholder="Contraseña" type="password" required className="p-2 border rounded" value={form.contrasena} onChange={e => setForm({...form, contrasena: e.target.value})} />}
          <button className="md:col-span-3 bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition">
            {editando ? 'Guardar Cambios' : 'Registrar'}
          </button>
        </form>
      </section>

      {/* Tabla de Consulta y Búsqueda */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Médicos Registrados</h3>
          <input 
            placeholder="Buscar por nombre o cédula..." 
            className="p-2 border rounded w-64"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Cédula</th>
              <th className="p-3">Estatus</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {medicosFiltrados.map(m => (
              <tr key={m.id_geriatra} className="border-t hover:bg-gray-50">
                <td className="p-3">{m.nombre} {m.apellidop}</td>
                <td className="p-3 font-mono">{m.cedula}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${m.estatus === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{m.estatus}</span></td>
                <td className="p-3 space-x-2">
                  <button onClick={() => {setEditando(m.id_geriatra); setForm(m);}} className="text-blue-600 hover:underline">Editar</button>
                  <button onClick={async () => { if(confirm("¿Baja?")) { await fetch(`http://localhost:4000/api/admin/geriatras/${m.id_geriatra}`, {method:'DELETE'}); cargarMedicos(); } }} className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdministrarMedicos;