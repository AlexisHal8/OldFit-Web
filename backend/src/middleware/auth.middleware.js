import jwt from "jsonwebtoken";
import { pool } from "../lib/db.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "Sin autorización - No se proporcionó el token " });

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) return res.status(401).json({ message: "Sin autorización - Token invalido" });

    //Más adelante
    const userResult = await pool.query(
      "SELECT id, email, full_name, profile_pic, role FROM users WHERE id = $1", 
      [decoded.userId]
    );

    if (userResult.rows.length === 0) return res.status(404).json({ message: "User not found" });

    req.user = userResult.rows[0]; 
    next();
  } catch (error) {
    console.log("Error en protectRoute del middleware:", error);
    res.status(500).json({ message: "Error interno del servidor: " });
  }
};