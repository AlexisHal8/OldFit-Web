import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

// 1. Nuevas Rutas
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import evaluationRoutes from "./routes/evaluation.route.js";

// 2. Tus Rutas Originales
import adminRoutes from "./routes/admin.js";
import geriatraRoutes from "./routes/geriatras.js";
import recetasRoutes from "./routes/recetas.js";
import citasRoutes from "./routes/citas.js";

import { connectDB } from "./lib/db.js"; 
import { ENV } from "./lib/env.js"; // IMPORTANTE: Ajusté esta ruta según tu captura donde env.js está en la raíz o lib
import { app, server } from "./lib/socket.js";

const PORT = ENV.PORT || 4000;

app.use(express.json({ limit: "5mb" })); 
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

// 3. Conexión de Rutas Nuevas
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/evaluations", evaluationRoutes);

// 4. Conexión de Rutas Originales
app.use('/api/admin', adminRoutes);       
app.use('/api/geriatra', geriatraRoutes); 
app.use('/api/recetas', recetasRoutes);   
app.use('/api/citas', citasRoutes);       

// 5. Encendido del Servidor
server.listen(PORT, async () => {
  console.log("=========================================");
  console.log("🚀 Servidor Old-Fit (Pro) corriendo en puerto: " + PORT);
  console.log("=========================================");
  await connectDB(); 
});