import { pool } from "../lib/db.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import cloudinary from "../lib/cloudinary.js"

// Obtener los contactos disponibles (Geriatras ven Clientes y viceversa)
export const getContacts = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.rol;

  try {
    let query;
    if (userRole === "geriatra" || userRole === "administrador") {
      // El geriatra ve a sus clientes asignados o con los que tiene conversación
      query = `SELECT id_cliente AS id, CONCAT(nombre, ' ', apellidop) AS fullName, rol, foto_perfil FROM clientes`;
    } else {
      // El cliente ve a los geriatras
      query = `SELECT id_geriatra AS id, CONCAT(nombre, ' ', apellidop) AS fullName, rol, foto_perfil FROM geriatras`;
    }

    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener contactos" });
  }
};

// Obtener mensajes de una conversación específica
export const getMessages = async (req, res) => {
  const { id_conversacion } = req.params;

  try {
    const query = `
      SELECT id_mensaje, contenido_texto, fecha_envio, id_remitente, tipo_remitente 
      FROM mensajes 
      WHERE id_conversacion = $1 
      ORDER BY fecha_envio ASC
    `;
    const { rows } = await pool.query(query, [id_conversacion]);
    
    // Postgres devuelve el JSONB como objeto automáticamente
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al recuperar mensajes" });
  }
};

// Enviar un mensaje (Guardando en JSONB como pide tu esquema)
export const sendMessage = async (req, res) => {
  const { id_conversacion, contenido_texto } = req.body;
  const senderId = req.user.id; // Viene del protectRoute
  const senderRole = req.user.rol;

  try {
    // Determinar tipo_remitente según el ENUM de tu DB
    const tipoRemitente = (senderRole === 'geriatra' || senderRole === 'administrador') 
                          ? 'geriatra' : 'cliente';

    // 2. Insertar mensaje (contenido es JSONB)
    const query = `
      INSERT INTO mensajes (id_conversacion, id_remitente, tipo_remitente, contenido_texto)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id_conversacion, senderId, tipoRemitente, contenido_texto]);
    const newMessage = rows[0];

    // 3. Lógica de Socket.io para tiempo real
    const convData = await pool.query("SELECT id_cliente, id_geriatra FROM conversacion WHERE id_conversacion = $1", [id_conversacion]);
    const receiverId = tipoRemitente === "geriatra" 
  ? convData.rows[0].id_cliente 
  : convData.rows[0].id_geriatra;

    const receiverRole = tipoRemitente === "geriatra" ? "cliente" : "geriatra";
    const receiverSocketId = getReceiverSocketId(receiverId.toString(), receiverRole);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Error al enviar mensaje" });
  }
};