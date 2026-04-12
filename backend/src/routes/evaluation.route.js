import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createEvaluation } from "../controllers/evaluation.controller.js";
import { pool } from "../lib/db.js";

const router = express.Router();

// Más adelante
router.post("/", protectRoute, createEvaluation);

// Obtener el historial del paciente
router.get("/patient/:patientId", protectRoute, async (req, res) => {
  try {
    const { patientId } = req.params;
    const query = `
      SELECT e.*, u.full_name as evaluator_name 
      FROM evaluations e
      JOIN users u ON e.evaluator_id = u.id
      WHERE e.patient_id = $1
      ORDER BY e.created_at DESC;
    `;
    const result = await pool.query(query, [patientId]);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener historial" });
  }
});

export default router;