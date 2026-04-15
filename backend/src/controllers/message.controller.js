// message.controller.js
import { pool } from "../lib/db.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getContacts = async (req, res) => {
  const userRole = req.user.rol;
  try {
    let query;
    if (userRole === "geriatra" || userRole === "administrador") {
      query = `SELECT id_cliente AS id, CONCAT(nombre, ' ', apellidop) AS "fullName", rol, foto_perfil AS "profilePic" FROM clientes`;
    } else {
      query = `SELECT id_geriatra AS id, CONCAT(nombre, ' ', apellidop) AS "fullName", rol, foto_perfil AS "profilePic" FROM geriatras`;
    }
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener contactos" });
  }
};

// Obtener conversaciones activas del usuario
export const getMyConversations = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.rol;

  try {
    let query;
    if (userRole === "geriatra" || userRole === "administrador") {
      // Geriatra ve a sus clientes con conversación activa
      query = `
        SELECT 
          c.id_conversacion,
          cl.id_cliente AS id,
          CONCAT(cl.nombre, ' ', cl.apellidop) AS "fullName",
          cl.foto_perfil AS "profilePic",
          cl.rol
        FROM conversacion c
        JOIN clientes cl ON c.id_cliente = cl.id_cliente
        WHERE c.id_geriatra = $1
        ORDER BY c.fecha_creacion DESC
      `;
    } else {
      // Cliente ve a sus geriatras con conversación activa
      query = `
        SELECT 
          c.id_conversacion,
          g.id_geriatra AS id,
          CONCAT(g.nombre, ' ', g.apellidop) AS "fullName",
          g.foto_perfil AS "profilePic",
          g.rol
        FROM conversacion c
        JOIN geriatras g ON c.id_geriatra = g.id_geriatra
        WHERE c.id_cliente = $1
        ORDER BY c.fecha_creacion DESC
      `;
    }
    const { rows } = await pool.query(query, [userId]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener conversaciones" });
  }
};

// Obtener mensajes: busca la conversación por los dos participantes
export const getMessages = async (req, res) => {
  const { targetId } = req.params;
  const myId = req.user.id;
  const myRole = req.user.rol;

  try {
    let convQuery;
    if (myRole === "geriatra" || myRole === "administrador") {
      convQuery = `SELECT id_conversacion FROM conversacion WHERE id_geriatra = $1 AND id_cliente = $2`;
    } else {
      convQuery = `SELECT id_conversacion FROM conversacion WHERE id_cliente = $1 AND id_geriatra = $2`;
    }

    const convResult = await pool.query(convQuery, [myId, targetId]);
    if (convResult.rows.length === 0) {
      return res.status(200).json([]); // Sin conversación aún, devuelve vacío
    }

    const id_conversacion = convResult.rows[0].id_conversacion;

    const { rows } = await pool.query(
      `SELECT id_mensaje, contenido_texto, fecha_envio, id_remitente, tipo_remitente
       FROM mensajes WHERE id_conversacion = $1 ORDER BY fecha_envio ASC`,
      [id_conversacion]
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al recuperar mensajes" });
  }
};

// Enviar mensaje: busca o crea la conversación automáticamente
export const sendMessage = async (req, res) => {
  const { targetId, contenido_texto } = req.body;
  const senderId = req.user.id;
  const senderRole = req.user.rol;

  try {
    const tipoRemitente = (senderRole === "geriatra" || senderRole === "administrador") ? "geriatra" : "cliente";

    const clienteId  = tipoRemitente === "geriatra" ? targetId  : senderId;
    const geriatraId = tipoRemitente === "geriatra" ? senderId  : targetId;

    // Buscar conversación existente
    let convResult = await pool.query(
      `SELECT id_conversacion FROM conversacion WHERE id_cliente = $1 AND id_geriatra = $2`,
      [clienteId, geriatraId]
    );

    // Crear si no existe
    if (convResult.rows.length === 0) {
      convResult = await pool.query(
        `INSERT INTO conversacion (id_cliente, id_geriatra) VALUES ($1, $2) RETURNING id_conversacion`,
        [clienteId, geriatraId]
      );
    }

    const id_conversacion = convResult.rows[0].id_conversacion;

    const { rows } = await pool.query(
      `INSERT INTO mensajes (id_conversacion, id_remitente, tipo_remitente, contenido_texto)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id_conversacion, senderId, tipoRemitente, contenido_texto]
    );
    const newMessage = rows[0];

    // Socket en tiempo real
    const receiverId = tipoRemitente === "geriatra" ? clienteId : geriatraId;
    const receiverRole = tipoRemitente === "geriatra" ? "cliente" : "geriatra";
    const receiverSocketId = getReceiverSocketId(receiverId.toString(), receiverRole);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    res.status(500).json({ message: "Error al enviar mensaje" });
  }
};