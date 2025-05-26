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
      QRCode.toDataURL(production.lote ?? "No tiene lote", {
        width: 256, // Ancho de la imagen en píxeles (aumenta para mayor resolución)
      })
        .then((url) => {
          qrCodes.push(url);
        })
        .catch((err) => {
          console.error(err);
        });
    }

    // Retornar los QR Codes generados
    return qrCodes;
  } catch (error) {
    console.error("❌ Error al generar los códigos QR:", error);
    return [];
  }
};

export const printTag = ({
  productions,
  QRs,
  ticketFormat,
}: {
  productions: IProduction[];
  QRs: string[];
  ticketFormat: string[];
}) => {
  // Crear una instancia de jsPDF
  const doc = new jsPDF({
    orientation: "landscape", // Horizontal
    unit: "mm", // Usar milímetros
    format: [30, 50], // Tamaño personalizado de etiqueta (30mm x 50mm)
  });

  const rowInit =
    ticketFormat.length === 5
      ? 7
      : ticketFormat.length === 4
      ? 9
      : ticketFormat.length === 3
      ? 11
      : ticketFormat.length === 2
      ? 13
      : 15;

  productions.map(async (production, index) => {
    // Dibujar un borde opcional
    doc.setDrawColor(0); // Negro
    doc.setLineWidth(0.5); // Grosor
    doc.addImage(QRs[index], "PNG", 1, 1, 23, 23);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);

    ticketFormat.map((key, i) => {
      const line = rowInit + i * 3;
      const col = 23.5;
      if (key === "date") {
        const formattedDate = format(new Date(production.date), "dd/LL/y - HH:mm", {locale: es});

        return doc.text(`${formattedDate}`, col, line);
      }
      if (key === "name") return doc.text(`${production.order_detail?.product?.name}`, col, line);
      if (key === "amount")
        return doc.text(
          `1${production.production_unit?.shortname} - ${production.equivalent_amount} ${production.production_equivalent_unit?.shortname}`,
          col,
          line
        );
      if (key === "micronage")
        return production.micronage
          ? doc.text(`${production.micronage?.join(" - ")}`, col, line)
          : "";
      return doc.text(`${production[key as keyof IProduction]}`, col, line);
    });

    doc.setFont("helvetica", "bold"); // Usamos Helvetica y negrita
    doc.setFontSize(8);
    doc.text(production.lote ?? "", 12, 27.5);

    //if (production.order_detail?.product?.type_product === 1) doc.text(`PLÁSTICOS CARMEN`, 14, 27);
    //else doc.text(`PRODUCTO EN PROCESO`, 12, 27);

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
