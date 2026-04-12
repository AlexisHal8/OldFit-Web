import jwt from "jsonwebtoken";
import { pool } from "../lib/db.js";
import { ENV } from "../lib/env.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];

    if (!token) {
      console.log("Conexión de socket rechazada: No se proporcionó el token");
      return next(new Error("Sin autorización - No se proporcionó el token"));
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      console.log("Conexión de socket rechazada: Token invalido");
      return next(new Error("Sin autorización - Token invalido"));
    }

    const userResult = await pool.query(
      "SELECT id, email, full_name, profile_pic, role FROM users WHERE id = $1", 
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      console.log("Conexión con el socket rechazada: Usuario no encontrado");
      return next(new Error("Usuario no encontrado"));
    }

    socket.user = userResult.rows[0];
    socket.userId = userResult.rows[0].id.toString(); // Cambiado de _id a id

    console.log(`Socket autenticado para el usuario: ${socket.user.full_name} (${socket.user.id})`);

    next();
  } catch (error) {
    console.log("Error en la autenticación del socket:", error.message);
    next(new Error("Sin autorización - Error en la autenticación"));
  }
};