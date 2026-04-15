import { Router } from 'express';
import pool from '../elementos/db.js';

const router = Router();

// GET: Obtener todos los geriatras
router.get('/geriatras', async (req, res) => {
    try {
        const query = `
            SELECT id_geriatra, nombre, apellidop, apellidom, correo, cedula, estatus 
            FROM geriatras 
            WHERE rol = 'geriatra'
            ORDER BY id_geriatra ASC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error("Error al obtener geriatras:", err);
        res.status(500).json({ error: "Error al consultar la base de datos" });
    }
});

// POST: Registrar nuevo médico
router.post('/geriatras', async (req, res) => {
    const { nombre, apellidop, apellidom, correo, contrasena, cedula, telefono } = req.body;
    try {
        const check = await pool.query('SELECT 1 FROM geriatras WHERE cedula = $1', [cedula]);
        if (check.rows.length > 0) {
            return res.status(400).json({ error: "El número de cédula ya se encuentra registrado en el sistema" });
        }

        const query = `
            INSERT INTO geriatras (nombre, apellidop, apellidom, correo, contrasena, cedula, rol, estatus)
            VALUES ($1, $2, $3, $4, $5, $6, 'geriatra', 'activo') RETURNING *`;
        
        const result = await pool.query(query, [nombre, apellidop, apellidom, correo, contrasena, cedula]);
        res.json({ message: "Empleado registrado correctamente", data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Error al registrar médico" });
    }
});

// PUT: Modificar médico
router.put('/geriatras/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellidop, apellidom, correo, cedula } = req.body;
    try {
        const query = `
            UPDATE geriatras 
            SET nombre = $1, apellidop = $2, apellidom = $3, correo = $4, cedula = $5
            WHERE id_geriatra = $6 RETURNING *`;
        const result = await pool.query(query, [nombre, apellidop, apellidom, correo, cedula, id]);
        res.json({ message: "Cambios guardados correctamente", data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Error al actualizar datos" });
    }
});

// DELETE: Eliminar médico (Baja lógica)
router.delete('/geriatras/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("UPDATE geriatras SET estatus = 'inactivo' WHERE id_geriatra = $1", [id]);
        res.json({ message: "Empleado dado de baja correctamente" });
    } catch (err) {
        res.status(500).json({ error: "Error al eliminar" });
    }
});

export default router;