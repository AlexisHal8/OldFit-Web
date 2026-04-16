import { pool } from "../lib/db.js";
import cloudinary from "../lib/cloudinary.js";
import { buildEvaluationPDF } from "../lib/pdf.generator.js";

const uploadBufferToCloudinary = (buffer, folderName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folderName, resource_type: "image", format:"pdf", access_mode:"public", type:"upload" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

export const createEvaluation = async (req, res) => {
  const { patientId, type, results } = req.body;
  const evaluatorId = req.user.id; // Viene del token JWT (debería ser el geriatra)

  try {
    // 1. Obtener nombre del paciente (tabla clientes)
    const patientResult = await pool.query(
      "SELECT CONCAT(nombre, ' ', apellidop) AS full_name FROM clientes WHERE id_cliente = $1",
      [patientId]
    );
    
    // 2. Obtener nombre del evaluador (tabla geriatras)
    const evaluatorResult = await pool.query(
      "SELECT CONCAT(nombre, ' ', apellidop) AS full_name FROM geriatras WHERE id_geriatra = $1",
      [evaluatorId]
    );

    if (patientResult.rows.length === 0) return res.status(404).json({ message: "Paciente no encontrado" });
    if (evaluatorResult.rows.length === 0) return res.status(404).json({ message: "Evaluador no encontrado" });

    const patientName = patientResult.rows[0].full_name;
    const evaluatorName = evaluatorResult.rows[0].full_name;

    // 3. Generar el PDF en memoria
    const pdfBuffer = await buildEvaluationPDF(patientName, evaluatorName, type, results);

    // 4. Subir el PDF a Cloudinary
    const cloudinaryResponse = await uploadBufferToCloudinary(pdfBuffer, "geriatric_reports");

    // 5. Guardar en PostgreSQL (usando la nueva tabla evaluaciones_clinicas)
    const insertQuery = `
      INSERT INTO evaluaciones_clinicas (id_cliente, id_geriatra, tipo, resultados, url_pdf_reporte)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    
    const newEvalResult = await pool.query(insertQuery, [
      patientId, 
      evaluatorId, 
      type, 
      JSON.stringify(results), // Aseguramos formato JSONB
      cloudinaryResponse.secure_url
    ]);

    res.status(201).json({
      message: "Evaluación guardada y PDF generado exitosamente",
      evaluation: newEvalResult.rows[0]
    });

  } catch (error) {
    console.error("Error en createEvaluation:", error);
    res.status(500).json({ message: "Error interno del servidor al crear evaluación" });
  }
};