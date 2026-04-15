import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js'; 
import { login } from './authController.js'; // Ajusta la ruta si es necesario

// 1. Importación de las Rutas Modulares
import adminRoutes from '../routes/admin.js';
import geriatraRoutes from '../routes/geriatras.js';
import recetasRoutes from '../routes/recetas.js';
import citasRoutes from '../routes/citas.js';

dotenv.config();

const app = express();

// 2. Middlewares (Configuraciones de paso)
app.use(cors()); 
app.use(express.json()); 

// 3. Rutas Base y Autenticación
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ status: "Conectado a Postgres", time: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Error de conexión", detail: err.message });
    }
});

app.post('/api/auth/login', login);

// 4. Conexión de los Módulos (El enrutador base)
app.use('/api/admin', adminRoutes);       // Maneja /api/admin/geriatras...
app.use('/api/geriatra', geriatraRoutes); // Maneja /api/geriatra/:id/resumen...
app.use('/api/recetas', recetasRoutes);   // Maneja /api/recetas/...
app.use('/api/citas', citasRoutes);       // Maneja /api/citas/...

// 5. Encendido del servidor (Siempre debe ir al final)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Servidor de Old-Fit conectado y listo!`);
    console.log(`📡 Corriendo en: http://localhost:${PORT}`);
    console.log(`=========================================`);
});