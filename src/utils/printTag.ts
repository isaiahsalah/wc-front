import jsPDF from "jspdf";
import {IProduction} from "./interfaces";
import {format} from "date-fns";
import {es} from "date-fns/locale";

import QRCode from "qrcode"; // Asegúrate de importar correctamente tu biblioteca

export const generateQR = async ({
  productions,
}: {
  productions: IProduction[];
}): Promise<string[]> => {
  try {
    // Verificar que la lista de productos no esté vacía
    if (!productions || productions.length === 0) {
      throw new Error("No se proporcionaron productos.");
    }

    // Lista para almacenar los códigos QR generados en formato base64
    const qrCodes: string[] = [];

    // Iterar sobre los productos para generar el QR para cada uno
    for (const production of productions) {
      const qrText = `${production.lote?.name}-${production.id}`; // Puedes poner cualquier URL o texto que desees

      QRCode.toDataURL(qrText, {
        width: 256, // Ancho de la imagen en píxeles (aumenta para mayor resolución)
      })
        .then((url) => {
          //console.log(url);
          qrCodes.push(url);
        })
        .catch((err) => {
          console.error(err);
        });

      //console.log(`Código QR generado para: ${qrText}`);
    }

    // Retornar los QR Codes generados
    return qrCodes;
  } catch (error) {
    console.error("❌ Error al generar los códigos QR:", error);
    return [];
  }
};

export const printTag = ({productions, QRs}: {productions: IProduction[]; QRs: string[]}) => {
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

    // Configuración de fuente y tamaño
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5);
    // Colocar el texto en la mitad derecha (desplazamos a la derecha)

    doc.addImage(QRs[index], "PNG", 1, 1, 23, 23);

    doc.text(`Id:`, 24, 5);
    doc.text(`Nombre:`, 24, 10);
    doc.text(`Fecha:`, 24, 15);
    doc.text(`Unidad:`, 24, 20);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    const formattedDate = format(new Date(production.date), "dd/LLL/y - HH:mm", {locale: es});
    const qrData = `${production.lote?.name}-${production.id}`; // Puedes poner cualquier URL o texto que desees

    doc.text(`${qrData}`, 24, 7);
    doc.text(`${production.order_detail?.product?.name}`, 24, 12);
    doc.text(`${formattedDate}`, 24, 17);
    doc.text(
      `${production.order_detail?.product?.amount} ${production.order_detail?.product?.unity?.shortname}.`,
      24,
      22
    );
    doc.setFont("helvetica", "bold"); // Usamos Helvetica y negrita

    console.log("Type✔️✔️", production.order_detail?.product?.model?.type);
    if (production.order_detail?.product?.model?.type === 1) doc.text(`PLÁSTICOS CARMEN`, 14, 27);
    else doc.text(`PRODUCTO EN PROCESO`, 12, 27);

    doc.roundedRect(1, 1, 48, 28, 2, 2); // Rectángulo con bordes redondeados, radio de 5
    doc.line(1, 24, 49, 24); // Rectángulo de 1mm de margen

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
