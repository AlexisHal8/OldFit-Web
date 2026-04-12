import PDFDocument from "pdfkit";

// Función para generar el PDF en un Buffer de memoria
export const buildEvaluationPDF = (patientName, evaluatorName, evaluationType, results) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // Formato del reporte médico (más adelante)
    
    // Encabezado
    doc.fontSize(20).fillColor("#2B3A55").text("Centro Geriátrico - Reporte Clínico", { align: "center" });
    doc.moveDown();
    
    // Datos Generales
    doc.fontSize(12).fillColor("black");
    doc.text(`Tipo de Evaluación: ${evaluationType.toUpperCase()}`);
    doc.text(`Paciente: ${patientName}`);
    doc.text(`Evaluador (Médico/Cuidador): ${evaluatorName}`);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`);
    doc.moveDown(2);

    // Resultados (Iteramos sobre el JSON dinámico)
    doc.fontSize(14).fillColor("#5B86E5").text("Resultados de la Evaluación", { underline: true });
    doc.moveDown();

    doc.fontSize(12).fillColor("black");
    for (const [key, value] of Object.entries(results)) {
      // Formateamos las llaves (ej: "mini_mental_score" -> "Mini Mental Score")
      const formattedKey = key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
      doc.font("Helvetica-Bold").text(`${formattedKey}: `, { continued: true })
         .font("Helvetica").text(`${value}`);
      doc.moveDown(0.5);
    }

    // Pie de página
    doc.moveDown(3);
    doc.fontSize(10).fillColor("gray").text("Documento generado automáticamente por el Sistema Geriátrico.", { align: "center" });

    // Finalizamos el documento
    doc.end();
  });
};