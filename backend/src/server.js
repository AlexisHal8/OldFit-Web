import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";


import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";


import evaluationRoutes from "./routes/evaluation.route.js";


import { connectDB } from "./lib/db.js"; // Este ahora conecta a Postgres
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const __dirname = path.resolve();
const PORT = ENV.PORT || 3000;

app.use(express.json({ limit: "5mb" })); 
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/evaluations", evaluationRoutes);


// Se corre en el servidor
server.listen(PORT, async () => {
  console.log("Servidor corriendo en el puerto: " + PORT);
  await connectDB(); 
});