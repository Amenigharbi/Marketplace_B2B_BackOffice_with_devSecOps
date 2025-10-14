import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Tax } from "../types/tax";

export const downloadTaxPDF = (taxes: Tax[]) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Tax Report", 14, 15);

  const tableData = taxes.map((tax) => [tax.id, tax.value]);

  autoTable(doc, {
    head: [["ID", "Value"]],
    body: tableData,
    startY: 25,
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 2,
      overflow: "linebreak",
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 70 },
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

  doc.save("tax_report.pdf");
};
