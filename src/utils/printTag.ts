import jsPDF from "jspdf";
import { ProductionInterfaces } from "./interfaces";
import { format } from "date-fns";
import { es } from "date-fns/locale";
 
 

export const printTag = ({
  productions,
}: {
  productions: ProductionInterfaces[];
}) => {
  // Crear una instancia de jsPDF
  const doc = new jsPDF({
    orientation: "landscape", // Horizontal
    unit: "mm", // Usar milímetros
    format: [30, 50], // Tamaño personalizado de etiqueta (30mm x 50mm)
  });

  productions.map(async (production, index) => {
    // Dibujar un borde opcional
    doc.setDrawColor(0); // Negro
    doc.setLineWidth(0.5); // Grosor
    doc.roundedRect(1, 1, 48, 28, 2, 2); // Rectángulo con bordes redondeados, radio de 5
    doc.line(1, 24, 49, 24); // Rectángulo de 1mm de margen

    // Configuración de fuente y tamaño
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5);
    // Colocar el texto en la mitad derecha (desplazamos a la derecha)

    doc.text(`Id:`, 25, 5);
    doc.text(`Nombre:`, 25, 10);
    doc.text(`Fecha:`, 25, 15);
    doc.text(`Unidad:`, 25, 20);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    const formattedDate = format(
      new Date(production.date),
      "dd/LLL/y - HH:mm",
      { locale: es }
    );
    const qrData = `${production.lote?.name}-${production.id}`; // Puedes poner cualquier URL o texto que desees

    doc.text(`${qrData}`, 25, 7);
    doc.text(`${production.order_detail?.product?.name}`, 25, 12);
    doc.text(`${formattedDate}`, 25, 17);
    doc.text(
      `${production.order_detail?.product?.amount} ${production.order_detail?.product?.unity?.shortname}.`,
      25,
      22
    );
    doc.setFont("helvetica", "bold"); // Usamos Helvetica y negrita

    doc.text(`PLÁSTICOS CARMEN`, 14, 27);

   

    // Agregar una nueva página para el siguiente elemento (excepto el último)
    if (index < productions.length - 1) {
      doc.addPage([30, 50]); // Tamaño personalizado para cada página
    }
  });

  // Generar Blob del PDF
  const pdfBlob = doc.output("blob");

  // Crear una URL temporal para el PDF
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // Abrir en una nueva ventana y ejecutar la impresión
  const printWindow = window.open(pdfUrl);
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print(); // Inicia la impresión automáticamente
      printWindow.onafterprint = () => {
        printWindow.close(); // Cierra la ventana después de imprimir
      };
    };
  } else {
    console.error("No se pudo abrir la ventana de impresión.");
  }
};
