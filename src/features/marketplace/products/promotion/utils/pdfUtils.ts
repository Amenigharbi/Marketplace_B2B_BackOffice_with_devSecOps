import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Promotion } from "../types/promo";

export const downloadPromoPDF = (promotions: Promotion[]) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Promotion Report", 14, 15);

  const tableData = promotions.map((promotion) => {
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);

    return [
      promotion.id,
      promotion.promoPrice,
      startDate.toLocaleDateString(),
      endDate.toLocaleDateString(),
    ];
  });

  autoTable(doc, {
    head: [["ID", "Promo Price", "Start Date", "End Date"]],
    body: tableData,
    startY: 25,
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 2,
      overflow: "linebreak",
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 40 },
      2: { cellWidth: 40 },
      3: { cellWidth: 40 },
    },
    headStyles: {
      fillColor: [0, 51, 102],
      textColor: [255, 255, 255],
      fontSize: 12,
      halign: "center",
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    tableWidth: "auto",
  });

  doc.save("promotion_report.pdf");
};
