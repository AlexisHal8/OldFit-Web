import React, { useState } from 'react';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('https://backendoldfit-production.up.railway.app/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Vital para que funcione la seguridad del nuevo backend
      body: JSON.stringify({ 
        correo: correo,       // <-- Asegura que 'email' sea el nombre de tu estado de React
        contrasena: contrasena // <-- Asegura que 'password' sea el nombre de tu estado de React
      }) 
    });

    const data = await response.json();

    // Si el backend nos da luz verde (status 200)
    if (response.ok) {
      // El nuevo backend devuelve los datos directamente en 'data'
      localStorage.setItem('usuario', JSON.stringify(data)); 
      
      // Redirigimos según el rol
      if (data.rol === 'geriatra') {
        window.location.href = '/medico';
      } else if (data.rol === 'administrador') {
        window.location.href = '/admin';
      }
    } else {
      // Si el backend nos rechaza (ej. error 400), mostramos el mensaje de forma segura
      // NOTA: Si usas otra variable para tu recuadro rojo (como setError), cámbialo aquí.
      alert(data.message); 
    }
  } catch (err) {
    console.error(err);
    alert('Error al conectar con el servidor');
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sesión en Old-Fit
        </h2>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-6 rounded text-sm text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-semibold text-gray-700">
              Correo Electrónico:
            </label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
              placeholder="usuario@ejemplo.com"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-semibold text-gray-700">
              Contraseña:
            </label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
              placeholder="********"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 px-4 rounded text-white font-bold transition duration-200 mt-2 
              ${loading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;