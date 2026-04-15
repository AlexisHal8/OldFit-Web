import pool from './db.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    // 1. Buscar ÚNICAMENTE en la tabla geriatras (donde están admins y geriatras)
    const query = 'SELECT id_geriatra AS id, nombre, rol, contrasena FROM geriatras WHERE correo = $1 AND estatus = $2';
    const result = await pool.query(query, [correo, 'activo']);

    // 2. Verificar si el usuario existe
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas o usuario inactivo" });
    }

    const usuario = result.rows[0];

    // 3. Validación de contraseña
    if (usuario.contrasena !== contrasena) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Fallback: Si olvidaste poner JWT_SECRET en el .env, esto evitará el Error 500
    const secret = process.env.JWT_SECRET || 'clave_secreta_temporal_123';

    // 4. Generar Token
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      secret,
      { expiresIn: '8h' }
    );

    // 5. ENVIAR EL ROL AL FRONTEND
    // Aquí extraemos el rol de la BD y lo mandamos en la respuesta
    res.json({
      token,
      usuario: { 
        id: usuario.id,
        nombre: usuario.nombre, 
        rol: usuario.rol // Extraído directamente de la BD (admin o geriatra)
      }
    });

  } catch (error) {
    console.error("🔴 Error detallado en el backend:", error);
    res.status(500).json({ error: "Error interno del servidor", detalle: error.message });
  }
};