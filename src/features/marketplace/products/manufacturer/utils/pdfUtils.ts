import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Manufacturer } from "../types/manufacturer";

export const downloadManufacturerPDF = (manufacturers: Manufacturer[]) => {
  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(18);
  doc.text("Manufacturer List", 14, 15);

  const tableData = manufacturers.map((manufacturer) => [
    manufacturer.manufacturerId,
    manufacturer.code || "",
    manufacturer.companyName || "",
    manufacturer.contactName || "",
    manufacturer.phoneNumber || "",
    manufacturer.email || "",
    manufacturer.postalCode || "",
    manufacturer.city || "",
    manufacturer.country || "",
    manufacturer.capital || "",
    manufacturer.address || "",
  ]);

  autoTable(doc, {
    head: [
      [
        "ID",
        "Code",
        "Company",
        "Contact",
        "Phone",
        "Email",
        "Postal Code",
        "City",
        "Country",
        "Capital",
        "Address",
      ],
    ],
    body: tableData,
    startY: 25,
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 2,
      overflow: "linebreak",
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 15 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
      5: { cellWidth: 30 },
      6: { cellWidth: 25 },
      7: { cellWidth: 20 },
      8: { cellWidth: 25 },
      9: { cellWidth: 25 },
      10: { cellWidth: 22 },
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

  doc.save("manufacturers.pdf");
};
